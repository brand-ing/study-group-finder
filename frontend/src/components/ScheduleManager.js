import React, { useEffect, useState } from "react";
import { getFirestore, collection, addDoc, query, where, getDocs } from "firebase/firestore"; // Firestore
import Calendar from "react-calendar"; // Calendar library
import "react-calendar/dist/Calendar.css";
import "./styles.css"; // Add custom styles

const ScheduleManager = ({ onClose, groupID }) => {
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
  // const [duration, setDuration] = useState("");
  const [durationHours, setDurationHours] = useState(0);
  const [durationMinutes, setDurationMinutes] = useState(0);
  const [conflictingEvents, setConflictingEvents] = useState([]);
  // const [timestamp, setTimestamp] = useState(new Date());

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

    var timestamp = new Date(selectedDate.toISOString());
    timestamp.setHours(0)
    timestamp.setMinutes(0)
    const hour = timeSlot.split(":")[0]
    const minute = timeSlot.split(":")[1]
    console.log(timestamp.toISOString() + "; hour:" + hour + "; minute:" + minute)

    timestamp.setTime(timestamp.getTime() + (hour*60*60*1000)); //add hours
    timestamp.setTime(timestamp.getTime() + (minute*60*1000)) //add minutes

    console.log("final calculation:" + timestamp.toISOString())

    var endTimeStamp = new Date();
    var lasted_hours = durationHours
    var lasted_minutes = durationMinutes
    endTimeStamp.setTime(timestamp.getTime() + (lasted_hours*60*60*1000) + (lasted_minutes*60*1000))

    // Check for time slot conflicts
     
    const q = query(
      collection(db, "events"),
      // where("date", "==", selectedDate.toISOString().split("T")[0]),
      // where("timeSlot", "==", timeSlot)
      where("startTimeStamp", ">=", timestamp),
      where("startTimeStamp", "<=", endTimeStamp)
    );

    const q2 = query(
      collection(db, "events"),
      where("groupID", "==", groupID),
      // where("date", "==", selectedDate.toISOString().split("T")[0]),
      // where("timeSlot", "==", timeSlot)
      where("endTimeStamp", ">=", timestamp),
      where("endTimeStamp", "<=", endTimeStamp)
    );



    const snapshot1 = await getDocs(q);
    const snapshot2 = await getDocs(q2);

    const combinedResults = [...snapshot1.docs, ...snapshot2.docs];

    if (combinedResults.length > 0) {
      // Conflict detected
      setConflict(true);
      const conflicts = combinedResults.map((doc) => doc.data())
      const badTimes = conflicts.map((data) => ({
        startTimeMS: data.startTimeStamp.toDate().getTime(),
        endTimeMS: data.endTimeStamp.toDate().getTime(),
      }))
      var worstStart = 9999999999999999;
      var worstEnd = 0;
      badTimes.forEach((item) => {
        if(item.startTimeMS < worstStart) {
          worstStart = item.startTimeMS;
        }
        if(item.endTimeMS > worstEnd) {
          worstEnd = item.endTimeMS;
        }
      })

      var before = new Date(worstStart)
      before.setTime(before.getTime() - (durationHours*60*60*1000) - (durationMinutes*60*1000))
      var after = new Date(worstEnd)
      var thirdOption = new Date()
      thirdOption.setTime(after.getTime() + (1*60*60*1000)) //plus one hour

      setConflictingEvents(conflicts);
      // badTimes = combinedResults.filter()
      setAvailableSlots([before.toLocaleTimeString(), after.toLocaleTimeString(), thirdOption.toLocaleTimeString()]); // Example slots
      console.log("Conflicting Events:", conflictingEvents);
    } else {
      // No conflict, schedule the event
      try {
        await addDoc(collection(db, "events"), {
          groupID: groupID,
          title,
          description,
          date: selectedDate.toISOString().split("T")[0],
          timeSlot,
          category: selectedCategory,
          startTimeStamp: timestamp,
          endTimeStamp : endTimeStamp,
        });

        alert("Event scheduled successfully!" + "Start:" + timestamp.toISOString());
        setTitle("");
        setDescription("");
        setTimeSlot("");
        setCategory("Study"); // Reset to default
        setCustomCategory("");
        setConflictingEvents([]);
      } catch (error) {
        console.error("Error scheduling event:", error);
      }
    }
  };

  return (
    <div className="schedule-manager">
      <div>
        <div>
          <h3>Schedule Manager</h3>

          {/* Calendar for selecting a date */}
          <Calendar onChange={handleDateChange} value={selectedDate} />
          <p>Selected Date: {selectedDate.toDateString()}</p>
        </div>
        
        {/* Form for scheduling events */}
        <div className="event-creator">
          <form onSubmit={handleScheduleSubmit}>
            <div>
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
            </div>
            <div>
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
                Duration
                <div className="event-duration">
                  <input 
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    required
                    min="0"
                    max="23"
                  /> HR
                  
                  <input 
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    required
                    min="0"
                    max="59"
                  /> MIN
                </div>
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
            </div>
          </form>


          {/* Conflict Resolution */}
          {conflict && (
            <div className="conflict-message">
              <p>
                This time slot is unavailable. 
              </p>
              <ul>
                {conflictingEvents.map((el) => (
                  <li key={el.title}> {el.title} starts {el.startTimeStamp.toDate().toLocaleTimeString()} and ends {el.endTimeStamp.toDate().toLocaleTimeString()}</li>
                ))}
              </ul>
              <p>Please choose a time before</p>
              <p> 
                Please choose an alternate time
                slot, for example:
              </p>
              <ul>
                {availableSlots.map((slot, index) => (
                  <li key={index}>{slot}</li>
                ))}
              </ul>
            </div>
          )}

        </div>
      </div>
      {/* Back Button */}
      <button className="schedule-manager-close" onClick={onClose}>Close</button>
    </div>
  );
};

export default ScheduleManager;
