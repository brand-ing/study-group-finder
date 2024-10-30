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
                <p id="hero-what">LFG = looking for group </p>
                <p>***LFG connects you with like-minded learners, helps you stay on track, and makes studying more productive and fun.***   </p>

                <h2 className="cta-statement">Let’s Forge Greatness!</h2> 
            </div>
            <h2>Features</h2>
                <Features />
                <h2 className="cta-statement"> GET YOUR A-Team Together TODAY </h2>
                <button onClick={() => navigate('/register')} className="register-btn">Sign Up</button>
            <footer>
                <p>Footer here.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
