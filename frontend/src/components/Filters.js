// Filters.js
import React, { useState } from "react";

const Filters = ({ filters, setFilters, onApply }) => {
  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = () => {
    setFilters({ course: "", major: "", department: "" });
    onApply();  // Trigger a fresh search with empty filters
  };

  return (
    <div className="filters">
      <button onClick={() => setShowFilters(!showFilters)}>
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      {showFilters && (
        <div className="filter-options">
          <input
            type="text"
            name="course"
            placeholder="Course"
            value={filters.course}
            onChange={handleChange}
          />
          <input
            type="text"
            name="major"
            placeholder="Major"
            value={filters.major}
            onChange={handleChange}
          />
          <input
            type="text"
            name="department"
            placeholder="Department"
            value={filters.department}
            onChange={handleChange}
          />
          <div className="filter-buttons">
            <button onClick={onApply}>Apply Filters</button>
            <button onClick={handleClear} className="clear-btn">
              Clear Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
