// Backup da página de monitoramento com design profissional
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Camera, CircleStop, CirclePlay, FileVideo, Activity, AlertTriangle, Volume2,
  Settings2, Pause, Play, Focus, ShieldCheck, HardDrive, Timer, ScanFace,
  Download, Trash2, Pencil, Save, Cpu, Network, Eye, Users, Zap, Monitor
} from "lucide-react";

const CAM_BASE = import.meta.env.VITE_CAM_BASE || "http://localhost:3000";

const PRESETS = [
  { id: "esp32", label: "ESP32 (via backend)", type: "mjpeg", url: `${CAM_BASE}/api/cam/stream` },
  { id: "aje", label: "Mundo • Al Jazeera English (áudio)", type: "hls", url: "https://live-hls-apps-aje-v3-fa.getaj.net/AJE/index.m3u8" },
  { id: "dw-en", label: "Mundo • DW English (áudio)", type: "hls", url: "https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8" },
  { id: "cna", label: "Ásia • CNA – Channel NewsAsia (áudio)", type: "hls", url: "https://d2e1asnsl7br7b.cloudfront.net/7782e205e72f43aeb4a48ec97f66ebbe/index.m3u8" },
];

export default function Monitoramento() {
  const [cameraAtiva, setCameraAtiva] = useState(false);
  const [gravando, setGravando] = useState(false);
  const [reconhecimentoAtivo, setReconhecimentoAtivo] = useState(true);
  const [qualidadeVideo, setQualidadeVideo] = useState("Auto");
  const [detectados, setDetectados] = useState([]);
  const [muted, setMuted] = useState(true);
  const [statusMsg, setStatusMsg] = useState("Câmera desligada");
  const [presetId, setPresetId] = useState(PRESETS[0].id);

  const [configuracoes, setConfiguracoes] = useState({
    brilho: 50, contraste: 50, saturacao: 50, zoom: 100,
  });

  const videoRef = useRef(null);
  const imgRef = useRef(null);

  const currentPreset = useMemo(
    () => PRESETS.find(p => p.id === presetId) || PRESETS[0],
    [presetId]
  );
  const isESP32 = currentPreset.type === "mjpeg";

  const pessoasDetectadas = [
    { id: 1, nome: "João Silva", confianca: 96.8, timestamp: "14:23:45", status: "Autorizado" },
    { id: 2, nome: "Maria Santos", confianca: 94.2, timestamp: "14:22:18", status: "Autorizado" },
    { id: 3, nome: "Pessoa Desconhecida", confianca: 67.5, timestamp: "14:21:52", status: "Negado" },
    { id: 4, nome: "Pedro Lima", confianca: 98.1, timestamp: "14:20:33", status: "Autorizado" },
  ];

  useEffect(() => {
    if (cameraAtiva && reconhecimentoAtivo) {
      const interval = setInterval(() => {
        const exemplo = pessoasDetectadas[Math.floor(Math.random() * pessoasDetectadas.length)];
        const novaDeteccao = {
          id: Date.now(),
          nome: Math.random() > 0.7 ? "Pessoa Desconhecida" : exemplo.nome,
          confianca: Number((Math.random() * 40 + 60).toFixed(1)),
          timestamp: new Date().toLocaleTimeString("pt-BR"),
          status: Math.random() > 0.3 ? "Autorizado" : "Negado",
        };
        setDetectados((prev) => [novaDeteccao, ...prev].slice(0, 10));
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [cameraAtiva, reconhecimentoAtivo]);

  const toggleGravar = () => {
    setGravando(prev => !prev);
  };

  const capturarFrame = () => {
    // Simular captura
    console.log("Frame capturado!");
  };

  const cssFilter = () => {
    const { brilho, contraste, saturacao } = configuracoes;
    const b = (brilho / 50) * 100;
    const c = (contraste / 50) * 100;
    const s = (saturacao / 50) * 100;
    return `brightness(${b}%) contrast(${c}%) saturate(${s}%)`;
  };

  const serieTempo = useMemo(
    () => Array.from({ length: 24 }).map((_, i) => ({
      t: `${String(i).padStart(2, "0")}:00`,
      fps: 24 + Math.round(Math.sin(i / 2.8) * 6) + (cameraAtiva ? 4 : 0),
    })), [cameraAtiva]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 space-y-8 p-6">
      
      {/* HEADER PROFISSIONAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-900/5"
      >
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
              <Monitor className="size-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-800 bg-clip-text text-transparent mb-2">
                Centro de Monitoramento
              </h1>
              <p className="text-slate-600 text-lg">Vigilância em tempo real com IA e reconhecimento facial</p>
              <div className="flex items-center gap-2 mt-2">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  cameraAtiva ? 'bg-emerald-400' : 'bg-red-400'
                }`}></div>
                <span className="text-sm text-slate-500">{statusMsg}</span>
              </div>
            </div>
          </div>

          {/* Controles principais */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setCameraAtiva(v => !v);
                setStatusMsg(v => v ? "Câmera desligada" : "Sistema online");
              }}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                cameraAtiva
                  ? "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white"
                  : "bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white"
              }`}
            >
              {cameraAtiva ? <CircleStop className="size-5" /> : <CirclePlay className="size-5" />}
              {cameraAtiva ? "Desligar Sistema" : "Ativar Sistema"}
            </button>

            <button
              onClick={toggleGravar}
              disabled={!cameraAtiva}
              className={`inline-flex items-center gap-3 px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                gravando
                  ? "bg-gradient-to-r from-red-500 to-pink-600 text-white"
                  : "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              }`}
            >
              {gravando ? <Pause className="size-5" /> : <Play className="size-5" />}
              {gravando ? "Parar Gravação" : "Iniciar Gravação"}
            </button>

            <button
              onClick={() => setMuted(m => !m)}
              disabled={isESP32}
              className="inline-flex items-center gap-2 px-4 py-3 rounded-xl font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-50 transition-all duration-200"
            >
              <Volume2 className="size-5" />
              {muted ? "Mudo" : "Som"}
            </button>
          </div>
        </div>

        {/* Estatísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <Activity className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">FPS Médio</p>
                <p className="text-xl font-bold text-slate-800">
                  {Math.round(serieTempo.reduce((a, b) => a + b.fps, 0) / serieTempo.length)} fps
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Precisão</p>
                <p className="text-xl font-bold text-slate-800">94.8%</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500 rounded-lg">
                <Timer className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Latência</p>
                <p className="text-xl font-bold text-slate-800">{isESP32 ? "~0.3s" : "~2s"}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500 rounded-lg">
                <AlertTriangle className="size-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-slate-600">Alertas (30m)</p>
                <p className="text-xl font-bold text-slate-800">12</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* GRID PRINCIPAL */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        
        {/* COLUNA PRINCIPAL - VIDEO FEED */}
        <div className="xl:col-span-3 space-y-6">
          
          {/* FEED DA CÂMERA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-6 shadow-xl shadow-slate-900/5"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg">
                  <Camera className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">Feed Principal</h3>
                  <p className="text-sm text-slate-600">{currentPreset.label}</p>
                </div>
              </div>
              
              {/* Seletor de preset */}
              <select
                value={presetId}
                onChange={(e) => setPresetId(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {PRESETS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>

            {/* Container do vídeo */}
            <div className="relative aspect-video bg-slate-900 rounded-xl overflow-hidden border-2 border-slate-200 shadow-2xl">
              {cameraAtiva ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center text-white">
                    <div className="text-center">
                      <Camera className="size-16 mx-auto mb-4 opacity-70" />
                      <p className="text-lg font-medium">Feed da Câmera Simulado</p>
                      <p className="text-sm opacity-75">Fonte: {currentPreset.label}</p>
                    </div>
                  </div>

                  {/* Overlay de reconhecimento */}
                  {reconhecimentoAtivo && (
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 150, damping: 14 }}
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="w-48 h-48 border-3 border-emerald-400 rounded-xl shadow-[0_0_40px_-10px_rgba(16,185,129,0.8)] animate-pulse" />
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
                        <ScanFace className="inline size-4 mr-1" />
                        Detectando...
                      </div>
                    </motion.div>
                  )}

                  {/* Status overlays */}
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 text-white px-4 py-2 rounded-xl backdrop-blur-sm text-sm shadow-lg">
                      <Eye className="inline size-4 mr-2" />
                      Reconhecimento {reconhecimentoAtivo ? "Ativo" : "Pausado"}
                    </div>
                    <div className="bg-black/70 text-white px-4 py-2 rounded-xl backdrop-blur-sm text-sm shadow-lg">
                      {isESP32 ? "ESP32/MJPEG" : "HLS Stream"} • Qualidade: {qualidadeVideo}
                    </div>
                    {gravando && (
                      <div className="bg-red-600/90 text-white px-4 py-2 rounded-xl backdrop-blur-sm text-sm shadow-lg animate-pulse">
                        <FileVideo className="inline size-4 mr-2" />
                        Gravando...
                      </div>
                    )}
                  </div>

                  {/* Controles de zoom e captura */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                      onClick={capturarFrame}
                      className="p-3 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-lg transition-all duration-200"
                      title="Capturar frame"
                    >
                      <Camera className="size-5" />
                    </button>
                    <button
                      onClick={() => setReconhecimentoAtivo(r => !r)}
                      className={`p-3 rounded-xl shadow-lg transition-all duration-200 ${
                        reconhecimentoAtivo 
                          ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                          : "bg-slate-300 hover:bg-slate-400 text-slate-700"
                      }`}
                      title="Toggle reconhecimento"
                    >
                      <Eye className="size-5" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-slate-400">
                    <Camera className="size-16 mx-auto mb-4 opacity-50" />
                    <p className="text-xl font-medium">Sistema Desligado</p>
                    <p className="text-sm">Clique em "Ativar Sistema" para iniciar o monitoramento</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controles de configuração */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Brilho</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={configuracoes.brilho}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, brilho: +e.target.value }))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Contraste</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={configuracoes.contraste}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, contraste: +e.target.value }))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Saturação</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={configuracoes.saturacao}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, saturacao: +e.target.value }))}
                  className="w-full accent-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Zoom</label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={configuracoes.zoom}
                  onChange={(e) => setConfiguracoes(prev => ({ ...prev, zoom: +e.target.value }))}
                  className="w-full accent-indigo-500"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* SIDEBAR DIREITA */}
        <div className="space-y-6">
          
          {/* Detecções Recentes */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-6 shadow-xl shadow-slate-900/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <ScanFace className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Detecções Recentes</h3>
                <p className="text-sm text-slate-600">Últimos 30 minutos</p>
              </div>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {detectados.length > 0 ? detectados.map((pessoa) => (
                <div key={pessoa.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${
                      pessoa.status === "Autorizado" ? "bg-emerald-400" : "bg-red-400"
                    }`}></div>
                    <div>
                      <p className="font-medium text-slate-800">{pessoa.nome}</p>
                      <p className="text-xs text-slate-500">{pessoa.timestamp} • {pessoa.confianca}%</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    pessoa.status === "Autorizado" 
                      ? "bg-emerald-100 text-emerald-700" 
                      : "bg-red-100 text-red-700"
                  }`}>
                    {pessoa.status}
                  </span>
                </div>
              )) : (
                <div className="text-center py-8 text-slate-500">
                  <Users className="size-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma detecção ainda</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Status do Sistema */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-6 shadow-xl shadow-slate-900/5"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-lg">
                <HardDrive className="size-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Status do Sistema</h3>
                <p className="text-sm text-slate-600">Monitoramento em tempo real</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">CPU</span>
                <span className="text-sm font-medium text-slate-800">23%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Memória</span>
                <span className="text-sm font-medium text-slate-800">67%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Armazenamento</span>
                <span className="text-sm font-medium text-slate-800">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Rede</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-slate-800">Online</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
