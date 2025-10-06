import { createContext, useContext, useEffect, useState } from "react";
import cartService from "../services/cartService"; // ✅ updated import (default export)

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null); // full cart data {cart_id, items, totalItems, totalAmount}
  const [cartCount, setCartCount] = useState(0); // for navbar badge
  const [loading, setLoading] = useState(true);

  
  const fetchCart = async () => {
    setLoading(true);
    try {
      const data = await cartService.getCart();
      console.log("Cart API:", data);

      // Expecting { success: true, data: {...} }
      setCart(data.data);
      setCartCount(data.data?.totalItems || data.data?.items?.length || 0);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== FETCH CART COUNT ====================
  const fetchCartCount = async () => {
    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  // ==================== ADD ITEM ====================
  const addItem = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart();
    } catch (error) {
      console.error("Failed to add item:", error);
      throw error;
    }
  };

  // ==================== UPDATE ITEM ====================
  const updateItem = async (cartItemId, quantity) => {
    try {
      await cartService.updateCartItem(cartItemId, quantity);
      await fetchCart();
    } catch (error) {
      console.error("Failed to update item:", error);
      throw error;
    }
  };

  // ==================== REMOVE ITEM ====================
  const removeItem = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
      throw error;
    }
  };

  // ==================== CLEAR CART ====================
  const clearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      setCartCount(0);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  // ==================== VALIDATE CART ====================
  const validate = async () => {
    try {
      return await cartService.validateCart();
    } catch (error) {
      console.error("Cart validation failed:", error);
      throw error;
    }
  };

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    fetchCart();
  }, []);

  // ==================== CONTEXT VALUE ====================
  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        loading,
        fetchCart,
        fetchCartCount,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        validate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// ==================== CUSTOM HOOK ====================
export const useCart = () => useContext(CartContext);
