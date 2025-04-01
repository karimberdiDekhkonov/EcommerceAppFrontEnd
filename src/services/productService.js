import axios from "axios";

const API_BASE = "http://localhost:8080/api";

// ✅ User/public URLs
const PUBLIC_PRODUCTS_URL = `${API_BASE}/products/available`;
const CATEGORY_URL = `${API_BASE}/products/categories`;

// ✅ Admin URLs
const ADMIN_BASE = `${API_BASE}/admin/products`;
const IMAGE_UPLOAD_URL = `${ADMIN_BASE}/save-with-images`;
const ADMIN_PRODUCTS_URL = `${ADMIN_BASE}/all`;
const TOGGLE_AVAILABILITY_URL = `${ADMIN_BASE}`;

// ✅ Auth headers
const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`
});


// ✅ Admin: Fetch paginated product list
export const fetchProducts = async (page = 0, size = 10, sort = "name,asc") => {
  try {
    const response = await axios.get(
      `${ADMIN_PRODUCTS_URL}?page=${page}&size=${size}&sort=${sort}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching products (admin):", error);
    return { content: [], totalPages: 0 };
  }
};

// ✅ Public: Fetch available products with filters
export const fetchAvailableProducts = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  try {
    const response = await axios.get(
      `${PUBLIC_PRODUCTS_URL}?${query}`,
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching available products:", error);
    return { content: [], totalPages: 0, number: 0 };
  }
};

// ✅ Admin: Fetch single product (you might add a route if needed)
export const fetchProduct = async (id) => {
  try {
    const response = await axios.get(`${ADMIN_BASE}/${id}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

// ✅ Categories: Public
export const fetchCategories = async () => {
  try {
    const response = await axios.get(CATEGORY_URL, {
      headers: getAuthHeaders()
    });
    return response.data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

// ✅ Admin: Save product with images
export const saveProductWithImages = async (productData) => {
  const formData = new FormData();

  const productJson = JSON.stringify({
    name: productData.name,
    price: productData.price,
    description: productData.description,
    category: productData.category,
    amountLeft: productData.amountLeft,
    available: productData.available ?? true
  });

  formData.append("product", new Blob([productJson], { type: "application/json" }));

  if (productData.images?.length) {
    productData.images.forEach((image) => {
      if (image instanceof File) {
        formData.append("images", image);
      }
    });
  }

  try {
    const response = await axios.post(IMAGE_UPLOAD_URL, formData, {
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "multipart/form-data"
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error saving product with images:", error);
    throw new Error(error.response?.data || "Failed to save product.");
  }
};

// ✅ Admin: Toggle availability
export const toggleAvailability = async (id) => {
  try {
    const response = await axios.patch(
      `${TOGGLE_AVAILABILITY_URL}/${id}/toggle-availability`,
      {},
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error("Error toggling availability:", error);
    throw error;
  }
};
