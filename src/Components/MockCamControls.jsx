
import { useEffect, useState } from "react";

const CAM_BASE = import.meta.env.VITE_CAM_BASE || "http://localhost:3000";

export default function MockCamControls() {
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function refresh() {
    setError("");
    try {
      const r = await fetch(`${CAM_BASE}/api/cam/list`);
      const j = await r.json();
      if (!j.ok) throw new Error("Falha ao listar");
      setFiles(j.files);
    } catch (e) {
      setError(e.message);
    }
  }

  useEffect(() => { refresh(); }, []);

  async function onUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`${CAM_BASE}/api/cam/upload`, { method: "POST", body: fd });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Upload falhou");
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function select(name) {
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`${CAM_BASE}/api/cam/select`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name }) });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Erro ao selecionar");
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(name) {
    if (!confirm("Remover esta imagem?")) return;
    setBusy(true);
    setError("");
    try {
      const r = await fetch(`${CAM_BASE}/api/cam/file?name=${encodeURIComponent(name)}`, { method: "DELETE" });
      const j = await r.json();
      if (!j.ok) throw new Error(j.error || "Erro ao remover");
      await refresh();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-slate-800">MockCam • Gerenciar Foto</h3>
        <label className="text-sm px-3 py-1.5 rounded-md bg-slate-900 text-white cursor-pointer">
          {busy ? "Processando..." : "Trocar foto"}
          <input type="file" accept="image/*" className="hidden" disabled={busy} onChange={onUpload} />
        </label>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {files.map(f => (
          <div key={f.name} className="border rounded-lg p-2">
            <img src={`${CAM_BASE.replace(/\/$/, "")}/mock/${encodeURIComponent(f.name)}`} alt={f.name} className="w-full h-28 object-cover rounded" onError={(e)=>{e.currentTarget.style.display='none'}} />
            <div className="mt-2 flex items-center justify-between">
              <span className="text-xs truncate">{f.name}</span>
              <div className="flex gap-1">
                <button className="text-xs px-2 py-1 rounded bg-emerald-600 text-white" disabled={busy} onClick={()=>select(f.name)}>Usar</button>
                <button className="text-xs px-2 py-1 rounded bg-rose-600 text-white" disabled={busy} onClick={()=>remove(f.name)}>Excluir</button>
              </div>
            </div>
          </div>
        ))}
        {!files.length && <div className="text-sm text-slate-500">Nenhuma imagem enviada ainda.</div>}
      </div>
      {error && <div className="mt-3 text-sm text-rose-700">{error}</div>}
      <div className="mt-3">
        <span className="text-sm text-slate-600">Snapshot atual:</span>
        <div className="mt-2 border rounded-lg p-2">
          <img src={`${CAM_BASE}/api/cam/capture?t=${Date.now()}`} alt="snapshot atual" className="w-full max-w-sm rounded" />
        </div>
      </div>
    </div>
  );
}
