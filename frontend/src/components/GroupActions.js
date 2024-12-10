// GroupActions.js
import React from "react";
import { useNavigate } from "react-router-dom";

const GroupActions = ({ userData }) => {
    const navigate = useNavigate();

    return (
        <div className="group-actions">
            <button
                className="action-btn"
                onClick={() => navigate("/groups/search")}
            >
                Search Groups
            </button>
            <button
                className="action-btn"
                onClick={() => navigate("/groups/create", { state: { userData } })}
            >
                Create Group
            </button>
        </div>
    );
};

export default GroupActions;
