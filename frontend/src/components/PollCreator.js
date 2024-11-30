import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { toast } from 'react-toastify';

const PollCreator = ({ onPollCreated, onClose }) => {
    const [options, setOptions] = useState(['']); // Start with one empty option field
    const [duration, setDuration] = useState({ months: 0, days: 0, hours: 0, minutes: 0 });
    const [error, setError] = useState(null);

    // Add a new empty option input
    const addOptionField = () => setOptions([...options, '']);

    // Handle option text change
    const handleOptionChange = (index, value) => {
        const updatedOptions = [...options];
        updatedOptions[index] = value;
        setOptions(updatedOptions);
    };

    // Handle duration input change
    const handleDurationChange = (field, value) => {
        const updatedDuration = { ...duration, [field]: Number(value) };
        setDuration(updatedDuration);
    };

    // Calculate end date from the current time and duration
    const calculateEndDate = () => {
        const now = new Date();
        now.setMonth(now.getMonth() + duration.months);
        now.setDate(now.getDate() + duration.days);
        now.setHours(now.getHours() + duration.hours);
        now.setMinutes(now.getMinutes() + duration.minutes);
        return now;
    };

    // Submit the poll to Firestore
    const createPoll = async () => {
        try {
            if (options.some(option => option.trim() === '')) {
                setError('All options must be filled out.');
                return;
            }
            if (
                !duration.months &&
                !duration.days &&
                !duration.hours &&
                !duration.minutes
            ) {
                setError('Please set a valid duration.');
                return;
            }

            const endDate = calculateEndDate();

            const pollData = {
                options,
                votes: Array(options.length).fill(0), // Initialize vote counts to 0
                startDate: Timestamp.fromDate(new Date()),
                endDate: Timestamp.fromDate(endDate),
                voted: [], // Stores user IDs
            };

            // Add the poll to the Firestore collection
            const docRef = await addDoc(collection(db, 'Polls'), pollData);

            // Notify success and pass the poll data to the parent component
            toast.success('Poll created successfully!');
            if (onPollCreated) {
                onPollCreated({
                    ...pollData,
                    PollID: docRef.id, // Add the Firestore document ID
                });
            }

            // Reset form state
            setError(null);
            setOptions(['']);
            setDuration({ months: 0, days: 0, hours: 0, minutes: 0 });
            onClose(); // Close the PollCreator after successful submission
        } catch (err) {
            console.error(err);
            setError('Failed to create poll. Please try again.');
        }
    };

    return (
        <div className="poll-creator">
            <h3>Create a New Poll</h3>

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

            <div className="poll-duration">
                <h4>Set Duration</h4>
                <div>
                    <label>
                        Months:
                        <input
                            type="number"
                            min="0"
                            value={duration.months}
                            onChange={(e) => handleDurationChange('months', e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Days:
                        <input
                            type="number"
                            min="0"
                            value={duration.days}
                            onChange={(e) => handleDurationChange('days', e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Hours:
                        <input
                            type="number"
                            min="0"
                            value={duration.hours}
                            onChange={(e) => handleDurationChange('hours', e.target.value)}
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Minutes:
                        <input
                            type="number"
                            min="0"
                            value={duration.minutes}
                            onChange={(e) => handleDurationChange('minutes', e.target.value)}
                        />
                    </label>
                </div>
            </div>

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
