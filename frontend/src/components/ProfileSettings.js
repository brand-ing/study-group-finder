import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, updateProfile, updatePassword } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { FaPencilAlt } from 'react-icons/fa';
import './styles.css';

const ProfileSettings = () => {
  const [displayName, setDisplayName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [password, setPassword] = useState('');
  const [userId, setUserId] = useState(null);
  const [isEditingDisplayName, setIsEditingDisplayName] = useState(false);

  const navigate = useNavigate();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUserId(user.uid);
      loadProfile(user.uid);
    }
  }, []);

  const loadProfile = async (uid) => {
    const userDoc = doc(db, 'users', uid);
    const docSnap = await getDoc(userDoc);
    if (docSnap.exists()) {
      const userData = docSnap.data();
      setDisplayName(userData.displayName || '');
      setProfilePicture(userData.profilePicture || 'default-profile.png');
    } else {
      console.log("No such document!");
    }
  };

  const handleSaveChanges = async () => {
    const user = auth.currentUser;
    if (userId) {
      const userDoc = doc(db, 'users', userId);
      await updateDoc(userDoc, {
        displayName,
        profilePicture,
      });

      await updateProfile(user, { displayName });

      if (password) {
        await updatePassword(user, password);
      }

      console.log("Changes saved!");
      alert("Profile updated successfully!");
      setIsEditingDisplayName(false);
    }
  };

  const handleDiscardChanges = () => {
    loadProfile(userId);
    setPassword('');
    setIsEditingDisplayName(false);
    console.log("Changes discarded!");
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setProfilePicture(e.target.result);
      reader.readAsDataURL(file);
    }
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
        <div className="display-name-container">
          {isEditingDisplayName ? (
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="profile-input"
            />
          ) : (
            <span>{displayName}</span>
          )}
          <button
            className="edit-button"
            onClick={() => setIsEditingDisplayName(!isEditingDisplayName)}
          >
            <FaPencilAlt />
          </button>
        </div>

        <h3>Password:</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="profile-input"
        />
      </div>

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
