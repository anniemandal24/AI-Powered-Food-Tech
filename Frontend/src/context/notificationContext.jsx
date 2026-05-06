import { createContext, useState, useEffect } from 'react';
import { getNotifications } from '../services/notificationService'; 

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications(); // Fetch from backend
            setNotifications(data);
            setUnreadCount(data.filter(n => !n.read).length);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    return (
        <NotificationContext.Provider value={{ notifications, unreadCount, fetchNotifications }}>
            {children}
        </NotificationContext.Provider>
    );
};