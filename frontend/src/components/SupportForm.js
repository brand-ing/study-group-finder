import React, { useState } from "react";
import "./SupportForm.css"; // Link the above CSS here

const SupportForm = () => {
  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [category, setCategory] = useState("");
  const [requests, setRequests] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      description,
      contactInfo,
      category,
      status: "Pending",
    };
    setRequests([...requests, newRequest]);
    setDescription("");
    setContactInfo("");
    setCategory("");
  };

  return (
    <div>
      <h2>Support Center</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Issue Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Contact Information
          <input
            type="email"
            value={contactInfo}
            onChange={(e) => setContactInfo(e.target.value)}
            required
          />
        </label>
        <fieldset>
          <legend>Category</legend>
          <label>
            <input
              type="radio"
              name="category"
              value="Support Help"
              onChange={(e) => setCategory(e.target.value)}
            />
            Support Help
          </label>
          <label>
            <input
              type="radio"
              name="category"
              value="Feature Request"
              onChange={(e) => setCategory(e.target.value)}
            />
            Feature Request
          </label>
          <label>
            <input
              type="radio"
              name="category"
              value="Feature Liked"
              onChange={(e) => setCategory(e.target.value)}
            />
            Feature Liked
          </label>
          <label>
            <input
              type="radio"
              name="category"
              value="Complaint"
              onChange={(e) => setCategory(e.target.value)}
            />
            Complaint
          </label>
        </fieldset>
        <button type="submit">Submit Request</button>
      </form>

      <h3>Your Submitted Requests</h3>
      <ul>
        {requests.map((request, index) => (
          <li key={index}>
            <span>{request.category}</span>: {request.description} - Status:{" "}
            {request.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupportForm;
