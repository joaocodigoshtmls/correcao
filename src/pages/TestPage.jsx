import React from 'react';

export default function TestPage() {
  const handleTestLogin = () => {
    // Simula um login bem-sucedido
    const usuario = {
      email: 'teste@teste.com',
      nome: 'teste'
    };
    
    localStorage.setItem('token', 'test-token-123');
    localStorage.setItem('usuario', JSON.stringify(usuario));
    
    // Força o redirecionamento
    window.location.href = '/home';
  };
  
  const checkAuth = () => {
    const usuario = localStorage.getItem('usuario');
    const token = localStorage.getItem('token');
    
    console.log('Token:', token);
    console.log('Usuario:', usuario);
    
    alert(`Token: ${token}\nUsuario: ${usuario}`);
  };
  
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Teste de Autenticação</h1>
      
      <div className="space-x-4">
        <button 
          onClick={handleTestLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Simular Login
        </button>
        
        <button 
          onClick={checkAuth}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Verificar Auth
        </button>
        
        <button 
          onClick={() => localStorage.clear()}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Limpar Storage
        </button>
      </div>
    </div>
  );
}
