import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { ReactComponent as Logo } from './img/lfg-logo.svg';

import Features from './Features';

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <nav>
                <Logo className="logo" /> 
                <ul>
                    <li>Features</li>
                    <li>Support</li>
                </ul>
                <div className="cta-buttons">
                    <button onClick={() => navigate('/login')} className="login-btn">Log In</button>
                    <button onClick={() => navigate('/register')} className="register-btn">Sign Up</button>
                </div>
            </nav>
            <div className="hero-section">
                <p id="hero-what">CONNECT WITH LEARNERS, STAY ON TRACK, AND MAKE STUDYING MORE FUN. </p>
                <button onClick={() => navigate('/register')} className="register-btn hero-btn">Sign Up Now </button>
                <h2 className="cta-statement">Let’s Forge Greatness!</h2> 
            </div>
                <Features />
                <h2 className="cta-statement"> GET YOUR A-Team Together TODAY </h2>
            <footer>
                <p>© 2024 Panther Pals</p>
            </footer>
        </div>
    );
};

export default LandingPage;
