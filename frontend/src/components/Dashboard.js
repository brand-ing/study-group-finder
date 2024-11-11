// Dashboard.js
import React, { useState, useEffect, useRef } from 'react';
import { signOut, getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, getDocs, collection, query, where, orderBy, limit, QuerySnapshot, Timestamp} from 'firebase/firestore';
// import 'firebase/firestore'
import { auth, db } from './firebaseConfig';
import { FiSearch, FiUser, FiBell } from 'react-icons/fi'; // Importing icons

import './styles.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Message from './Message';

const notify = () => toast("Here is your toast.");

  async function fetchFirestoreUserData(user) {
    var error;
    try{
      var userDocRef = doc(db, 'Users', user.uid); // Use the UID instead of email
      var userDoc = await getDoc(userDocRef);
      var userData = userDoc.data();
    } catch(err) {
      error = err;
    }
    return [userData, error];
  }

  async function fetchFirestoreDoc(ref) { //Why did I make this?
    var error;
    try{
      var doc = await getDoc(ref);
      var docData = doc.data();
    } catch(err) {
      error = err;
    }
    return [docData, error];
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
  const [selectedGroup, setSelectedGroup] = useState()
  const [messages, setMessages] = useState()
 

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

          for(var i = 0; i < data.groups.length; i++) {
            let curr = await getDoc(data.groups[i])
            let currData = curr.data();
            // console.log("curr: " + JSON.stringify(currData));
            gdata.push(currData);
            groups.push(currData.title);
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


  useEffect(() => {
  },[selectedGroup]) //TODO



  


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
      return el.title == e.target.value;
    })
    console.log(groupData[0]);
    const groupChannelRef = (groupData.length > 0) ? groupData[0].channels[0] : null;

    console.log(groupChannelRef);
    var messageArray= [];

    if (groupChannelRef != null) {
      const channelDataDoc =  await getDoc(groupChannelRef);
      const channelData = channelDataDoc.data()
      const channelSubCollection = collection(db, groupChannelRef.path + "/Messages");
      const q = query(channelSubCollection, orderBy('timestamp'), limit(100)); // grab last 100 messages 
      console.log(channelSubCollection);
      console.log(channelData);
      console.log(q);
      const channelMessagesSnapshot = await getDocs(q);
      console.log(channelMessagesSnapshot);
      channelMessagesSnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        messageArray.push({
          id: doc.id,
          data: doc.data()}
        )
      })

      
    }

    setMessages(messageArray);

  }

  
function ChatMessage(props) {
  const { content, timestamp } = props.message;
  const time = timestamp.toDate();
  const formattedTime = time.toISOString();

  // const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    {/* <div className={`message ${messageClass}`}> */}
    <div className={`message`}>
      <p>{content} - {formattedTime}</p>
    </div>
  </>)
}



  return (
    <div className="dashboard">
      {error && <p className="error">{error}</p>}
 
      {/* Friends Sidebar */}
      <div className={`sidebar friends ${isSidebarCollapsed ? 'collapsed' : 'expanded'}`}>
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
          <button className="toggle-button" onClick={toggleSidebar}>
            <FiUser size={20} />
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
            {/* <span className="username">{username}</span> */}
            <span className="profile-icon">
              {isSidebarCollapsed ? (
                <FiUser size={24} />
              ) : (
                <>
                  <FiUser size={24} />
                  <span className="username">{userData.first_name}</span>
                  <span className="username">{username}</span>
                </>
              )}
              </span>
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
          <h3 className="group-name">{selectedGroup}</h3>
                    {/* Notifications Button */}
          <button className="notification-btn notifications-toggle" onClick={toggleNotifications}>
            <FiBell size={20} />
          </button>
          <ToastContainer />
        </div>
        <div className="message-area">
          {(messages ? messages.map(msg => <ChatMessage key={msg.id} message={msg.data} />) : (<p>Messages will be here...</p>))}
        </div>
      </div>


      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="notifications-dropdown">
          <div className="notification-item">Notification 1</div>
          <div className="notification-item">Notification 2</div>
          <div className="notification-item">Notification 3</div>
        </div>
      )}


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
