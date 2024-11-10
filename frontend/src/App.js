import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import './components/styles.css';
import LandingPage from './components/LandingPage';
import ProfileMaker from './components/ProfileMaker';
import Dashboard from './components/Dashboard';
import MyPage from './components/myPage';
import ProfileSettings from './components/ProfileSettings';
import JoinGroup from './components/JoinGroup';
import GroupMaker from './components/GroupMaker';
import {FindGroupFiller, GroupFinder, GroupNavigation} from './components/GroupFinder'

function App() {
  const handleLoginSuccess = () => {
    console.log("User logged in successfully!");
    // Add any additional logic you need here
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile-maker" element={<ProfileMaker />} />
          <Route path="/dashboard/@me" element={<MyPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile-settings" element={<ProfileSettings />} />
          <Route path="/join-group" element={<JoinGroup />} />
          <Route path="/create-group" element={<GroupMaker />} />
          <Route path="/group-hub" element={<GroupFinder />} />
          <Route path="/group-navigation" element={<FindGroupFiller />} />

        </Routes>
      </div>  
    </Router>
  );
}

export default App;