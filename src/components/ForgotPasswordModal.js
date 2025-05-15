import React, { useState } from 'react';
import { useLoginModal } from '../context/LoginModalContext';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import logo from '../images/logo.png';

export default function ForgotPasswordModal() {
  const { modalType, closeLoginModal, openLoginModal } = useLoginModal();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (modalType !== 'forgot-password') return null;

  const handleClose = () => {
    closeLoginModal();
    openLoginModal();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsLoading(true);

    if (!email.includes('@')) {
      setError('Por favor ingresa un correo válido.');
      setIsLoading(false);
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setSuccess(true);
      setEmail('');
    } catch (err) {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        setError('No existe una cuenta con este correo.');
      } else {
        setError('Error al enviar el correo de recuperación.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <button
          className="absolute top-4 left-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={handleClose}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Renal Logo" className="h-24 w-auto object-contain mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">Recuperar contraseña</h2>
          <p className="text-gray-600 text-center text-sm">
            Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-full px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-300"
            disabled={isLoading}
          />
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && (
            <div className="text-green-500 text-sm text-center">
              Se ha enviado un correo con las instrucciones para recuperar tu contraseña.
            </div>
          )}
          {isLoading && <div className="text-gray-500 text-sm text-center">Enviando...</div>}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-full mt-2 hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            ENVIAR INSTRUCCIONES
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          <button onClick={handleClose} className="text-blue-600 font-semibold hover:underline">
            Volver a iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
} 