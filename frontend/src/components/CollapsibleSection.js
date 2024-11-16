import React, { useState } from "react";

const CollapsibleSection = ({ title, children, editable = false }) => {
  const [isExpanded, setIsExpanded] = useState(true); // State for collapsing

  return (
    <div className="section collapsible-section">
      {/* Clickable Header for Toggling */}
      <div
        className="section-header"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: "pointer" }}
      >
        <p className="section-title">{title}</p>
        <span style={{ fontSize: "0.8rem", color: "#888" }}>
          {isExpanded ? "▼" : "▲"}
        </span>
      </div>

      {/* Render Children Only When Expanded */}
      {isExpanded && (
        <div className="section-content">
          {editable ? <div className="editable-content">{children}</div> : children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleSection;
