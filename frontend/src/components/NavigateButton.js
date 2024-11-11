
// NavigateButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css'

const NavigateButton = ({ label, target }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(target);
  };

  return (
    <button onClick={handleClick} className="navigate-btn simple-button">
      {label}
    </button>
  );
};

export default NavigateButton;
