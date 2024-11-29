import React, { useEffect, useState } from 'react';
import { addDoc, collection, serverTimestamp, setDoc,getDoc, updateDoc, arrayRemove, arrayUnion, doc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
// import './FriendList.css';

const FriendList = ({ friendList, setCurrentFriend, handleAddFriendRequest, sidebarOff = true, setSideBar }) => {
    const [showInput, setShowInput] = useState(false);
    const [friendCode, setFriendCode] = useState('');
    const [pictures, setPictures] = useState([]);

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
                >
                    {/* Optionally, you can add a placeholder for friend profile picture */}
                    <img src={element.picURL} alt="Profile" className="profile-picture friend" />
                </div>
            ))}
            
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