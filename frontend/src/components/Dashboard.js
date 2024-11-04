// Dashboard.js
import React, { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { FiSearch, FiUser, FiBell } from 'react-icons/fi'; // Importing icons

import './styles.css';

const Dashboard = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("User"); // Placeholder until dynamically set
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar collapse state
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const goToProfileSettings = () => {
    navigate('/profile-settings');
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };


  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  return (
    <div className="dashboard">
 
      {/* Friends Sidebar */}
      <div className={`sidebar friends ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        <div className="sidebar-header">
          {!isSidebarCollapsed ? (
            <input 
              type="text" 
              placeholder="Search friends..." 
              className="search-bar" 
            />
          ) : (
            <button className="search-icon">
              <FiSearch size={20} />
            </button>
          )}
          <button className="toggle-button" onClick={toggleSidebar}>
            <FiUser size={20} />
          </button>
        </div>


        <div className="friend-list">
          <div className="friend-circle"></div>
          <div className="friend-circle"></div>
          <div className="friend-circle"></div>
          <div className="friend-circle"></div>
          <div className="friend-circle add-new">+</div>
        </div>

                {/* Profile Box */}
        <div className="profile-box" onClick={() => setShowDropdown(!showDropdown)}>
          <div className="profile-info">
            {/* <span className="username">{username}</span> */}
            <span className="profile-icon">
              {isSidebarCollapsed ? (
                <FiUser size={24} />
              ) : (
                <>
                  <FiUser size={24} />
                  <span className="username">{username}</span>
                </>
              )}
              </span>
          </div>
          {showDropdown && (
            <div className="dropdown">
              <button onClick={goToProfileSettings}>Profile Settings</button>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="main-content">
        <div className="header">
          <select className="group-select">
            <option>Group Alpha</option>
            <option>Group Beta</option>
            <option>Group Gamma</option>
          </select>
          <h3 className="group-name">Group Alpha</h3>
                    {/* Notifications Button */}
          <button className="notification-btn notifications-toggle" onClick={toggleNotifications}>
            <FiBell size={20} />
          </button>
        </div>
        <div className="message-area">
          <p>Messages will be here...</p>
        </div>
      </div>
      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notification-item">Notification 1</div>
          <div className="notification-item">Notification 2</div>
          <div className="notification-item">Notification 3</div>
        </div>
      )}
      {/* Right Sidebar */}
      <div className="sidebar notifications">
        <div className="notification-box"></div>
        <div className="notification-box"></div>
        <div className="notification-box"></div>
      </div>
    </div>
  );
};

export default Dashboard;
