// SearchBarWithFilters.js
import React, { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";  // Firebase Config
import SearchBar from "./SearchBar";
import Filters from "./Filters";
import SearchResults from "./SearchResults";

const SearchBarWithFilters = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filters, setFilters] = useState({
        course: "",
        major: "",
        department: "",
    });
    const [results, setResults] = useState([]);
    const [message, setMessage] = useState("");

    // Handle Search Logic
    const handleSearch = async () => {
        try {
            const groupsRef = collection(db, "Groups");

            // Build Firestore Query
            const queries = [];
            if (searchTerm) queries.push(where("groupName", "==", searchTerm));
            if (filters.course) queries.push(where("course", "==", filters.course));
            if (filters.major) queries.push(where("major", "==", filters.major));
            if (filters.department) queries.push(where("department", "==", filters.department));

            const q = queries.length ? query(groupsRef, ...queries) : groupsRef;

            // Fetch Results
            const querySnapshot = await getDocs(q);

            if (querySnapshot.empty) {
                setMessage("No matching study groups found.");
                setResults([]);
            } else {
                const groups = [];
                querySnapshot.forEach((doc) => groups.push({ id: doc.id, ...doc.data() }));
                setResults(groups);
                setMessage("");  // Clear message
            }
        } catch (error) {
            console.error("Error fetching groups:", error);
            setMessage("Error fetching results.");
        }
    };

    return (
        <div className="search-container">
            <SearchBar setSearchTerm={setSearchTerm} onSearch={handleSearch} />
            <Filters filters={filters} setFilters={setFilters} onApply={handleSearch} />
            {message && <p>{message}</p>}
            <SearchResults results={results} />
        </div>
    );
};

export default SearchBarWithFilters;
