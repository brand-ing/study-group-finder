import { useState } from 'react';
import './styles.css';

const GroupActivities = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleGroupActivities = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="group-activities-container">
      {/* Group Activities Button */}
      <button className="group-activities-btn" onClick={toggleGroupActivities}>
        📚 {/* Replace with an icon if desired */}
      </button>

      {/* Pop-out menu */}
      {isMenuOpen && (
        <div className="group-activities-menu">
          <ul>
            <li onClick={() => console.log("To-Do List selected")}>To-Do List</li>
            <li onClick={() => console.log("Poll selected")}>Poll</li>
            <li onClick={() => console.log("Schedule an Event selected")}>Schedule an Event</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default GroupActivities;
