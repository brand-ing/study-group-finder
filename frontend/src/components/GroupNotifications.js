import React, { useState, useEffect } from "react";
import { getFirestore, collection, query, where, onSnapshot } from "firebase/firestore";

const GroupNotifications = ({ userId }) => {
    const [notifications, setNotifications] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const notificationsRef = query(
            collection(db, "Notifications"),
            where("userId", "==", userId)
        );

        const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
            const fetchedNotifications = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNotifications(fetchedNotifications);
        });

        return () => unsubscribe(); // Cleanup listener on component unmount
    }, [db, userId]);

    return (
        <div className="notifications">
            <h3>Your Notifications</h3>
            {notifications.length ? (
                notifications.map((notification) => (
                    <div className="notification-card" key={notification.id}>
                        <p>{notification.message}</p>
                        <small>{new Date(notification.timestamp.toDate()).toLocaleString()}</small>
                    </div>
                ))
            ) : (
                <p>No notifications yet.</p>
            )}
        </div>
    );
};

export default GroupNotifications;
