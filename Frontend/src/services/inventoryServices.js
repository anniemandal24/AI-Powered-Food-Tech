import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_ITEM_URL;

// 1. Define the helper function at the top of the file
const getAuthHeaders = () => {
    const token = localStorage.getItem("accessToken");
    
    if (!token || token === "undefined") {
        return null; // Return null so methods know there's no auth
    }

    return {
        headers: { 
            Authorization: `Bearer ${token}` 
        },
    };
};

export const inventoryService = {
    getAllItems: async () => {
        const config = getAuthHeaders();
        
        // If no token, return empty array for guests
        if (!config) return [];

        try {
            const response = await axios.get(`${API_BASE_URL}/all`, config);
            return response.data.data;
        } catch (error) {
            console.error("Inventory Fetch Error:", error.response?.data || error.message);
            return []; 
        }
    },

    addItem: async (itemData) => {
        const config = getAuthHeaders();
        
        if (!config) {
            throw new Error("No valid authentication token found.");
        }

        try {
            // itemData is the body, config is the third argument containing headers
            const response = await axios.post(`${API_BASE_URL}/add-item`, itemData, config);
            return response.data;
        } catch (error) {
            console.error("Add Item Error:", error.response?.data || error.message);
            throw error; 
        }
    }
};