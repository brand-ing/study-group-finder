// GroupSearchPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import SearchBarWithFilters from "./SearchBarWithFilters";

const GroupSearchPage = () => {
    const navigate = useNavigate();

    return (
        <div className="group-search-page">
            <button 
                className="back-button" 
                onClick={() => navigate(-1)}  // Go Back to Dashboard
            >
                ← Back
            </button>

            <h1>Find a Study Group</h1>
            <SearchBarWithFilters />
        </div>
    );
};

export default GroupSearchPage;
