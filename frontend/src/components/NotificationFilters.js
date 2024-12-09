// NotificationFilters.js
import React from "react";

const NotificationFilters = ({ currentFilter, onFilterChange }) => {
    const filters = ["ALL", "FILES", "EVENTS", "TO-DOs"];

    return (
        <div className="filter-buttons">
            {filters.map((filter) => (
                <button
                    key={filter}
                    className={currentFilter === filter ? "active" : ""}
                    onClick={() => onFilterChange(filter)}
                >
                    {filter}
                </button>
            ))}
        </div>
    );
};

export default NotificationFilters;
