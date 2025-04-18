import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-gray-800 p-4 shadow-md">
          <ul className="flex justify-center space-x-8">
            <li><Link to="/" className="text-white hover:text-blue-300 font-medium">Home</Link></li>
            <li><Link to="/about" className="text-white hover:text-blue-300 font-medium">About</Link></li>
            <li><Link to="/contact" className="text-white hover:text-blue-300 font-medium">Contact</Link></li>
            <li><Link to="/cart" className="text-white hover:text-blue-300 font-medium">Cart</Link></li>
          </ul>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
