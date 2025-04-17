import React from 'react';
import { Link } from 'react-router-dom';

const Cart = () => {
  return (
    <div className="cart">
      <h1>Your Shopping Cart</h1>
      <div className="cart-container">
        <p>Your cart is currently empty.</p>
        <Link to="/checkout" className="checkout-button">Proceed to Checkout</Link>
      </div>
    </div>
  );
};

export default Cart; 