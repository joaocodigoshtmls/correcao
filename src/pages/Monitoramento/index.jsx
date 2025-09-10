import React, { useEffect, useMemo, useRef, useState } from "react";

export default function Monitoramento() {
  // === HLS (como já estava) ===
  const [directUrl, setDirectUrl] = useState(
    "https://live-hls-apps-aje-v3-fa.getaj.net/AJE/index.m3u8"
  );
  const base = import.meta.env.VITE_CAM_BASE || "http://localhost:4000";
  const proxiedUrl = useMemo(() => {
    return `${base}/proxy/hls?src=${encodeURIComponent(directUrl)}`;
  }, [directUrl, base]);

  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const retryRef = useRef({ timer: null, tries: 0 });

  // === ESP32 (novo) ===
  const [mode, setMode] = useState(() => localStorage.getItem("mon_mode") || "hls"); // "hls" | "esp32"
  const [esp32Base, setEsp32Base] = useState(() => localStorage.getItem("esp32Base") || "");
  const [snapSrc, setSnapSrc] = useState("");

  useEffect(() => localStorage.setItem("mon_mode", mode), [mode]);
  useEffect(() => localStorage.setItem("esp32Base", esp32Base), [esp32Base]);

  // Player HLS com autorrecuperação
  useEffect(() => {
    if (mode !== "hls") return;
    const video = videoRef.current;
    if (!video) return;

    let mounted = true;

    const setup = async () => {
      if (!mounted) return;
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
      if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = proxiedUrl;
        return;
      }
      const Hls = (await import("hls.js")).default;
      if (Hls.isSupported()) {
        const hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          liveSyncDurationCount: 3,
        });
        hlsRef.current = hls;
        hls.loadSource(proxiedUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (_evt, data) => {
          if (!data?.fatal) return;
          if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            hls.startLoad();
            scheduleRestart();
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            hls.recoverMediaError();
          } else {
            scheduleRestart(true);
          }
        });
      } else {
        video.src = proxiedUrl;
      }
    };

    const scheduleRestart = (destroyFirst = false) => {
      const state = retryRef.current;
      clearTimeout(state.timer);
      const delay = Math.min(30000, 2000 * (state.tries + 1));
      state.tries++;
      state.timer = setTimeout(() => {
        if (destroyFirst && hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        setup();
      }, delay);
    };

    setup();
    return () => {
      mounted = false;
      clearTimeout(retryRef.current.timer);
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [proxiedUrl, mode]);

  const handleEsp32Snapshot = () => {
    if (!esp32Base) return;
    setSnapSrc(`${base}/api/cam/capture?base=${encodeURIComponent(esp32Base)}&t=${Date.now()}`);
  };

  return (
    <div className="p-4 space-y-4">
      {/* Seletor de fonte */}
      <div className="flex gap-2 items-center">
        <span className="text-sm font-medium">Fonte:</span>
        <button
          className={`px-3 py-1 border rounded ${mode === "hls" ? "bg-black text-white" : ""}`}
          onClick={() => setMode("hls")}
        >
          HLS
        </button>
        <button
          className={`px-3 py-1 border rounded ${mode === "esp32" ? "bg-black text-white" : ""}`}
          onClick={() => setMode("esp32")}
        >
          ESP32
        </button>
      </div>

      {mode === "hls" && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium">URL .m3u8 (direta)</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={directUrl}
              onChange={(e) => setDirectUrl(e.target.value)}
              placeholder="https://exemplo.com/live/index.m3u8"
            />
            <div className="text-xs opacity-70">Via proxy: <code>{proxiedUrl}</code></div>
          </div>

          <video
            ref={videoRef}
            controls
            autoPlay
            muted
            playsInline
            style={{ width: "100%", maxWidth: 900, background: "#000" }}
          />
        </>
      )}

      {mode === "esp32" && (
        <>
          <div className="space-y-2">
            <label className="block text-sm font-medium">Base do ESP32 (ex.: http://192.168.0.50)</label>
            <input
              className="border rounded px-3 py-2 w-full"
              value={esp32Base}
              onChange={(e) => setEsp32Base(e.target.value)}
              placeholder="http://SEU_IP_DA_CAM"
            />
            <div className="text-xs opacity-70">
              Stream MJPEG via proxy:{" "}
              <code>{`${base}/api/cam/stream?base=${encodeURIComponent(esp32Base || "")}`}</code>
            </div>
          </div>

          {/* MJPEG rende melhor como <img> contínuo */}
          {esp32Base ? (
            <img
              src={`${base}/api/cam/stream?base=${encodeURIComponent(esp32Base)}&t=${Date.now()}`}
              alt="ESP32 stream"
              style={{ width: "100%", maxWidth: 900, background: "#000", borderRadius: 6 }}
            />
          ) : (
            <div className="text-sm">Informe a base do ESP32 para iniciar o stream.</div>
          )}

          <div className="flex items-center gap-2">
            <button className="px-3 py-1 border rounded" onClick={handleEsp32Snapshot} disabled={!esp32Base}>
              Tirar snapshot
            </button>
            {snapSrc && (
              <a className="text-sm underline" href={snapSrc} target="_blank" rel="noreferrer">
                abrir snapshot
              </a>
            )}
          </div>

          {snapSrc && (
            <img
              src={snapSrc}
              alt="snapshot"
              style={{ width: 320, borderRadius: 6, border: "1px solid #ddd" }}
            />
          )}
        </>
      )}
    </div>
  );
}
