import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Shield, BarChart3, Users, Eye, Activity, Brain, Cpu, Zap, AlertTriangle, CheckCircle, Camera, Clock, Target, Layers, Database, Network } from 'lucide-react';

const Home = () => {
  const [stats, setStats] = useState({
    pessoasDetectadas: 1247,
    precisaoIA: 98.4,
    alertasAtivos: 3,
    tempoResposta: 0.24,
    modelosAtivos: 4,
    sistemaOnline: true
  });

  const [hora, setHora] = useState(new Date());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const darkMode = localStorage.getItem('darkMode') === 'true' || 
      (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setIsDark(darkMode);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setHora(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const metricasIA = [
    {
      titulo: 'Detecções de Faces (Hoje)',
      valor: '1,247',
      tendencia: '+312',
      porcentagem: '+33.4%',
      positiva: true,
      destaque: true,
      icone: Brain,
      descricao: 'Processamento neural ativo'
    },
    {
      titulo: 'Precisão do Modelo IA',
      valor: '98.4%',
      tendencia: '+2.1%',
      porcentagem: '',
      positiva: true,
      destaque: false,
      icone: Target,
      descricao: 'Accuracy em tempo real'
    },
    {
      titulo: 'Tempo de Resposta IA',
      valor: '0.24s',
      tendencia: '-0.08s',
      porcentagem: '-25%',
      positiva: true,
      destaque: false,
      icone: Zap,
      descricao: 'Latência de inferência'
    },
    {
      titulo: 'Alertas de Segurança',
      valor: '3',
      tendencia: '-7',
      porcentagem: '-70%',
      positiva: true,
      destaque: false,
      icone: Shield,
      descricao: 'Ameaças identificadas'
    }
  ];

  const dadosProcessamentoIA = [
    { hora: '00', deteccoes: 23, confianca: 96.2 },
    { hora: '03', deteccoes: 8, confianca: 97.1 },
    { hora: '06', deteccoes: 156, confianca: 98.3 },
    { hora: '09', deteccoes: 289, confianca: 98.7 },
    { hora: '12', deteccoes: 201, confianca: 97.9 },
    { hora: '15', deteccoes: 178, confianca: 98.1 },
    { hora: '18', deteccoes: 134, confianca: 97.8 },
    { hora: '21', deteccoes: 67, confianca: 96.9 }
  ];

  const maxDeteccoes = Math.max(...dadosProcessamentoIA.map(d => d.deteccoes));

  const eventosIA = [
    { hora: '14:32', evento: 'Novo rosto cadastrado no modelo neural', status: 'sucesso', confianca: 99.2 },
    { hora: '14:28', evento: 'Detecção de comportamento suspeito - Área restrita', status: 'alerta', confianca: 94.7 },
    { hora: '14:15', evento: 'Modelo de reconhecimento atualizado (v2.3.1)', status: 'info', confianca: null },
    { hora: '14:12', evento: 'João Silva identificado - Acesso autorizado', status: 'sucesso', confianca: 98.9 },
    { hora: '14:08', evento: 'Análise de multidão: 12 pessoas detectadas', status: 'info', confianca: 97.3 }
  ];

  const sistemasIA = [
    { nome: 'YOLOv8 Face Detection', status: 'online', gpu: 'RTX 4090', memoria: '8.2GB', fps: 47 },
    { nome: 'FaceNet Recognition', status: 'online', gpu: 'RTX 4090', memoria: '4.1GB', fps: 52 },
    { nome: 'DeepSORT Tracking', status: 'online', gpu: 'RTX 3080', memoria: '3.7GB', fps: 34 },
    { nome: 'Emotion Detection', status: 'standby', gpu: 'RTX 3080', memoria: '2.1GB', fps: 0 }
  ];

  return (
    <div className={`min-h-screen space-y-8 ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-indigo-900 to-purple-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-100'
    }`}>
      
      {/* Header profissional com IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`backdrop-blur-md border rounded-2xl p-8 shadow-xl ${
          isDark 
            ? 'bg-slate-800/80 border-slate-700/60 shadow-black/20' 
            : 'bg-white/80 border-slate-200/60 shadow-slate-900/5'
        }`}
      >
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="relative p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg neural-network">
              <Brain className="size-8 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold mb-2 heading-ai ${
                isDark 
                  ? 'bg-gradient-to-r from-blue-300 via-purple-300 to-indigo-300 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 bg-clip-text text-transparent'
              }`}>
                FaceRec AI
              </h1>
              <p className={`text-lg text-ai ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                Sistema Inteligente de Monitoramento e Reconhecimento Facial
              </p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className={`text-sm mono-ai ${isDark ? 'text-green-300' : 'text-green-600'}`}>
                  IA PROCESSANDO • 4 MODELOS ATIVOS
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className={`text-3xl font-bold heading-ai ${isDark ? 'text-white' : 'text-slate-800'}`}>
                {hora.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
              <div className={`text-sm capitalize text-ai ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {hora.toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
              </div>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold shadow-md border ${
              stats.sistemaOnline 
                ? isDark 
                  ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 text-green-300 border-green-700' 
                  : 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200'
                : isDark 
                  ? 'bg-gradient-to-r from-red-900/50 to-rose-900/50 text-red-300 border-red-700' 
                  : 'bg-gradient-to-r from-red-100 to-rose-100 text-red-700 border-red-200'
            }`}>
              <div className={`w-3 h-3 rounded-full ${stats.sistemaOnline ? 'bg-green-400' : 'bg-red-400'} animate-pulse shadow-lg`}></div>
              <span className="mono-ai">IA {stats.sistemaOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Métricas de IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
      >
        {metricasIA.map((metrica, index) => {
          const IconeMetrica = metrica.icone;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className={`backdrop-blur-md border rounded-2xl p-6 shadow-xl transition-all duration-300 group hover:-translate-y-1 ${
                metrica.destaque 
                  ? isDark 
                    ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-600/60 shadow-blue-500/10 hover:shadow-blue-500/20' 
                    : 'bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-300/60 shadow-blue-500/20 hover:shadow-blue-500/30'
                  : isDark 
                    ? 'bg-slate-800/80 border-slate-700/60 shadow-black/20 hover:shadow-black/30 hover:border-blue-600/30' 
                    : 'bg-white/80 border-slate-200/60 shadow-slate-900/5 hover:shadow-slate-900/10 hover:border-blue-300/30'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl shadow-lg ${
                  metrica.destaque 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
                    : index === 1 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600'
                      : index === 2
                        ? 'bg-gradient-to-r from-yellow-500 to-orange-600'
                        : 'bg-gradient-to-r from-red-500 to-rose-600'
                }`}>
                  <IconeMetrica className="size-6 text-white" />
                </div>
                {metrica.positiva ? (
                  <TrendingUp size={16} className={metrica.destaque 
                    ? (isDark ? 'text-blue-400' : 'text-blue-600') 
                    : (isDark ? 'text-green-400' : 'text-green-600')} />
                ) : (
                  <TrendingDown size={16} className={isDark ? 'text-red-400' : 'text-red-600'} />
                )}
              </div>
              
              <div className={`text-sm font-medium mb-2 text-ai ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{metrica.titulo}</div>
              <div className={`text-3xl font-bold mb-3 heading-ai ${
                metrica.destaque 
                  ? isDark 
                    ? 'bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
                  : isDark ? 'text-white' : 'text-slate-800'
              }`}>{metrica.valor}</div>
              
              <div className="flex items-center gap-2 text-sm mb-2">
                <span className={
                  metrica.destaque 
                    ? (isDark ? 'text-blue-400 font-semibold mono-ai' : 'text-blue-600 font-semibold mono-ai')
                    : metrica.positiva 
                      ? (isDark ? 'text-green-400 font-semibold mono-ai' : 'text-green-600 font-semibold mono-ai') 
                      : (isDark ? 'text-red-400 font-semibold mono-ai' : 'text-red-600 font-semibold mono-ai')
                }>
                  {metrica.tendencia}
                </span>
                {metrica.porcentagem && (
                  <span className={`text-ai ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{metrica.porcentagem}</span>
                )}
              </div>
              
              <div className={`text-xs text-ai ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                {metrica.descricao}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Seções principais */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Sistemas de IA ativos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="xl:col-span-2 backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-900/5"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg">
              <Network className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 heading-ai">Sistemas de IA Neural</h2>
              <p className="text-slate-600 text-ai">Modelos de machine learning em execução</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sistemasIA.map((sistema, index) => (
              <div key={index} className="flex items-center justify-between p-4 rounded-xl bg-slate-50/50 hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-300 group border border-slate-200/30">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    sistema.status === 'online' ? 'bg-green-400 shadow-lg shadow-green-400/50' : 
                    sistema.status === 'standby' ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50' :
                    'bg-red-400 shadow-lg shadow-red-400/50'
                  } group-hover:scale-125 transition-transform duration-300`}></div>
                  <div>
                    <div className="font-semibold text-slate-800 group-hover:text-blue-700 transition-colors duration-300 text-ai">{sistema.nome}</div>
                    <div className="text-sm text-slate-500 mono-ai">
                      {sistema.gpu} • {sistema.memoria} • {sistema.fps} FPS
                    </div>
                  </div>
                </div>
                <div className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-all duration-300 mono-ai ${
                  sistema.status === 'online' 
                    ? 'bg-green-100 text-green-700 group-hover:bg-green-200' : 
                  sistema.status === 'standby'
                    ? 'bg-yellow-100 text-yellow-700 group-hover:bg-yellow-200'
                    : 'bg-red-100 text-red-700'
                }`}>
                  {sistema.status.toUpperCase()}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Eventos de IA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-900/5"
        >
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl shadow-lg">
              <Activity className="size-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800 heading-ai">Log de IA</h2>
              <p className="text-slate-600 text-ai">Eventos neurais recentes</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {eventosIA.map((atividade, index) => (
              <div key={index} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gradient-to-r hover:from-emerald-50/30 hover:to-green-50/30 transition-all duration-300 group border border-slate-200/20">
                <div className={`w-3 h-3 rounded-full mt-2 transition-all duration-300 group-hover:scale-125 group-hover:shadow-lg ${
                  atividade.status === 'sucesso' ? 'bg-green-400 group-hover:shadow-green-400/50' :
                  atividade.status === 'info' ? 'bg-blue-400 group-hover:shadow-blue-400/50' : 'bg-orange-400 group-hover:shadow-orange-400/50'
                }`}></div>
                <div className="flex-1">
                  <div className="font-medium text-slate-800 group-hover:text-emerald-700 transition-colors duration-300 text-ai">{atividade.evento}</div>
                  <div className="text-sm text-slate-500 flex items-center gap-2 mt-1">
                    <Clock className="size-3" />
                    <span className="mono-ai">{atividade.hora}</span>
                    {atividade.confianca && (
                      <>
                        <span>•</span>
                        <span className="mono-ai text-green-600">{atividade.confianca}% confiança</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Status do sistema de IA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-900/5"
      >
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg">
              <Database className="size-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-800 heading-ai">Sistema FaceRec Seguro</h3>
              <div className="text-slate-600 text-ai">Arquitetura distribuída • Criptografia AES-256 • MLOps Pipeline</div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-3 px-4 py-3 bg-green-50 rounded-xl border border-green-200">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              <span className="font-medium text-green-700 mono-ai">API Neural: Online</span>
            </div>
            
            <div className="flex items-center gap-3 px-4 py-3 bg-blue-50 rounded-xl border border-blue-200">
              <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
              <span className="font-medium text-blue-700 mono-ai">GPU Cluster: Ativo</span>
            </div>
            
            <div className="backdrop-blur-md bg-gradient-to-br from-purple-500/10 to-violet-500/10 border border-purple-200/60 rounded-2xl p-6 text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-violet-600 bg-clip-text text-transparent heading-ai">99.7%</div>
              <div className="text-sm font-medium text-slate-600 text-ai">Uptime Neural</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;