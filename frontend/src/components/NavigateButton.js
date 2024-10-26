// NavigateButton.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const NavigateButton = ({ label, target }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(target);
  };

  return (
    <button onClick={handleClick} className="navigate-btn">
      {label}
    </button>
  );
};

export default NavigateButton;
