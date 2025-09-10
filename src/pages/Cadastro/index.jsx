import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  Phone,
  UserPlus,
  ArrowRight,
  ArrowLeft,
  CheckCircle
} from "lucide-react";

export default function Cadastro() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [step, setStep] = useState(1); // Multi-step form
  
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateStep1 = () => {
    return formData.fullName.length >= 2 && formData.email && formData.phone;
  };

  const validateStep2 = () => {
    return formData.password.length >= 6 && formData.password === formData.confirmPassword;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setStep(1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) {
      alert("Verifique se as senhas coincidem e têm pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    
    try {
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Erro no cadastro");
      
      // Sucesso - redireciona para login
      navigate("/login", { 
        state: { message: "Conta FaceRec criada com sucesso! Faça login para continuar." }
      });
      
    } catch (err) {
      console.error("Erro no cadastro:", err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100 flex items-center justify-center relative overflow-hidden">
      
      {/* Efeitos de fundo Neural */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 2,
              delay: i * 0.05,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: Math.random() * 4
            }}
            className="absolute w-1 h-1 bg-gradient-to-r from-purple-400 to-blue-600 rounded-full"
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
            radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.3) 1px, transparent 0)
          `,
          backgroundSize: '40px 40px'
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
            initial={{ scale: 0, rotate: 180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0.4 }}
            className="relative"
          >
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-full animate-pulse shadow-2xl shadow-purple-500/25"></div>
              <div className="absolute inset-2 bg-gradient-to-r from-slate-800 to-slate-900 rounded-full"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <UserPlus className="w-20 h-20 text-white drop-shadow-lg" />
              </div>
              
              {/* Anéis Orbitais */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-purple-400/30 rounded-full"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-2 border-blue-400/30 rounded-full"
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
            <h1 className="text-6xl font-bold heading-ai bg-gradient-to-r from-purple-700 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
              FaceRec Registry
            </h1>
            <div className="flex items-center justify-center gap-2">
              <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-purple-500"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-blue-500"></div>
            </div>
            <p className="text-xl text-slate-600 text-ai max-w-lg">
              Junte-se à Rede Neural de Inteligência Artificial e Reconhecimento Facial Avançado
            </p>
          </motion.div>

          {/* Process Steps */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-4 w-full max-w-sm"
          >
            <h3 className="text-lg font-semibold text-slate-700 heading-ai mb-4">Processo de Registro FaceRec</h3>
            
            {[
              { step: 1, title: "Dados Pessoais", desc: "Informações básicas", active: step >= 1 },
              { step: 2, title: "Segurança FaceRec", desc: "Senha e confirmação", active: step >= 2 },
              { step: 3, title: "Ativação", desc: "Sistema ativo", active: false }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                className={`flex items-center gap-4 p-3 rounded-xl border transition-all duration-300 ${
                  item.active 
                    ? "bg-gradient-to-r from-purple-50 to-blue-50 border-purple-300" 
                    : "bg-white/50 border-slate-200"
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  item.active 
                    ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white" 
                    : "bg-slate-200 text-slate-500"
                }`}>
                  {item.active ? <CheckCircle className="w-4 h-4" /> : item.step}
                </div>
                <div>
                  <h4 className="font-medium text-slate-800 text-ai">{item.title}</h4>
                  <p className="text-xs text-slate-600 text-ai">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Lado Direito - Formulário de Cadastro */}
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
                <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-600 rounded-xl">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800 heading-ai">Registro FaceRec</h2>
              </div>
              <p className="text-slate-600 text-ai">
                {step === 1 ? "Crie sua conta no sistema de IA" : "Configure sua segurança FaceRec"}
              </p>
              <div className="flex items-center gap-2 justify-center mt-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span className="text-sm mono-ai text-purple-600">ETAPA {step} DE 2</span>
              </div>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="w-full bg-slate-200 rounded-full h-2">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: step === 1 ? "50%" : "100%" }}
                  transition={{ duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                />
              </div>
            </div>

            {/* Formulário */}
            <form onSubmit={step === 2 ? handleSubmit : (e) => e.preventDefault()} className="space-y-6">
              
              {/* Step 1 - Dados Pessoais */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  
                  {/* Nome Completo */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 text-ai">Nome Completo</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        placeholder="Seu nome completo"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-ai bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Email */}
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
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-ai bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 text-ai">Telefone</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="(11) 99999-9999"
                        className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-ai bg-white/80"
                      />
                    </div>
                  </div>

                  {/* Botão Próximo */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleNextStep}
                    disabled={!validateStep1()}
                    className="w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-ai bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <span>Próxima Etapa</span>
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              )}

              {/* Step 2 - Segurança */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  
                  {/* Senha */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 text-ai">Senha FaceRec</label>
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
                        placeholder="Mínimo 6 caracteres"
                        className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-ai bg-white/80"
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

                  {/* Confirmar Senha */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700 text-ai">Confirmar Senha</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Shield className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        placeholder="Repita sua senha"
                        className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-ai bg-white/80"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        ) : (
                          <Eye className="h-5 w-5 text-slate-400 hover:text-slate-600" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Indicador de Força da Senha */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 text-ai">Força da Senha</span>
                      <span className={`font-medium ${
                        formData.password.length >= 8 ? 'text-green-600' : 
                        formData.password.length >= 6 ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {formData.password.length >= 8 ? 'Forte' : 
                         formData.password.length >= 6 ? 'Média' : 'Fraca'}
                      </span>
                    </div>
                    <div className="h-2 bg-slate-200 rounded-full">
                      <div className={`h-2 rounded-full transition-all duration-300 ${
                        formData.password.length >= 8 ? 'w-full bg-green-500' :
                        formData.password.length >= 6 ? 'w-2/3 bg-yellow-500' : 'w-1/3 bg-red-500'
                      }`} />
                    </div>
                  </div>

                  {/* Botões */}
                  <div className="flex gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={handlePrevStep}
                      className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-ai border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center gap-2"
                    >
                      <ArrowLeft className="w-5 h-5" />
                      <span>Voltar</span>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading || !validateStep2()}
                      className="flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-ai bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Registrando...</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Brain className="w-5 h-5" />
                          <span>Criar Conta</span>
                        </div>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </form>

            {/* Link para Login */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-8 text-center"
            >
              <p className="text-slate-600 text-ai">
                Já possui acesso FaceRec?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-purple-600 hover:text-purple-700 transition-colors"
                >
                  Entrar no Sistema
                </Link>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
