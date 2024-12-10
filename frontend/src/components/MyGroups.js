// MyGroups.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const MyGroups = ({ userGroups, handleGroupChange}) => {
    const [showOptions, setShowOptions] = useState(false);  // "+" Menu
    const [contextMenuVisible, setContextMenuVisible] = useState(false);  // Right-Click Menu
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const navigate = useNavigate();

    
    // Handle Right-Click
    const handleRightClick = (e, group) => {
        e.preventDefault();  // Prevent Default Context Menu
        setSelectedGroup(group);
        setMenuPosition({ x: e.pageX, y: e.pageY });
        setContextMenuVisible(true);
    };

    // Handle Left Click Anywhere to Close the Menu
    const handleLeftClick = (e) => {
        const isContextClick = e.target.closest(".context-menu");
        const isAddNewClick = e.target.closest(".add-new");
        if (!isContextClick && !isAddNewClick) {
            setContextMenuVisible(false);  // Close Context Menu
            setShowOptions(false);  // Close "+"
        }
    };

    // Handle Right-Click Menu Actions
    const handleOptionClick = (option) => {
        if (option === "description") {
            alert(`Description: ${selectedGroup.description || "No description available."}`);
        } else if (option === "schedule") {
            alert(`Schedule: ${selectedGroup.schedule || "No schedule available."}`);
        }
        setContextMenuVisible(false);  // Close After Action
    };

    console.log("Rendering User Groups in MyGroups:", userGroups);

    return (
        <div className="my-groups-container" onClick={handleLeftClick}>
            {userGroups.length > 0 ? (
                userGroups.map((group, index) => (
                    <div
                        key={index}
                        className="group-card"
                        onClick={() => handleGroupChange(index)}
                        onContextMenu={(e) => handleRightClick(e, group)}
                    >
                        <h3>{group || "Unnamed Group"}</h3>
                    </div>
                ))
            ) : (
                <p className="empty-message">No groups found. Try joining one!</p>
            )}

            {/* "+" New Group Button */}
            <div
                className="group-card add-new"
                onClick={() => setShowOptions(!showOptions)}
            >
                <h3>+</h3>
            </div>

            {showOptions && (
                <div className="group-options-popup">
                    <button
                        className="group-option-btn"
                        onClick={() => navigate("/group-search")}
                    >
                        Search for a Group
                    </button>
                    <button
                        className="group-option-btn"
                        onClick={() => navigate("/create-group")}
                    >
                        Create a New Group
                    </button>
                </div>
            )}

            {/* Right-Click Context Menu */}
            {contextMenuVisible && (
                <div
                    className="context-menu"
                    style={{
                        top: `${menuPosition.y}px`,
                        left: `${menuPosition.x}px`,
                    }}
                >
                    <p onClick={() => handleOptionClick("description")}>
                        View Description
                    </p>
                    <p onClick={() => handleOptionClick("schedule")}>
                        View Schedule
                    </p>
                    <p onClick={() => setContextMenuVisible(false)}>Close</p>
                </div>
            )}
        </div>
    );
};

export default MyGroups;
