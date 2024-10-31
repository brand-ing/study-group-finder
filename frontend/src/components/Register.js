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

  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, 'Users', user.uid), {
        uid: user.uid,
        first_name: firstName,
        last_name: lastName,
        email_address: email,
        phone_number: phoneNumber,
      });
      
      setMessage('Registration successful!');
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhoneNumber('');
      setPassword('');
    } catch (error) {
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

const handlePhoneNumber = (e) => {
  const value = e.target.value;
  const formattedInputValue = getFormattedInputValue(value);
  setPhoneNumber(formattedInputValue);
  

}
const getFormattedInputValue = value => {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  let res = '';
  if (digits.length > 0){
    res = `${digits.slice(0, 3)}`;
  }
  if(digits.length >= 4){
    res = `(${res})${digits.slice(3,6)}`;
  }
  if(digits.length >= 7){
    res += `-${digits.slice(6)}`;
  }
  return res
}
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
  <div>
      <div className="title-container">
          <a href="/">
              <h1 className='title-long'>looking for group?</h1>
          </a>
      </div>
      <div className="container dark-mode">
          <form onSubmit={handleSubmit}>
              <h2>Register</h2>
              {message && <p className="message">{message}</p>}
              <input
                  type="text"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ borderColor: error.firstName ? 'red' : '' }}
              />
              {error.firstName && <p className="error">{error.firstName}</p>}

              <input
                  type="text"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ borderColor: error.lastName ? 'red' : '' }}
              />
              {error.lastName && <p className="error">{error.lastName}</p>}

              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ borderColor: error.email ? 'red' : '' }}
              />
              {error.email && <p className="error">{error.email}</p>}

              <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChange={handlePhoneNumber}
                  style={{ borderColor: error.phoneNumber ? 'red' : '' }}
              />
              {error.phoneNumber && <p className="error">{error.phoneNumber}</p>}

              <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                  style={{ borderColor: Object.values(passwordValid).includes(false) ? 'red' : 'green' }}
                  />
                  <p>Forgot?</p>
              {error.password && <p className="error">{error.password}</p>}
              <div className="password-checker">
                <p>{passwordValid.minLength ? '✔️' : '❌'} Minimum 8 characters</p>
                <p>{passwordValid.hasUpperCase ? '✔️' : '❌'} At least one uppercase letter</p>
                <p>{passwordValid.hasLowerCase ? '✔️' : '❌'} At least one lowercase letter</p>
                <p>{passwordValid.hasNumber ? '✔️' : '❌'} At least one number</p>
                <p>{passwordValid.hasSpecialChar ? '✔️' : '❌'} At least one special character</p>
            </div>

              <button type="submit">Register</button>
          </form>
          <p>By signing up you agree to our Terms of Use and Privacy Policy</p>
          <NavigateButton label="Already have an account? Sign In" target="/login" />
      </div>
  </div>
);
};


export default Register;
