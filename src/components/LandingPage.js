import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

const LandingPage = () => {
    const navigate = useNavigate();
    return (
        <div>
            <nav>
            <h1>LFG!!!</h1>
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
                <p id="hero-what">LFG = Looking For Group</p>
                <p>LFG connects you with like-minded learners, helps you stay on track, and makes studying more productive and fun.</p>

                <h2 className="cta-statement">Let’s Forge Greatness!</h2> 
            </div>
            <p>GET YOUR A-Team Together</p>

            <h2>Features</h2>
                <h3>Connect Instantly with Classmates</h3>
                <p>Message your peers directly—quick, easy, and right when you need it. No more missed group messages!</p>
                <h3>Effortless File Sharing</h3>  
                <p>Share notes, slides, or project files without a hitch. Keep everyone on the same page with just a click.</p>
                <h3>Jump into the Discussion</h3>
                <p>Engage in group conversations to brainstorm, solve problems, and stay connected. Make every idea count!</p>
                <h3>Take the Pulse with Polls</h3>
                <p>Get instant feedback or make quick decisions with polls that keep your study group on track.</p>

            <footer>
                <p>Footer here.</p>
            </footer>
        </div>
    );
};

export default LandingPage;
