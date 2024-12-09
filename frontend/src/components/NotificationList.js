// NotificationList.js
import React from "react";
import NotificationItem from "./NotificationItem";

const NotificationList = ({ notifications }) => {
    if (!notifications.length) {
        return <p>No notifications found.</p>;
    }

    return (
        <ul className="notification-list">
            {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
            ))}
        </ul>
    );
};

export default NotificationList;
