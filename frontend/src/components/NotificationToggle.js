import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaBell, FaBellSlash } from "react-icons/fa";

const NotificationToggle = () => {
  const [showNotifications, setShowNotifications] = useState(true);

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);

    // Show a test notification or disable toast when toggled
    if (!showNotifications) {
      toast.success("Notifications Enabled");
    } else {
      toast.info("Notifications Disabled");
    }
  };

  return (
    <div>
      {/* Toast Container */}
      <ToastContainer />

      {/* Notification Icon */}
      <div onClick={toggleNotifications} style={{ cursor: "pointer" }}>
        {showNotifications ? (
          <FaBell title="Disable Notifications" size={24} />
        ) : (
          <FaBellSlash title="Enable Notifications" size={24} />
        )}
      </div>
    </div>
  );
};

export default NotificationToggle;
