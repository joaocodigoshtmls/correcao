import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line
} from "recharts";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  Eye,
  Shield,
  AlertTriangle,
  CheckCircle,
  Camera,
  Users,
  Clock,
  Zap,
  Brain,
  Cpu,
  Target,
  Network,
  Database,
  Layers,
  BarChart3
} from "lucide-react";

export default function Dashboard() {
  const [periodo, setPeriodo] = useState("7dias");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Dados de reconhecimento facial baseados no período
  const reconhecimentosPorHora = useMemo(() => {
    if (periodo === "24h") {
      return new Array(24).fill(0).map((_, i) => ({
        hora: `${String(i).padStart(2, "0")}:00`,
        deteccoes: Math.floor(Math.abs(Math.sin(i / 3)) * 45 + 12),
        precisao: Math.floor(Math.random() * 5 + 95),
        falsoPositivo: Math.floor(Math.random() * 3)
      }));
    } else if (periodo === "7dias") {
      return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, i) => ({
        hora: dia,
        deteccoes: Math.floor(Math.abs(Math.sin(i / 2)) * 320 + 180),
        precisao: Math.floor(Math.random() * 3 + 96),
        falsoPositivo: Math.floor(Math.random() * 15 + 5)
      }));
    } else {
      return new Array(30).fill(0).map((_, i) => ({
        hora: `${i + 1}`,
        deteccoes: Math.floor(Math.abs(Math.sin(i / 7)) * 450 + 200),
        precisao: Math.floor(Math.random() * 4 + 95),
        falsoPositivo: Math.floor(Math.random() * 25 + 10)
      }));
    }
  }, [periodo]);

  // Análise de confiança dos modelos baseada no período
  const analiseConfianca = useMemo(() => {
    if (periodo === "24h") {
      return new Array(24).fill(0).map((_, i) => ({
        hora: `${String(i).padStart(2, "0")}h`,
        yolov8: Math.floor(Math.random() * 3 + 97),
        facenet: Math.floor(Math.random() * 2 + 98),
        deepsort: Math.floor(Math.random() * 4 + 94),
        emotion: Math.floor(Math.random() * 8 + 88)
      }));
    } else if (periodo === "7dias") {
      return ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => ({
        dia: dia,
        yolov8: Math.floor(Math.random() * 3 + 97),
        facenet: Math.floor(Math.random() * 2 + 98),
        deepsort: Math.floor(Math.random() * 4 + 94),
        emotion: Math.floor(Math.random() * 8 + 88)
      }));
    } else {
      return new Array(30).fill(0).map((_, i) => ({
        dia: `${i + 1}`,
        yolov8: Math.floor(Math.random() * 3 + 97),
        facenet: Math.floor(Math.random() * 2 + 98),
        deepsort: Math.floor(Math.random() * 4 + 94),
        emotion: Math.floor(Math.random() * 8 + 88)
      }));
    }
  }, [periodo]);

  const estatisticasIA = [
    {
      titulo: "Processamento Neural/Min",
      valor: "847",
      mudanca: "+23.7%",
      positivo: true,
      icone: Brain,
      cor: "from-blue-500 to-purple-600",
      descricao: "Inferências por minuto"
    },
    {
      titulo: "Accuracy Média Global",
      valor: "98.2%",
      mudanca: "+1.8%",
      positivo: true,
      icone: Target,
      cor: "from-green-500 to-emerald-600",
      descricao: "Precisão dos modelos"
    },
    {
      titulo: "Alertas de Segurança",
      valor: "12",
      mudanca: "-8",
      positivo: true,
      icone: Shield,
      cor: "from-red-500 to-rose-600",
      descricao: "Detecções de ameaças"
    },
    {
      titulo: "GPU Utilization",
      valor: "84%",
      mudanca: "+12%",
      positivo: true,
      icone: Cpu,
      cor: "from-orange-500 to-yellow-600",
      descricao: "Uso do cluster neural"
    }
  ];

  // Dados de performance dos modelos
  const performanceModelos = [
    { nome: "YOLOv8", accuracy: 98.7, latencia: 0.23, memoria: 8.2 },
    { nome: "FaceNet", accuracy: 99.1, latencia: 0.18, memoria: 4.1 },
    { nome: "DeepSORT", accuracy: 96.3, latencia: 0.31, memoria: 3.7 },
    { nome: "Emotion AI", accuracy: 94.8, latencia: 0.45, memoria: 2.8 }
  ];

  // Distribuição de detecções
  const distribuicaoDeteccoes = [
    { nome: "Faces Autorizadas", valor: 2847, cor: "#10b981" },
    { nome: "Visitantes", valor: 342, cor: "#3b82f6" },
    { nome: "Desconhecidos", valor: 156, cor: "#f59e0b" },
    { nome: "Bloqueados", valor: 23, cor: "#ef4444" }
  ];

  // Métricas de segurança em tempo real
  const metricsSeguranca = [
    { tipo: "Acesso Autorizado", quantidade: 156, status: "normal", cor: "bg-green-100 text-green-700" },
    { tipo: "Tentativa de Invasão", quantidade: 3, status: "alerta", cor: "bg-red-100 text-red-700" },
    { tipo: "Pessoa Não Identificada", quantidade: 12, status: "atencao", cor: "bg-yellow-100 text-yellow-700" },
    { tipo: "Comportamento Suspeito", quantidade: 7, status: "alerta", cor: "bg-orange-100 text-orange-700" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-ai">Carregando análises neurais...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100">
      
      {/* Header FaceRec Analytics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-900/5 mb-8"
      >
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg neural-network">
              <BarChart3 className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2 heading-ai bg-gradient-to-r from-indigo-700 via-purple-700 to-blue-800 bg-clip-text text-transparent">
                FaceRec Analytics Dashboard
              </h1>
              <p className="text-lg text-ai text-slate-600">
                Análises Avançadas de Inteligência Artificial e Machine Learning
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm mono-ai text-blue-600">
                  ANÁLISE EM TEMPO REAL • DEEP LEARNING ATIVO
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {["24h", "7dias", "30dias"].map((periodo_opt) => (
              <button
                key={periodo_opt}
                onClick={() => setPeriodo(periodo_opt)}
                className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  periodo === periodo_opt
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25"
                    : "bg-transparent text-slate-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                {periodo_opt === "24h" ? "24 Horas" : periodo_opt === "7dias" ? "7 Dias" : "30 Dias"}
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Cards de Estatísticas IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8"
      >
        {estatisticasIA.map((stat, index) => {
          const IconComponent = stat.icone;
          return (
            <motion.div
              key={stat.titulo}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-6 shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl shadow-lg bg-gradient-to-r ${stat.cor}`}>
                  <IconComponent className="size-6 text-white" />
                </div>
                {stat.positivo ? (
                  <TrendingUp size={16} className="text-green-600" />
                ) : (
                  <TrendingDown size={16} className="text-red-600" />
                )}
              </div>
              <h3 className="text-sm font-medium text-slate-600 text-ai mb-2">{stat.titulo}</h3>
              <p className="text-3xl font-bold text-slate-800 heading-ai mb-2">{stat.valor}</p>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-semibold mono-ai ${
                  stat.positivo ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.mudanca}
                </span>
                <span className="text-xs text-slate-500 text-ai">{stat.descricao}</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Grid Principal */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        
        {/* Performance dos Modelos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
              <Network size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 heading-ai">Performance dos Modelos</h3>
              <p className="text-slate-600 text-sm text-ai">Métricas de ML em tempo real</p>
            </div>
          </div>

          <div className="space-y-4">
            {performanceModelos.map((modelo, index) => (
              <motion.div
                key={modelo.nome}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="p-4 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-slate-800 text-ai">{modelo.nome}</h4>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 mono-ai">ATIVO</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-slate-500 text-ai">Accuracy</p>
                    <p className="font-semibold text-slate-800 mono-ai">{modelo.accuracy}%</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-ai">Latência</p>
                    <p className="font-semibold text-slate-800 mono-ai">{modelo.latencia}s</p>
                  </div>
                  <div>
                    <p className="text-slate-500 text-ai">Memória</p>
                    <p className="font-semibold text-slate-800 mono-ai">{modelo.memoria}GB</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Análise de Confiança dos Modelos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl">
                <BarChart3 size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 heading-ai">Análise de Confiança Neural</h3>
                <p className="text-slate-600 text-sm text-ai">Accuracy dos modelos por {periodo === "24h" ? "hora" : periodo === "7dias" ? "dia" : "dia do mês"}</p>
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analiseConfianca}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey={periodo === "24h" ? "hora" : "dia"} 
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  tickMargin={10}
                />
                <YAxis 
                  domain={[85, 100]}
                  tick={{ fontSize: 12, fill: "#64748b" }}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ stroke: "#6366f1", strokeWidth: 2 }}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(16px)"
                  }}
                  formatter={(value, name) => [`${value}%`, name]}
                />
                <Line type="monotone" dataKey="yolov8" stroke="#6366f1" strokeWidth={3} name="YOLOv8" />
                <Line type="monotone" dataKey="facenet" stroke="#10b981" strokeWidth={3} name="FaceNet" />
                <Line type="monotone" dataKey="deepsort" stroke="#f59e0b" strokeWidth={3} name="DeepSORT" />
                <Line type="monotone" dataKey="emotion" stroke="#ef4444" strokeWidth={3} name="Emotion AI" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Seção Inferior */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        
        {/* Distribuição de Detecções */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
              <Eye size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 heading-ai">Distribuição de Detecções</h3>
              <p className="text-slate-600 text-sm text-ai">Análise categórica neural</p>
            </div>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distribuicaoDeteccoes}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="valor"
                >
                  {distribuicaoDeteccoes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.cor} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    backgroundColor: "rgba(255, 255, 255, 0.95)"
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-2 gap-3 mt-4">
            {distribuicaoDeteccoes.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.cor }}></div>
                <span className="text-sm text-slate-600 text-ai">{item.nome}</span>
                <span className="text-sm font-semibold text-slate-800 mono-ai">{item.valor}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Métricas de Segurança */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-red-500 to-rose-500 rounded-xl">
              <Shield size={20} className="text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-800 heading-ai">Alertas de Segurança FaceRec</h3>
              <p className="text-slate-600 text-sm text-ai">Detecções em tempo real</p>
            </div>
          </div>

          <div className="space-y-4">
            {metricsSeguranca.map((metric, index) => (
              <motion.div
                key={metric.tipo}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    metric.status === 'normal' ? 'bg-green-400' :
                    metric.status === 'atencao' ? 'bg-yellow-400' : 'bg-red-400'
                  } animate-pulse`}></div>
                  <span className="font-medium text-slate-800 text-ai">{metric.tipo}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold text-slate-800 heading-ai">{metric.quantidade}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium mono-ai ${metric.cor}`}>
                    {metric.status.toUpperCase()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="h-8" />
    </div>
  );
}
