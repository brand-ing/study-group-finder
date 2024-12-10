import React, { useEffect, useState } from 'react';
import MemberList from './MemberList';
import { db } from './firebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';

const GroupModeration = ({ groupId, currentUser }) => {
    const [groupData, setGroupData] = useState(null);

    // Fetch Group Data from Firestore
    const fetchGroupData = async () => {
        try {
            const groupRef = doc(db, 'Groups', groupId);
            const groupDoc = await getDoc(groupRef);
            if (groupDoc.exists()) {
                setGroupData(groupDoc.data());
            } else {
                console.error("Group doesn't exist.");
            }
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    };

    // Leave Group Logic
    const handleLeaveGroup = async () => {
        try {
            const groupRef = doc(db, 'Groups', groupId);
            await updateDoc(groupRef, {
                members: arrayRemove(currentUser),
            });
            alert('You left the group successfully!');
        } catch (error) {
            console.error('Error leaving group:', error);
            alert('Failed to leave group.');
        }
    };

    useEffect(() => {
        fetchGroupData();
    }, []);

    if (!groupData) {
        return <p>Loading group details...</p>;
    }

    return (
        <div className="group-moderation">
            <h1>Group Moderation</h1>

            <MemberList
                members={groupData.members}
                groupOwner={groupData.groupOwner}
                groupId={groupId}
                currentUser={currentUser}
            />

            <h2>Flagged Messages</h2>
            <ul className="flagged-messages">
                {groupData.flaggedMessages?.length ? (
                    groupData.flaggedMessages.map((msg, index) => (
                        <li key={index}>{msg}</li>
                    ))
                ) : (
                    <p>No flagged messages found.</p>
                )}
            </ul>

            <button className="leave-group-btn" onClick={handleLeaveGroup}>
                Leave Group
            </button>
        </div>
    );
};

export default GroupModeration;
