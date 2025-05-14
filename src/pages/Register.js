import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { setDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
  
    if (!email || !password || !firstName || !lastName) {
        setError('Llena todos los campos');
        return;
    }
  
    try {
      // 1. Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  
      // 2. Guardar en Firestore su rol como cliente
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email,
        firstName,
        lastName,
        role: 'cliente'
      });
  
      // 3. Mensaje de éxito + redirección
      setSuccessMessage('✅ Te has registrado con éxito');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error(err);
      setError('Error al crear la cuenta: ' + err.message);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-white">
      <form onSubmit={handleRegister} className="bg-white p-8 rounded-xl shadow-md w-full max-w-md space-y-4">
        <h2 className="text-2xl font-bold text-[#5773BB] mb-2 text-center">Crear Cuenta</h2>

        <input
          type="text"
          placeholder="Nombre"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

        <input
          type="text"
          placeholder="Apellido"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2"
        />

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

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}

        <button type="submit" className="w-full bg-[#5773BB] hover:bg-[#4466B7] text-white font-bold py-3 rounded-lg transition-all">
          Registrarme
        </button>
      </form>
    </div>
  );
}
