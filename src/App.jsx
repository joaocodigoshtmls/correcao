import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/login';
import Cadastro from './pages/Cadastro';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Configuracoes from './pages/Configuracoes';
import Monitoramento from './pages/Monitoramento';
import MainLayout from './Layout/MainLayout';
import TestPage from './pages/TestPage';
import ConfigFoto from "./pages/Configuracoes/Foto";

// ⬇️ ADICIONE
import Camera from './pages/Camera';

function PrivateRoute({ children }) {
  let usuario = null;

  try {
    const raw = localStorage.getItem("usuario");
    console.log("🔐 PrivateRoute - raw localStorage:", raw);
    if (raw && raw !== "undefined") {
      usuario = JSON.parse(raw);
      console.log("🔐 PrivateRoute - usuário encontrado:", usuario);
    }
  } catch (err) {
    console.error("🔐 PrivateRoute - erro ao parsear usuário:", err);
    usuario = null;
  }

  const isAuthenticated = !!usuario;
  console.log("🔐 PrivateRoute - está autenticado?", isAuthenticated);
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  const location = useLocation();
  const isPublic = ["/", "/login", "/cadastro"].includes(location.pathname);

  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />
      <Route path="/test" element={<TestPage />} />

      {/* Privadas */}
      {!isPublic && (
        <>
          <Route path="/home" element={
            <MainLayout>
              <PrivateRoute><Home /></PrivateRoute>
            </MainLayout>
          } />
          <Route path="/dashboard" element={
            <MainLayout>
              <PrivateRoute><Dashboard /></PrivateRoute>
            </MainLayout>
          } />
          <Route path="/monitoramento" element={
            <MainLayout>
              <PrivateRoute><Monitoramento /></PrivateRoute>
            </MainLayout>
          } />
          <Route path="/configuracoes" element={
            <MainLayout>
              <PrivateRoute><Configuracoes /></PrivateRoute>
            </MainLayout>
          } />
          <Route path="/foto" element={
            <MainLayout>
              <PrivateRoute><ConfigFoto /></PrivateRoute>
            </MainLayout>
          } />

          {/* ⬇️ NOVA ROTA PRIVADA */}
          <Route path="/camera" element={
            <MainLayout>
              <PrivateRoute><Camera /></PrivateRoute>
            </MainLayout>
          } />
        </>
      )}
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
