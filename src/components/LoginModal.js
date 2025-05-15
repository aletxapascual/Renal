import React, { useState } from 'react';
import { useLoginModal } from '../context/LoginModalContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function LoginModal() {
  const { isOpen, closeLoginModal } = useLoginModal();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [keepSession, setKeepSession] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleGoogle = async () => {
    setError('');
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const uid = result.user.uid;
      const email = result.user.email || 'cliente_google';
      login({ uid, email, firstName: '', lastName: '', role: 'cliente' });
      closeLoginModal();
      navigate('/usuario');
    } catch (err) {
      console.error(err);
      setError('No se pudo iniciar sesión con Google.');
    } finally {
      setIsLoading(false);
    }
  };

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
      closeLoginModal();
      navigate(role === 'admin' ? '/dashboard' : '/usuario');
    
    } catch (err) {
      setError('Correo o contraseña incorrectos.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40">
      <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fadeIn">
        <button
          className="absolute top-4 left-4 text-2xl text-gray-400 hover:text-gray-700"
          onClick={closeLoginModal}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <div className="flex flex-col items-center mb-6">
          <img src="/images/login-illustration.png" alt="login" className="w-20 h-20 mb-2" />
          <h2 className="text-2xl font-bold text-center mb-2">Inicia sesión o crea tu cuenta</h2>
        </div>
        <button
          className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-3 font-semibold text-gray-700 mb-4 hover:bg-gray-50 transition disabled:opacity-50"
          onClick={handleGoogle}
          disabled={isLoading}
        >
          <FaGoogle className="text-[#EA4335] text-xl" />
          CONTINUAR CON GOOGLE
        </button>
        <p className="text-xs text-center text-gray-500 mb-6">
          Al iniciar sesión con mi login social, acepto vincular mi cuenta conforme a la <span className="underline cursor-pointer">Política de Privacidad</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-4 py-3"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={keepSession} 
                onChange={() => setKeepSession(!keepSession)}
                disabled={isLoading}
              />
              Mantener sesión
            </label>
            <a href="/forgot-password" className="text-[#5773BB] hover:underline">¿Has olvidado tu contraseña?</a>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {isLoading && <div className="text-gray-500 text-sm text-center">Cargando...</div>}
          <button 
            type="submit" 
            className="w-full bg-black text-white font-bold py-3 rounded-lg mt-2 hover:bg-gray-900 transition-all disabled:opacity-50"
            disabled={isLoading}
          >
            INICIAR SESIÓN
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          ¿No tienes cuenta? <a href="/register" className="text-[#5773BB] font-semibold hover:underline">Regístrate</a>
        </div>
        <div className="text-center mt-4 text-xs text-gray-400">
          <a href="/login?admin=1" className="hover:underline">Iniciar sesión para administradores</a>
        </div>
      </div>
    </div>
  );
} 