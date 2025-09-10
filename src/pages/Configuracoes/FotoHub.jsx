import { useMemo, useRef, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import {
  Image as ImageIcon,
  Upload,
  Link as LinkIcon,
  Palette,
  RefreshCcw,
  CheckCircle2,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

/* =========================
   Helpers
   ========================= */

// Monta URL absoluta para exibir avatar (SEM fallback fantasma)
function toAvatarUrl(u) {
  const candidate = u?.profile_picture || "";
  if (!candidate) return "/avatar-default.png"; // padrão p/ todos
  if (/^https?:\/\//i.test(candidate)) return candidate;
  const path = candidate.startsWith("/") ? candidate : `/${candidate}`;
  return `${API_BASE}${path}`;
}

// Tenta tornar link do Drive em link direto
function normalizeDriveUrl(raw) {
  if (!raw) return raw;
  try {
    const url = new URL(raw);
    if (url.hostname.includes("drive.google.com")) {
      const match = url.pathname.match(/\/file\/d\/([^/]+)/);
      const id = match?.[1] || url.searchParams.get("id");
      if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
    }
    return raw;
  } catch {
    return raw;
  }
}

function getToken() {
  const keys = ["authToken", "token", "accessToken", "jwt"];
  for (const k of keys) {
    const v = localStorage.getItem(k);
    if (v) return v;
  }
  for (const k of ["authToken", "token"]) {
    const v = sessionStorage.getItem(k);
    if (v) return v;
  }
  return null;
}

// util: #RRGGBB -> [r,g,b]
function hexToRgb(hex) {
  if (!hex) return [0, 0, 0];
  const h = hex.replace("#", "");
  const v = parseInt(h.length === 3 ? h.split("").map(c => c + c).join("") : h, 16);
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255];
}

/* =========================
   Componente
   ========================= */

export default function FotoHub() {
  const { usuario, setUsuario, updateProfilePicture } = useUser();
  const safeUser = usuario || {};
  const baseAvatarUrl = useMemo(() => toAvatarUrl(safeUser), [safeUser]);

  const [tab, setTab] = useState("galeria"); // 'galeria' | 'drive' | 'original' | 'cores'
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null); // {type:'ok'|'err', text}
  const [urlInput, setUrlInput] = useState("");
  const [tint, setTint] = useState(null); // {hex, label} | null

  const fileInputRef = useRef(null);

  const palette = [
    { hex: null, label: "Nenhuma" },
    { hex: "#ff4d4d", label: "Vermelho" },
    { hex: "#ff9800", label: "Âmbar" },
    { hex: "#ffd54f", label: "Amarelo" },
    { hex: "#4caf50", label: "Verde" },
    { hex: "#03a9f4", label: "Azul" },
    { hex: "#7c4dff", label: "Violeta" },
    { hex: "#e91e63", label: "Rosa" },
    { hex: "#795548", label: "Sépia" },
    { hex: "#9e9e9e", label: "Cinza" },
  ];

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3500);
  };

  // Envia um Blob/Arquivo para o endpoint de upload do back
  const uploadBlobAsFile = async (blob, filename = "profile.png") => {
    const token = getToken();
    if (!token) throw new Error("Sessão expirada. Faça login novamente.");

    const form = new FormData();
    // NOME DO CAMPO TEM QUE SER profilePicture (multer.single('profilePicture'))
    form.append("profilePicture", new File([blob], filename, { type: blob.type || "image/png" }));

    const r = await fetch(`${API_BASE}/api/user/profile-picture`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    const data = await r.json().catch(() => ({}));
    if (!r.ok || !data?.success) {
      throw new Error(data?.error || data?.message || "Falha ao enviar imagem.");
    }

    // A resposta já vem com ?v=timestamp; para persistir no usuário, salvamos sem o ?v=
    const returned = data.profilePictureUrl || safeUser.profile_picture;
    const cleanPath = (returned || "").replace(API_BASE, "").replace(/\?v=.*$/, "");
    const updated = { ...safeUser, profile_picture: cleanPath || null };
    setUsuario(updated);
    try { localStorage.setItem("usuario", JSON.stringify(updated)); } catch {}

    // Atualiza header/preview com cache-busting
    const full = /^https?:\/\//i.test(returned)
      ? returned
      : `${API_BASE}${returned?.startsWith("/") ? returned : "/" + returned}`;
    if (full) updateProfilePicture(`${full}?v=${Date.now()}`);

    return data;
  };

  // Upload local
  const handleUploadLocal = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      showMsg("err", "Escolha JPG, PNG ou WebP.");
      e.target.value = "";
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showMsg("err", "Máximo 5MB.");
      e.target.value = "";
      return;
    }
    try {
      setBusy(true);
      await uploadBlobAsFile(file, file.name);
      showMsg("ok", "Foto atualizada!");
    } catch (err) {
      showMsg("err", err.message || "Erro ao enviar.");
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  // Importar por URL/Drive — faz o download no cliente e reenvia ao teu POST existente
  const handleImportUrl = async () => {
    if (!urlInput) return;
    try {
      setBusy(true);
      const normalized = normalizeDriveUrl(urlInput);
      const resp = await fetch(normalized, { mode: "cors" });
      if (!resp.ok) throw new Error("Não foi possível baixar a imagem dessa URL.");
      const ct = resp.headers.get("content-type") || "";
      if (!/image\/(png|jpe?g|webp|gif)/i.test(ct)) {
        // ainda tentamos, mas avisamos
        console.warn("Content-Type não parece imagem:", ct);
      }
      const blob = await resp.blob();
      await uploadBlobAsFile(blob, `from_url_${Date.now()}.png`);
      setUrlInput("");
      showMsg("ok", "Foto importada!");
    } catch (err) {
      showMsg("err", err.message || "Erro ao importar.");
    } finally {
      setBusy(false);
    }
  };

  // === COLORIR “POR DENTRO” (troca o fundo preto por uma cor sólida) ===
  async function colorizeDarkBackground(imgUrl, hex) {
    const [tr, tg, tb] = hexToRgb(hex || "#000000");

    // carrega imagem base
    const img = new Image();
    img.crossOrigin = "anonymous";
    // cache-bust p/ evitar preview antigo ao voltar de rota
    const sep = imgUrl.includes("?") ? "&" : "?";
    img.src = `${imgUrl}${sep}v=${Date.now()}`;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = () => rej(new Error("Falha ao carregar imagem base."));
    });

    const w = img.naturalWidth || img.width;
    const h = img.naturalHeight || img.height;
    const canvas = document.createElement("canvas");
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, w, h);

    // recolore só pixels ESCUROS (fundo), preservando brancos (silhueta/aro)
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i], g = data[i+1], b = data[i+2], a = data[i+3];
      if (a === 0) continue; // transparente fora do círculo
      // luminância perceptiva
      const lum = 0.2126*r + 0.7152*g + 0.0722*b;
      // threshold alto (~brancos ficam)
      if (lum < 235) {
        data[i] = tr; data[i+1] = tg; data[i+2] = tb; // cor sólida
      }
    }
    ctx.putImageData(imageData, 0, 0);
    return new Promise((res) => canvas.toBlob(res, "image/png", 0.95));
  }

  // Aplica cor e salva
  const saveTinted = async () => {
    try {
      setBusy(true);
      // sem cor -> volta ao original (reenvia a base)
      const blob = await colorizeDarkBackground(baseAvatarUrl, tint?.hex || null);
      if (!blob) throw new Error("Falha ao gerar imagem.");
      await uploadBlobAsFile(blob, `${tint?.hex ? `color_${tint.label}` : "original"}_${Date.now()}.png`);
      showMsg("ok", tint?.hex ? `Foto ${tint.label} salva!` : "Foto original aplicada!");
    } catch (err) {
      showMsg("err", err.message || "Erro ao aplicar cor.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-6 shadow-xl shadow-slate-900/5">
      {/* Cabeçalho */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-fuchsia-500 to-purple-500 rounded-lg shrink-0">
          <ImageIcon className="size-5 text-white" />
        </div>
        <div className="min-w-0">
          <h3 className="text-lg font-bold text-slate-800">Foto de Perfil</h3>
          <p className="text-sm text-slate-600">Galeria • Link/Drive • Original • Cores</p>
        </div>
      </div>

      {/* Preview + mensagem */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src={baseAvatarUrl}
          alt="Pré-visualização"
          className="w-16 h-16 rounded-full object-cover border border-slate-200 shrink-0"
          onError={(e) => { e.currentTarget.src = "/avatar-default.png"; }}
        />
        {message && (
          <div
            className={`text-sm px-3 py-2 rounded-lg border break-words flex-1 min-w-0 ${
              message.type === "ok"
                ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                : "bg-red-50 border-red-200 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { id: "galeria", label: "Galeria", icon: <Upload className="size-4" /> },
          { id: "drive", label: "Drive/URL", icon: <LinkIcon className="size-4" /> },
          { id: "original", label: "Original", icon: <RefreshCcw className="size-4" /> },
          { id: "cores", label: "Cores", icon: <Palette className="size-4" /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-3 py-2 text-sm rounded-xl border transition ${
              tab === t.id
                ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Conteúdo */}
      {tab === "galeria" && (
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleUploadLocal}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 w-full sm:w-auto"
          >
            <Upload className="size-4" />
            Selecionar arquivo
          </button>
          <p className="text-xs text-slate-500">JPG, PNG ou WebP — até 5MB</p>
        </div>
      )}

      {tab === "drive" && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Cole um link público (Drive, Imgur, etc.)"
              className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-300"
            />
            <button
              onClick={handleImportUrl}
              disabled={busy || !urlInput}
              className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 w-full sm:w-auto"
            >
              <CheckCircle2 className="size-4" />
              Importar
            </button>
          </div>
          <p className="text-xs text-slate-500 break-words">
            Links do Drive também funcionam (use compartilhamento público).
          </p>
        </div>
      )}

      {tab === "original" && (
        <div className="space-y-2">
          <p className="text-sm text-slate-600">Voltar para a foto sem cor/filtros.</p>
          <button
            onClick={() => { setTint(null); setTab("cores"); }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 w-full sm:w-auto"
          >
            <RefreshCcw className="size-4" />
            Usar foto original (salvar sem cor)
          </button>
          <p className="text-xs text-slate-500">Depois clique em “Salvar” na aba Cores.</p>
        </div>
      )}

      {tab === "cores" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {palette.map((c) => (
              <button
                key={c.label}
                onClick={() => setTint(c.hex ? { hex: c.hex, label: c.label } : null)}
                className={`h-10 px-2 rounded-xl border text-xs sm:text-sm ${
                  (tint?.hex || null) === (c.hex || null)
                    ? "border-indigo-400 ring-2 ring-indigo-200"
                    : "border-slate-200"
                }`}
                style={{
                  background: c.hex ? `linear-gradient(90deg, ${c.hex}55, ${c.hex}aa)` : "white",
                }}
                title={c.label}
              >
                {c.label}
              </button>
            ))}
          </div>

          <button
            onClick={saveTinted}
            disabled={busy}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-50 w-full sm:w-auto"
          >
            <CheckCircle2 className="size-4" />
            Salvar {tint?.label ? `(${tint.label})` : "(sem cor)"}
          </button>

          <p className="text-xs text-slate-500">
            Agora a cor substitui o fundo preto (sem sobrepor a silhueta branca).
          </p>
        </div>
      )}
    </div>
  );
}
