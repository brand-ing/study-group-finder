import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MemberList from './MemberList';
import { auth, db } from './firebaseConfig';
import { doc, getDoc, updateDoc, arrayRemove,  } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const GroupModeration = ({ }) => {
    const {groupId} = useParams();
    // const currentUser = auth.currentUser.uid;
    const [currentUser, setCurrentUser] = useState()
    const [groupData, setGroupData] = useState(null);
    const [membersData, setMembersData] = useState(null);
    const navigate = useNavigate();

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (!user) {
                console.warn("User is signed out. Redirecting to login.");
                navigate("/login");
                return;
            }
            setCurrentUser(user.uid);
        });

        return unsubscribe;
    },[])

    const test = async(ref) => {
        const doc = await getDoc(ref);
        if(!doc.exists()) {
            console.warn("User data not found for member ref", ref);
        }

        const userData = await doc.data()

        return(userData)
    }

    const loadMemberData = async(members) => {
        var memberDataWithIDs = [];
        var real = [];

        // members.map(async(ref, index) => {
        //     const doc = await getDoc(ref);
        //     if(!doc.exists()) {
        //         console.warn("User data not found for member ref", ref);
        //     }

        //     const userData = await doc.data()
        //     // console.log("pushing..:" + JSON.stringify({...userData, id: doc.id}))
        //     memberDataWithIDs.push({...userData, id: doc.id});

        // })

        for (var member of members) {
            const data  = test(member);
            memberDataWithIDs.push(data);
        }

        // for await (const member of memberDataWithIDs) {
        //     real.push(member);
        // }

        real = await Promise.all(memberDataWithIDs);
        console.log(real);

        // console.log(memberDataWithIDs)
        // memberDataWithIDs.array.forEach(element => {
        //     console.log("aah")
        // });

        try {

        } catch(error) {
            console.error('Error retrieve group members document data:', error);
            alert('Failed to load group members data.')
        }

        return real;
    }
    
    // useEffect(()=>{},[])
    // useEffect(()=>{
    //     const data = loadMemberData(members);
    //     setMemberData(data);
    //     console.log(data)
    // },[])

    // Fetch Group Data from Firestore
    const fetchGroupData = async () => {
        try {
            const groupRef = doc(db, 'Groups', groupId);
            const groupDoc = await getDoc(groupRef);
            if (groupDoc.exists()) {
                const data  = groupDoc.data();
                setGroupData(data);
                const retrievedMembersData = await loadMemberData(data.members);
                console.log("members data:",retrievedMembersData);
                console.log(retrievedMembersData.map(member => (member)))
                console.log([{num:1}, {num:2}, {num:3}].map(el => (el)))
                console.log(retrievedMembersData.length);
                setMembersData(retrievedMembersData);
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

    if (!groupData || !membersData) {
        return <p>Loading group details...</p>;
    }

    return (
        <div className="group-moderation">
            <h1>Group Moderation</h1>

            <MemberList
                members={membersData}
                groupOwner={groupData.createdBy}
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
