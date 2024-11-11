import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from './firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

import NavigateButton from './NavigateButton';
import PhoneNumberInput from './PhoneNumberInput';



const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [error, setErrors] = useState({});


  const handleRegister = async () => {
    try {
      // Generate a salt and hash the password before storing it
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create the user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Store the user data along with the hashed password in Firestore
      await setDoc(doc(db, 'Users', user.uid), {
        uid: user.uid,
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        phone_number: phoneNumber,
        password: hashedPassword, // Store the hashed password securely
        profileCompleted: false,
      });
      
      setMessage('Registration successful!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
    } catch (error) {
      console.error('Error registering user:', error);
      setMessage('An error occurred. Please try again later.');
    }
  };
  
  
  const [passwordValid, setPasswordValid] = useState({
  minLength: false,
  hasUpperCase: false,
  hasLowerCase: false,
  hasNumber: false,
  hasSpecialChar: false,
});

const [isCheckerVisible, setIsCheckerVisible] = useState(false);

const validatePassword = (password) => {
  setPasswordValid({
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*]/.test(password),
  });
};

const handlePasswordChange = (e) => {
  const value = e.target.value;
  setPassword(value);
  validatePassword(value);
};


const handlePhoneNumberChange = (formattedPhoneNumber) => {
  setPhoneNumber(formattedPhoneNumber);
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

    handleRegister();
};

return (
  <div className="register-page">
      <div className="title-container">
        <a href="/">
          <h1 className="title">Looking for Group?</h1>
        </a>
          <p className="tagline">A place where students come together and collaborate.</p>
      </div>
      <div className="form-container">
          <form onSubmit={handleSubmit}>
              <h2>Create Your Account</h2>
              {message && <p className="message">{message}</p>}
              <div className="input-group">
                  <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{ borderColor: error.firstName ? 'red' : '' }}
                  />
                  {error.firstName && <p className="error">{error.firstName}</p>}
              </div>

              <div className="input-group">
                  <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{ borderColor: error.lastName ? 'red' : '' }}
                  />
                  {error.lastName && <p className="error">{error.lastName}</p>}
              </div>

              <div className="input-group">
                  <input
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{ borderColor: error.email ? 'red' : '' }}
                  />
                  {error.email && <p className="error">{error.email}</p>}
              </div>

              <div className="input-group">
                  <PhoneNumberInput
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      style={{ borderColor: error.phoneNumber ? 'red' : '' }}
                  />
                  {error.phoneNumber && <p className="error">{error.phoneNumber}</p>}
              </div>

              <div className="password-container">
                  <input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      onFocus={() => setIsCheckerVisible(true)}
                      onBlur={() => setIsCheckerVisible(false)}
                      placeholder="Enter your password"
                      className="password-input"
                  />
                  {isCheckerVisible && (
                      <div className="password-checker">
                          <p>{passwordValid.minLength ? '✔️' : '❌'} Minimum 8 characters</p>
                          <p>{passwordValid.hasUpperCase ? '✔️' : '❌'} At least one uppercase letter</p>
                          <p>{passwordValid.hasLowerCase ? '✔️' : '❌'} At least one lowercase letter</p>
                          <p>{passwordValid.hasNumber ? '✔️' : '❌'} At least one number</p>
                          <p>{passwordValid.hasSpecialChar ? '✔️' : '❌'} At least one special character</p>
                      </div>
                  )}
              </div>

              <button type="submit" className="flame-button">Register</button>

          </form>
          <p>By signing up you agree to our Terms of Use and Privacy Policy</p>
          <NavigateButton label="Already have an account? Sign In" target="/login"/>

      </div>
  </div>
);
};

export default Register;
