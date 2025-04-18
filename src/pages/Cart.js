import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-6">Your Shopping Cart</h1>
      <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <p className="text-gray-600 mb-6">Your cart is currently empty.</p>
        <Link 
          to="/checkout" 
          className="inline-block bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition-colors"
        >
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
};

export default Cart; 