import React, { useState, useEffect } from 'react';

// Sample components for each step
const WelcomeMessage = ({ nextStep }) => (
  <div>
    <h1>Welcome!</h1>
    <p>Let’s set up your account!</p>
    <button onClick={nextStep}>Next</button>
  </div>
);

const ProfileName = ({ name, setName, nextStep }) => (
  <div>
    <h2>What’s your display name?</h2>
    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
    <button onClick={nextStep}>Next</button>
  </div>
);

const GenderSelector = ({ nextStep }) => (
  <div>
    <h2>Select your gender:</h2>
    <label>
      <input type="radio" name="gender" value="male" /> Male
    </label>
    <label>
      <input type="radio" name="gender" value="female" /> Female
    </label>
    <label>
      <input type="radio" name="gender" value="non-binary" /> Non-binary
    </label>
    <button onClick={nextStep}>Next</button>
  </div>
);


// Main Profile Maker Component
const ProfileMaker = () => {
    const [currentStep, setCurrentStep] = useState(0);
    const [name, setName] = useState('');
    
    const nextStep = () => {
        setCurrentStep((prevStep) => prevStep + 1);
      };
      
    const steps = [
        <WelcomeMessage nextStep={nextStep} />,
        <ProfileName name={name} setName={setName} nextStep={nextStep} />,
        <GenderSelector nextStep={nextStep} />,
        // Add other components for subsequent steps
    ];
    
    useEffect(() => {
    // Optionally auto-transition after a few seconds
    if (currentStep === 0) {
      const timer = setTimeout(() => {
        nextStep();
      }, 3000); // Change 3000 to whatever duration you want (in ms)

      return () => clearTimeout(timer); // Cleanup on unmount
    }
  }, [currentStep]);

  return (
    <div>
      {steps[currentStep]}
    </div>
  );
};

export default ProfileMaker;
