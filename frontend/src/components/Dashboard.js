// Dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { serverTimestamp, onSnapshot, doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, addDoc, getDoc, getDocs, setDoc, collection, query, where, orderBy, limit, QuerySnapshot, Timestamp} from 'firebase/firestore';
// import 'firebase/firestore'
import { auth, db, storage } from './firebaseConfig';
import { FiSearch, FiUser, FiBell, FiHome, FiChevronLeft, FiChevronRight, FiCoffee , FiHash, FiUsers , FiCalendar, FiFile } from 'react-icons/fi'; // Importing icons

import './styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Message from './Message';
// import GroupActivities from './GroupActivities';
import PollCreator from './PollCreator';
import PollMessageContent from './PollMessageContent.js';
import FriendList from './FriendList.js';

// file upload
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";



const notify = () => toast("Here is your toast.");

async function fetchFirestoreUserData(user) {
  var error,userData;
  try{
    var userDocRef = doc(db, 'Users', user.uid); // Use the UID instead of email
    var userDoc = await getDoc(userDocRef);
    userData = userDoc.data();
  } catch(err) {
    error = err;
  }
  return [userData, error];
}

async function fetchFirestoreDoc(ref) { //Why did I make this?
  var error,doc,docData;
  try{
    doc = await getDoc(ref);
    docData = doc.data();
  } catch(err) {
    error = err;
  }
  return [docData, error];
} 

async function addMessageToFirestore(msgCollection,uid,userDisplayName, content, replyToID, hasSpecial = false, specialData=null ) {
  var error,msgDocRef;
  try{
    msgDocRef = await addDoc(msgCollection,{
      timestamp: serverTimestamp(),
      content: content,
      replyToID: replyToID,
      uid: uid,
      userDisplayName: userDisplayName,
      lastChanged: serverTimestamp(),
      hasSpecial: hasSpecial,
      specialData: specialData
    });
  } catch(err) {
    error = err;
    console.log("msg send err:" + error + " specialData: " + specialData + JSON.stringify(specialData)); 
  }
  return [msgDocRef, error];
}

  

  
  
  
const Dashboard = () => {
  const [error, setError] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("User"); // Should be dynamically set now
  const [currentUser, setCurrentUser] = useState();
  const [userData , setUserData] = useState();
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Sidebar collapse state
  const [groupDataArray,setGroupDataArray] = useState();
  const [groupArray, setGroupArray] = useState([]);
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState();
  const [selectedChannel, setSelectedChannel] = useState();
  const [messages, setMessages] = useState();
  const [activeSection, setActiveSection] = useState('discussion');
  // put here to remove error message lol
  // i made a button... - Jamie 11/10
  const [messageText, setMessageText] = useState("");
  const [replyToID, setReplyToID] = useState(false);
  const [channelRef, setChannelRef] = useState();
  const [messageEditID, setMessageEditID] = useState(false);
  const [isRightSidebarCollapsed, setIsRightSidebarCollapsed] = useState(true);
  const [newPollData, setNewPollData] = useState(); 
  const [activeSideBar, setActiveSideBar] = useState('');

  const [groupActivitiesMenuOpen, setGroupActivitiesMenuOpen] = useState(false);
  const [currGroupData, setCurrGroupData] = useState();
  const [currGroupOwner, setCurrGroupOwner] = useState();
  const [currentFriend, setCurrentFriend] = useState(null);
  // const friendList = userData.friendList || [];
  const [friendList, setFriendList] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("User authenticated:" + uid);
        setCurrentUser(user);
        setUsername(user.email);
        async function fetchData() {
          const [data, error] = await fetchFirestoreUserData(user);
          setUserData(data);
          setError(error);
          if(error) {console.log(error)};

          var groups = [];
          var gdata = [];

          const numberGroups = ((data.groups && data.groups.length) ? data.groups.length : 0);

          for(var i = 0; i < numberGroups; i++) {
            let curr = await getDoc(data.groups[i])
            let currData = curr.data();
            // console.log("curr: " + JSON.stringify(currData));
            gdata.push(currData);
            groups.push(currData.groupName);
          }
          // console.log(gdata);
          setGroupArray(groups);
          setGroupDataArray(gdata);

          if('friendList' in data) {
            setFriendList(data.friendList);
          }
        };
        fetchData();
        // ...
      } else {
        // User is signed out
        // ...
        navigate('/login');
      }
      console.log("Auth state changed");
    });
    return unsubscribe;
  }, []);

  //Realtime updates for new messages from other users
  //https://firebase.google.com/docs/firestore/query-data/listen
  useEffect(() => {
    if(!channelRef) {return;}
    const q = query(collection(db, channelRef.path + "/Messages"), orderBy('timestamp'), limit(100));
    //Event Listener
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      //onSnapshot is fired immediately after local write, some data might be null
      //we don't want to render null stuff
      //https://firebase.google.com/docs/firestore/query-data/listen#events-local-changes
      const local = querySnapshot.metadata.hasPendingWrites; 
      
      if (!local) {updateMessages(querySnapshot)};
    });
    return unsubscribe;
  },[channelRef])



  // Putting event handlers for chat here for now...
  
  const handleFileUpload = async (groupId, userId) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "application/pdf,image/*";
  
    fileInput.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;
  
      try {
        const storageRef = ref(storage, `uploads/${groupId}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
  
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log("Upload is " + progress + "% done");
          },
          (error) => {
            console.error("Upload failed:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            console.log("File available at", downloadURL);
  
            // Reference to the group's uploads subcollection
            const uploadsCollectionRef = collection(db, "Groups", groupId, "uploads");
  
            await addDoc(uploadsCollectionRef, {
              url: downloadURL,
              name: file.name,
              uploadedBy: userId,
              uploadedAt: serverTimestamp(),
            });
  
            alert("File uploaded successfully!");
          }
        );
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    };
  
    fileInput.click();
  };
  
  async function handleSendMessage() {
    var txtToSend = messageText.trim();
    if(!txtToSend) {return;}
    if (!messageEditID) {
      // Logic for sending the message
      setMessageText(''); // Clear the input field
      var [msgDocRef, msgSendError] = await addMessageToFirestore(
        collection(db, channelRef.path + "/Messages"),
        currentUser.uid,
        userData.first_name,
        txtToSend,
        replyToID
      )
      setReplyToID(false);
      console.log("message submited: " + JSON.stringify(msgDocRef));
      var msgDoc = await getDoc(msgDocRef);
      var msgDocData = msgDoc.data()
      if(msgSendError) {
        console.log("failed to send msg with error:" + msgSendError)
      } else {console.log("sent message successfully")};
      
      //React re-renders when stateful variables change.
      //However, for things like arrays, this is not always intuitive
      //React needs to see a new reference to re-render.
      //A slice with no arguments does the trick.
      var updatedMessages = messages.slice(); 
      updatedMessages.push(
        {
          id: msgDoc.id,
          data: msgDocData,
          newlocal: true}
      );
      console.log("new sent msg: " + JSON.stringify({
        id: msgDoc.id,
        data: msgDocData,
        newlocal: true}));
      setMessages(updatedMessages);
    } else {
      setMessageText(''); 
      setReplyToID(false); //Note: Currently edits take priority over replies, needs proper state handling
      const msgCollection = collection(db, channelRef.path + "/Messages");
      const msgRef = doc(msgCollection, messageEditID);
      const msgDoc = await getDoc(msgRef)
      if(msgDoc.exists()) {
        var msgDocData = msgDoc.data();
        msgDocData.content = txtToSend;
        msgDocData.lastChanged = serverTimestamp();
        await setDoc(msgRef, msgDocData);
      } else {console.log("message to edit does not exist!")}

      var messageLocalIndex;
      var messageObjToUpdate = messages.filter((el, index) => {
        messageLocalIndex = index;
        return el.id == messageEditID;
      })
      // var messageLocalIndex = messages.indexOf(messageObjToUpdate) 
      // console.log(messageObjToUpdate);
      var updatedMessages = messages.slice();
      updatedMessages[messageLocalIndex].data.content = txtToSend;
      setMessages(updatedMessages);
      setMessageEditID(false);
    }
  };

  async function handleSendPollMessage(pollID) {
    var txtToSend = messageText.trim();

    var [msgDocRef, msgSendError] = await addMessageToFirestore(
      collection(db, channelRef.path + "/Messages"),
      currentUser.uid,
      userData.first_name,
      txtToSend,
      replyToID,
      true,
      {
        pollID: pollID
      }
    )
    console.log("Dashboard handleSendPollMessage: post message send attempt - " + JSON.stringify(msgDocRef) + " ; " + JSON.stringify(msgSendError));
    return [msgDocRef, msgSendError];
  }
  
  const toggleGroupActivities = () => {
    // Logic to open the group activities shelf
  };
  


  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const goToProfileSettings = () => {
    try {
      navigate('/profile-settings');
    } catch (error){
      console.error("Error loading page: ", error);

    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed); 
  };

  const toggleRightSidebar = () => {
    setIsRightSidebarCollapsed(!isRightSidebarCollapsed); 
  };


  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    toast("test notification"); // testing to see if a notification will appear if the bell icon is clicked
  };

  async function handleGroupChange(e){

    console.log("Group changed to:" + e.target.value)
    setSelectedGroup(e.target.value);
    setSelectedChannel(e.target.value);
    var groupData = groupDataArray.filter(function (el) {
      return el.groupName == e.target.value;
    })
    let currRef;


    //Whyyyyy
    currRef = (groupData.length > 0) ? groupData[0].channels[0] : null
    setCurrGroupData((groupData.length > 0) ? groupData[0] : null)

    //MESSY
    var groupData = (groupData.length > 0) ? groupData[0] : null;
    var groupOwnerRef = groupData.members[0];
    try{
      var groupOwnerDoc = await getDoc(groupOwnerRef);
    } catch(error) {
      console.log("could not retrieve group owner doc:" + error);
    }

    if(groupOwnerDoc) {setCurrGroupOwner(groupOwnerDoc.id)};


    console.log("groupData.members[0]:" + JSON.stringify(groupOwnerRef));


    // setChannelRef( currRef ); 
    handleChannelChange(currRef);
    //note: setstate functions are async, so there is no guarantee 
    //that they are set right after calling
    console.log("Group ref grabbed" + currRef + "; statevar: " + channelRef);

    // if (currRef != null) {
    //   const channelDataDoc =  await getDoc(currRef);
    //   const channelData = channelDataDoc.data()
    //   const channelSubCollection = collection(db, currRef.path + "/Messages");
    //   const q = query(channelSubCollection, orderBy('timestamp'), limit(100)); // grab last 100 messages 

    //   const channelMessagesSnapshot = await getDocs(q);
    //   console.log("channel msgs snapshot loaded:" + channelMessagesSnapshot);

    //   updateMessages(channelMessagesSnapshot);
    // } else {
    //   setError("Group has no channels!")
    //   setMessages([]);
    // };
  }
  async function handleChannelChange(ref) {
    setChannelRef(ref);

    if (ref != null) {
      try{
        const channelDataDoc =  await getDoc(ref);
        const channelData = channelDataDoc.data()
        const channelSubCollection = collection(db, ref.path + "/Messages");
        const q = query(channelSubCollection, orderBy('timestamp'), limit(100)); // grab last 100 messages 

        const channelMessagesSnapshot = await getDocs(q);
        console.log("channel msgs snapshot loaded:" + channelMessagesSnapshot);

        updateMessages(channelMessagesSnapshot);
      } catch(error) {
        console.log("handleChannelChange: failed to load channel messages - " + error);
      }
    } else {
      setError("Group has no channels!")
      setMessages([]);
    };
  }
  function updateMessages(qSnapshot) {
    var messageArray = [];
    var debugOutput = [];
    qSnapshot.forEach((doc) => {
      // console.log(doc.id, " => ", doc.data());
      debugOutput.push("updateMessages msgdoc: " + doc.id + " => " + JSON.stringify(doc.data()))
      messageArray.push({
        id: doc.id,
        data: doc.data(),
        newlocal: false}
      )
    })
    console.log(debugOutput);
    setMessages(messageArray)
  }



    
  function ChatMessage(props) {
    const { content, timestamp, uid, userDisplayName, replyToID } = props.message;
    var lastChanged = null;
    if ('lastChanged' in props.message && props.message.lastChanged) {
      lastChanged = props.message.lastChanged
      var lastChangedTime = lastChanged.toDate();
      var formattedLastChanged = lastChangedTime.toLocaleDateString() + ' ' + lastChangedTime.toLocaleTimeString()
    }
    const id = props.id;
    // console.log("timestamp " + timestamp + ";JSON string: " + JSON.stringify(timestamp));
    const time = timestamp.toDate();
    const formattedTime = time.toLocaleDateString() + ' ' + time.toLocaleTimeString();

    const messageClass = (uid === currentUser.uid) ? 'sender' : 'receiver';
    // gets stuck as pending until reloading group, dunno why, will look at later but not important.
    // const messageSubClass = (props.newlocal) ? 'pending' : ''; 
    const messageSubClass = '';

    var replyData;

    if(replyToID && replyToID != '' && channelRef) {
      let localFetchReplyToMessages = messages.filter((el) => (el.id == replyToID));
      replyData = localFetchReplyToMessages[0].data;
      // console.log("for reply " + replyToID + "<-" + id + ",got data:" + JSON.stringify(replyData));
    }

    // Refs for scrolling
    const messageRefs = useRef({});

    // Scroll handler, need to fix
    const scrollToMessage = (messageId) => {
        if (messageRefs.current[messageId]) {
            messageRefs.current[messageId].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    var pollID;
    //Poll
    if('specialData' in props.message && props.message.specialData != null){
      if('pollID' in props.message.specialData) {
        pollID = props.message.specialData.pollID;
      }
    };

    var groupOwner = currGroupOwner;

    return (<>
      <div className={`message-container ${messageClass} ${messageSubClass}`} id = {id}>
        {(replyToID && replyData) ? (
          <div 
              // key={reply.id} 
              className="reply-preview" 
              onClick={() => scrollToMessage(replyToID)} >
              <div className="reply-preview-content">
                ↪{replyData.content.slice(0, 50)}
              </div>
              <div className="reply-preview-time">
                  {(replyData.timestamp.toDate()).toLocaleTimeString()}
              </div>
          </div>
        ) : <></>}

        <div ref={el => messageRefs.current[id] = el} className="message-content">
            
            <div className="message-header">
              <div className="message-avatar">
                {/* <img src="avatar.png" alt="User Avatar" /> */}
              </div>
              <span className="message-username">{userDisplayName}</span>
              <span className="message-username">{uid == groupOwner ? <>(Owner)</> : <></>}</span>
              <span className="message-time">{formattedTime} 
                {(lastChanged && (time.getTime() != lastChangedTime.getTime())) ? <> - Edited {formattedLastChanged}</> : <></>}</span>
            </div>
            
            
            <div className="message-text">
              {content}
              {(pollID != null) ? <PollMessageContent pollDocId = {pollID} currentUserUid ={currentUser.uid}></PollMessageContent> : <></>}
            </div>

            

            {/* Hover buttons */}
            <div className="message-buttons">
              <button className="message-button" onClick={() => setReplyToID(id)}>
                Reply
              </button>
              {(uid === currentUser.uid) ? 
                <button className="message-button" onClick={() => setMessageEditID(id) }>
                  Edit 
                </button> : <></>
              }
              {(uid === currentUser.uid || currentUser.uid == groupOwner) ? 
                <button className="message-button" onClick={() => handleMessageDelete(id) }>
                  Delete
                </button> : <></>
              } 
              {/* maybe I should not be using ternary operators this way? - Jamie 11/10 */}
              {/* Add more buttons if needed */}
            </div>
        </div>
      </div>
    </>)
  }

  
  const GroupActivitiesSelector = () => {
    // const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleGroupActivities = () => {
      setGroupActivitiesMenuOpen(!groupActivitiesMenuOpen);
    };

    return (
      <div className="group-activities-container">
        {/* Group Activities Button */}
        <button className="group-activities-btn" onClick={toggleGroupActivities}>
          📚 {/* Replace with an icon if desired */}
        </button>

        {/* Pop-out menu */}
        {groupActivitiesMenuOpen && (
          <div className="group-activities-menu">
            <ul>
              <li onClick={() => {console.log("To-Do List selected")}}>To-Do List</li>
              <li onClick={() => {
                console.log("Poll selected");
                setActiveSideBar('poll');
                setIsRightSidebarCollapsed(false);
                }}>Poll</li>
              <li onClick={() => {console.log("Schedule an Event selected")}}>Schedule an Event</li>
            </ul>
          </div>
        )}
      </div>
    );
  };

  const goToDashboard = () => {
    navigate('/dashboard/@me'); // Navigate to the future activity dashboard page
  };

  const clearError = () => {
    setError(null);
  }

  async function handleNewPoll(newPoll) {
    console.log("Dashboard handleNewPoll: New poll " + newPoll.PollID + " detected:" + JSON.stringify(newPoll));
    setNewPollData(newPoll);
    var [msgDocRef, msgSendError] = await handleSendPollMessage(newPoll.PollID);
    console.log("Dashboard handleNewPoll: post message send attempt - " + JSON.stringify(msgDocRef) + " ; " + JSON.stringify(msgSendError));
  }

  async function handleMessageDelete(msgID) {
    const channelSubCollection = collection(db, channelRef.path + "/Messages");
    const docRef = doc(db,channelSubCollection.path + '/' + msgID);
    try {
      await deleteDoc(docRef);
    } catch(err) {
      console.log("handleMessageDelete: could not delete document " + msgID 
        + " due to error: " + JSON.stringify(err));
      console.log("handleMessageDelete: docref- " + JSON.stringify(docRef));
    }
  }

  // Firestore listener for friend requests
  useEffect(() => {
    if(!currentUser) {return}
    const unsubscribe = onSnapshot(doc(db, 'Users', currentUser.uid), (docSnapshot) => {
        const data = docSnapshot.data();
        if (data && data.friendRequests) {
            data.friendRequests.forEach(request => {
                toast.info(
                    <>
                        <p>{request.name} sent you a friend request</p>
                        <button onClick={() => acceptFriendRequest(request)}>Accept</button>
                    </>
                );
            });
        }
    });

    return unsubscribe;
  }, [currentUser]);

  // Function to accept a friend request
  const acceptFriendRequest = async (request) => {
      const userDocRef = doc(db, 'Users', currentUser.uid);
      try {
        addFriendToFirestore(request.uid);
          await updateDoc(userDocRef, {
              // friendList: arrayUnion(request.uid),
              friendRequests: arrayRemove(request)
          });
          toast.success(`You are now friends with ${request.name}`);
      } catch (error) {
          console.error("Error accepting friend request:", error);
      }
  };

  const handleAddFriendRequest = async (friendUid) => {
    if (friendUid === currentUser.uid) {
        toast.error("You cannot add yourself.");
        return;
    }

    const friendDocRef = doc(db, 'Users', friendUid);
    const currentUserDocRef = doc(db, 'Users', currentUser.uid);

    try {
        // Get the current user's name and other relevant data (assuming userData has name)
        const currentUserSnap = await getDoc(currentUserDocRef);
        const currentUserData = currentUserSnap.data();

        if (currentUserData) {
            await updateDoc(friendDocRef, {
                friendRequests: arrayUnion({
                    uid: currentUser.uid,
                    name: currentUserData.name // Assuming user's name is in userData
                })
            });
            toast.success("Friend request sent!");
        } else {
            toast.error("Failed to retrieve current user data.");
        }
    } catch (error) {
        console.error("Error sending friend request:", error);
        toast.error("Failed to send friend request.");
    }
  };


  // Function to add a friend by UID
  const addFriendToFirestore = async (friendUid) => {
      if (friendUid === currentUser.uid) {
          toast.error("You cannot add yourself.");
          return;
      }

      const userDocRef = doc(db, 'Users', currentUser.uid);
      const friendDocRef = doc(db, 'Users', friendUid);
      var channelDocRef = null;
      try{
        channelDocRef = await addDoc(collection(db, "Channels"),{
          groupName: null,
          groupID: null,
          creationDate: serverTimestamp(),
          pinnedMessageID: null,
          title: "General",
          isDirectMessageChannel: true,
          directMessageUserUids: [currentUser.uid,friendUid]
        });
      } catch(error) {
        console.error("Error adding friend: Error during channel creation:", error)
      }
      try {
          await updateDoc(userDocRef, {
              friendList: arrayUnion(friendUid),
              friendChannelList: arrayUnion(channelDocRef)
          });
          await updateDoc(friendDocRef, {
            friendList: arrayUnion(friendUid),
            friendChannelList: arrayUnion(channelDocRef)
        });
          toast.success("Friend added successfully!");
      } catch (error) {
          console.error("Error adding friend:", error);
      }
  };

async function handleFriendClick(id) {
  setCurrentFriend(id)
  var i = userData.friendList.indexOf(id);
  
  try{
    console.log("handleFriendClick: attempting to load DM channel for friend: " + id + ", index=" + i);
    setChannelRef(userData.friendChannelList[i]);
    const friendDoc = await getDoc(doc(db, 'Users', id))
    const friendData = friendDoc.data();
    const friendName = friendData.first_name;
    console.log("handleFriendClick: name=" + friendName);
    setSelectedChannel(friendName);
  }catch(error) {
    console.error("handleFriendClick: failed to load DM channel for friend" + id + ", index=" + i + "error: " + error);
  }
}

  return (
    <div className="dashboard">
      {error && 
        <div className="error">
          {error}
          <button className="dashboard-button" onClick={clearError}>
            Clear Error
          </button>
        </div>
      }
 
      {/* Friends Sidebar */}
      {/* Some of the formatting and indentation here scares me. */}
      <div className={`sidebar friends ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        <button className="dashboard-button" onClick={goToDashboard}>
          <FiHome className="button-icon" /> 
        </button>
        <select className="group-select" onChange={handleGroupChange} value={selectedGroup}>
            {/* {userData.groups ? userData.groups.map((item, index) => (
              <option>{item}</option>
            )) : <option>Failed to load</option>
            } */}
           {groupArray.map((el, index) => 
              React.createElement('option', { key: index }, el))}
          </select>
        <div className="sidebar-header">
          {!isSidebarCollapsed ? (
            <input 
              type="text" 
              placeholder="Search friends..." 
              className="search-bar" 
            />
          ) : (
            <button className="search-icon">
              <FiSearch size={20} />
            </button>
          )}
          <button onClick={toggleSidebar} className="toggle-button">
            {isSidebarCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
        </button>
        </div>


        {/* <div className="friend-list">
          <div className="friend-circle"></div>
          <div className="friend-circle"></div>
          <div className="friend-circle"></div>
          <div className="friend-circle"></div>
          <div className="friend-circle add-new">+</div>
        </div> */}

        <FriendList 
          friendList={friendList} 
          setCurrentFriend={handleFriendClick} 
          handleAddFriendRequest={handleAddFriendRequest} 
          sidebarOff={isSidebarCollapsed}
          setSideBar={setIsSidebarCollapsed}
        />

        {/* Profile Box */}
        <div className="profile-box" onClick={() => setShowDropdown(!showDropdown)}>
        <div className="profile-info">
    {isSidebarCollapsed ? (
      <FiUser size={24} />
    ) : (
      <>
        <img src={userData?.profilePicture} alt="Profile" className="profile-picture" />
        <div className="profile-text">
          <span className="first-name">{userData.first_name}</span>
          <span className="username">{username}</span>
        </div>
          </>
          )}
          </div>
          {showDropdown && (
            <div className="dropdown">
              <button onClick={goToProfileSettings}>Profile Settings</button>
              <button onClick={handleSignOut}>Sign Out</button>
            </div>
          )}
        </div>
      </div>

      
      {/* Main Chat Area */}
      <div className="main-content">
        <div className="header">
          <select className="group-select" onChange={handleGroupChange} value={selectedGroup}>
            {/* {userData.groups ? userData.groups.map((item, index) => (
              <option>{item}</option>
            )) : <option>Failed to load</option>
            } */}
           {groupArray.map((el, index) => 
              React.createElement('option', { key: index }, el))}
            <option>Group Alpha</option>
            <option>Group Beta</option>
            <option>Group Gamma</option>
          </select>
          <h3 className="group-name">{selectedChannel}</h3>
                    {/* Notifications Button */}
          <button className="notification-btn notifications-toggle" onClick={toggleNotifications}>
            <FiBell size={20} />
          </button>
          <ToastContainer />
          <ul className="section-nav">
            <li onClick={() => setActiveSection('discussion')} className={activeSection === 'discussion' ? 'active' : ''}>
              <FiCoffee  title="Discussion Board" />
            </li>
            <li onClick={() => setActiveSection('channels')} className={activeSection === 'channels' ? 'active' : ''}>
              <FiHash title="Channels" />
            </li>
            <li onClick={() => setActiveSection('classlist')} className={activeSection === 'classlist' ? 'active' : ''}>
              <FiUsers  title="Classlist" />
            </li>
            <li onClick={() => setActiveSection('calendar')} className={activeSection === 'calendar' ? 'active' : ''}>
              <FiCalendar title="Calendar" />
            </li>
            <li onClick={() => setActiveSection('file')} className={activeSection === 'file' ? 'active' : ''}>
              <FiFile title="Files" />
            </li>
          </ul>
        </div>
        <div className="message-area">
          {((messages && messages.length > 0) ? messages.map(msg => 
            <ChatMessage key={msg.id} id={msg.id} message={msg.data} newlocal={msg.newlocal} 
          />) : (<p>Messages will be here...</p>))}
        </div>
        
        <div className="chat-input-container">
        {/* File Upload Button */}
            <button className="file-upload-btn" onClick={handleFileUpload}>
            +  
            </button>
          {/* Message Input Field */}
          <input
            type="text"
            className="message-input"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' ? handleSendMessage() : null}
          />
          {/* Send Button */}
          <button className="send-btn" onClick={handleSendMessage}>
            {messageEditID ? <>Edit</> : <>Send</>} {/* Replace with an icon if desired */}
          </button>
          {messageEditID ? <button className="send-btn" onClick={() => {
            setMessageEditID(false);
            setMessageText('');
            }}>
            Cancel
          </button> : <></> }

          {/* Group Activities Button */}
          <GroupActivitiesSelector /> 
        </div>
      </div>

      {/* Right Sidebar */}
      <div className={`sidebar activities ${isRightSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
        <button onClick={toggleRightSidebar} className="toggle-button">
            {isRightSidebarCollapsed ? <FiChevronRight size={24} /> : <FiChevronLeft size={24} />}
        </button>
        {(!isRightSidebarCollapsed && activeSideBar == 'poll') ? <PollCreator newPoll={handleNewPoll}> new poll </PollCreator>: <></>}
      </div>

      {/* Notifications Dropdown */}
      {/* {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notification-item">Notification 1</div>
          <div className="notification-item">Notification 2</div>
          <div className="notification-item">Notification 3</div>
        </div>
      )} */}


      {/* Right Sidebar */}
      {/* <div className="sidebar notifications">
        <div className="notification-box"></div>
        <div className="notification-box"></div>
        <div className="notification-box"></div>
      </div> */}

    </div>
  );
};

export default Dashboard;
