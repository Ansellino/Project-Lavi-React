import React, { createContext, useContext, useState, useEffect } from "react";
import { Cart, CartItem, Product } from "../models";
import { CartRepository } from "../repositories/CartRepository";
import { useAuth } from "./AuthContext";

interface CartContextType {
  cart: Cart | null;
  cartItems: (CartItem & { product: Product })[];
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  removeFromCart: (itemId: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartItems, setCartItems] = useState<
    (CartItem & { product: Product })[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cartRepository = new CartRepository();

  // Load or create cart when user logs in
  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(true);
      try {
        const userCart = cartRepository.getOrCreateCart(user.id);
        setCart(userCart);

        const items = cartRepository.getCartItemsWithProducts(userCart.id);
        setCartItems(items);
        setError(null);
      } catch (err) {
        setError("Failed to load cart");
      } finally {
        setLoading(false);
      }
    } else {
      setCart(null);
      setCartItems([]);
    }
  }, [isAuthenticated, user]);

  const addToCart = (productId: number, quantity: number) => {
    if (!cart) return;

    try {
      setError(null);
      const newItem = cartRepository.addItem(cart.id, productId, quantity);

      // Refresh cart items
      const updatedItems = cartRepository.getCartItemsWithProducts(cart.id);
      setCartItems(updatedItems);
    } catch (err) {
      setError("Failed to add item to cart");
    }
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (!cart) return;

    try {
      setError(null);
      if (quantity <= 0) {
        removeFromCart(itemId);
        return;
      }

      const updatedItem = cartRepository.updateItemQuantity(itemId, quantity);

      if (updatedItem) {
        // Refresh cart items
        const updatedItems = cartRepository.getCartItemsWithProducts(cart.id);
        setCartItems(updatedItems);
      }
    } catch (err) {
      setError("Failed to update item quantity");
    }
  };

  const removeFromCart = (itemId: number) => {
    if (!cart) return;

    try {
      setError(null);
      const success = cartRepository.removeItem(itemId);

      if (success) {
        // Refresh cart items
        const updatedItems = cartRepository.getCartItemsWithProducts(cart.id);
        setCartItems(updatedItems);
      }
    } catch (err) {
      setError("Failed to remove item from cart");
    }
  };

  const clearCart = () => {
    if (!cart) return;

    try {
      setError(null);
      const success = cartRepository.clearCart(cart.id);

      if (success) {
        setCartItems([]);
      }
    } catch (err) {
      setError("Failed to clear cart");
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartItems,
        loading,
        error,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
