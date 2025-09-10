import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Camera, Check, X, RefreshCw, Monitor } from "lucide-react";

export default function Esp32CamPlayer({
  baseUrl = "http://localhost:3000", // mock
  fallbackEveryMs = 1500,
  style = {},
  onError = null
}) {
  const imgRef = useRef(null);
  const [mode, setMode] = useState("stream");
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (mode !== "stream") return;
    const img = imgRef.current;
    if (!img) return;
    
    const handleLoad = () => {
      setIsLoading(false);
      setHasError(false);
    };
    const onErrorHandler = () => {
      console.warn("📷 Erro no stream, tentando modo snapshot");
      setMode("snapshot");
      setIsLoading(false);
      setHasError(true);
      if (onError) onError("stream_error");
    };
    
    img.addEventListener("load", handleLoad);
    img.addEventListener("error", onErrorHandler);
    img.src = new URL("/api/cam/stream", baseUrl).toString();
    
    return () => {
      img.removeEventListener("load", handleLoad);
      img.removeEventListener("error", onErrorHandler);
    };
  }, [mode, baseUrl, onError]);

  useEffect(() => {
    if (mode !== "snapshot") return;
    let alive = true;
    
    const tick = async () => {
      if (!alive) return;
      setIsLoading(true);
      
      try {
        const res = await fetch(new URL(`/api/cam/capture?t=${Date.now()}`, baseUrl).toString());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const blob = await res.blob();
        const obj = URL.createObjectURL(blob);
        if (imgRef.current) {
          imgRef.current.src = obj;
          imgRef.current.onload = () => {
            setIsLoading(false);
            setHasError(false);
          };
        }
      } catch (err) {
        console.warn("📷 Erro no snapshot:", err.message);
        setIsLoading(false);
        setHasError(true);
        if (onError) onError("snapshot_error");
      }
      
      if (alive) setTimeout(tick, fallbackEveryMs);
    };
    
    tick();
    return () => { alive = false; };
  }, [mode, baseUrl, fallbackEveryMs]);

  const handleAccess = async (allow) => {
    try {
      const response = await fetch(new URL(`/api/cam/access?allow=${allow ? 1 : 0}`, baseUrl).toString());
      const message = await response.text();
      
      // Toast notification mais elegante
      const toast = document.createElement('div');
      toast.className = `fixed top-4 right-4 p-4 rounded-xl shadow-lg z-50 ${allow ? 'bg-green-500' : 'bg-red-500'} text-white font-semibold`;
      toast.textContent = message;
      document.body.appendChild(toast);
      
      setTimeout(() => document.body.removeChild(toast), 3000);
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <div className="relative">
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-10 rounded-xl">
          <div className="text-center">
            <RefreshCw className="size-8 text-white animate-spin mx-auto mb-2" />
            <p className="text-white font-medium">Carregando feed...</p>
          </div>
        </div>
      )}
      
      {/* Main image container */}
      <div className="relative bg-slate-900 rounded-xl overflow-hidden shadow-inner min-h-[400px] flex items-center justify-center">
        <img 
          ref={imgRef} 
          alt="ESP32 Camera Stream" 
          className="w-full h-auto max-h-[600px] object-contain"
        />
        
        {/* Camera icon when no image */}
        {!imgRef.current?.src && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="size-16 text-slate-600" />
          </div>
        )}
      </div>
      
      {/* Status bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-4 flex items-center justify-between p-4 bg-slate-100 rounded-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Monitor className="size-4 text-slate-600" />
            <span className="text-sm font-medium text-slate-700">
              {mode === "stream" ? "Modo Stream (MJPEG)" : `Modo Snapshot (${fallbackEveryMs/1000}s)`}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'}`}></div>
            <span className="text-xs text-slate-600">
              {isLoading ? 'Carregando...' : 'Conectado'}
            </span>
          </div>
        </div>
        
        {/* Control buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAccess(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            <Check className="size-4" />
            Liberar
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleAccess(false)}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors shadow-md"
          >
            <X className="size-4" />
            Negar
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
