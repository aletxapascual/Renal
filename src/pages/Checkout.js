import React from 'react';

const Checkout = () => {
  return (
    <div className="checkout">
      <h1>Checkout</h1>
      <div className="checkout-container">
        <div className="shipping-info">
          <h2>Shipping Information</h2>
          <form>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input type="text" id="name" placeholder="Enter your full name" />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" placeholder="Enter your email" />
            </div>
            <div className="form-group">
              <label htmlFor="address">Address</label>
              <input type="text" id="address" placeholder="Enter your address" />
            </div>
            <div className="form-group">
              <label htmlFor="city">City</label>
              <input type="text" id="city" placeholder="Enter your city" />
            </div>
            <div className="form-group">
              <label htmlFor="zip">ZIP Code</label>
              <input type="text" id="zip" placeholder="Enter your ZIP code" />
            </div>
          </form>
        </div>
        <div className="payment-info">
          <h2>Payment Information</h2>
          <form>
            <div className="form-group">
              <label htmlFor="card-number">Card Number</label>
              <input type="text" id="card-number" placeholder="Enter card number" />
            </div>
            <div className="form-group">
              <label htmlFor="expiry">Expiry Date</label>
              <input type="text" id="expiry" placeholder="MM/YY" />
            </div>
            <div className="form-group">
              <label htmlFor="cvv">CVV</label>
              <input type="text" id="cvv" placeholder="Enter CVV" />
            </div>
            <button className="place-order-button">Place Order</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 