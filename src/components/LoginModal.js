import React, { useState } from 'react';
import { useLoginModal } from '../context/LoginModalContext';
import { useAuth } from '../context/AuthContext';
import { FaGoogle } from 'react-icons/fa';

export default function LoginModal() {
  const { isOpen, closeLoginModal } = useLoginModal();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogle = () => {
    // Aquí iría la lógica real de login con Google
    login('cliente_google', 'cliente');
    closeLoginModal();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    // Aquí va la lógica real de autenticación
    login(email, 'cliente');
    closeLoginModal();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-semibold mb-4 text-center">Iniciar Sesión</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-blue-200"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Entrar
          </button>
        </form>

        <div className="my-4 border-t border-gray-200" />

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          <FaGoogle className="mr-2" />
          Iniciar sesión con Google
        </button>

        <button
          onClick={closeLoginModal}
          className="mt-4 w-full text-sm text-gray-600 hover:text-gray-800"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
