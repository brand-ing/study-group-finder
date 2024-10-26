// Dashboard.js
import React from 'react';
import './styles.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Friends Sidebar (Area 1) */}
      <div className="sidebar friends">
        <h3>Friends</h3>
        <div className="friend-circle"></div>
        <div className="friend-circle"></div>
        <div className="friend-circle"></div>
        <div className="friend-circle"></div>
      </div>

      {/* Main Chat Area (Area 2) */}
      <div className="main-content">
        <div className="header">
          <select className="group-select">
            <option>Group Alpha</option>
            <option>Group Beta</option>
            <option>Group Gamma</option>
          </select>
          <h3 className="group-name">Group Alpha</h3>
        </div>
        <div className="message-area">
          {/* Placeholder message box */}
          <p>Messages will be here...</p>
        </div>
      </div>

      {/* Notifications Sidebar (Area 3) */}
      <div className="sidebar notifications">
        <h3>Notifications</h3>
        <div className="notification-box"></div>
        <div className="notification-box"></div>
        <div className="notification-box"></div>
      </div>
    </div>
  );
};

export default Dashboard;
