import React, { useRef } from 'react';

const PhoneNumberInput = ({ value, onChange }) => {
  const inputRef = useRef(null);

  const handlePhoneNumber = (e) => {
    const input = e.target;
    const { selectionStart } = input;
    const digits = e.target.value.replace(/\D/g, "").slice(0, 10);

    // Apply the formatting based on digit length
    let formattedValue = '';
    if (digits.length > 0) {
      formattedValue = `(${digits.slice(0, 3)}`;
    }
    if (digits.length >= 4) {
      formattedValue += `) ${digits.slice(3, 6)}`;
    }
    if (digits.length >= 7) {
      formattedValue += `-${digits.slice(6)}`;
    }

    // Calculate the new cursor position based on the length difference
    const newCursorPosition = 
      selectionStart + (formattedValue.length - e.target.value.length);

    // Update value and cursor position
    onChange(formattedValue);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
      }
    }, 0);
  };

  return (
    <input
      type="text"
      ref={inputRef}
      value={value}
      onChange={handlePhoneNumber}
      placeholder="(###) ###-####"
      maxLength="14" // Limiting to standard U.S. phone number length
    />
  );
};

export default PhoneNumberInput;
