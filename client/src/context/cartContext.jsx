import { createContext, useContext, useEffect, useState } from "react";
import * as cartService from "../services/cartService"; // import all service functions

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null); // full cart data {cart_id, items, totalItems, totalAmount}
  const [cartCount, setCartCount] = useState(0); // for navbar badge
  const [loading, setLoading] = useState(true);

  // Fetch full cart
  const fetchCart = async () => {
  setLoading(true);
  try {
    const data = await cartService.getCart();
    console.log("Cart API:", data); // 👈 log here
    setCart(data.data);
    setCartCount(data.data?.totalItems || data.data?.items?.length || 0);
  } catch (error) {
    console.error("Failed to fetch cart:", error);
  } finally {
    setLoading(false);
  }
};


  // Fetch only cart count (lighter API call)
  const fetchCartCount = async () => {
    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  // Add product to cart
  const addItem = async (productId, quantity = 1) => {
    try {
      await cartService.addToCart(productId, quantity);
      await fetchCart(); // refresh after add
    } catch (error) {
      console.error("Failed to add item:", error);
      throw error;
    }
  };

  // Update item quantity
  const updateItem = async (cartItemId, quantity) => {
    try {
      await cartService.updateCartItem(cartItemId, quantity);
      await fetchCart();
    } catch (error) {
      console.error("Failed to update item:", error);
      throw error;
    }
  };

  // Remove item
  const removeItem = async (cartItemId) => {
    try {
      await cartService.removeFromCart(cartItemId);
      await fetchCart();
    } catch (error) {
      console.error("Failed to remove item:", error);
      throw error;
    }
  };

  // Clear entire cart
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

  // Validate cart before checkout
  const validate = async () => {
    try {
      return await cartService.validateCart();
    } catch (error) {
      console.error("Cart validation failed:", error);
      throw error;
    }
  };

  // Load cart on first render
  useEffect(() => {
    fetchCart();
  }, []);

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

// custom hook
export const useCart = () => useContext(CartContext);
