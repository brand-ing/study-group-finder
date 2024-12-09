import React, { useState } from "react";
import "./GroupCatalog.css";

const groups = [
  {
    id: 1,
    name: "Math Study Group",
    description: "Join us for weekly calculus problem-solving sessions.",
    schedule: "Mondays 5 PM",
    course: "Calculus I",
    major: "Mathematics",
    department: "Science",
    type: "Study Group",
  },
  {
    id: 2,
    name: "AI Enthusiasts",
    description: "Discuss and learn about the latest in AI.",
    schedule: "Fridays 7 PM",
    course: "Intro to AI",
    major: "Computer Science",
    department: "Engineering",
    type: "Club",
  },
  {
    id: 3,
    name: "History Buffs",
    description: "Dive into fascinating historical events bi-weekly.",
    schedule: "Sundays 2 PM",
    course: "World History",
    major: "History",
    department: "Humanities",
    type: "Study Group",
  },
];

const GroupCatalog = () => {
  const [search, setSearch] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    course: "",
    major: "",
    department: "",
    type: "",
  });

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const filteredGroups = groups.filter((group) => {
    return (
      (filters.course ? group.course === filters.course : true) &&
      (filters.major ? group.major === filters.major : true) &&
      (filters.department ? group.department === filters.department : true) &&
      (filters.type ? group.type === filters.type : true) &&
      (group.name.toLowerCase().includes(search.toLowerCase()) ||
        group.description.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <div className="group-catalog">
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search for groups..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="toggle-filters"
          onClick={() => setShowFilters(!showFilters)}
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="filters">
          <div className="filter">
            <label>Course:</label>
            <select
              name="course"
              value={filters.course}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Calculus I">Calculus I</option>
              <option value="Intro to AI">Intro to AI</option>
              <option value="World History">World History</option>
            </select>
          </div>
          <div className="filter">
            <label>Major:</label>
            <select
              name="major"
              value={filters.major}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Computer Science">Computer Science</option>
              <option value="History">History</option>
            </select>
          </div>
          <div className="filter">
            <label>Department:</label>
            <select
              name="department"
              value={filters.department}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Science">Science</option>
              <option value="Engineering">Engineering</option>
              <option value="Humanities">Humanities</option>
            </select>
          </div>
          <div className="filter">
            <label>Type:</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
            >
              <option value="">All</option>
              <option value="Study Group">Study Group</option>
              <option value="Club">Club</option>
              <option value="Project">Project</option>
            </select>
          </div>
        </div>
      )}

<div className="group-list">
  {filteredGroups.length > 0 ? (
    filteredGroups.map((group) => (
      <div key={group.id} className="group-card">
        <div className="group-content">
          <h3 className="group-name">{group.name}</h3>
          <p className="group-description">{group.description}</p>
        </div>
        <span className="group-schedule">{group.schedule}</span>
      </div>
    ))
  ) : (
    <p className="no-results">No groups found</p>
  )}
</div>

    </div>
  );
};

export default GroupCatalog;
