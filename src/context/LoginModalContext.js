import React, { createContext, useContext, useState } from 'react';

const LoginModalContext = createContext();

export function useLoginModal() {
  return useContext(LoginModalContext);
}

export function LoginModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const openLoginModal = () => setIsOpen(true);
  const closeLoginModal = () => setIsOpen(false);

  return (
    <LoginModalContext.Provider value={{ isOpen, openLoginModal, closeLoginModal }}>
      {children}
    </LoginModalContext.Provider>
  );
} 