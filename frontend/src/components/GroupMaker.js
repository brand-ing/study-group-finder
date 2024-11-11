import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import './styles.css';


const GroupMaker = () => {
  const [groupName, setGroupName] = useState('');
  const [subject, setSubject] = useState('');
  const [meetingTimes, setMeetingTimes] = useState([]);
  const [description, setDescription] = useState('');
  const [maxSize, setMaxSize] = useState(5); 
  
  const [isGroupCreated, setIsGroupCreated] = useState(false);  // To track if the group was created
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');  // To track any error message
  
  const navigate = useNavigate();
  const onCreateGroup = (groupData) => {

    // console.log("Group created successfully:", groupData);
    setSuccessMessage("Group created successfully!");
    // Redirect after a short delay
    setTimeout(() => {
      navigate('/dashboard/@me');
    }, 2000); // Redirect after 2 seconds

  };

  
  const handleMeetingTimeChange = (day) => {
    setMeetingTimes((prevTimes) =>
      prevTimes.includes(day)
        ? prevTimes.filter((time) => time !== day)
        : [...prevTimes, day]
    );
  };

  // Firebase function to add group to Firestore
  const addGroupToFirestore = async (groupData) => {
    try {
      // Get the current user's ID (assuming they are logged in and the user object is available)
      const userId = auth.currentUser ? auth.currentUser.uid : null;

      if (!userId) {
        console.error("User is not authenticated.");
        setErrorMessage("You must be logged in to create a group.");
        return;
      }
      // Create a new group document in Firestore
      const docRef = await addDoc(collection(db, "Groups"), {
        groupName: groupData.groupName,
        subject: groupData.subject,
        meetingTimes: groupData.meetingTimes,
        description: groupData.description,
        maxSize: groupData.maxSize,
        createdBy: userId,
        creationDate: serverTimestamp(),
        groupCategory: groupData.subject, // You can use the subject as the category
        members: [userId], // Initial member is the group creator
        groupAvatar: "", // Optional: you can add a default avatar or let the user upload one
        groupEvents: [] // Empty initially; events can be added later
      });

      const channelDocRef = await addDoc(collection(db, "Channels"),{
        groupName: groupData.groupName,
        groupID: docRef.id,
        creationDate: serverTimestamp(),
        pinnedMessageID: null,
        title: "General"
      });

      console.log("Group created with ID: ", docRef.id);

      // Call onCreateGroup with the newly created group data if needed
      onCreateGroup(groupData); // This function is optional depending on your UI structure

      // Optionally, you could reset form fields if desired
      setGroupName('');
      setSubject('');
      setMeetingTimes([]);
      setDescription('');
      setMaxSize(5);

    } catch (error) {
      console.error("Error adding group: ", error);
      setErrorMessage("There was an error creating the group. Please try again.");
    }
  };

  const handleSubmit = () => {
    const newGroup = {
      groupName,
      subject,
      meetingTimes,
      description,
      maxSize,
    };

    // Call Firebase function to add the group
    addGroupToFirestore(newGroup);
  };

  return (
    <div className="group-maker-container">
      <h2>Create a New Group</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <label>Group Name</label>
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Enter group name"
      />

      <label>Subject/Category</label>
      <select value={subject} onChange={(e) => setSubject(e.target.value)}>
        <option value="">Select a subject</option>
        <option value="math">Math</option>
        <option value="science">Science</option>
        <option value="history">History</option>
        <option value="programming">Programming</option>
        <option value="literature">Literature</option>
      </select>

      <label>Meeting Times</label>
      <div className="meeting-times">
        {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
          <label key={day}>
            <input
              type="checkbox"
              value={day}
              checked={meetingTimes.includes(day)}
              onChange={() => handleMeetingTimeChange(day)}
            />
            {day}
          </label>
        ))}
      </div>

      <label>Group Description (Optional)</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Briefly describe the group focus or goals"
        maxLength="200"
      />

      <label>Max Group Size</label>
      <input
        type="number"
        value={maxSize}
        onChange={(e) => setMaxSize(e.target.value)}
        min="2"
        max="10"
      />

      <button className="create-group-btn" onClick={handleSubmit}>
        Create Group
      </button>
    </div>
  );
};

export default GroupMaker;
