// SearchResults.js
import React from "react";

const SearchResults = ({ results }) => {
    return (
        <div className="search-results">
            {results.length > 0 ? (
                results.map((group) => (
                    <div key={group.id} className="group-card">
                        <h3 className="group-name">{group.groupName}</h3>
                        <p className="group-description">
                            {group.description || "No description provided."}
                        </p>
                        <p className="group-meta">
                            <strong>Members:</strong> {group.members?.length || 0} <br />
                            <strong>Course:</strong> {group.course || "N/A"} <br />
                            <strong>Major:</strong> {group.major || "N/A"} <br />
                            <strong>Department:</strong> {group.department || "N/A"}
                        </p>
                    </div>
                ))
            ) : (
                <p className="empty-message">No groups found. Try a different search.</p>
            )}
        </div>
    );
};

export default SearchResults;
