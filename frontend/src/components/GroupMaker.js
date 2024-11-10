import React, { useState } from 'react';
import './styles.css';



const GroupMaker = ({ onCreateGroup }) => {
    const [groupName, setGroupName] = useState('');
    const [subject, setSubject] = useState('');
    const [meetingTimes, setMeetingTimes] = useState([]);
    const [description, setDescription] = useState('');
    const [maxSize, setMaxSize] = useState(5); // Default to 5 members
  
    const handleMeetingTimeChange = (day) => {
      setMeetingTimes((prevTimes) =>
        prevTimes.includes(day)
          ? prevTimes.filter((time) => time !== day)
          : [...prevTimes, day]
      );
    };
  
    const handleSubmit = () => {
      const newGroup = {
        groupName,
        subject,
        meetingTimes,
        description,
        maxSize,
      };
      onCreateGroup(newGroup);
      // Reset form fields if desired
      setGroupName('');
      setSubject('');
      setMeetingTimes([]);
      setDescription('');
      setMaxSize(5);
    };
  
    return (
      <div className="group-maker-container">
        <h2>Create a New Group</h2>
  
        <label>Group Name</label>
        <input
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
          placeholder="Enter group name"
        />
  
        <label>Subject/Category</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          <option value="">Select a subject</option>
          <option value="math">Math</option>
          <option value="science">Science</option>
          <option value="history">History</option>
          <option value="programming">Programming</option>
          <option value="literature">Literature</option>
          {/* Add more subjects as needed */}
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