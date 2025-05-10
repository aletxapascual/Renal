import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('cliente');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    login(username || (role === 'admin' ? 'admin' : 'cliente'), role);
    navigate(role === 'admin' ? '/dashboard' : '/usuario');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-[#5773BB]/5 to-white">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-6">
        <h2 className="text-2xl font-bold text-[#5773BB] mb-4 text-center">Iniciar Sesión</h2>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-2"
        />
        <div className="flex gap-4 mb-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="cliente" checked={role === 'cliente'} onChange={() => setRole('cliente')} /> Cliente
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="role" value="admin" checked={role === 'admin'} onChange={() => setRole('admin')} /> Admin
          </label>
        </div>
        <button type="submit" className="w-full bg-[#5773BB] hover:bg-[#4466B7] text-white font-bold py-3 rounded-lg transition-all">Entrar</button>
      </form>
    </div>
  );
} 