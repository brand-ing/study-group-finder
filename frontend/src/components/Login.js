import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider , signInWithPopup} from 'firebase/auth';
import { doc, getDoc, setDoc  } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import NavigateButton from './NavigateButton';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Sign in the user
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Reference the user document in Firestore
      const userDocRef = doc(db, 'Users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // For first-time users, create the document with profileCompleted set to false
        await setDoc(userDocRef, { profileCompleted: false });
        navigate('/profile-maker'); // Redirect to profile setup page
      } else {
        // Existing user - check if profileCompleted is true or false
        const userData = userDoc.data();
        if (userData.profileCompleted) {
          navigate('/dashboard'); // Profile is complete, go to Dashboard
        } else {
          navigate('/profile-maker'); // Profile is incomplete, go to ProfileMaker
        }
      }
    } catch (err) {
      setError(err.message); // Set the error message for display
    }
  };


  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      navigate("/dashboard"); // Redirect after successful login
    } catch (error) {
      console.error("Error signing in with Google:", error.message);
    }
  };
  return (
    <div className='login-page'>
      <div className="title-container">
        <a href="/">
          <h1 className="title">Looking for Group?</h1>
        </a>
      </div>
      <div className="form-container ">
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
          <button type="submit" className="flame-button">Log in</button>
        </form>
        <NavigateButton label="Need an account? Register" target="/register" />
        <div className="icon-container"> 
          <p>Or continue with</p>
          <button className="google-signin-btn" onClick={signInWithGoogle}>
          Sign in with Google
        </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
