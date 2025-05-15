import React, { useState } from 'react';
import { useLoginModal } from '../context/LoginModalContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import logo from '../images/logo.png';

export default function LoginModal() {
  const { isOpen, closeLoginModal, openRegisterModal, openForgotPasswordModal } = useLoginModal();
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
      navigate('/usuario', { replace: true });
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
      if (role === 'admin') {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/usuario', { replace: true });
      }
    
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
          <img src={logo} alt="Renal Logo" className="h-24 w-auto object-contain mb-4" />
          <h2 className="text-2xl font-bold text-center mb-2 text-blue-600">Inicia sesión o crea tu cuenta</h2>
        </div>
        <button
          className="w-full border border-blue-600 text-blue-600 rounded-full py-3 flex items-center justify-center gap-3 font-semibold mb-4 hover:bg-blue-600 hover:text-white transition-all duration-300 disabled:opacity-50"
          onClick={handleGoogle}
          disabled={isLoading}
        >
          <FaGoogle className="text-xl" />
          CONTINUAR CON GOOGLE
        </button>
        <p className="text-xs text-center text-gray-500 mb-6">
          Al iniciar sesión con mi login social, acepto vincular mi cuenta conforme a la <span className="underline cursor-pointer text-blue-600">Política de Privacidad</span>
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-full px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-300"
            disabled={isLoading}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-full px-4 py-3 focus:border-blue-600 focus:ring-1 focus:ring-blue-600 outline-none transition-all duration-300"
            disabled={isLoading}
          />
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input 
                type="checkbox" 
                checked={keepSession} 
                onChange={() => setKeepSession(!keepSession)}
                disabled={isLoading}
                className="rounded text-blue-600 focus:ring-blue-600"
              />
              Mantener sesión
            </label>
            <button 
              type="button"
              onClick={openForgotPasswordModal} 
              className="text-blue-600 hover:underline"
            >
              ¿Has olvidado tu contraseña?
            </button>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {isLoading && <div className="text-gray-500 text-sm text-center">Cargando...</div>}
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-full mt-2 hover:bg-blue-700 transition-all duration-300 disabled:opacity-50"
            disabled={isLoading}
          >
            INICIAR SESIÓN
          </button>
        </form>
        <div className="text-center mt-6 text-sm">
          ¿No tienes cuenta? <button onClick={openRegisterModal} className="text-blue-600 font-semibold hover:underline">Regístrate</button>
        </div>
      </div>
    </div>
  );
} 