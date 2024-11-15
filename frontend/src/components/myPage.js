import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, updateDoc, getDocs, collection } from "firebase/firestore"; 
import { auth, db } from "./firebaseConfig"; 
import { GroupFinder } from './GroupFinder';
import CollapsibleSection from "./CollapsibleSection";

const MyPage = () => {
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null); // State for profile data
    const [loading, setLoading] = useState(true); // State for loading
    const [isEditing, setIsEditing] = useState(false); // Toggle edit mode
    const [formData, setFormData] = useState(null); // State for editable form data

    const [majors, setMajors] = useState([]);

  
    const goToDash = () => {
        try {
            navigate('/dashboard');
          } catch (error){
            console.error("Error loading page: ", error);
          }
    };

    const goToJoinGroup = () => {
        try {
            navigate('/join-group');
          } catch (error){
            console.error("Error loading page: ", error);
          }
    }

    const goToCreateGroup = () => {
        try {
            navigate('/create-group');
          } catch (error){
            console.error("Error loading page: ", error);
          }
    }


    useEffect(() => {
      const fetchData = async () => {
        try {
          // Fetch User Profile
          const user = auth.currentUser; // Get the authenticated user
          if (!user) {
            console.error("User not authenticated");
            return;
          }
    
          const profileRef = doc(db, "Profiles", user.uid); // Reference to user's profile
          const profileSnap = await getDoc(profileRef);
    
          if (profileSnap.exists()) {
            setProfile(profileSnap.data()); // Set the profile data
            setFormData(profileSnap.data()); // Initialize editable form data
          } else {
            console.error("No profile found for user:", user.uid);
          }
    
          // Fetch Majors
          const majorsCollection = collection(db, "Majors");
          const snapshot = await getDocs(majorsCollection);
          const majorsList = snapshot.docs.map((doc) => doc.data().name);
          setMajors(majorsList);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false); // Stop loading
        }
      };
    
      fetchData();
    }, []);
    

    if (loading) {
      return <p>Loading...</p>; // Display while data is being fetched
    }

    const handleSaveClick = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          console.error("User not authenticated");
          return;
        }
  
        const profileRef = doc(db, "Profiles", user.uid);
        await updateDoc(profileRef, formData); // Update Firestore with new data
        setProfile(formData); // Update local profile state
        console.log("Profile updated successfully!");
        setIsEditing(false); // Exit edit mode
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    };

    const handleEditClick = () => {
      setIsEditing(true); // Enable edit mode
    };
  
    const handleCancelClick = () => {
      setFormData(profile); // Reset form data to original profile
      setIsEditing(false); // Exit edit mode
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
    return (
        <div className="group-dashboard">
            <h1 className="welcome-header"> Edit Your Profile </h1>
            <div className="bento-grid">
                {/* Navigation Cards/Buttons */}

                <div className="nav-section">
                    <button className="nav-card join-button" onClick={goToJoinGroup}>
                        Join a Group
                    </button>
                    <button className="nav-card create-button" onClick={goToCreateGroup}>
                        Create a Group
                    </button>
                    {/* <button className="nav-card joined-button" onClick={goToJoinedGroups}>
                        Joined Groups
                    </button> */}
                {/* About Me */}
                <div className="section suggestions">
                {/* <p className="section-title">About Me</p> */}
<CollapsibleSection title="About Me">
      {isEditing ? (
        <div className="about-me">
          <label>
            Major:
                <select
            id="major"
            name="major"
            value={profile.major}
            onChange={handleInputChange} // Uses profile change handler
            required
          >
            <option value="">Change your major</option>
            {majors.map((major, index) => (
              <option key={index} value={major}>
                {major}
              </option>
            ))}
          </select>
          </label>
          <label>
            Year:
            <select id="year" name="year" value={profile.year} onChange={handleInputChange} required>
              <option value="">Select year</option>
              <option value="freshman">Freshman</option>
              <option value="sophomore">Sophomore</option>
              <option value="junior">Junior</option>
              <option value="senior">Senior</option>
              <option value="masters">Masters</option>
              <option value="phD">phD</option>
            </select>
          </label>
          <label>
            GPA:
            <input
              type="text"
              name="gpa"
              value={formData.gpa || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Department:
            <input
              type="text"
              name="department"
              value={formData.department || ""}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Learning Style:
            <input
              type="text"
              name="learningStyle"
              value={formData.learningStyle || ""}
              onChange={handleInputChange}
            />
          </label>
          <div className="button-container">
            <button onClick={handleSaveClick}>Save</button>
            <button onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>
      ) : (
        <div className="about-me">
          <p><strong>Major:</strong> {profile.major}</p>
          <p><strong>Year:</strong> {profile.year}</p>
          <p><strong>GPA:</strong> {profile.gpa}</p>
          <p><strong>Department:</strong> {profile.department}</p>
          <p><strong>Learning Style:</strong> {profile.learningStyle}</p>
          <button onClick={handleEditClick}>Edit</button>
        </div>
      )}
    </CollapsibleSection>
    </div>
                {/* Suggestions Section */}
                <div className="section suggestions">
                <p className="section-title">Suggestions</p>
                </div>

                {/* Notifications Section */}
                <div className="section notifications">
                <p className="section-title">Notifications</p>
                </div>

                {/* Friends Section */}
                <div className="section friends">
                <p className="section-title">Friends</p>
                </div>
                {/* Block List Section */}
                <div className="section block">
                <p className="section-title">Blocked</p>
                </div>
            </div>

            <div className="back-section">
                <button className="back-button" onClick={goToDash}>
                Back to Dashboard
                </button>
            </div>
    </div>
    </div>
  );
};

export default MyPage;