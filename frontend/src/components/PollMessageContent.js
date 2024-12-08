import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, increment, onSnapshot } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const PollMessageContent = ({ pollDocId, currentUserUid }) => {
    const [pollData, setPollData] = useState(null);  // State to store poll data fetched from Firestore
    const [selectedOption, setSelectedOption] = useState(null);  // For selected option by user
    const [hasVoted, setHasVoted] = useState(false);  // For checking if user has voted
    const [results, setResults] = useState([]); // Votes results array from Firestore
    const [pollEnded, setPollEnded] = useState(false);

    // Fetch poll data from Firestore on initial render
    useEffect(() => {
        const fetchPollData = async () => {
            const pollDocRef = doc(db, 'Polls', pollDocId);
            const pollSnapshot = await getDoc(pollDocRef);

            if (pollSnapshot.exists()) {
                const data = pollSnapshot.data();
                setPollData(data);  // Set the poll data from Firestore
                setResults(data.votes);  // Initialize results with votes array from Firestore
                setHasVoted(data.voted.includes(currentUserUid)); // Check if current user has voted

                if (data.endDate && new Date() > data.endDate.toDate()) {
                    setPollEnded(true);
                }
            
            } else {
                console.error("Poll document not found");
            }
        };

        fetchPollData();
    }, [pollDocId, currentUserUid]);

    // Set up a real-time listener for changes to the poll document
    useEffect(() => {
        const pollDocRef = doc(db, 'Polls', pollDocId);

        const unsubscribe = onSnapshot(pollDocRef, (snapshot) => {
            if (snapshot.exists()) {
                const poll = snapshot.data();
                //  console.log("PollMessageContent: poll : " + JSON.stringify(poll));
                setResults(poll.votes);  // Update votes results
                // console.log("PollMessageContent: poll voted array: " + JSON.stringify(poll.voted));
                setHasVoted(poll.voted.includes(currentUserUid)); // Check if current user voted
                
                if (poll.endDate && new Date() > poll.endDate.toDate()) {
                    setPollEnded(true);
                }
            
            }
        });

        return unsubscribe; // Clean up listener on unmount
    }, [pollDocId, currentUserUid]);

    // Handle voting submission
    const submitVote = async () => {
        if (selectedOption === null || hasVoted || !pollData) return;

        const pollDocRef = doc(db, 'Polls', pollDocId);
        const updates = {};

        // Increment the vote count for the selected option
        updates[`votes.${selectedOption}`] = increment(1);
        // Add current user ID to the "voted" array to prevent multiple votes
        updates[`voted`] = [...pollData.voted, currentUserUid];

        try {
            await updateDoc(pollDocRef, updates);
        } catch (error) {
            console.error("Error submitting vote: ", error);
        }
    };

    // If pollData is not yet loaded, show a loading state
    if (!pollData) {
        return <div>Loading poll...</div>;
    }

    return (
        <div className="poll-message-content">
            <h4>{('title' in pollData) ? pollData.title : 'Poll'}</h4>
            {!hasVoted && !pollEnded ? (
                <div>
                    <div className="options">
                        {pollData.options.map((option, index) => (
                            <label key={index} className="poll-option">
                                <input
                                    type="radio"
                                    name="poll"
                                    value={index}
                                    onChange={() => setSelectedOption(index)}
                                    checked={selectedOption === index}
                                />
                                {option}
                            </label>
                        ))}
                    </div>
                    <button 
                        onClick={submitVote} 
                        className="submit-button" 
                        disabled={selectedOption === null || hasVoted}
                    >
                        Submit Vote
                    </button>
                </div>
            ) : (
                <div className="results">
                    <h5>{pollEnded ? "Poll Ended - Final Results:" : "Results:"}</h5>
                    {pollData.options.map((option, index) => (
                        <div key={index} className="result-item">
                            <span>{option}: </span>
                            <span>{results[index]} votes</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PollMessageContent;
