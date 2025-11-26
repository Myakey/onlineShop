// import { createContext, useContext, useEffect, useState } from "react";
// import cartService from "../services/cartService";

// const CartContext = createContext();

// export const CartProvider = ({ children }) => {
//   const [cart, setCart] = useState(null);
//   const [cartCount, setCartCount] = useState(0);
//   const [loading, setLoading] = useState(true);

//   // ==================== FETCH CART ====================
//   const fetchCart = async () => {
//     setLoading(true);
//     try {
//       const data = await cartService.getCart();
//       console.log("Cart API:", data);
//       setCart(data.data);
//       setCartCount(data.data?.totalItems || data.data?.items?.length || 0);
//     } catch (error) {
//       console.error("Failed to fetch cart:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ==================== FETCH CART COUNT ====================
//   const fetchCartCount = async () => {
//     try {
//       const count = await cartService.getCartCount();
//       setCartCount(count);
//     } catch (error) {
//       console.error("Failed to fetch cart count:", error);
//     }
//   };

//   // ==================== ADD ITEM ====================
//   const addItem = async (productId, quantity = 1) => {
//     try {
//       await cartService.addToCart(productId, quantity);
//       await fetchCart();
//     } catch (error) {
//       console.error("Failed to add item:", error);
//       throw error;
//     }
//   };

//   // ==================== UPDATE ITEM ====================
//   const updateItem = async (cartItemId, quantity) => {
//     try {
//       await cartService.updateCartItem(cartItemId, quantity);
//       await fetchCart();
//     } catch (error) {
//       console.error("Failed to update item:", error);
//       throw error;
//     }
//   };

//   // ==================== REMOVE ITEM ====================
//   const removeItem = async (cartItemId) => {
//     try {
//       await cartService.removeFromCart(cartItemId);
//       await fetchCart();
//     } catch (error) {
//       console.error("Failed to remove item:", error);
//       throw error;
//     }
//   };

//   // ==================== CLEAR CART ====================
//   const clearCart = async () => {
//     try {
//       await cartService.clearCart();
//       setCart(null);
//       setCartCount(0);
//     } catch (error) {
//       console.error("Failed to clear cart:", error);
//       throw error;
//     }
//   };

//   // ==================== REMOVE PRODUCT (for Order page) ====================
//   /**
//    * Remove selected product(s) from cart after order is placed
//    * @param {Array|number} cartItemIds - Single cart_item_id or array of cart_item_ids to remove
//    * Must provide cart_item_ids from the selected checkout items
//    */
//   const removeProduct = async (cartItemIds) => {
//     try {
//       // cartItemIds is required
//       if (!cartItemIds || (Array.isArray(cartItemIds) && cartItemIds.length === 0)) {
//         console.warn("removeProduct: No cart item IDs provided");
//         return;
//       }

//       // If single ID (number), convert to array
//       const idsToRemove = Array.isArray(cartItemIds) ? cartItemIds : [cartItemIds];

//       // Remove each item from backend
//       for (const itemId of idsToRemove) {
//         await cartService.removeFromCart(itemId);
//       }

//       // Refresh cart after removal
//       await fetchCart();
//     } catch (error) {
//       console.error("Failed to remove product(s):", error);
//       throw error;
//     }
//   };

//   // ==================== VALIDATE CART ====================
//   const validate = async () => {
//     try {
//       return await cartService.validateCart();
//     } catch (error) {
//       console.error("Cart validation failed:", error);
//       throw error;
//     }
//   };

//   // ==================== INITIAL LOAD ====================
//   useEffect(() => {
//     fetchCart();
//   }, []);

//   // ==================== CONTEXT VALUE ====================
//   return (
//     <CartContext.Provider
//       value={{
//         cart,
//         cartCount,
//         loading,
//         fetchCart,
//         fetchCartCount,
//         addItem,
//         updateItem,
//         removeItem,
//         removeProduct, // ✅ Added for Order page
//         clearCart,
//         validate,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };

// // ==================== CUSTOM HOOK ====================
// export const useCart = () => useContext(CartContext);

import { createContext, useContext, useEffect, useState } from "react";
import cartService from "../services/cartService";
import { useUser } from "./userContext";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, loading: userLoading } = useUser();

  // ==================== FETCH CART ====================
  const fetchCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token || !isAuthenticated) {
      setCart(null);
      setCartCount(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const data = await cartService.getCart();
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
    const token = localStorage.getItem("accessToken");
    if (!token || !isAuthenticated) {
      setCartCount(0);
      return;
    }

    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  // ==================== ADD ITEM ====================
  const addItem = async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      throw new Error("LOGIN_REQUIRED");
    }
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
    if (!isAuthenticated) {
      throw new Error("LOGIN_REQUIRED");
    }
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
    if (!isAuthenticated) {
      throw new Error("LOGIN_REQUIRED");
    }
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
    if (!isAuthenticated) {
      throw new Error("LOGIN_REQUIRED");
    }
    try {
      await cartService.clearCart();
      setCart(null);
      setCartCount(0);
    } catch (error) {
      console.error("Failed to clear cart:", error);
      throw error;
    }
  };

  // ==================== REMOVE PRODUCT (for Order page) ====================
  const removeProduct = async (cartItemIds) => {
    if (!isAuthenticated) {
      throw new Error("LOGIN_REQUIRED");
    }
    try {
      if (!cartItemIds || (Array.isArray(cartItemIds) && cartItemIds.length === 0)) {
        console.warn("removeProduct: No cart item IDs provided");
        return;
      }

      const idsToRemove = Array.isArray(cartItemIds) ? cartItemIds : [cartItemIds];
      for (const itemId of idsToRemove) {
        await cartService.removeFromCart(itemId);
      }

      await fetchCart();
    } catch (error) {
      console.error("Failed to remove product(s):", error);
      throw error;
    }
  };

  // ==================== VALIDATE CART ====================
  const validate = async (items) => {
    if (!isAuthenticated) {
      throw new Error("LOGIN_REQUIRED");
    }
    if (!Array.isArray(items) || items.length === 0) {
      throw new Error("NO_ITEMS_SELECTED");
    }
    try {
      return await cartService.validateCart(items);
    } catch (error) {
      console.error("Cart validation failed:", error);
      throw error;
    }
  };

  // ==================== INITIAL LOAD ====================
  useEffect(() => {
    if (userLoading) return;
    fetchCart();
    fetchCartCount();
  }, [isAuthenticated, userLoading]);

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
        removeProduct,
        clearCart,
        validate,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
