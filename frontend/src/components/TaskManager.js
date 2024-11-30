import React, { useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./styles.css";

const TaskManager = ({ onClose }) => {
  const db = getFirestore();

  const [tasks, setTasks] = useState([]); // All tasks
  const [view, setView] = useState("list"); // View state: 'list', 'add', or 'edit'
  const [taskToEdit, setTaskToEdit] = useState(null); // Task being edited

  // Task form state
  const [taskName, setTaskName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [filter, setFilter] = useState("active"); // Filter: 'active', 'completed', 'due-soon'

  // Fetch tasks from Firestore and remove expired tasks
  useEffect(() => {
    const fetchTasks = async () => {
      const taskQuery = query(collection(db, "tasks"), orderBy("dueDate", "asc"));
      const taskSnapshot = await getDocs(taskQuery);

      const now = new Date();
      const fetchedTasks = [];
      const tasksToDelete = [];

      taskSnapshot.docs.forEach((doc) => {
        const task = { id: doc.id, ...doc.data() };
        if (new Date(task.dueDate) < now && !task.completed) {
          tasksToDelete.push(doc.ref); // Mark expired task for deletion
        } else {
          fetchedTasks.push(task); // Keep valid tasks
        }
      });

      // Delete expired tasks from Firestore
      await Promise.all(tasksToDelete.map((ref) => deleteDoc(ref)));

      if (tasksToDelete.length > 0) {
        toast.info(`Removed ${tasksToDelete.length} expired tasks.`);
      }

      setTasks(fetchedTasks);
    };

    fetchTasks();
  }, [db]);

  // Filtered tasks based on filter state
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "active") return !task.completed;
    if (filter === "due-soon")
      return new Date(task.dueDate) > new Date() &&
        new Date(task.dueDate) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Due within 7 days
    return false; // Default case
  });

  // Handle form submission for adding/editing tasks
  const handleTaskSubmit = async (e) => {
    e.preventDefault();

    if (!taskName || !description || !dueDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    if (view === "add") {
      try {
        const newTask = {
          taskName,
          description,
          dueDate,
          completed: false,
          createdAt: new Date().toISOString(),
        };

        const docRef = await addDoc(collection(db, "tasks"), newTask);

        setTasks((prevTasks) => [...prevTasks, { id: docRef.id, ...newTask }]);
        toast.success("Task created successfully!");
      } catch (error) {
        console.error("Error adding task:", error);
        toast.error("Failed to add task. Please try again.");
      }
    } else if (view === "edit" && taskToEdit) {
      try {
        const taskRef = doc(db, "tasks", taskToEdit.id);
        await updateDoc(taskRef, {
          taskName,
          description,
          dueDate,
        });

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskToEdit.id
              ? { ...task, taskName, description, dueDate }
              : task
          )
        );
        toast.success("Task updated successfully!");
      } catch (error) {
        console.error("Error updating task:", error);
        toast.error("Failed to update task. Please try again.");
      }
    }

    // Reset form and return to list view
    setTaskName("");
    setDescription("");
    setDueDate("");
    setTaskToEdit(null);
    setView("list");
  };

  // Handle task completion toggle
  const handleToggleCompleteTask = async (taskId, currentStatus) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await updateDoc(taskRef, { completed: !currentStatus });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !currentStatus } : task
        )
      );

      toast.success(
        `Task marked as ${!currentStatus ? "complete" : "incomplete"}!`
      );
    } catch (error) {
      console.error("Error toggling task completion:", error);
      toast.error("Failed to update task. Please try again.");
    }
  };

  // Handle task deletion
  const handleDeleteTask = async (taskId) => {
    try {
      const taskRef = doc(db, "tasks", taskId);
      await deleteDoc(taskRef);

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("Failed to delete task. Please try again.");
    }
  };

  return (
    <div className="task-manager">
      <ToastContainer />
      {view === "list" && (
        <>
          <h3>Your Tasks</h3>

          {/* Filters */}
          <div className="task-filters">
            <label>
              Filter Tasks:
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="due-soon">Due Soon</option>
              </select>
            </label>
          </div>

          {filteredTasks.length > 0 ? (
            <ul>
              {filteredTasks.map((task) => (
                <li key={task.id}>
                  <h5>{task.taskName}</h5>
                  <p>{task.description}</p>
                  <p>Due: {task.dueDate}</p>
                  <button
                    onClick={() =>
                      handleToggleCompleteTask(task.id, task.completed)
                    }
                  >
                    {task.completed ? "Mark as Incomplete" : "Mark as Complete"}
                  </button>
                  <button
                    onClick={() => {
                      setTaskToEdit(task);
                      setTaskName(task.taskName);
                      setDescription(task.description);
                      setDueDate(task.dueDate);
                      setView("edit");
                    }}
                  >
                    Edit
                  </button>
                  <button onClick={() => handleDeleteTask(task.id)}>
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No tasks available. Add one to get started!</p>
          )}
          <button onClick={() => setView("add")}>Add Task</button>
        </>
      )}

      {(view === "add" || view === "edit") && (
        <>
          <h3>{view === "add" ? "Add a New Task" : "Edit Task"}</h3>
          <form onSubmit={handleTaskSubmit}>
            <label>
              Task Name
              <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                required
              />
            </label>
            <label>
              Description
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <label>
              Due Date
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                required
              />
            </label>
            <button type="submit">{view === "add" ? "Save Task" : "Update Task"}</button>
            <button type="button" onClick={() => setView("list")}>
              Cancel
            </button>
          </form>
        </>
      )}

      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default TaskManager;
