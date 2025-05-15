import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tienda from './pages/Tienda';
import Acerca from './pages/Acerca';
import Contacto from './pages/Contacto';
import ProductDetail from './containers/tienda/ProductDetail';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from './context/CartContext';
import CartDrawer from './components/CartDrawer';
import { PickupModalProvider } from './context/PickupModalContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserArea from './pages/UserArea';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import { LoginModalProvider } from './context/LoginModalContext';
import LoginModal from './components/LoginModal';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <CartProvider>
          <PickupModalProvider>
            <LoginModalProvider>
              <AuthProvider>
                <ScrollToTop />
                <CartDrawer />
                <LoginModal />
                <div className="min-h-screen flex flex-col">
                  <Navbar />
                  <main className="flex-grow pt-20 md:pt-32 transition-all duration-300">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/tienda" element={<Tienda />} />
                      <Route path="/acerca-de" element={<Acerca />} />
                      <Route path="/contacto" element={<Contacto />} />
                      <Route path="/tienda/:productId" element={<ProductDetail />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/dashboard" element={
                        <ProtectedRoute role="admin">
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/usuario" element={
                        <ProtectedRoute role="cliente">
                          <UserArea />
                        </ProtectedRoute>
                      } />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/register" element={<Register />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              </AuthProvider>
            </LoginModalProvider>
          </PickupModalProvider>
        </CartProvider>
      </LanguageProvider>
    </Router>
  );
}

export default App;
