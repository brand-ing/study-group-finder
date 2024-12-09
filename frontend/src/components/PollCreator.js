import React, { useState } from 'react';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { db } from './firebaseConfig';
import { toast } from 'react-toastify';


const PollCreator = ({ onPollCreated, onClose }) => {
    const [options, setOptions] = useState(['']); // Start with one empty option field

    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    const defaultStartDate = now.toISOString().slice(0,16);

    var nowPlusOnehour = new Date(now.getTime());
    nowPlusOnehour.setTime(nowPlusOnehour.getTime() + (1*60*60*1000)); //add one hour
    const defaultEndDate = nowPlusOnehour.toISOString().slice(0,16);

    const [startDate, setStartDate] = useState(defaultStartDate);
    const [endDate, setEndDate] = useState(defaultEndDate);
    const [error, setError] = useState(null);
    const [title, setTitle] = useState('');

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
                voted: [], //Stores user IDs, will be updated
                title: title,
            };

            const docRef = await addDoc(collection(db, 'Polls'), pollData);

            console.log("PollCreator: attempting to call parent function: " + JSON.stringify(onPollCreated));
            // Notify success and pass the poll data to the parent component
            toast.success('Poll created successfully!');
            if (onPollCreated) {
                onPollCreated({
                    ...pollData,
                    pollID: docRef.id, // Add the Firestore document ID
                });
            }
            setError(null); // Clear error on success
            // Optionally reset the form
            setOptions(['']);
            setStartDate('');
            setEndDate('');
            if(onClose) {
                onClose();
            }
        } catch (err) {
            setError('Failed to create poll. Please try again.' + err);
        }
    };

    return (
        <div className="poll-creator">
            <h3>Create a New Poll</h3>
            <div>
                <input
                    key="title"
                    type="text"
                    placeholder={`Enter title...`}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
            </div>
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
