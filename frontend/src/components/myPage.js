import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MyPage = () => {
    const navigate = useNavigate();
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
    return (
        <div>
            <h1 className="welcome-header"> Welcome, User! </h1>
            <div className="nav-section">
                <p>Navigation Cards/Buttons for Groups</p>
                <div className="group-buttons">
                    <button className="nav-card" onClick={goToJoinGroup}>
                        Join a Group
                    </button>
                    <button className="nav-card" onClick={goToCreateGroup}>
                        Create a Group
                    </button>
                </div>
            </div>
                <div className="section">
                    <p className="section-title">Suggestions</p>
                </div>

                <div className="section">
                    <p className="section-title">Notifications</p>
                </div>

                <div className="section">
                    <p className="section-title">Friends</p>
                </div>
                <div>
                    <button className="back-button" onClick={goToDash}>
                        Back to Dashboard
                    </button>
                </div>
        </div>
    );
}

export default MyPage;