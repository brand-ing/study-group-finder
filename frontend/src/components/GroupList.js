import React, { useState, useEffect } from "react";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const db = getFirestore();

    useEffect(() => {
        const fetchGroups = async () => {
            const querySnapshot = await getDocs(collection(db, "Groups"));
            const fetchedGroups = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setGroups(fetchedGroups);
        };
        fetchGroups();
    }, [db]);

    return (
        <div className="group-list">
            <h2>Available Study Groups</h2>
            {groups.length ? (
                groups.map((group) => (
                    <div className="group-card" key={group.id}>
                        <h3>{group.groupName}</h3>
                        <p>{group.description}</p>
                    </div>
                ))
            ) : (
                <p>No groups available.</p>
            )}
        </div>
    );
};

export default GroupList;
