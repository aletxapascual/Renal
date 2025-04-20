import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Routes from './Routes';

function App() {
  return (
    <Router>
      <LanguageProvider>
        <div className="min-h-screen flex flex-col overflow-x-hidden">
          <Navbar />
          <main className="flex-grow w-full">
            <Routes />
          </main>
          <Footer />
        </div>
      </LanguageProvider>
    </Router>
  );
}

export default App;
