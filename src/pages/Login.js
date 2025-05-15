import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email.includes('@') || !password) {
      setError('Por favor ingresa un correo válido y una contraseña.');
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
    
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
    
      let role = 'cliente';
      let firstName = '';
      let lastName = '';
    
      if (snap.exists()) {
        const data = snap.data();
        role = data.role || 'cliente';
        firstName = data.firstName || '';
        lastName = data.lastName || '';
      }
    
      login({ uid, email, firstName, lastName, role });
    
      navigate(role === 'admin' ? '/dashboard' : '/usuario');
    
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
      console.error(err);
    }
    
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const email = result.user.email || 'cliente_google';
      login(email, 'cliente');
      navigate('/usuario');
    } catch (err) {
      console.error(err);
      setError('No se pudo iniciar sesión con Google.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white via-[#5773BB]/5 to-white px-4">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-[#5773BB] mb-2 text-center">Iniciar Sesión</h2>

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        <div className="flex justify-between text-sm text-blue-600">
          <Link to="/forgot-password" className="hover:underline">¿Olvidaste tu contraseña?</Link>
          <Link to="/register" className="hover:underline">Registrarse</Link>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {isLoading && <p className="text-gray-500 text-sm text-center">Cargando...</p>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-[#5773BB] hover:bg-[#4466B7] text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50"
        >
          Entrar
        </button>

        <button
          type="button"
          disabled={isLoading}
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all disabled:opacity-50"
        >
          <FaGoogle />
          Iniciar con Google
        </button>
      </form>
    </div>
  );
}
