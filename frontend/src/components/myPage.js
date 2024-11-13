import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { GroupFinder } from './GroupFinder';

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
        <div className="group-dashboard">
            <h1 className="welcome-header"> Welcome, User! </h1>
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