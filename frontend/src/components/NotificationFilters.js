// NotificationFilters.js
import React from "react";

const NotificationFilters = ({ currentFilter, onFilterChange }) => {
    const filterTypes = ["ALL", "FILES", "EVENTS", "TO-DOs"];

    return (
        <div className="filter-buttons">
            {filterTypes.map((type) => (
                <button
                    key={type}
                    className={currentFilter === type ? "active" : ""}
                    onClick={() => onFilterChange(type)}
                >
                    {type}
                </button>
            ))}
        </div>
    );
};

export default NotificationFilters;
