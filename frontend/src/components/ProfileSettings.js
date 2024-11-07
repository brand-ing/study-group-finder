import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const ProfileSettings = () => {
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [password, setPassword] = useState('');

  const navigate = useNavigate();


  const handleSaveChanges = () => {
    // Logic to save changes (e.g., API calls or state updates)
    console.log("Changes saved!");
  };

  const handleDiscardChanges = () => {
    // Logic to discard changes (e.g., reset to initial values)
    setDisplayName('');
    setProfilePicture(null);
    setPassword('');
    console.log("Changes discarded!");
  };

  const handleProfilePictureChange = (e) => {
    setProfilePicture(URL.createObjectURL(e.target.files[0]));
  };

  const goBackToDashboard = () => {
    navigate("/dashboard"); 
  };

  return (
    <div className="profile-settings">
      <h2>Profile Settings</h2>
      
      <div className="profile-section">
        <h3>Profile Picture</h3>
        <div className="profile-picture-container">
          <img
            src={profilePicture || 'default-profile.png'}
            alt="Profile"
            className="profile-picture"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleProfilePictureChange}
          />
        </div>
        <h3>Display Name:</h3>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
      <h3>Password:</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {/* Notification Settings Section */}
      <div className="profile-section">
        <h3>Notification Settings</h3>
        <button className="notification-settings-button">
          Go to Notification Settings
        </button>
      </div>

      <div className="button-group">
        <button className="save-button" onClick={handleSaveChanges}>Save Changes</button>
        <button className="discard-button" onClick={handleDiscardChanges}>Discard Changes</button>
        <button className="back-button" onClick={goBackToDashboard}>Go Back</button>
      </div>
    </div>
  );
};

export default ProfileSettings;
