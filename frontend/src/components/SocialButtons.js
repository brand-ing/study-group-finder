import React from 'react';
import { FaGoogle, FaApple, FaGithub } from 'react-icons/fa';
import './SocialButtons.css';

const SocialButtons = () => {
  return (
    <div>
      <FaGoogle size={20} />
      <FaApple size={20} />
      <FaGithub size={20} />
    </div>
  );
};

export default SocialButtons;
