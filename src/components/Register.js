import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebaseConfig';
import NavigateButton from './NavigateButton';



const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('User registered successfully');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
        <h1>looking for group.</h1>
    <div className="container dark-mode">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
      </form>
      <p>By signing up you agree to our Terms of Use and Privacy Policy</p>
      <NavigateButton label="Already have an account? Sign In" target="/login" />

    </div>
    </div>
  );
};

export default Register;
