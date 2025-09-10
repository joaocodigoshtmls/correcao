import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, provider, signInWithPopup } from "../../firebase";
import { motion } from "framer-motion";
import { 
  Eye, 
  EyeOff, 
  Brain, 
  Shield, 
  Zap, 
  Network, 
  Target, 
  User, 
  Lock, 
  Mail,
  Chrome
} from "lucide-react";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  // Debug function para teste no console
  window.testLogin = async () => {
    console.log("🧪 Testando login com credenciais fixas");
    const testCredentials = {
      email: "teste@teste.com",
      password: "123456"
    };
    
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testCredentials),
      });
      const data = await res.json();
      console.log("🧪 Resultado do teste:", res.status, data);
      return { status: res.status, data };
    } catch (err) {
      console.error("🧪 Erro no teste:", err);
      return { error: err.message };
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("Usuário logado com Google:", result.user);

      const usuario = {
        nome: result.user.displayName,
        email: result.user.email,
        foto: result.user.photoURL,
      };

      localStorage.setItem("usuario", JSON.stringify(usuario));
      navigate("/home");
    } catch (error) {
      console.error("Erro no login com Google:", error);
      alert("Falha no login com Google.");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    console.log("🔄 Iniciando login com:", { email: formData.email });
    console.log("🌐 API_URL:", API_URL);
    
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();
      console.log("📥 LOGIN RESPONSE:", res.status, data);

      if (!res.ok) throw new Error(data.error || "Erro no login");

      console.log("💾 Salvando token:", data.token);
      localStorage.setItem("token", data.token);

      // Gera dados básicos do usuário localmente
      const usuario = {
        email: formData.email,
        nome: formData.email.split("@")[0],
      };

      console.log("👤 Salvando usuário:", usuario);
      localStorage.setItem("usuario", JSON.stringify(usuario));
      
      // Verificação imediata após salvar
      console.log("✅ Verificando se foi salvo:");
      console.log("Token no localStorage:", localStorage.getItem("token"));
      console.log("Usuario no localStorage:", localStorage.getItem("usuario"));

      console.log("🎯 Redirecionando para /home");
      
      // Adiciona um pequeno delay para garantir que o localStorage foi salvo
      setTimeout(() => {
        navigate("/home", { replace: true });
      }, 100);
      
    } catch (err) {
      console.error("❌ Login falhou:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center relative overflow-hidden">
      
      {/* Efeitos de fundo Neural */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 2,
              delay: i * 0.1,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: Math.random() * 3
            }}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-600 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      {/* Grid Neural Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `
            radial-gradient(circle at 1px 1px, rgba(99, 102, 241, 0.3) 1px, transparent 0)
          `,
          backgroundSize: '50px 50px'
        }} />
      </div>

      {/* Container Principal */}
      <div className="relative z-10 w-full max-w-6xl mx-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
        {/* Lado Esquerdo - Branding Neural */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex flex-col items-center justify-center text-center space-y-8"
        >
          
          {/* Logo Neural */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative"
          >
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-full animate-pulse shadow-2xl shadow-blue-500/25"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Brain className="w-20 h-20 text-white drop-shadow-lg" />
              </div>
              
              {/* Anéis Orbitais */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-blue-400/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-2 border-purple-400/30 rounded-full"
              />
            </div>
          </motion.div>

          {/* Título Neural */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="space-y-4"
          >
            <h1 className="text-6xl font-bold heading-ai bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 bg-clip-text text-transparent">
              FaceRec AI
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-blue-500"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-purple-500"></div>
            </div>
            <p className="text-xl text-slate-600 text-ai max-w-lg">
              Sistema Avançado de Reconhecimento Facial com Machine Learning e Deep Neural Networks
            </p>
          </motion.div>

          {/* Features Neurais */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-2 gap-6 max-w-lg"
          >
            {[
              { icon: Target, title: "98.7% Accuracy", desc: "Precisão Neural", color: "from-green-500 to-emerald-600" },
              { icon: Zap, title: "Real-time", desc: "Processamento Instantâneo", color: "from-yellow-500 to-orange-600" },
              { icon: Shield, title: "Segurança", desc: "Criptografia Avançada", color: "from-red-500 to-rose-600" },
              { icon: Network, title: "Deep Learning", desc: "Redes Neurais", color: "from-purple-500 to-pink-600" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className="backdrop-blur-md bg-white/80 rounded-2xl p-4 border border-slate-200/60 shadow-lg"
              >
                <div className={`p-2 rounded-xl bg-gradient-to-r ${feature.color} w-fit mx-auto mb-2`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-slate-800 text-sm heading-ai">{feature.title}</h3>
                <p className="text-xs text-slate-600 text-ai">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Lado Direito - Formulário de Login */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-3xl p-8 shadow-2xl shadow-slate-900/10">
            
            {/* Header do Formulário */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <User className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 heading-ai">Acesso FaceRec</h2>
              </div>
              <p className="text-slate-600 text-ai">Entre no sistema de inteligência artificial</p>
              <div className="flex items-center gap-2 justify-center mt-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm mono-ai text-blue-600">SISTEMA ATIVO</span>
              </div>
            </motion.div>

            {/* Formulário */}
            <motion.form
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              onSubmit={handleEmailLogin}
              className="space-y-6"
            >
              
              {/* Campo Email */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 text-ai">Email FaceRec</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="seu@email.com"
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-ai bg-white/80"
                  />
                </div>
              </div>

              {/* Campo Senha */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700 text-ai">Senha de Acesso</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-ai bg-white/80"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Botão de Login */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-ai bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processando Neural...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="w-5 h-5" />
                    <span>Acessar Sistema</span>
                  </div>
                )}
              </motion.button>

              {/* Divisor */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-slate-500 text-ai">ou continue com</span>
                </div>
              </div>

              {/* Login com Google */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleGoogleLogin}
                className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-ai border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-2"
              >
                <Chrome className="w-5 h-5 text-blue-500" />
                <span>Google FaceRec Auth</span>
              </motion.button>
            </motion.form>

            {/* Link para Cadastro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-slate-600 text-ai">
                Não possui acesso FaceRec?{" "}
                <Link
                  to="/cadastro"
                  className="font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Registrar no Sistema
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
