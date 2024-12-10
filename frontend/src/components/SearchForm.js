// SearchForm.js
import React, { useState } from "react";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

const SearchForm = () => {
  const [filters, setFilters] = useState({ course: "", major: "", department: "" });
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const db = getFirestore();

    const queries = [];
    if (filters.course) queries.push(where("course", "==", filters.course));
    if (filters.major) queries.push(where("major", "==", filters.major));
    if (filters.department) queries.push(where("department", "==", filters.department));

    const q = queries.length
      ? query(collection(db, "studyGroups"), ...queries)
      : collection(db, "studyGroups");

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setMessage("No matching study groups found. Please refine your search.");
    } else {
      const groups = [];
      querySnapshot.forEach((doc) => groups.push({ id: doc.id, ...doc.data() }));
      setResults(groups);
      setMessage("");
    }
  };

  return (
    <div className="search-form">
      <h2>Search Study Groups</h2>
      <form onSubmit={handleSearch}>
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
        <button type="submit">Search</button>
      </form>
      {message && <p>{message}</p>}
      <div className="results">
        {results.map((group) => (
          <div key={group.id}>
            <h3>{group.groupName}</h3>
            <p>{group.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchForm;
