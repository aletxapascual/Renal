import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoginModal } from '../context/LoginModalContext';
import { useNavigate, useLocation } from 'react-router-dom';

// role: 'admin' o 'cliente' (opcional)
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    if (!user && !publicRoutes.includes(location.pathname)) {
      openLoginModal();
      navigate('/');
    } else if (user && role && user.role !== role) {
      navigate('/');
    }
  }, [user, role, openLoginModal, navigate, location.pathname]);

  // Si no hay usuario o el rol no coincide, no renderizamos nada
  if (!user || (role && user.role !== role)) {
    return null;
  }

  // Si hay usuario y el rol coincide, renderizamos el contenido
  return children;
} 