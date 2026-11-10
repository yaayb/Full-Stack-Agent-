import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import {
  Product,
  ProductVariant,
  PromoValidationResult,
} from '../services/api';

export const FREE_SHIPPING_THRESHOLD = 250;
export const EXPRESS_SHIPPING_FEE = 25;

export interface CartItem {
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  sku: string;
  size: string;
  color: string;
  colorHex: string;
  unitPrice: number;
  maxStock: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  finalTotal: number;
  appliedPromo: PromoValidationResult | null;
  setAppliedPromo: (promo: PromoValidationResult | null) => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const CART_STORAGE_KEY = 'av_luxury_cart_v1';

const loadInitialCart = (): CartItem[] => {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => loadInitialCart());
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [appliedPromo, setAppliedPromo] = useState<PromoValidationResult | null>(null);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const addItem = useCallback(
    (product: Product, variant: ProductVariant, quantity = 1) => {
      if (variant.stock <= 0) return;

      const resolvedPrice = variant.price ?? product.basePrice;
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.variantId === variant.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          const existing = updated[existingIndex];
          const nextQty = Math.min(variant.stock, existing.quantity + quantity);
          updated[existingIndex] = {
            ...existing,
            quantity: nextQty,
            maxStock: variant.stock,
            unitPrice: resolvedPrice,
          };
          return updated;
        }
        return [
          ...prev,
          {
            productId: product.id,
            productSlug: product.slug,
            productName: product.name,
            variantId: variant.id,
            sku: variant.sku,
            size: variant.size,
            color: variant.color,
            colorHex: variant.colorHex,
            unitPrice: resolvedPrice,
            maxStock: variant.stock,
            imageUrl: variant.imageUrl || product.images[0] || '',
            quantity: Math.min(variant.stock, quantity),
          },
        ];
      });
      setIsCartOpen(true);
    },
    []
  );

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((item) => item.variantId !== variantId);
      }
      return prev.map((item) =>
        item.variantId === variantId
          ? { ...item, quantity: Math.min(item.maxStock, quantity) }
          : item
      );
    });
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setItems((prev) => prev.filter((item) => item.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedPromo(null);
  }, []);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      Number(
        items
          .reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
          .toFixed(2)
      ),
    [items]
  );

  useEffect(() => {
    if (appliedPromo && subtotal < appliedPromo.minCartSpend) {
      setAppliedPromo(null);
    }
  }, [subtotal, appliedPromo]);

  const discountAmount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.discountType === 'PERCENTAGE') {
      return Number(
        Math.min(subtotal, (subtotal * appliedPromo.discountValue) / 100).toFixed(2)
      );
    }
    return Math.min(subtotal, appliedPromo.discountValue);
  }, [appliedPromo, subtotal]);

  const shippingFee = useMemo(() => {
    if (items.length === 0) return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : EXPRESS_SHIPPING_FEE;
  }, [items.length, subtotal]);

  const finalTotal = useMemo(
    () => Number(Math.max(0, subtotal - discountAmount + shippingFee).toFixed(2)),
    [subtotal, discountAmount, shippingFee]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        isCartOpen,
        openCart,
        closeCart,
        addItem,
        updateQuantity,
        removeItem,
        clearCart,
        totalItems,
        subtotal,
        shippingFee,
        discountAmount,
        finalTotal,
        appliedPromo,
        setAppliedPromo,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
};
