import React, { useState } from "react";
import "./NotificationSettings.css"; // Link your styles here

const NotificationSettings = () => {
  const [settings, setSettings] = useState({
    groupInvites: true,
    directMessages: false,
    eventReminders: true,
    weeklySummary: false,
    systemUpdates: true,
  });

  const handleToggle = (setting) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [setting]: !prevSettings[setting],
    }));
  };

  return (
    <div className="notification-settings">
      <ul>
        {Object.keys(settings).map((setting) => (
          <li key={setting}>
            <label>
              <span>{formatLabel(setting)}</span>
              <input
                type="checkbox"
                checked={settings[setting]}
                onChange={() => handleToggle(setting)}
              />
              <span className="slider"></span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Helper function to format setting names
const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
};

export default NotificationSettings;
