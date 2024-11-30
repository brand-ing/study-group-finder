import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth"; // Firebase Auth
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore"; // Firestore
import "./SupportForm.css";

const SupportForm = () => {
  const navigate = useNavigate();
  const auth = getAuth(); // Initialize Firebase Auth
  const db = getFirestore(); // Initialize Firestore
  const user = auth.currentUser; // Get the currently logged-in user

  const [description, setDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [category, setCategory] = useState("");
  const [requests, setRequests] = useState([]);

  // Fetch previously submitted requests for the current user
  useEffect(() => {
    if (user) {
      const q = query(
        collection(db, "supportRequests"),
        where("userId", "==", user.uid)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const fetchedRequests = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRequests(fetchedRequests);
      });

      return () => unsubscribe();
    }
  }, [user, db]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("You need to be signed in to submit a request.");
      return;
    }

    try {
      const newRequest = {
        userId: user.uid,
        description,
        contactInfo,
        category,
        status: "Pending",
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "supportRequests"), newRequest);

      setDescription("");
      setContactInfo("");
      setCategory("");

      alert("Your support request has been submitted successfully!");
    } catch (error) {
      console.error("Error submitting support request: ", error);
      alert("Failed to submit your request. Please try again later.");
    }
  };

  return (
    <div>
      <h2>Support Center</h2>

      {/* Back Button */}
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        Back to Dashboard
      </button>

      {/* Support Form */}
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

      {/* Display Previously Submitted Requests */}
      <h3>Your Submitted Requests</h3>
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <span>{request.category}</span>: {request.description} - Status:{" "}
            {request.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SupportForm;
