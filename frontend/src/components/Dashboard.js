// Dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { serverTimestamp, onSnapshot, doc, addDoc, getDoc, getDocs, setDoc, collection, query, where, orderBy, limit, QuerySnapshot, Timestamp} from 'firebase/firestore';
// import 'firebase/firestore'
import { auth, db, storage } from './firebaseConfig';
import { FiSearch, FiUser, FiBell, FiHome, FiChevronLeft, FiChevronRight, FiCoffee , FiHash, FiUsers , FiCalendar, FiFile } from 'react-icons/fi'; // Importing icons

import './styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Message from './Message';
import GroupActivities from './GroupActivities';

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

  async function addMessageToFirestore(msgCollection,uid,userDisplayName, content, replyToID ) {
    var error,msgDocRef;
    try{
      msgDocRef = await addDoc(msgCollection,{
        timestamp: serverTimestamp(),
        content: content,
        replyToID: replyToID,
        uid: uid,
        userDisplayName: userDisplayName,
        lastChanged: serverTimestamp()
      });
    } catch(err) {
      error = err;
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
  const [messages, setMessages] = useState();
  const [activeSection, setActiveSection] = useState('discussion');
  // put here to remove error message lol
  // i made a button... - Jamie 11/10
  const [messageText, setMessageText] = useState("");
  const [replyToID, setReplyToID] = useState(false);
  const [groupChannelRef, setGroupChannelRef] = useState();
  const [messageEditID, setMessageEditID] = useState(false);

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
          console.log(gdata);
          setGroupArray(groups);
          setGroupDataArray(gdata);

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
    if(!groupChannelRef) {return;}
    const q = query(collection(db, groupChannelRef.path + "/Messages"), orderBy('timestamp'), limit(100));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      //TODO: find out how/where a SnapshotMetadata instance is returned
      // const source = doc.metadata.hasPendingWrites ? "Local" : "Server"; 
      updateMessages(querySnapshot);
    });
    return unsubscribe;
  },[])



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
        collection(db, groupChannelRef.path + "/Messages"),
        currentUser.uid,
        userData.first_name,
        txtToSend,
        replyToID
      )
      setReplyToID(false);
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
          data: msgDocData}
      );
      setMessages(updatedMessages);
    } else {
      setMessageText(''); 
      setReplyToID(false); //Note: Currently edits take priority over replies, needs proper state handling
      const msgCollection = collection(db, groupChannelRef.path + "/Messages");
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


  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    toast("test notification"); // testing to see if a notification will appear if the bell icon is clicked
  };

  async function handleGroupChange(e){

    console.log(e.target.value)
    setSelectedGroup(e.target.value);
    var groupData = groupDataArray.filter(function (el) {
      // console.log(el + ":" + el.title + "==" + e.target.value);
      return el.groupName == e.target.value;
    })
    let currRef;
    console.log(groupData[0]);
    
    console.log(groupData.length > 0);
    currRef = (groupData.length > 0) ? groupData[0].channels[0] : null
    console.log(currRef);
    setGroupChannelRef( currRef ); 
    //note: setstate functions are async, so there is no guarantee 
    //that they are set right after calling
    console.log(groupChannelRef);
    // var messageArray= [];

    if (currRef != null) {
      const channelDataDoc =  await getDoc(currRef);
      const channelData = channelDataDoc.data()
      const channelSubCollection = collection(db, currRef.path + "/Messages");
      const q = query(channelSubCollection, orderBy('timestamp'), limit(100)); // grab last 100 messages 
      console.log(channelSubCollection);
      console.log(channelData);
      console.log(q);
      const channelMessagesSnapshot = await getDocs(q);
      console.log(channelMessagesSnapshot);
      // channelMessagesSnapshot.forEach((doc) => {
      //   console.log(doc.id, " => ", doc.data());
      //   messageArray.push({
      //     id: doc.id,
      //     data: doc.data()}
      //   )
      // })
      updateMessages(channelMessagesSnapshot);
    } else {
      setError("Group has no channels!")
      setMessages([]);
    };

    // setMessages(messageArray);

  }

  function updateMessages(qSnapshot) {
    var messageArray = [];
    qSnapshot.forEach((doc) => {
      console.log(doc.id, " => ", doc.data());
      messageArray.push({
        id: doc.id,
        data: doc.data()}
      )
    })
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
  const time = timestamp.toDate();
  const formattedTime = time.toLocaleDateString() + ' ' + time.toLocaleTimeString();

  const messageClass = (uid === currentUser.uid) ? 'sender' : 'receiver';
  var replyData;

  if(replyToID && replyToID != '' && groupChannelRef) {
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

  return (<>
    <div className={`message-container ${messageClass}`} id = {id}>
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
            <span className="message-time">{formattedTime} 
              {(lastChanged && (time.getTime() != lastChangedTime.getTime())) ? <> - Edited {formattedLastChanged}</> : <></>}</span>
          </div>
          
          
          <div className="message-text">
            {content}
          </div>

          {/* Hover buttons */}
          <div className="message-buttons">
            <button className="message-button" onClick={() => setReplyToID(id)}>
              Reply
            </button>
            {(uid === currentUser.uid) ? 
              <button className="message-button" onClick={() => setMessageEditID(id) }>
              Edit
            </button> : <></>} 
            {/* maybe I should not be using ternary operators this way? - Jamie 11/10 */}
            {/* Add more buttons if needed */}
          </div>
      </div>
    </div>
  </>)
}

  const goToDashboard = () => {
    navigate('/dashboard/@me'); // Navigate to the future activity dashboard page
  };

  const clearError = () => {
    setError(null);
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


        <div className="friend-list">
          <div className="friend-circle"></div>
          <div className="friend-circle"></div>
          <div className="friend-circle"></div>
          <div className="friend-circle"></div>
          <div className="friend-circle add-new">+</div>
        </div>

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
          <h3 className="group-name">{selectedGroup}</h3>

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
            <ChatMessage key={msg.id} id={msg.id} message={msg.data} 
          />) : (<p>Messages will be here...</p>))}

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
            <GroupActivities /> 

          </div>
        </div>
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
      <div className="sidebar notifications">
        <div className="notification-box"></div>
        <div className="notification-box"></div>
        <div className="notification-box"></div>
      </div>
    </div>
  );
};

export default Dashboard;
