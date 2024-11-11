import React from 'react';
import './styles.css'; // Make sure to import the CSS file for styling

const Features = () => {
  return (
    <div className="features-section">
      <h2>Features</h2>
      <div className="feature-container">
        <h3>Connect Instantly with Classmates</h3>
        <p>Message your peers directly—quick, easy, and right when you need it. No more missed group messages!</p>
      </div>
      <div className="feature-container">
        <h3>Effortless File Sharing</h3>  
        <p>Share notes, slides, or project files without a hitch. Keep everyone on the same page with just a click.</p>
      </div>
      <div className="feature-container">
        <h3>Jump into the Discussion</h3>
        <p>Engage in group conversations to brainstorm, solve problems, and stay connected. Make every idea count!</p>
      </div>
      <div className="feature-container">
        <h3>Take the Pulse with Polls</h3>
        <p>Get instant feedback or make quick decisions with polls that keep your study group on track.</p>
      </div>
      {/* Add more features here in similar containers */}
    </div>
  );
};

export default Features;
