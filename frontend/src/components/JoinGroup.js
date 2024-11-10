import React, { useState } from 'react';


const suggestedGroups = [
    { id: 1, name: "Math Study Group", members: 12, description: "For calculus and algebra lovers" },
    { id: 2, name: "Physics Wizards", members: 8, description: "Dedicated to physics problems and discussions" },
    { id: 3, name: "Biology Buddies", members: 15, description: "Group for biology students" },
    // Add more groups as needed
  ];
  
  const JoinGroup = ({ onGroupSelect, onJoinWithCode }) => {
    const [groupCode, setGroupCode] = useState('');
  
    const handleJoinWithCode = () => {
      if (groupCode.trim()) {
        onJoinWithCode(groupCode);
      } else {
        alert("Please enter a valid code");
      }
    };
  
    return (
      <div className="join-group-container">
        <h2>Join a Group</h2>
  
        <section className="suggested-groups">
          <h3>Suggested Groups</h3>
          <div className="group-cards">
            {suggestedGroups.map((group) => (
              <div key={group.id} className="group-card" onClick={() => onGroupSelect(group.id)}>
                <h4>{group.name}</h4>
                <p>{group.description}</p>
                <span>{group.members} members</span>
              </div>
            ))}
          </div>
        </section>
  
        <section className="join-with-code">
          <h3>Have a Code?</h3>
          <input
            type="text"
            placeholder="Enter group code"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
          <button onClick={handleJoinWithCode}>Join with Code</button>
        </section>
      </div>
    );
  };

export default JoinGroup;
