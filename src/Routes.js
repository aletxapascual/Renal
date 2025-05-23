import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Container1 from './containers/home/Container1';
import Container2 from './containers/home/Container2';
import Container3 from './containers/home/Container3';
import Container4 from './containers/home/Container4';
import Container5 from './containers/home/Container5';
import About from './pages/About';
import Contact from './pages/Contact';
import Tienda from './pages/Tienda';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';

function HomePage() {
  return (
    <>
      <Container1 />
      <Container2 />
      <Container3 />
      <Container4 />
      <Container5 />
    </>
  );
}

function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/acerca-de" element={<About />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/tienda" element={<Tienda />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/register" element={<Register />} />
      {/* Add more routes here as needed */}
    </RouterRoutes>
  );
}

export default Routes; 