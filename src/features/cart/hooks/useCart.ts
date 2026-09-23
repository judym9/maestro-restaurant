import { useContext } from 'react';
import { CartContext } from '../context/cartStateContext';
import type { CartContextValue } from '../types/cart.types';

export const useCart = (): CartContextValue => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
