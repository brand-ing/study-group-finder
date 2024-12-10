import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp, setDoc,getDoc, updateDoc, arrayRemove, arrayUnion, doc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
// import './FriendList.css';

const FriendList = ({ friendList, setCurrentFriend, handleAddFriendRequest, sidebarOff = true, setSideBar }) => {
    const [showInput, setShowInput] = useState(false);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [friendCode, setFriendCode] = useState('');
    const [pictures, setPictures] = useState([]);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleAddFriendClick = () => {
        if(sidebarOff) {setShowInput(true)};
        if(sidebarOff) {
            setSideBar(true);
        }
        setShowInput((prev) => !prev);
    };

    const handleAddFriend = () => {
        if (friendCode.trim()) {
            handleAddFriendRequest(friendCode.trim());
            setFriendCode('');
            setShowInput(false);
        }
    };


    const retrievePictures = async () => {
        var updatedList = [];
        // friendList.forEach(element => {

        //     updatedList.push(currentData.profilePicture);
        // });
        for(const id of friendList) {
            const docSnap = await getDoc(doc(db,'Users',id));
            const data = docSnap.data();
            const picURL = ('profilePicture' in data ? data.profilePicture : '');
            // console.log();
            updatedList.push({
                id: id,
                picURL: picURL});
        }
        // console.log("picurls: " + JSON.stringify(updatedList));
        setPictures(updatedList);
        return updatedList;
    }

    // Invite Friend to Group
    const inviteFriendToGroup = async (friendId, groupId) => {
        try {
            const groupRef = doc(db, 'Groups', groupId);
            await updateDoc(groupRef, {
                members: arrayUnion(friendId),
            });
            alert('Friend invited successfully!');
            setShowContextMenu(false);
        } catch (error) {
            console.error('Error inviting friend:', error);
            alert('Failed to invite friend.');
        }
    };

    // Handle Right-Click on Friend
    const handleRightClick = (e, friendId) => {
        e.preventDefault();
        setSelectedFriend(friendId);
        setMenuPosition({ x: e.pageX, y: e.pageY });
        setShowContextMenu(true);
    };


    useEffect(() => {
        retrievePictures();
    },[friendList]);
    // retrievePictures();

    return (
        <div className="friend-list">
            {pictures.map((element) => (
                <div 
                    key={element.id} 
                    id={"friend_" + element.id}
                    className="friend-circle" 
                    onClick={() => setCurrentFriend(element.id)}
                    onContextMenu={(e) => handleRightClick(e, element.id)}
                >
                    {/* Optionally, you can add a placeholder for friend profile picture */}
                    <img src={element.picURL} alt="Profile" className="profile-picture friend" />
                </div>
            ))}
{showContextMenu && (
                <div
                    className="context-menu"
                    style={{
                        top: `${menuPosition.y}px`,
                        left: `${menuPosition.x}px`,
                    }}
                >
                    <p onClick={() => inviteFriendToGroup(selectedFriend, "testGroupID")}>
                        Invite to Group
                    </p>
                    <p onClick={() => setShowContextMenu(false)}>Cancel</p>
                </div>
            )}
            <div className="friend-circle add-new" onClick={handleAddFriendClick}>+</div>
            {showInput && (
                <div className="add-friend-input">
                    <input
                        type="text"
                        placeholder="Enter friend code"
                        value={friendCode}
                        onChange={(e) => setFriendCode(e.target.value)}
                    />
                    <span>Your code: {auth.currentUser.uid}</span>
                    <button onClick={handleAddFriend}>Add Friend</button>
                </div>
            )}
        </div>
    );
};

export default FriendList;