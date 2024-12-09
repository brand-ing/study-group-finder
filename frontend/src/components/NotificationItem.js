// NotificationItem.js
import React from "react";
import { getFirestore, doc, deleteDoc } from "firebase/firestore";

const NotificationItem = ({ notification }) => {
    const db = getFirestore();

    const handleDelete = async () => {
        try {
            await deleteDoc(doc(db, "Notifications", notification.id));
            console.log("Notification deleted");
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const handleViewDetails = () => {
        if (notification.type === "EVENTS" || notification.type === "TO-DOs") {
            alert(`Viewing details for: ${notification.title}`);
        }
    };

    return (
        <li className={`notification-item ${notification.type.toLowerCase()}`}>
            <div className="notification-content" onClick={handleViewDetails}>
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <small>
                    {new Date(notification.timestamp.toDate()).toLocaleString()}
                </small>
            </div>
            <button className="delete-btn" onClick={handleDelete}>
                x
            </button>
        </li>
    );
};

export default NotificationItem;
