import axios from "axios";

const CART_API = "http://localhost:8080/api/cart";

// ✅ Return plain headers object
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});

export const addToCart = async (item) => {
  try {
    const response = await axios.post(
      `${CART_API}/add`,
      item,
      { headers: getAuthHeaders() }
    );
    return response.data; // to get RestResponse
  } catch (err) {
    console.error("Failed to add to cart", err);
    throw err;
  }
};

export const getCart = async () => {
  try {
    const response = await axios.get(CART_API, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (err) {
    console.error("Failed to get cart", err);
    return [];
  }
};

export const updateCartItem = async (productId, quantity) => {
  try {
    await axios.put(
      `${CART_API}/update`,
      null,
      {
        headers: getAuthHeaders(),
        params: { productId, quantity }
      }
    );
  } catch (err) {
    console.error("Failed to update quantity", err);
  }
};

export const removeFromCart = async (productId) => {
  try {
    await axios.delete(
      `${CART_API}/remove/${productId}`,
      { headers: getAuthHeaders() }
    );
  } catch (err) {
    console.error("Failed to remove item", err);
  }
};

export const clearCart = async () => {
  try {
    await axios.post(
      `${CART_API}/clear`,
      null,
      { headers: getAuthHeaders() }
    );
  } catch (err) {
    console.error("Failed to clear cart", err);
  }
};
