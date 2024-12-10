import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { toast } from 'react-toastify';
import './styles.css';

const PollCreator = ({ onPollCreated, onClose }) => {
    const [pollQuestion, setPollQuestion] = useState('');
    const [options, setOptions] = useState(['']);
    const [endDate, setEndDate] = useState('');
    const [error, setError] = useState(null);

    // Add new empty option
    const addOptionField = () => setOptions([...options, '']);

    // Handle option change
    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    // Submit poll
    const createPoll = async () => {
        try {
            if (!pollQuestion.trim()) {
                setError('Poll question is required.');
                return;
            }

            if (options.some(option => option.trim() === '')) {
                setError('All options must be filled out.');
                return;
            }

            if (!endDate) {
                setError('Please select a valid end date and time.');
                return;
            }

            const pollData = {
                pollQuestion,
                options,
                votes: Array(options.length).fill(0), // Initialize votes
                startDate: Timestamp.fromDate(new Date()),
                endDate: Timestamp.fromDate(new Date(endDate)),
                voted: [], // Prevent duplicate voting
            };

            const docRef = await addDoc(collection(db, 'Polls'), pollData);

            toast.success('Poll created successfully!');
            if (onPollCreated) {
                onPollCreated({
                    ...pollData,
                    pollId: docRef.id, // Firestore doc ID
                });
            }

            // Reset form state
            setError(null);
            setPollQuestion('');
            setOptions(['']);
            setEndDate('');
            onClose(); // Close the creator form
        } catch (err) {
            console.error(err);
            setError('Failed to create poll. Please try again.');
        }
    };

    return (
        <div className="poll-creator">
            <h3>Create a New Poll</h3>

            <label>Poll Question:</label>
            <input
                type="text"
                placeholder="Enter your poll question"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
            />

            <div className="poll-options">
                <h4>Poll Options:</h4>
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

            <label>Poll End Date & Time:</label>
            <input
                type="datetime-local"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
            />

            {error && <p className="error">{error}</p>}

            <div className="poll-creator-buttons">
                <button type="button" onClick={createPoll} className="submit-poll">
                    Submit Poll
                </button>
                <button type="button" onClick={onClose} className="cancel-poll">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PollCreator;
