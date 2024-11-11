import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { arrayUnion,updateDoc, serverTimestamp, onSnapshot, doc, addDoc, getDoc, getDocs, setDoc, collection, query, where, orderBy, limit, QuerySnapshot, Timestamp} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';


const defaultGroups = [
    { id: 1, name: "Math Study Group", members: 12, description: "For calculus and algebra lovers" },
    { id: 2, name: "Physics Wizards", members: 8, description: "Dedicated to physics problems and discussions" },
    { id: 3, name: "Biology Buddies", members: 15, description: "Group for biology students" },
    // Add more groups as needed
  ];

  
  // const JoinGroup = ({ onGroupSelect, onJoinWithCode }) => { //dunno if we want to pass in these functions programmatically
const JoinGroup = () => {
    const [groupCode, setGroupCode] = useState('');
    const [suggestedGroups, setSuggestedGroups] = useState(defaultGroups);
    const [currentUser, setCurrentUser] = useState();
    const navigate = useNavigate();

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if(user) {setCurrentUser(user);}
        updateSuggested(user);
      });

      return unsubscribe;
    })

    const updateSuggested = async (user) => {
      // const user = currentUser;
      const uid = user.uid;
      // console.log(user.uid);
      const userDocRef = doc(db, 'Users', uid); 
      const userDoc = await getDoc(userDocRef);
      const userDocData = userDoc.data();
      const groupColl = collection(db,'Groups');
      const q = query(groupColl);
      const qSnapshot = await getDocs(q);
      var docsData = [];
      qSnapshot.forEach((doc) => {
        docsData.push({
          id : doc.id,
          data : doc.data()
        })
        // console.log("retrieved grp:" + doc.id);
      })

      var newGroupsData = docsData.filter((obj) => {
        console.log("group category: " + obj.data.groupCategory);
        var condition = userDocData.selectedInterests.includes(obj.data.groupCategory);
        console.log("condition" + condition);
        return (condition)
        // console.log()
      })

      console.log(newGroupsData);
      var newGroups=[];
      defaultGroups.forEach((obj) => {
        newGroups.push(obj)
      })
      newGroupsData.forEach((obj) => {
        newGroups.push({
          id: obj.id,
          description: obj.data.description,
          members: obj.data.maxSize,
          name: obj.data.groupName
        })
      })
      setSuggestedGroups(newGroups);
      console.log("Groups updated");
    }
  
    const handleJoinWithCode = () => {
      if (groupCode.trim()) {
        onJoinWithCode(groupCode);
      } else {
        alert("Please enter a valid code");
      }
    };

    const onGroupSelect = async (groupId) => {
      // Here, implement the logic for joining the group by ID
      const user = currentUser;

      var userDocRef = doc(db, 'Users', user.uid);
      var groupDocRef = doc(db, 'Groups', groupId);
  
      const updateUser = await updateDoc(doc(db,"Users",user.uid),
        {groups: arrayUnion(groupDocRef)}
      );
  
      const updateGroup = await updateDoc(doc(db,"Groups",groupId),
        {members: arrayUnion(userDocRef)}
      );

      alert(`Joined group with ID: ${groupId}`);
      try {
        navigate("/dashboard");
      } catch(err) {

      }
    };
  
    const onJoinWithCode = (code) => {
      // Add logic to verify the code and join the group if valid
      alert(`Attempting to join with code: ${code}`);
      // For now, treat group IDs as group codes :)
      onGroupSelect(code);
    };
  
    // updateSuggested();
    return (
      <div className="join-group-container">
        <h2>Join a Group</h2>
  
        <section className="suggested-groups">
          <h3>Suggested Groups</h3>
          <div className="group-cards">
            {suggestedGroups.map((group) => (
              <div key={group.id} className="group-card" onClick={() => onGroupSelect(group.id)}>
                <h4>{group.name}</h4>
                <p>{group.description}</p>
                <span>{group.members} members</span>
              </div>
            ))}
          </div>
        </section>
  
        <section className="join-with-code">
          <h3>Have a Code?</h3>
          <input
            type="text"
            placeholder="Enter group code"
            value={groupCode}
            onChange={(e) => setGroupCode(e.target.value)}
          />
          <button onClick={handleJoinWithCode}>Join with Code</button>
        </section>
      </div>
    );
  };

export default JoinGroup;
