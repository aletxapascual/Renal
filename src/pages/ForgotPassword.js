import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Ingresa tu correo');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Te enviamos un correo para restablecer tu contraseña.');
    } catch (err) {
      console.error(err);
      setError('No se pudo enviar el correo: ' + err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      <form onSubmit={handleReset} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-[#5773BB] mb-2 text-center">Recuperar Contraseña</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {message && <p className="text-green-600 text-sm text-center">{message}</p>}

        <button type="submit" className="w-full bg-[#5773BB] hover:bg-[#4466B7] text-white font-bold py-3 rounded-lg transition-all">
          Enviar correo
        </button>
      </form>
    </div>
  );
}

