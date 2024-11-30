import React, { useState } from "react";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Firestore
import Calendar from "react-calendar"; // Calendar library
import "react-calendar/dist/Calendar.css";
import "./styles.css"; // Add custom styles

const ScheduleManager = ({ onClose }) => {
  const db = getFirestore(); // Initialize Firestore

  // State for calendar and form
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Study"); // Default category
  const [customCategory, setCustomCategory] = useState(""); // For user suggestions
  const [conflict, setConflict] = useState(false);
  const [availableSlots, setAvailableSlots] = useState([]);

  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setConflict(false); // Clear any previous conflicts
    setAvailableSlots([]); // Clear available slots
  };

  // Handle form submission
  const handleScheduleSubmit = async (e) => {
    e.preventDefault();

    const selectedCategory =
      category === "Custom" ? customCategory : category; // Determine category

    if (!selectedCategory) {
      alert("Please provide a category for the event.");
      return;
    }

    // Check for time slot conflicts
    const q = query(
      collection(db, "events"),
      where("date", "==", selectedDate.toISOString().split("T")[0]),
      where("timeSlot", "==", timeSlot)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // Conflict detected
      setConflict(true);
      const conflictingEvents = querySnapshot.docs.map((doc) => doc.data());
      setAvailableSlots(["10:00 AM", "1:00 PM", "3:00 PM"]); // Example slots
      console.log("Conflicting Events:", conflictingEvents);
    } else {
      // No conflict, schedule the event
      try {
        await addDoc(collection(db, "events"), {
          title,
          description,
          date: selectedDate.toISOString().split("T")[0],
          timeSlot,
          category: selectedCategory,
        });

        alert("Event scheduled successfully!");
        setTitle("");
        setDescription("");
        setTimeSlot("");
        setCategory("Study"); // Reset to default
        setCustomCategory("");
      } catch (error) {
        console.error("Error scheduling event:", error);
      }
    }
  };

  return (
    <div className="schedule-manager">
      <h3>Schedule Manager</h3>

      {/* Calendar for selecting a date */}
      <Calendar onChange={handleDateChange} value={selectedDate} />

      <p>Selected Date: {selectedDate.toDateString()}</p>

      {/* Form for scheduling events */}
      <form onSubmit={handleScheduleSubmit}>
        <label>
          Event Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>
        <label>
          Event Description
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </label>
        <label>
          Time Slot
          <input
            type="time"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
          >
            <option value="Study">Study</option>
            <option value="Meeting">Meeting</option>
            <option value="Lecture">Lecture</option>
            <option value="Custom">Custom</option>
          </select>
        </label>
        {category === "Custom" && (
          <label>
            Suggest a Category
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              required
            />
          </label>
        )}
        <button type="submit">Schedule Event</button>
      </form>

      {/* Conflict Resolution */}
      {conflict && (
        <div className="conflict-message">
          <p>
            This time slot is unavailable. Please choose an alternate time
            slot:
          </p>
          <ul>
            {availableSlots.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Back Button */}
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ScheduleManager;
