import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_ANALYTICS_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem("accessToken");

  if (!token || token === "undefined") {
    return null;
  }

  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const analyticsService = {
  // GET analytics report
  getAnalytics: async ({ userId, startDate, endDate }) => {
    const config = getAuthHeaders();

    if (!config) return null;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/get-analytics/${userId}`,
        { startDate, endDate },
        config
      );
      return response.data.data;
    } catch (error) {
      console.error("Get Analytics Error:", error.response?.data || error.message);
      return null;
    }
  },

  // SAVE analytics report
  saveAnalytics: async ({ userId, startDate, endDate, description }) => {
    const config = getAuthHeaders();

    if (!config) {
      throw new Error("No valid authentication token found.");
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/save-analytics/${userId}`,
        { startDate, endDate, description },
        config
      );
      return response.data;
    } catch (error) {
      console.error("Save Analytics Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // DELETE analytics report
  deleteAnalytics: async (analyticsId) => {
    const config = getAuthHeaders();

    if (!config) {
      throw new Error("No valid authentication token found.");
    }

    try {
      const response = await axios.delete(
        `${API_BASE_URL}/delete-analytics/${analyticsId}`,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Delete Analytics Error:", error.response?.data || error.message);
      throw error;
    }
  },

  // EDIT analytics report - only description
  editAnalytics: async (analyticsId, description) => {
    const config = getAuthHeaders();

    if (!config) {
      throw new Error("No valid authentication token found.");
    }

    try {
      const response = await axios.put(
        `${API_BASE_URL}/edit-analytics/${analyticsId}`,
        { description },
        config
      );
      return response.data;
    } catch (error) {
      console.error("Edit Analytics Error:", error.response?.data || error.message);
      throw error;
    }
  }
};