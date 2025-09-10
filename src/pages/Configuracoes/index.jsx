import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "../../contexts/UserContext";
import AlterarSenha from "./AlterarSenha";
import FotoHub from "./FotoHub";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Lock,
  Save,
  X,
  Settings,
  Shield,
  Database,
  Trash2,
  AlertTriangle,
  Check,
  Edit3
} from "lucide-react";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3001";

export default function Configuracoes() {
  const { usuario, setUsuario } = useUser();
  const [loading, setLoading] = useState(true);
  const [camposEditaveis, setCamposEditaveis] = useState({
    full_name: false,
    phone: false,
    cpf: false,
  });

  const [mostrarAlterarSenha, setMostrarAlterarSenha] = useState(false);
  const [mostrarExcluirConta, setMostrarExcluirConta] = useState(false);

  const [carregando, setCarregando] = useState(false);
  const [carregandoPerfil, setCarregandoPerfil] = useState(true);

  const navigate = useNavigate();
  const safeUsuario = usuario || {};

  const obterToken = () => {
    const possiveis = [
      localStorage.getItem("authToken"),
      localStorage.getItem("token"),
      localStorage.getItem("accessToken"),
      localStorage.getItem("jwt"),
      sessionStorage.getItem("authToken"),
      sessionStorage.getItem("token"),
    ];
    return possiveis.find(Boolean) || null;
  };

  const formatDateTime = (val) => {
    if (!val) return "-";
    const isoish = typeof val === "string" ? val.replace(" ", "T") : val;
    const d = new Date(isoish);
    if (Number.isNaN(d.getTime())) return "-";
    return d.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Busca perfil no backend (traz created_at/updated_at)
  const buscarDadosUsuario = async (token) => {
    try {
      const response = await fetch(`${API_BASE}/api/user/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUsuario(userData);
        try { localStorage.setItem("usuario", JSON.stringify(userData)); } catch {}
      } else {
        const error = await response.json().catch(() => ({}));
        console.error("❌ Erro ao buscar dados:", error);
        if (response.status === 401 || response.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("💥 Erro na requisição:", error);
    } finally {
      setCarregandoPerfil(false);
    }
  };

  // Carregamento inicial
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStorage = localStorage.getItem("usuario");

    if (!token && !userStorage) {
      navigate("/login");
      return;
    }
    if (token) {
      buscarDadosUsuario(token);
      return;
    }
    if (userStorage) {
      try {
        setUsuario(JSON.parse(userStorage));
      } catch {
        navigate("/login");
      }
      setCarregandoPerfil(false);
    }
  }, [navigate, setUsuario]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [usuario]);

  const handleSalvarPerfil = async () => {
    setCarregando(true);
    try {
      const token = obterToken();
      if (!token) {
        alert("Token de autenticação não encontrado. Faça login novamente.");
        navigate("/login");
        return;
      }

      const response = await fetch(`${API_BASE}/api/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: safeUsuario.full_name,
          phone: safeUsuario.phone,
          cpf: safeUsuario.cpf,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        setUsuario(data.user);
        setCamposEditaveis({ full_name: false, phone: false, cpf: false });
        buscarDadosUsuario(token); // atualiza updated_at no card
        alert("Dados atualizados com sucesso!");
      } else {
        alert("Erro ao atualizar dados: " + (data?.error || "Desconhecido"));
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
      alert("Erro ao atualizar dados: " + error.message);
    } finally {
      setCarregando(false);
    }
  };

  const handleEditarCampo = (campo) => {
    setCamposEditaveis((prev) => ({ ...prev, [campo]: true }));
  };

  const obterLabelCampo = (campo) => {
    const labels = { full_name: "Nome Completo", email: "Email", phone: "Telefone", cpf: "CPF" };
    return labels[campo] || campo;
  };

  if (carregandoPerfil) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-slate-600 font-medium">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 space-y-8 p-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-900/5"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <Settings className="size-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-800 bg-clip-text text-transparent mb-2">
              Configurações da Conta
            </h1>
            <p className="text-slate-600 text-lg">Gerencie suas informações pessoais e configurações de segurança</p>
          </div>
        </div>
      </motion.div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Coluna esquerda: Informações pessoais */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-2 space-y-6"
        >
          <div className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-900/5">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                <User className="size-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Informações Pessoais</h2>
                <p className="text-slate-600">Atualize seus dados básicos</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Nome */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <User className="size-4" />
                  {obterLabelCampo("full_name")} *
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={safeUsuario.full_name || ""}
                      disabled={!camposEditaveis.full_name}
                      onChange={(e) => setUsuario({ ...(usuario || {}), full_name: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        camposEditaveis.full_name
                          ? "border-indigo-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                      placeholder="Seu nome completo"
                    />
                  </div>
                  <button
                    onClick={() => handleEditarCampo("full_name")}
                    disabled={camposEditaveis.full_name}
                    className={`p-3 rounded-xl transition-all duration-300 shadow-md ${
                      camposEditaveis.full_name
                        ? "bg-emerald-100 text-emerald-600 cursor-default"
                        : "bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    {camposEditaveis.full_name ? <Check className="size-5" /> : <Edit3 className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Mail className="size-4" />
                  Email *
                </label>
                <div className="flex-1 relative">
                  <input
                    type="email"
                    value={safeUsuario.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-600"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Lock className="size-4 text-slate-400" />
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">Email não pode ser alterado</p>
              </div>

              {/* Telefone */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <Phone className="size-4" />
                  Telefone
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={safeUsuario.phone || ""}
                      disabled={!camposEditaveis.phone}
                      onChange={(e) => setUsuario({ ...(usuario || {}), phone: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        camposEditaveis.phone
                          ? "border-indigo-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <button
                    onClick={() => handleEditarCampo("phone")}
                    disabled={camposEditaveis.phone}
                    className={`p-3 rounded-xl transition-all duration-300 shadow-md ${
                      camposEditaveis.phone
                        ? "bg-emerald-100 text-emerald-600 cursor-default"
                        : "bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    {camposEditaveis.phone ? <Check className="size-5" /> : <Edit3 className="size-5" />}
                  </button>
                </div>
              </div>

              {/* CPF */}
              <div>
                <label className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <CreditCard className="size-4" />
                  CPF
                </label>
                <div className="flex items-center space-x-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={safeUsuario.cpf || ""}
                      disabled={!camposEditaveis.cpf}
                      onChange={(e) => setUsuario({ ...(usuario || {}), cpf: e.target.value })}
                      className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
                        camposEditaveis.cpf
                          ? "border-indigo-300 bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                          : "border-slate-200 bg-slate-50 text-slate-600"
                      }`}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <button
                    onClick={() => handleEditarCampo("cpf")}
                    disabled={camposEditaveis.cpf}
                    className={`p-3 rounded-xl transition-all duration-300 shadow-md ${
                      camposEditaveis.cpf
                        ? "bg-emerald-100 text-emerald-600 cursor-default"
                        : "bg-slate-100 hover:bg-indigo-100 text-slate-600 hover:text-indigo-600"
                    }`}
                  >
                    {camposEditaveis.cpf ? <Check className="size-5" /> : <Edit3 className="size-5" />}
                  </button>
                </div>
              </div>

              {/* Botão Salvar */}
              {Object.values(camposEditaveis).some(Boolean) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="pt-6 border-t border-slate-200"
                >
                  <button
                    onClick={handleSalvarPerfil}
                    disabled={carregando}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {carregando ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <Save className="size-5" />
                    )}
                    {carregando ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Coluna direita */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* HUB DE FOTO */}
          <FotoHub />

          {/* Segurança */}
          <div className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-6 shadow-xl shadow-slate-900/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                <Shield className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Segurança</h3>
                <p className="text-sm text-slate-600">Gerencie sua senha e segurança</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <button
                onClick={() => setMostrarAlterarSenha(true)}
                className="w-full text-left p-4 bg-slate-50 hover:bg-indigo-50 rounded-xl transition-all duration-200 border border-slate-200 hover:border-indigo-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock className="size-5 text-slate-600 group-hover:text-indigo-600" />
                    <span className="font-medium text-slate-800 group-hover:text-indigo-700">Alterar Senha</span>
                  </div>
                  <div className="text-slate-400 group-hover:text-indigo-500">→</div>
                </div>
              </button>
            </div>
          </div>

          {/* Modal/bloco Alterar Senha */}
          {mostrarAlterarSenha && (
            <div className="backdrop-blur-md bg-white/90 border border-slate-200/70 rounded-2xl p-6 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">Alterar Senha</h3>
                <button
                  onClick={() => setMostrarAlterarSenha(false)}
                  className="p-2 rounded hover:bg-slate-100"
                >
                  <X className="size-5 text-slate-500" />
                </button>
              </div>
              <AlterarSenha />
            </div>
          )}

          {/* Zona de Perigo */}
          <div className="backdrop-blur-md bg-white/80 border border-red-200/60 rounded-2xl p-6 shadow-xl shadow-red-900/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <AlertTriangle className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-red-800">Zona de Perigo</h3>
                <p className="text-sm text-red-600">Ações irreversíveis</p>
              </div>
            </div>
            
            <button
              onClick={() => setMostrarExcluirConta(true)}
              className="w-full text-left p-4 bg-red-50 hover:bg-red-100 rounded-xl transition-all duration-200 border border-red-200 hover:border-red-300 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Trash2 className="size-5 text-red-600" />
                  <span className="font-medium text-red-800">Excluir Conta</span>
                </div>
                <div className="text-red-400">→</div>
              </div>
            </button>
          </div>

          {/* Informações da Conta */}
          <div className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-6 shadow-xl shadow-slate-900/5">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <Database className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Informações da Conta</h3>
                <p className="text-sm text-slate-600">Dados administrativos</p>
              </div>
            </div>
            
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Criada em:</span>
                <span className="font-medium text-slate-800">
                  {formatDateTime(safeUsuario.created_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Atualizada em:</span>
                <span className="font-medium text-slate-800">
                  {formatDateTime(safeUsuario.updated_at)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Status:</span>
                <span className="font-medium text-emerald-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                  Ativa
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
