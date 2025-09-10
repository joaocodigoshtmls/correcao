import React, { useEffect, useState } from "react";

export default function ConfigFoto() {
  const base = import.meta.env.VITE_CAM_BASE || "http://localhost:4000";
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(`${base}/api/cam/capture?ts=${Date.now()}`);

  const refreshList = async () => {
    const r = await fetch(`${base}/api/cam/list`);
    const j = await r.json();
    setFiles(j.files || []);
    setCurrentSrc(`${base}/api/cam/capture?ts=${Date.now()}`);
  };

  useEffect(() => { refreshList(); }, []);

  const onUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    await fetch(`${base}/api/cam/upload`, { method: "POST", body: fd });
    setUploading(false);
    await refreshList();
  };

  const onSelect = async (name) => {
    await fetch(`${base}/api/cam/select`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    await refreshList();
  };

  const onDelete = async (name) => {
    await fetch(`${base}/api/cam/file?name=${encodeURIComponent(name)}`, { method: "DELETE" });
    await refreshList();
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Configurações — Trocar Foto da Câmera</h1>

      <div className="space-y-2">
        <label className="block text-sm font-medium">Enviar nova foto (vira a atual)</label>
        <input type="file" accept="image/*" onChange={onUpload} disabled={uploading} />
        {uploading && <div className="text-xs">Enviando…</div>}
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Snapshot atual</div>
        <img
          src={currentSrc}
          alt="Atual"
          style={{ maxWidth: 320, borderRadius: 8, border: "1px solid #ddd" }}
          onError={(e) => { e.currentTarget.src = `${base}/api/cam/capture?ts=${Date.now()}`; }}
        />
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">Imagens disponíveis</div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {files.map((name) => (
            <div key={name} className="border rounded p-2 space-y-2">
              <div className="text-xs break-all">{name}</div>
              <img src={`${base}/mock/${name}`} alt={name} style={{ width: "100%", borderRadius: 6 }} />
              <div className="flex gap-2">
                <button
                  className="px-2 py-1 text-sm border rounded"
                  onClick={() => onSelect(name)}
                >Usar</button>
                {!/^current\./i.test(name) && (
                  <button
                    className="px-2 py-1 text-sm border rounded"
                    onClick={() => onDelete(name)}
                  >Excluir</button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
