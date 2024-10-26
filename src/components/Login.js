import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import NavigateButton from './NavigateButton';
import SocialButtons from './SocialButtons';


const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin(); 
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <div>
    <div className="title-container">
      <a href="/">
        <h1>looking for group.</h1>
      </a>
    </div>
    <div className="container dark-mode">
      <form onSubmit={handleLogin}>
        <h2>Log into your account</h2>
        {error && <p className="error">{error}</p>}
        <h3>Email address</h3>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <h3>Password</h3>
        <div className="password-field">
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="forgot-text">Forgot?</p>
        </div>
        <button type="submit">Log in</button>
      </form>
      <NavigateButton label="Need an account? Register" target="/register" />
      <div className='icon-container'> 
        <p>Or continue with</p>
        <div className="icon">
          <SocialButtons />
        </div>
      </div>

    </div>
    </div>
    
  );
};

export default Login;
