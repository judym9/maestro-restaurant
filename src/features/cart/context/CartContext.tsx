import React, { useReducer, useEffect, useMemo } from 'react';
import type { CartState, CartAction, CartContextValue, CartItem, AddCartItemPayload } from '../types/cart.types';
import { formatSYP } from '../../../utils/currency';
import { useLanguage } from '../../../app/providers/LanguageProvider';
import { useSiteSettings } from '../../../features/settings/context/SiteSettingsContext';


const generateCartItemId = (
  mealId: string,
  optionId?: string,
  spiciness?: string
): string => {
  return `${mealId}__${optionId || 'default'}__${spiciness || 'none'}`;
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const payload = action.payload;
      const unitPrice = payload.price ?? payload.unitPrice ?? 0;
      const quantity = payload.quantity > 0 ? payload.quantity : 1;
      const itemId = generateCartItemId(payload.mealId, payload.selectedOption?.id, payload.spiciness);

      const existingIndex = state.items.findIndex((item) => item.id === itemId);

      if (existingIndex > -1) {
        const updatedItems = [...state.items];
        const existing = updatedItems[existingIndex];
        const newQty = existing.quantity + quantity;
        const price = existing.price ?? existing.unitPrice ?? unitPrice;
        updatedItems[existingIndex] = {
          ...existing,
          price,
          unitPrice: price,
          quantity: newQty,
          totalPrice: newQty * price,
        };
        return {
          ...state,
          items: updatedItems,
          isOpen: true, // Auto open drawer to confirm addition
        };
      }

      const newItem: CartItem = {
        ...payload,
        id: itemId,
        price: unitPrice,
        unitPrice,
        quantity,
        totalPrice: unitPrice * quantity,
      };

      return {
        ...state,
        items: [...state.items, newItem],
        isOpen: true, // Auto open drawer
      };
    }

    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    }

    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter((item) => item.id !== id),
        };
      }

      const updatedItems = state.items.map((item) => {
        if (item.id === id) {
          const unitPrice = item.price ?? item.unitPrice ?? 0;
          return {
            ...item,
            price: unitPrice,
            unitPrice,
            quantity,
            totalPrice: quantity * unitPrice,
          };
        }
        return item;
      });

      return {
        ...state,
        items: updatedItems,
      };
    }

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    case 'OPEN_CART':
      return {
        ...state,
        isOpen: true,
      };

    case 'CLOSE_CART':
      return {
        ...state,
        isOpen: false,
      };

    case 'TOGGLE_CART':
      return {
        ...state,
        isOpen: !state.isOpen,
      };

    default:
      return state;
  }
};

const initialCartState: CartState = {
  items: [],
  isOpen: false,
};

import { CartContext } from './cartStateContext';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language, isRtl } = useLanguage();
  const { settings } = useSiteSettings();
  // Strictly in-memory session cart: always starts empty on load/reload
  const [state, dispatch] = useReducer(cartReducer, initialCartState);

  // Defensively clear any legacy persistent cart keys from previous versions
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('maestro_cart_state');
        localStorage.removeItem('mastro_cart');
      } catch {
        // Ignore if storage is inaccessible
      }
    }
  }, []);

  // Derived calculations
  const totalItems = useMemo(() => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0);
  }, [state.items]);

  const deliveryFee = 0;

  const subtotal = useMemo(() => {
    return state.items.reduce(
      (total, item) => total + ((item.price ?? item.unitPrice ?? 0) * item.quantity),
      0
    );
  }, [state.items]);

  const grandTotal = useMemo(() => {
    return subtotal + (deliveryFee || 0);
  }, [subtotal, deliveryFee]);

  const total = grandTotal;

  const addItem = (item: AddCartItemPayload) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const openCart = () => {
    dispatch({ type: 'OPEN_CART' });
  };

  const closeCart = () => {
    dispatch({ type: 'CLOSE_CART' });
  };

  const toggleCart = () => {
    dispatch({ type: 'TOGGLE_CART' });
  };

  const checkoutViaWhatsApp = () => {
    if (state.items.length === 0) return;

    const phone = settings.whatsapp_number ? settings.whatsapp_number.replace(/\D/g, '') : '963969697587';
    let message = isRtl
      ? `*طلب جديد من مطعم مايسترو*\n------------------------------\n`
      : `*New Order from MAESTRO Restaurant*\n------------------------------\n`;

    state.items.forEach((item, index) => {
      const name = isRtl ? item.nameAr : item.nameEn;
      const optionStr = item.selectedOption
        ? ` (${isRtl ? item.selectedOption.nameAr : item.selectedOption.nameEn})`
        : '';
      const spiceStr = item.spiciness
        ? ` [${isRtl ? (item.spiciness === 'extraSpicy' ? 'حار ناري' : item.spiciness === 'medium' ? 'متوسط' : 'عادي') : item.spiciness}]`
        : '';
      const notes = item.instructions ? ` - ملاحظة: ${item.instructions}` : '';
      const itemUnitPrice = item.price ?? item.unitPrice ?? 0;
      const itemLineTotal = itemUnitPrice * item.quantity;
      const priceFormatted = formatSYP(itemLineTotal, { locale: language });

      message += `${index + 1}. *${name}* × ${item.quantity}${optionStr}${spiceStr}: ${priceFormatted}${notes}\n`;
    });

    const totalFormatted = formatSYP(grandTotal, { locale: language });
    message += `------------------------------\n*${isRtl ? 'المجموع الإجمالي' : 'Grand Total'}: ${totalFormatted}*\n`;
    message += isRtl
      ? `التوصيل: النبك - شارع أمين وما حولها\nيرجى تأكيد الطلب وتحديد عنوان التوصيل الدقيق. شكراً لكم!`
      : `Delivery: Al-Nabek - Amin Street & surrounding areas\nPlease confirm the order and specify your exact delivery address. Thank you!`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/${phone}?text=${encoded}`, '_blank');
  };

  const contextValue: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    totalItems,
    subtotal,
    deliveryFee,
    grandTotal,
    total,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    checkoutViaWhatsApp,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};
