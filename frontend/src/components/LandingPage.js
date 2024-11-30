import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';
import { ReactComponent as Logo } from './img/lfg-logo.svg';
import 'react-toastify/dist/ReactToastify.css';


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

                <h2 className="cta-statement"> GET YOUR A-Team Together TODAY </h2>
            </div>
            <footer>
                <button onClick={() => navigate('/register')} className="register-btn">Sign Up</button>
                <p>© 2024 Panther Pals</p>
            </footer>
        </div>
        </div>
    );
};

export default LandingPage;
