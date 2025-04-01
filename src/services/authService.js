import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // Expecting { success: boolean, message: string }
  } catch (error) {
    return error.response?.data || { success: false, message: "Registration failed" };
  }
};

export const loginUser = async (loginData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, loginData);

    if (response.data.success) {
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("roles", JSON.stringify(response.data.roles || [])); // ✅ Store multiple roles
    }

    return response.data; // Expecting { success, roles, token }
  } catch (error) {
    return error.response?.data || { success: false, token: "Login failed." };
  }
};
