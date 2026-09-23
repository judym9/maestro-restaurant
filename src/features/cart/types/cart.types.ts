export interface CartOption {
  id: string;
  nameAr: string;
  nameEn: string;
  priceDiff: number;
}

export type SpiceLevel = 'mild' | 'medium' | 'extraSpicy';

export interface CartItem {
  id: string; // Composite unique key: `${mealId}-${option?.id || 'none'}-${spiciness}`
  mealId: string;
  nameAr: string;
  nameEn: string;
  imageKey: string;
  price: number; // Unit price
  unitPrice: number; // Unit price alias
  quantity: number;
  totalPrice: number; // Line total: price * quantity
  selectedOption?: CartOption | null;
  spiciness?: SpiceLevel;
  instructions?: string;
}

export interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

export type AddCartItemPayload = Omit<CartItem, 'id' | 'price' | 'unitPrice' | 'totalPrice'> & {
  price?: number;
  unitPrice?: number;
};

export type CartAction =
  | { type: 'ADD_ITEM'; payload: AddCartItemPayload }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'OPEN_CART' }
  | { type: 'CLOSE_CART' }
  | { type: 'TOGGLE_CART' };

export interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  total: number; // Alias for grandTotal
  addItem: (item: AddCartItemPayload) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  checkoutViaWhatsApp: () => void;
}
