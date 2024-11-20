import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const PollCreator = ({ newPoll }) => {
    const [options, setOptions] = useState(['']); // Start with one empty option field
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);

    // Add a new empty option input
    const addOptionField = () => setOptions([...options, '']);

    // Handle option text change
    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    // Submit the poll to Firestore
    const createPoll = async () => {
        try {
            if (options.some(option => option.trim() === '')) {
                setError('All options must be filled out.');
                return;
            }
            if (!startDate || !endDate) {
                setError('Start and end dates are required.');
                return;
            }

            const pollData = {
                options,
                votes: Array(options.length).fill(0), // Initialize vote counts to 0
                startDate: Timestamp.fromDate(new Date(startDate)),
                endDate: Timestamp.fromDate(new Date(endDate)),
                voted: [] //Stores user IDs, will be updated
            };

            const docRef = await addDoc(collection(db, 'Polls'), pollData);
            const newPollData = {
                ...pollData,
                PollID: docRef.id,
            };

            console.log("PollCreator: attempting to call parent function: " + JSON.stringify(newPoll) + "args: " + JSON.stringify(newPollData));
            newPoll(newPollData); // Call the parent’s function with poll data
            setError(null); // Clear error on success
            // Optionally reset the form
            setOptions(['']);
            setStartDate('');
            setEndDate('');
        } catch (err) {
            setError('Failed to create poll. Please try again.' + err);
        }
    };

    return (
        <div className="poll-creator">
            <h3>Create a New Poll</h3>
            <div className="poll-dates">
                <label>
                    Start Date:
                    <input
                        type="datetime-local"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </label>
                <label>
                    End Date:
                    <input
                        type="datetime-local"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </label>
            </div>

            <div className="poll-options">
                {options.map((option, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                ))}
                <button type="button" onClick={addOptionField} className="add-option">
                    + Add Option
                </button>
            </div>

            {error && <p className="error">{error}</p>}

            <button type="button" onClick={createPoll} className="submit-poll">
                Submit Poll
            </button>
        </div>
    );
};

export default PollCreator;
