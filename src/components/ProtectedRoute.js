import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLoginModal } from '../context/LoginModalContext';
import { useNavigate } from 'react-router-dom';

// role: 'admin' o 'cliente' (opcional)
export default function ProtectedRoute({ children, role }) {
  const { user } = useAuth();
  const { openLoginModal } = useLoginModal();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!user) {
      openLoginModal();
      navigate('/');
    } else if (role && user.role !== role) {
      openLoginModal();
      navigate('/');
    }
  }, [user, role, openLoginModal, navigate]);

  if (!user) {
    return null;
  }

  if (role && user.role !== role) {
    return null;
  }

  return children;
} 