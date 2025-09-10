import { motion } from "framer-motion";
import { Camera as CameraIcon, Monitor, Wifi, Signal } from "lucide-react";
import Esp32CamPlayer from "../Components/Esp32CamPlayer.jsx";

// Usa .env → VITE_CAM_BASE=http://localhost:4000 (ou a porta do mock-cam)
// Se não definir nada, cai em http://localhost:3001 (backend)
const CAM_BASE = import.meta.env.VITE_CAM_BASE || "http://localhost:3001";

export default function Camera() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* HEADER PROFISSIONAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-900/5 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg">
            <CameraIcon className="size-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-800 bg-clip-text text-transparent mb-2">
              Visualização em Tempo Real
            </h1>
            <p className="text-slate-600 text-lg">
              Monitor da câmera ESP32 com simulação automática
            </p>
          </div>
        </div>
      </motion.div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Feed da câmera */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="xl:col-span-3"
        >
          <div className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-8 shadow-xl shadow-slate-900/5">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                  <Monitor className="size-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">Feed Principal</h2>
                  <p className="text-slate-600">ESP32-CAM Simulada</p>
                </div>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                AO VIVO
              </div>
            </div>

            {/* Container do player */}
            <div className="bg-slate-900 rounded-xl overflow-hidden shadow-inner">
              {/* Corrigido: usa CAM_BASE em vez de localhost:3000 fixo */}
              <Esp32CamPlayer baseUrl={CAM_BASE} fallbackEveryMs={1500} />
            </div>
          </div>
        </motion.div>

        {/* Sidebar de informações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Status da conexão */}
          <div className="backdrop-blur-md bg-white/80 border border-slate-200/60 rounded-2xl p-6 shadow-xl shadow-slate-900/5">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Wifi className="size-5 text-white" />
              </div>
              <h3 className="font-bold text-slate-800">Status da Conexão</h3>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                <span className="text-green-800 font-medium">WiFi</span>
                <div className="flex items-center gap-2 text-green-600">
                  <Signal className="size-4" />
                  <span className="text-sm font-semibold">Conectado</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-xl border border-blue-200">
                <span className="text-blue-800 font-medium">ESP32</span>
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Online</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-xl border border-purple-200">
                <span className="text-purple-800 font-medium">Stream</span>
                <div className="flex items-center gap-2 text-purple-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">Ativo</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
