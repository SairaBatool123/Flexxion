import React, { useState } from "react";
import "../../src/App.css";
import { FaRegEdit } from "react-icons/fa";
import { AiTwotoneDelete } from "react-icons/ai";
import { IoIosAddCircleOutline } from "react-icons/io";


export default function AddTaskCard() {
  const [tasks, setTasks] = useState([
    "Compiler Construction",
    "Algorithm",
    "10 Min Break"
  ]);
  const [newTask, setNewTask] = useState("");
  const [editIndex, setEditIndex] = useState(null);

  const handleAddTask = () => {
    if (newTask.trim()) {
      if (editIndex !== null) {
        const updatedTasks = [...tasks];
        updatedTasks[editIndex] = newTask;
        setTasks(updatedTasks);
        setEditIndex(null);
      } else {
        setTasks([...tasks, newTask]);
      }
      setNewTask("");
    }
  };

  const handleDelete = (index) => {
    const updatedTasks = tasks.filter((_, i) => i !== index);
    setTasks(updatedTasks);
  };

  const handleEdit = (index) => {
    setNewTask(tasks[index]);
    setEditIndex(index);
  };

  return (
    <div className="task-card enhanced">
      <h3>{editIndex !== null ? "Edit Task Here" : "Add Task Here"}</h3>

      <div className="input-wrapper">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter your task"
        />
        <IoIosAddCircleOutline
          className="input-icon"
          onClick={handleAddTask}
          title={editIndex !== null ? "Update" : "Add"}
        />
      </div>

      <ul className="task-list">
        {tasks.map((task, index) => (
          <li key={index} className="task-item">
            <input type="checkbox" className="task-checkbox" />
            <span className="task-text">{task}</span>
            <div className="task-actions">
              <button onClick={() => handleEdit(index)} title="Edit">
                <FaRegEdit />
              </button>
              <button onClick={() => handleDelete(index)} title="Delete">
                <AiTwotoneDelete />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}