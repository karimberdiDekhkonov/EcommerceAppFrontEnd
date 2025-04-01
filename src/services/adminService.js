import axios from "axios";

const API_URL = "http://localhost:8080/api/admin";

const getAuthHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

// ✅ Export the function correctly
export const inviteAdmin = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/add?email=${encodeURIComponent(email)}`,
      {},
      getAuthHeaders()
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Failed to send invitation." };
  }
};

// ✅ Ensure registerAdmin is correctly exported
export const registerAdmin = async (adminData) => {
  try {
    const response = await axios.post(
      `${API_URL}/register?token=${adminData.token}`,
      {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        password: adminData.password,
      },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    return error.response?.data || { success: false, message: "Registration failed." };
  }
};
