import React, { useState, useEffect } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db } from './firebaseConfig';
import { doc , updateDoc } from 'firebase/firestore';
import './styles.css';


const defaultAvatars = [
    '/images/avatar1.png',
    '/images/avatar2.png',
    '/images/avatar3.png',
    '/images/avatar4.png', 
  ];
  

const ProfilePictureSetup = ({ nextStep, currentStep, prevStep, setProfilePicture, setHighlightColor, name, setName, userId }) => {
  const [selectedAvatar, setSelectedAvatar] = useState(defaultAvatars[0]);
  const [image, setImage] = useState(null);
  const [highlightColor, setHighlightColorState] = useState('#FF6347'); 

  const storage = getStorage();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Update image preview
        setSelectedAvatar(null); // If custom image is selected, reset avatar selection
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarSelect = (avatar) => {
    setImage(null);
    setSelectedAvatar(avatar);
  };

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `profile-pictures/${userId}/${file.name}`);
    const uploadTask = await uploadBytes(storageRef, file);
    const fileURL = await getDownloadURL(uploadTask.ref);
    return fileURL;
  };

  const saveProfilePicture = async (selectedImage) => {
    const userDocRef = doc(db, 'users', userId);
    await updateDoc(userDocRef, { profilePicture: selectedImage });
    setProfilePicture(selectedImage);
  };

  const handleSave = async () => {
    if (image) {
      const file = dataURLToBlob(image);
      const imageUrl = await handleImageUpload(file);
      saveProfilePicture(imageUrl);
    } else {
      saveProfilePicture(selectedAvatar);
    }
    nextStep();
  };

  const dataURLToBlob = (dataUrl) => {
    const arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new Blob([u8arr], { type: mime });
  };

  const handleColorChange = (event) => {
    const color = event.target.value;
    setHighlightColorState(color); // Local state update
    setHighlightColor(color); // Update in parent component
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  useEffect(() => {
    setProfilePicture(selectedAvatar || image);
  }, [selectedAvatar, image, setProfilePicture]);

  return (
    <div className="profile-maker-container">
      <h2>Choose a profile picture</h2>
      <h3>(You can change this later in settings.)</h3>

      {/* Image preview with dynamic border color */}
        <div
        className="image-preview"
        style={{ borderColor: highlightColor }} // Apply border color dynamically here
        >
        {image ? (
          <img
            src={image}
            alt="Profile Preview"
            className="profile-image"
          />
        ) : (
          <img
            src={selectedAvatar}
            alt="Default Avatar"
            className="profile-image"
          />
        )}
      </div>
      <p>{name ? name : "Your Display Name"}</p>
      
      {/* Upload button */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* Avatar selection */}
      <div className="avatar-selection">
        <h3>Or choose from default avatars:</h3>
        <div className="avatars">
          {defaultAvatars.map((avatar, index) => (
            <img
              key={index}
              src={avatar}
              alt={`Avatar ${index + 1}`}
              className={`avatar ${selectedAvatar === avatar ? 'selected' : ''}`}
              onClick={() => handleAvatarSelect(avatar)}
            />
          ))}
        </div>
      </div>

      {/* Color picker */}
      <div className="color-picker-container">
        <label htmlFor="highlight-color">Choose your highlight color:</label>
        <input
          type="color"
          id="highlight-color"
          value={highlightColor}
          onChange={handleColorChange}
        />
      </div>

      {/* Next and back buttons */}
      <div className="button-group">
        <button className="next-btn" onClick={handleSave}>Next</button>
        <button className="back-btn" onClick={prevStep} disabled={currentStep === 0}>Back</button>
      </div>
    </div>
  );
};

export default ProfilePictureSetup;
