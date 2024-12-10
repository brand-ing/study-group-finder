import React from 'react';
import { db } from './firebaseConfig';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';

const MemberList = ({ members, groupOwner, groupId, currentUser }) => {
    // Remove Member from Group
    const handleRemoveMember = async (memberId) => {
        if (memberId === groupOwner) {
            alert("You can't remove the group owner.");
            return;
        }

        try {
            const groupRef = doc(db, 'Groups', groupId);
            await updateDoc(groupRef, {
                members: arrayRemove(memberId),
            });
            alert('Member removed successfully!');
        } catch (error) {
            console.error('Error removing member:', error);
            alert('Failed to remove member.');
        }
    };

    return (
        <div className="member-list">
            <h2>Group Members</h2>
            {members.map((member) => (
                <div key={member.id} className="member-item">
                    <p>{member.name || "Unnamed User"}</p>

                    {/* Only the group owner can remove members */}
                    {currentUser === groupOwner && (
                        <button
                            className="remove-btn"
                            onClick={() => handleRemoveMember(member.id)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}
        </div>
    );
};

export default MemberList;
