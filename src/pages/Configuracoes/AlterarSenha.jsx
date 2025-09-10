// src/pages/Configuracoes/AlterarSenha.jsx
import React, { useMemo, useState } from "react";
import { Eye, EyeOff, Save, AlertTriangle, CheckCircle } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";
const CHANGE_PASSWORD_URL = `${API_BASE}/api/user/password`; // tua rota (PUT)

function strengthOf(pass = "") {
  let score = 0;
  if (pass.length >= 8) score++;
  if (/[A-Z]/.test(pass)) score++;
  if (/[a-z]/.test(pass)) score++;
  if (/\d/.test(pass)) score++;
  if (/[^A-Za-z0-9]/.test(pass)) score++;
  if (score > 4) score = 4;
  const labels = ["Muito fraca", "Fraca", "Média", "Forte", "Muito forte"];
  return { score, label: labels[score] };
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

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");

  const [show, setShow] = useState({ atual: false, nova: false, conf: false });
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'ok'|'err', text }

  const { score, label } = useMemo(() => strengthOf(novaSenha), [novaSenha]);
  const canSubmit =
    senhaAtual.length > 0 &&
    novaSenha.length >= 8 &&
    confirmar === novaSenha &&
    score >= 2;

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    const token = getToken();
    if (!token) {
      setMsg({ type: "err", text: "Sessão expirada. Faça login novamente." });
      return;
    }

    try {
      setSubmitting(true);
      const r = await fetch(CHANGE_PASSWORD_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword: senhaAtual,
          newPassword: novaSenha,
        }),
      });

      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        setMsg({ type: "err", text: data?.error || data?.message || "Falha ao alterar senha." });
        return;
      }

      setMsg({ type: "ok", text: data?.message || "Senha alterada com sucesso." });
      setSenhaAtual("");
      setNovaSenha("");
      setConfirmar("");
    } catch {
      setMsg({ type: "err", text: "Erro de conexão com o servidor." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {msg?.type === "ok" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700">
          <CheckCircle className="size-4" />
          <span>{msg.text}</span>
        </div>
      )}
      {msg?.type === "err" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700">
          <AlertTriangle className="size-4" />
          <span>{msg.text}</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Senha atual */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Senha atual</label>
          <div className="relative">
            <input
              type={show.atual ? "text" : "password"}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 transition"
              value={senhaAtual}
              onChange={(e) => setSenhaAtual(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, atual: !s.atual }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              aria-label="Mostrar/ocultar senha atual"
            >
              {show.atual ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
        </div>

        {/* Nova senha */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Nova senha</label>
          <div className="relative">
            <input
              type={show.nova ? "text" : "password"}
              className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-indigo-500 transition"
              value={novaSenha}
              onChange={(e) => setNovaSenha(e.target.value)}
              placeholder="Mínimo 8 caracteres"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, nova: !s.nova }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              aria-label="Mostrar/ocultar nova senha"
            >
              {show.nova ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>

          {/* Barra de força */}
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
              <span>Força da senha</span>
              <span>{label}</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded">
              <div
                className={[
                  "h-2 rounded transition-all",
                  score <= 1 ? "bg-red-400" : score === 2 ? "bg-yellow-400" : score === 3 ? "bg-emerald-400" : "bg-green-600",
                ].join(" ")}
                style={{ width: `${(score / 4) * 100}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Use letras maiúsculas/minúsculas, números e símbolo para fortalecer.</p>
          </div>
        </div>

        {/* Confirmar */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar nova senha</label>
          <div className="relative">
            <input
              type={show.conf ? "text" : "password"}
              className={`w-full px-4 py-3 rounded-xl border-2 transition ${
                confirmar && confirmar !== novaSenha ? "border-red-400 focus:border-red-500" : "border-slate-200 focus:border-indigo-500"
              }`}
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              placeholder="Repita a nova senha"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => ({ ...s, conf: !s.conf }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              aria-label="Mostrar/ocultar confirmação"
            >
              {show.conf ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
          </div>
          {confirmar && confirmar !== novaSenha && <p className="text-xs text-red-600 mt-1">As senhas não conferem.</p>}
        </div>

        <button
          type="submit"
          disabled={!canSubmit || submitting}
          className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-xl shadow hover:from-indigo-600 hover:to-purple-700 flex items-center justify-center gap-2"
        >
          {submitting ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" /> : <Save className="size-5" />}
          {submitting ? "Salvando..." : "Salvar nova senha"}
        </button>
      </form>
    </div>
  );
}
