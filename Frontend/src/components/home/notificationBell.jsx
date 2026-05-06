import { useState, useContext } from 'react';
import { NotificationContext } from "../../context/notificationContext";
import { markNotificationsAsRead } from "../../services/notificationService"; // Import the service
import './notificationBell.css';

export default function NotificationBell() {
    // Destructure fetchNotifications from context so we can refresh the count
    const { notifications, unreadCount, fetchNotifications } = useContext(NotificationContext);
    const [isOpen, setIsOpen] = useState(false);

    // This function handles opening the menu AND marking items as read
    const handleToggle = async () => {
        const nextState = !isOpen;
        
        // If we are opening the menu and there are unread notifications
        if (nextState === true && unreadCount > 0) {
            try {
                await markNotificationsAsRead();
                await fetchNotifications(); // Refresh the badge count and list from server
            } catch (error) {
                console.error("Could not update notifications:", error);
            }
        }
        
        setIsOpen(nextState);
    };

    return (
        <div className="notification-container">
            {/* Change the onClick to use handleToggle */}
            <button className="bell-icon" onClick={handleToggle}>
                🔔 {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <h3>Notifications</h3>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <p className="empty-msg">No new alerts</p>
                        ) : (
                            notifications.map((notif) => (
                                // Use _id if your MongoDB uses that, otherwise keep notif.id
                                <div key={notif._id || notif.id} className={`notif-item ${notif.type}`}>
                                    <strong>{notif.title}</strong>
                                    <p>{notif.message}</p>
                                    <small>{new Date(notif.createdAt || notif.date).toLocaleString()}</small>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}