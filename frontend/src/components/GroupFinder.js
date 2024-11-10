import React, { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaPlusCircle } from 'react-icons/fa';
import './styles.css';

const GroupFinder = ({ onJoinGroup, onCreateGroup }) => {
    const navigate = useNavigate(); // Hook for navigation
    
    const handleJoinGroup = () => {
        navigate('/join-group'); // Navigate to the Join Group page
    };
  
    const handleCreateGroup = () => {
        navigate('/create-group'); // Navigate to the Create Group page
    };
    
    return (
        <div className="group-choice-container">
            <h2>Find Your Group</h2>
            <div className="button-container">
                <div className="choice-option">
                    <button className="circle-btn" onClick={handleJoinGroup}>
                        <FaUsers className="icon" />
                    </button>
                    <p>Join a Group</p>
                </div>
                <div className="choice-option">
                    <button className="circle-btn" onClick={handleCreateGroup}>
                        <FaPlusCircle className="icon" />
                    </button>
                    <p>Create a Group</p>
                </div>
            </div>
        </div>
    );
};

// Define FindGroupFiller as a separate component
const FindGroupFiller = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/group-navigation'); // Adjust the path to the desired page
        }, 7000); // Adjust the timing as needed
        return () => clearTimeout(timer);
    }, [navigate]);
    
    return (
        <div className="filler-container">
            <h2>Let's Find You a Group!</h2>
            {/* Optional: Add a loading GIF or animation here */}
        </div>
    );
};

// Export both components
export { GroupFinder, FindGroupFiller };
