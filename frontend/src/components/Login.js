import React, { useState } from 'react';
import { signInWithEmailAndPassword, GoogleAuthProvider , signInWithPopup} from 'firebase/auth';
import { doc, getDoc,  } from 'firebase/firestore';
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
      const user = userCredential.user; // Get user data from Firebase

      //onLogin(); // Call the onLogin callback

      // Check if the user document exists
      const userDocRef = doc(db, 'Users', user.uid); // Use the UID instead of email
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // First-time user if document does not exist
        navigate('/profile-maker');
        await db.collection('Users').doc(user.uid).set({ firstLoginCompleted: true });
      } else {
        navigate('/dashboard'); // Existing users go to Dashboard
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
