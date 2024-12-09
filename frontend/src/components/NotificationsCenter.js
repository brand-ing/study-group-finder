// NotificationCenter.js
import React, { useState, useEffect } from "react";
import {
    getFirestore,
    collection,
    query,
    onSnapshot,
    orderBy,
} from "firebase/firestore";
import NotificationFilters from "./NotificationFilters";
import NotificationList from "./NotificationList";
import "./Notification.css";

const NotificationCenter = ({ initialNotifications = [] }) => {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [filter, setFilter] = useState("ALL");

    const db = getFirestore();

    // Load Notifications in Real-Time from Firestore
    useEffect(() => {
        if (initialNotifications.length > 0) {
            setNotifications(initialNotifications);
            setFilteredNotifications(initialNotifications);
        } else {
            const notificationsRef = query(
                collection(db, "Notifications"),
                orderBy("timestamp", "desc")
            );

            const unsubscribe = onSnapshot(notificationsRef, (snapshot) => {
                const loadedNotifications = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setNotifications(loadedNotifications);
                setFilteredNotifications(loadedNotifications);
            });

            return () => unsubscribe();
        }
    }, [db, initialNotifications]);

    // Filter Notifications Based on Type
    const applyFilter = (filterType) => {
        setFilter(filterType);
        if (filterType === "ALL") {
            setFilteredNotifications(notifications);
        } else {
            setFilteredNotifications(
                notifications.filter((n) => n.type === filterType)
            );
        }
    };

    return (
        <div className="notification-center">
            <h2>Notifications</h2>
            <NotificationFilters currentFilter={filter} onFilterChange={applyFilter} />
            <NotificationList notifications={filteredNotifications} />
        </div>
    );
};

export default NotificationCenter;