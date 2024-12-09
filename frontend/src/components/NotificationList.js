// NotificationList.js
import React from "react";

const NotificationList = ({ notifications }) => {
    return (
        <div className="notification-list">
            {notifications.length > 0 ? (
                notifications.map((note) => (
                    <div key={note.id} className="notification-item">
                        <p>
                            <strong>{note.type}: </strong>
                            {note.message}
                        </p>
                        {note.link && (
                            <a
                                href={note.link}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View File
                            </a>
                        )}
                    </div>
                ))
            ) : (
                <p className="empty-message">No notifications found.</p>
            )}
        </div>
    );
};

export default NotificationList;
