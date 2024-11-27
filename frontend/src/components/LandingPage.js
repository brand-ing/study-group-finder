import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { ReactComponent as Logo } from './img/lfg-logo.svg';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Features from './Features';

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <nav>
                <Logo className="logo" /> 
                <ul>
                    <li>Features</li>
                    <li onClick={() => navigate('/support')}>Support</li>
                </ul>
                <div className="cta-buttons">
                    <button onClick={() => navigate('/login')} className="login-btn">Log In</button>
                    <button onClick={() => navigate('/register')} className="register-btn">Sign Up</button>
                </div>
            </nav>
            <div className="hero-section">
                <div className="hero-content">
                    <p id="hero-what">CONNECT WITH LEARNERS, STAY ON TRACK, AND MAKE STUDYING MORE FUN.</p>
                    <button onClick={() => navigate('/register')} className="register-btn hero-btn">Sign Up Now</button>
                    <h2 className="cta-statement">Let's Forge Greatness!</h2>
                </div>
                <img 
                    src="/images/study-group.png" 
                    alt="Students studying together" 
                    className="hero-image"
                />
            </div>
            <div className='features-section'>
                <Features />
                <h2 className="cta-statement"> GET YOUR A-Team Together TODAY </h2>
            </div>
            <footer>
                <button onClick={() => navigate('/register')} className="register-btn">Sign Up</button>
                <p>© 2024 Panther Pals</p>
            </footer>
        </div>
    );
};

export default LandingPage;
