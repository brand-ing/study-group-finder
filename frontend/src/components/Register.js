import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';

import NavigateButton from './NavigateButton';



const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setErrors] = useState({});

  const handleRegister = async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log(user);
      // Add user data to Firestore with the new syntax
      await setDoc(doc(db, 'Users', user.uid), {
        uid: user.uid,
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        phone_number: phoneNumber,
      });
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };
  
  const handleSubmit = async(e) => {
    e.preventDefault();
    // reset errors
    setErrors({});
    setMessage('');

    // Simple validation
    const newErrors = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    // Simulate an API call to register the user
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ firstName, email, password }),
        });

        if (response.ok) {
          setMessage('Registration successful!');
          // Clear the fields
          handleRegister(email, password);
          setFirstName('');
          setLastName('');
          setEmail('');
          setPhoneNumber('');
          setPassword('');
          // Optionally, redirect to another page
          // window.location.href = '/login'; // or use history.push('/login') with React Router
      } else {
          // Handle server errors
          const errorData = await response.json();
          setMessage(errorData.message || 'Registration failed.');
      }
  } catch (error) {
      setMessage('An error occurred. Please try again later.');
  }
};

  return (
    <div>
      <div className="title-container">
        <a href="/">
          <h1 className='title-long'>looking for group?</h1>
        </a>
      </div>
    <div className="container dark-mode">
      <form onSubmit={handleSubmit}>
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
          type="phone number"
          placeholder="phone number"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Register</button>
        {message && <p>{message}</p>}
      </form>
      <p>By signing up you agree to our Terms of Use and Privacy Policy</p>
      <NavigateButton label="Already have an account? Sign In" target="/login" />

    </div>
    </div>
  );
};

export default Register;
