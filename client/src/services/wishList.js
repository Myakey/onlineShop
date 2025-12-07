import api from "../services/api";

const wishlistService = {
  // GET /api/wishlist
  async getWishlist() {
    const res = await api.get("/wishlist");
    return res.data;
  },

  // POST /api/wishlist  { product_id }
  async addToWishlist(productId) {
    const res = await api.post("/wishlist", { product_id: productId });
    return res.data;
  },

  // DELETE /api/wishlist/:productId
  async removeFromWishlist(productId) {
    const res = await api.delete(`/wishlist/${productId}`);
    return res.data;
  },

  // GET /api/wishlist/check/:productId
  async checkWishlist(productId) {
    const res = await api.get(`/wishlist/check/${productId}`);
    return res.data;
  },

  // DELETE /api/wishlist
  async clearWishlist() {
    const res = await api.delete("/wishlist");
    return res.data;
  },
};

export default wishlistService;
