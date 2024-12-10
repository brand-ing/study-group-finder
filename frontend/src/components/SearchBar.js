// SearchBar.js
import React from "react";

const SearchBar = ({ setSearchTerm, onSearch }) => {
    return (
        <div className="search-bar-container">
            <input
                type="text"
                className="search-input"
                placeholder="Search for groups..."
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-btn" onClick={onSearch}>
                🔍 Search
            </button>
        </div>
    );
};

export default SearchBar;
