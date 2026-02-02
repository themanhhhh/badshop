'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getToken } from '@/lib/auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';
const LOCAL_CART_KEY = 'guest_cart';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  loading: boolean;
  itemCount: number;
  subtotal: number;
  addToCart: (item: Omit<CartItem, 'id'>) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper to generate unique ID
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Get cart from localStorage (for guests)
function getLocalCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const cart = localStorage.getItem(LOCAL_CART_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch {
    return [];
  }
}

// Save cart to localStorage
function saveLocalCart(items: CartItem[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(items));
}

// Clear local cart
function clearLocalCart(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCAL_CART_KEY);
}

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { user, isAuthenticated } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartId, setCartId] = useState<string | null>(null);

  // Calculate derived values
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Load cart on mount or when auth changes
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      if (isAuthenticated && user) {
        // Load cart from API for authenticated users
        try {
          const token = getToken();
          const response = await fetch(`${API_BASE_URL}/carts/user/${user.id}`, {
            method: 'POST', // getOrCreate
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });
          
          if (response.ok) {
            const result = await response.json();
            if (result.data) {
              setCartId(result.data.id);
              // Map API cart items to our format
              const apiItems: CartItem[] = (result.data.items || []).map((item: {
                id: string;
                product_id?: string;
                productId?: string;
                quantity: number;
                price: number;
                product?: {
                  name?: string;
                  brand?: { name?: string };
                  images?: { url?: string }[];
                };
              }) => ({
                id: item.id,
                productId: item.product_id || item.productId,
                name: item.product?.name || 'Sản phẩm',
                brand: item.product?.brand?.name || '',
                price: item.price,
                image: item.product?.images?.[0]?.url || '/products/placeholder.jpg',
                quantity: item.quantity,
              }));
              
              // Merge with local cart if any (guest items)
              const localItems = getLocalCart();
              if (localItems.length > 0) {
                // Add local items to server cart
                for (const localItem of localItems) {
                  const existing = apiItems.find((i: CartItem) => i.productId === localItem.productId);
                  if (!existing) {
                    apiItems.push(localItem);
                    // TODO: Sync to server
                  }
                }
                clearLocalCart();
              }
              
              setItems(apiItems);
            }
          }
        } catch (error) {
          console.error('Failed to load cart:', error);
          // Fallback to local cart
          setItems(getLocalCart());
        }
      } else {
        // Load from localStorage for guests
        setItems(getLocalCart());
        setCartId(null);
      }
      
      setLoading(false);
    };

    loadCart();
  }, [isAuthenticated, user]);

  // Save to localStorage when items change (for guests)
  useEffect(() => {
    if (!isAuthenticated) {
      saveLocalCart(items);
    }
  }, [items, isAuthenticated]);

  const addToCart = useCallback(async (item: Omit<CartItem, 'id'>) => {
    setItems(prev => {
      const existing = prev.find(i => i.productId === item.productId);
      if (existing) {
        return prev.map(i =>
          i.productId === item.productId
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, { ...item, id: generateId() }];
    });

    // Sync to server if authenticated
    if (isAuthenticated && cartId) {
      try {
        const token = getToken();
        await fetch(`${API_BASE_URL}/carts/${cartId}/items`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: item.productId,
            quantity: item.quantity,
          }),
        });
      } catch (error) {
        console.error('Failed to sync cart:', error);
      }
    }
  }, [isAuthenticated, cartId]);

  const removeFromCart = useCallback(async (productId: string) => {
    setItems(prev => prev.filter(i => i.productId !== productId));

    // TODO: Sync to server if authenticated
  }, []);

  const updateQuantity = useCallback(async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    
    setItems(prev =>
      prev.map(i =>
        i.productId === productId ? { ...i, quantity } : i
      )
    );

    // TODO: Sync to server if authenticated
  }, [removeFromCart]);

  const clearCart = useCallback(async () => {
    setItems([]);
    clearLocalCart();

    // TODO: Sync to server if authenticated
  }, []);

  const value: CartContextType = {
    items,
    loading,
    itemCount,
    subtotal,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
