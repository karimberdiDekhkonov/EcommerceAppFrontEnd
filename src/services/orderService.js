import axios from "axios";

const API_BASE = "http://localhost:8080/api";

// ✅ User endpoints
const ORDER_API = `${API_BASE}/orders`;

// ✅ Admin endpoints
const ADMIN_ORDER_API = `${API_BASE}/admin/orders`;

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

// ✅ User: Place new order
export const placeOrder = async (orderRequest) => {
  try {
    const response = await axios.post(
      ORDER_API,
      orderRequest,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to place order", err);
    throw err;
  }
};

// ✅ User: Get their own orders
export const getCustomerOrders = async () => {
  try {
    const response = await axios.get(ORDER_API, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch customer orders", err);
    return [];
  }
};

// ✅ User: Request refund
export const requestRefund = async (orderId) => {
  try {
    const response = await axios.post(
      `${ORDER_API}/${orderId}/request-refund`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to request refund", err);
    throw err;
  }
};

// ✅ Admin: Fetch all customer orders (paginated)
export const fetchAdminOrders = async (page = 0, size = 10) => {
  try {
    const response = await axios.get(ADMIN_ORDER_API, {
      headers: getAuthHeaders(),
      params: { page, size },
    });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch admin orders", err);
    return { content: [], totalPages: 0, number: 0 };
  }
};

// ✅ Admin: Confirm refund
export const confirmRefund = async (orderId) => {
  try {
    const response = await axios.post(
      `${ADMIN_ORDER_API}/${orderId}/confirm-refund`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (err) {
    console.error("Failed to confirm refund", err);
    throw err;
  }
};
