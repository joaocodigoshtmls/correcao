// server.js — mock-cam com HLS contínuo (keys reescritas + cookies/sessão)
// Requisitos: Node >=18; deps: express cors morgan compression multer dotenv

import express from "express";
import cors from "cors";
import morgan from "morgan";
import compression from "compression";
import multer from "multer";
import dotenv from "dotenv";
import fs from "node:fs/promises";
import fssync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.disable("x-powered-by");
app.use(cors());
app.use(compression());
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));

const PORT = Number(process.env.PORT) || 4000;
const ESP32_BASE = process.env.ESP32_BASE || ""; // ex: http://192.168.0.50
const ESP32_STREAM = process.env.ESP32_STREAM || ":81/stream";
const ESP32_SNAPSHOT = process.env.ESP32_SNAPSHOT || "/capture";

const mockDir = path.join(__dirname, "mock");
await fs.mkdir(mockDir, { recursive: true });

// Expor arquivos mock para pré-visualização
app.use("/mock", express.static(mockDir, { fallthrough: true }));

// Multer p/ upload persistente
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, mockDir),
  filename: (req, file, cb) => {
    const ext = (path.extname(file.originalname) || ".jpg").toLowerCase();
    cb(null, `upload-${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Define current.*
async function setCurrentImage(filename) {
  const src = path.join(mockDir, filename);
  const ext = path.extname(filename).toLowerCase() || ".jpg";
  const files = await fs.readdir(mockDir);
  await Promise.all(
    files.filter(fn => /^current\./i.test(fn))
         .map(fn => fs.rm(path.join(mockDir, fn)).catch(() => {}))
  );
  const dst = path.join(mockDir, `current${ext}`);
  await fs.copyFile(src, dst);
  return path.basename(dst);
}

// WebReadable -> res
async function pipeWebBodyToRes(webBody, res) {
  if (!webBody) { res.status(502).send("Upstream sem corpo"); return; }
  const readable = Readable.fromWeb(webBody);
  await pipeline(readable, res);
}

// ========== Endpoints de câmera ==========
app.get("/api/cam/capture", async (req, res) => {
  try {
    const overrideBase = req.query.base || ESP32_BASE;
    if (overrideBase) {
      const snapUrl = new URL(ESP32_SNAPSHOT, overrideBase).toString();
      const r = await fetch(snapUrl, { redirect: "follow" });
      res.setHeader("Content-Type", r.headers.get("content-type") || "image/jpeg");
      await pipeWebBodyToRes(r.body, res);
      return;
    }
    const files = await fs.readdir(mockDir);
    const current = files.find(fn => /^current\./i.test(fn)) ||
                    files.find(fn => /\.(png|jpe?g|webp)$/i.test(fn));
    if (!current) { res.status(404).json({ error: "Nenhuma imagem mock. Envie uma em /api/cam/upload." }); return; }
    res.sendFile(path.join(mockDir, current));
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Falha ao capturar imagem" });
  }
});

app.post("/api/cam/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) { res.status(400).json({ error: "Arquivo ausente (campo 'file')." }); return; }
    const saved = path.basename(req.file.filename);
    const current = await setCurrentImage(saved);
    res.json({ saved, current });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Falha no upload" });
  }
});

app.get("/api/cam/list", async (_req, res) => {
  try {
    const files = (await fs.readdir(mockDir)).filter(fn =>
      /\.(png|jpe?g|webp)$/i.test(fn) || /^current\./i.test(fn)
    );
    res.json({ files });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Falha ao listar" });
  }
});

app.post("/api/cam/select", async (req, res) => {
  try {
    const { name } = req.body || {};
    if (!name) { res.status(400).json({ error: "Informe 'name' no body" }); return; }
    const all = await fs.readdir(mockDir);
    if (!all.includes(name)) { res.status(404).json({ error: "Arquivo não existe" }); return; }
    const current = await setCurrentImage(name);
    res.json({ current });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Falha ao selecionar" });
  }
});

app.delete("/api/cam/file", async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) { res.status(400).json({ error: "Informe ?name=" }); return; }
    await fs.rm(path.join(mockDir, path.basename(name)));
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Falha ao remover" });
  }
});

// ========== Proxy MJPEG ==========
app.get("/proxy/mjpeg", async (req, res) => {
  try {
    const { src } = req.query;
    if (!src) { res.status(400).send("Parâmetro 'src' obrigatório"); return; }
    const r = await fetch(src, {
      redirect: "follow",
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/120 Safari/537.36" }
    });
    res.setHeader("Content-Type", r.headers.get("content-type") || "multipart/x-mixed-replace; boundary=frame");
    res.setHeader("Cache-Control", "no-cache");
    await pipeWebBodyToRes(r.body, res);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(502).send("Falha no proxy MJPEG");
  }
});

// ======= Proxy HLS com cookies e reescrita de KEY/MAP =======
const cookieJar = new Map(); // key: origin -> "k=v; k2=v2"
function getCookie(origin) { return cookieJar.get(origin) || ""; }
function setCookieFromResponse(origin, r) {
  // Node fetch (undici) pode ter getSetCookie(); fallback para raw()
  let arr = [];
  if (typeof r.headers.getSetCookie === "function") {
    arr = r.headers.getSetCookie();
  } else if (r.headers.raw) {
    arr = r.headers.raw()["set-cookie"] || [];
  } else {
    const one = r.headers.get("set-cookie");
    if (one) arr = [one];
  }
  if (!arr.length) return;
  // guarda apenas pares name=value
  const pairs = arr.map(s => s.split(";")[0]).filter(Boolean);
  if (!pairs.length) return;
  cookieJar.set(origin, pairs.join("; "));
}

async function fetchUpstream(urlStr) {
  const u = new URL(urlStr);
  const origin = u.origin;
  const headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/120 Safari/537.36",
    "Accept": "*/*",
    "Accept-Language": "en-US,en;q=0.8,pt-BR;q=0.7",
    "Origin": origin,
    "Referer": origin + "/",
  };
  const ck = getCookie(origin);
  if (ck) headers["Cookie"] = ck;
  const r = await fetch(urlStr, { redirect: "follow", headers });
  setCookieFromResponse(origin, r);
  return r;
}

function rewritePlaylist(text, finalUrl, req) {
  const base = new URL(finalUrl);
  const absolute = (line) => new URL(line, base).toString();
  const origin = `${req.protocol}://${req.headers.host}`;

  const lines = text.split("\n").map((line) => {
    const raw = line.trim();

    // Reescreve KEY/MAP: URI="..."
    if (raw.startsWith("#EXT-X-KEY") || raw.startsWith("#EXT-X-MAP")) {
      // substitui URI="...”
      return line.replace(/URI="([^"]+)"/i, (_, uri) => {
        try {
          const abs = absolute(uri);
          const prox = `${origin}/proxy/hls?src=${encodeURIComponent(abs)}`;
          return `URI="${prox}"`;
        } catch {
          return `URI="${uri}"`;
        }
      });
    }

    // Mantém diretivas/comentários
    if (raw === "" || raw.startsWith("#")) return line;

    // Reescreve URIs de media/variant
    try {
      const abs = absolute(raw);
      return `${origin}/proxy/hls?src=${encodeURIComponent(abs)}`;
    } catch {
      return line;
    }
  });

  return lines.join("\n");
}

app.get("/proxy/hls", async (req, res) => {
  try {
    const { src } = req.query;
    if (!src) { res.status(400).send("Parâmetro 'src' obrigatório"); return; }

    const r = await fetchUpstream(src);
    const finalUrl = r.url || src;

    // Playlist m3u8
    if (finalUrl.toLowerCase().endsWith(".m3u8")) {
      const text = await r.text();
      const rewritten = rewritePlaylist(text, finalUrl, req);
      res.setHeader("Cache-Control", "no-store, max-age=0, must-revalidate");
      res.type("application/vnd.apple.mpegurl").send(rewritten);
      return;
    }

    // Segmento (.ts/.m4s) ou chave (.key)
    res.setHeader("Content-Type", r.headers.get("content-type") || "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache");
    await pipeWebBodyToRes(r.body, res);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(502).send("Falha no proxy HLS");
  }
});

// ===== Stream direto do ESP32 (opcional) =====
app.get("/api/cam/stream", async (req, res) => {
  try {
    const overrideBase = req.query.base || ESP32_BASE; 
    if (!overrideBase) { res.status(400).json({ error: "ESP32_BASE não configurado" }); return; }
    const streamUrl = new URL(ESP32_STREAM, overrideBase).toString();
    const r = await fetch(streamUrl, { redirect: "follow" });
    res.setHeader("Content-Type", r.headers.get("content-type") || "multipart/x-mixed-replace");
    await pipeWebBodyToRes(r.body, res);
  } catch (e) {
    console.error(e);
    if (!res.headersSent) res.status(502).send("Falha no stream");
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`mock-cam rodando em http://0.0.0.0:${PORT}`);
});
