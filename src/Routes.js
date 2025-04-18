import React from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import Container1 from './containers/home/Container1';
import Container2 from './containers/home/Container2';
import Container3 from './containers/home/Container3';
import Container4 from './containers/home/Container4';
import Container5 from './containers/home/Container5';
import About from './pages/About';

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
      {/* Add more routes here as needed */}
    </RouterRoutes>
  );
}

export default Routes; 