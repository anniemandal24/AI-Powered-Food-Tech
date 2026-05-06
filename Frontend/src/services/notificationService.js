import axios from "axios";

// Access the URL from your .env file
const NOTIF_URL = import.meta.env.VITE_API_NOTIFICATION_URL;

/**
 * Fetches the current user's notifications
 */
export const getNotifications = async () => {
    try {
        // Concatenate the base URL with the specific endpoint
        const response = await axios.get(`${NOTIF_URL}/notifications`, {
            withCredentials: true,
        });
        return response.data.data;
    } catch (error) {
        console.error("Error fetching notifications:", error);
        throw error;
    }
};

/**
 * Mark notifications as read
 */
export const markNotificationsAsRead = async () => {
    try {
        const response = await axios.patch(`${NOTIF_URL}/notifications/read`, {}, {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        throw error;
    }
};