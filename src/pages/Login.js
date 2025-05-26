import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !password) {
      setError('Por favor ingresa usuario y contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      const user = await login(username, password);
      if (user) {
        navigate('/dashboard');
      } else {
        setError('Usuario o contraseña incorrectos.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Usuario o contraseña incorrectos.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-[#5773BB]/5 to-white px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-[#5773BB] mb-2 text-center">Iniciar Sesión</h2>

        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {isLoading && <p className="text-gray-500 text-sm text-center">Cargando...</p>}

        <button 
          type="submit" 
          className="w-full bg-[#5773BB] hover:bg-[#4466B7] text-white font-bold py-3 rounded-lg transition-all"
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
}
