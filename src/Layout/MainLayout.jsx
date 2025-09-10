import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { User, LogOut } from 'lucide-react';

export default function MainLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuario } = useUser();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  // Função para obter nome de exibição
  const getDisplayName = () => {
    if (usuario?.full_name) return usuario.full_name;
    if (usuario?.nome) return usuario.nome;
    if (usuario?.email) return usuario.email.split('@')[0];
    return 'Usuário';
  };

  // Função para obter foto de perfil
  const getProfilePicture = () => {
    return usuario?.profile_picture || usuario?.photoURL || null;
  };

  const navItems = [
    { to: '/home', label: 'Início' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/monitoramento', label: 'Monitoramento' },
    { to: '/configuracoes', label: 'Configurações' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header FaceRec com blur e fundo translúcido */}
      <header
        className="sticky top-0 z-40 border-b border-slate-200/60 backdrop-blur-md"
        style={{ background: 'rgba(255, 255, 255, 0.8)' }}
      >
        <nav className="container-pro h-16 flex items-center justify-between">
          {/* Marca Neural: ícone + texto com gradiente */}
          <Link to="/home" className="flex items-center gap-3 no-underline group">
            <div className="relative">
              <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-200">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-xl font-bold heading-ai bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                FaceRec
              </span>
              <div className="text-xs text-slate-500 mono-ai -mt-1">AI System</div>
            </div>
          </Link>

          {/* Navegação Neural */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((it) => (
              <Link 
                key={it.to} 
                to={it.to} 
                className={`relative px-3 py-2 rounded-lg font-medium transition-all duration-200 text-ai ${
                  location.pathname === it.to 
                    ? 'text-blue-600 bg-blue-50 shadow-sm' 
                    : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
                }`}
              >
                {it.label}
                {location.pathname === it.to && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full"></div>
                )}
              </Link>
            ))}
          </div>

          {/* Mini Hub de Perfil com nome, foto e botão sair */}
          <div className="flex items-center gap-3">
            {/* Foto de Perfil */}
            <div className="relative">
              {getProfilePicture() ? (
                <img
                  src={getProfilePicture()}
                  alt="Foto de Perfil"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-md"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-md">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
              {/* Status Indicator */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
            </div>
            
            {/* Nome do Usuário */}
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-800 heading-ai">{getDisplayName()}</p>
              <p className="text-xs text-slate-500 mono-ai">FaceRec User</p>
            </div>
            
            {/* Botão Sair */}
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 text-ai"
              title="Sair do Sistema"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">Sair</span>
            </button>
          </div>
        </nav>
      </header>

      {/* Conteúdo com largura/padding padrão */}
      <main className="flex-1">
        <div className="container-pro page">{children}</div>
      </main>

      <footer className="border-t border-slate-200/60 mt-16 bg-gradient-to-r from-slate-50 to-blue-50">
        <div className="container-pro py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
            <p className="text-sm text-slate-600 text-ai">
              © {new Date().getFullYear()} FaceRec AI — Sistema Inteligente de Reconhecimento.
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-ai" rel="noreferrer">Privacidade</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-ai" rel="noreferrer">Termos</a>
            <a href="#" className="text-slate-500 hover:text-blue-600 transition-colors text-ai" rel="noreferrer">Suporte</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
