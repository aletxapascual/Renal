import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';

function CartDrawer() {
  const { language } = useLanguage();

  return null; // Since we're removing cart functionality, return null
}

export default CartDrawer; 