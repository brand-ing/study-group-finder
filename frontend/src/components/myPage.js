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
            <h1> Welcome, User! </h1>
            <div>
                <button onClick={goToDash}>
                    Back to Dashboard
                </button>
                <p>Navigation Cards/Buttons for Groups</p>
                <button onClick={goToJoinGroup}>
                    Join a Group
                </button>
                <button onClick={goToCreateGroup}>
                    Create a Group
                </button>
                <p>Suggestions</p>
                <p>Notifications</p>
                <p>Friends</p>
            </div>
        </div>
    );
}

export default MyPage;