import React, { createContext, useContext, useState } from 'react';

const LoginModalContext = createContext();

export function useLoginModal() {
  return useContext(LoginModalContext);
}

export function LoginModalProvider({ children }) {
  const [modalType, setModalType] = useState(null); // 'login', 'register', 'forgot-password'

  const openLoginModal = () => setModalType('login');
  const openRegisterModal = () => setModalType('register');
  const openForgotPasswordModal = () => setModalType('forgot-password');
  const closeLoginModal = () => setModalType(null);

  const isOpen = modalType !== null;

  return (
    <LoginModalContext.Provider value={{
      isOpen,
      modalType,
      openLoginModal,
      openRegisterModal,
      openForgotPasswordModal,
      closeLoginModal
    }}>
      {children}
    </LoginModalContext.Provider>
  );
} 