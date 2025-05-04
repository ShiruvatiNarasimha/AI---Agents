"use client";

import { useState, useEffect } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface Task {
  gid: string;
  name: string;
  due_on?: string;
  notes?: string;
  completed?: boolean;
}

interface NewTask {
  task_name: string;
  due_on: string;
  notes: string;
}

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTask, setNewTask] = useState<NewTask>({
    task_name: "",
    due_on: "",
    notes: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/tasks`);
      setTasks(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/tasks/create`, newTask);
      setNewTask({ task_name: "", due_on: "", notes: "" });
      fetchTasks(); // Refresh the list
    } catch (err) {
      setError("Failed to create task");
      console.error(err);
    }
  };

  const markTaskComplete = async (taskId: string) => {
    try {
      await axios.put(`${API_URL}/tasks/update`, {
        task_id: taskId,
        completed: true,
      });
      fetchTasks(); // Refresh the list
    } catch (err) {
      setError("Failed to update task");
      console.error(err);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) return <div className="text-center p-4">Loading tasks...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Asana Tasks</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form
        onSubmit={createTask}
        className="mb-6 p-4 bg-gray-50 rounded shadow"
      >
        <h2 className="text-xl font-semibold mb-3">Create New Task</h2>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Task Name</label>
          <input
            type="text"
            name="task_name"
            value={newTask.task_name}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Due Date</label>
          <input
            type="date"
            name="due_on"
            value={newTask.due_on}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Notes</label>
          <textarea
            name="notes"
            value={newTask.notes}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            rows={3}
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Create Task
        </button>
      </form>

      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-3">Task List</h2>

        {tasks.length === 0 ? (
          <p>No tasks found</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <li key={task.gid} className="py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3
                      className={`font-medium ${
                        task.completed ? "line-through text-gray-500" : ""
                      }`}
                    >
                      {task.name}
                    </h3>
                    {task.due_on && (
                      <p className="text-sm text-gray-600">
                        Due: {new Date(task.due_on).toLocaleDateString()}
                      </p>
                    )}
                    {task.notes && (
                      <p className="mt-1 text-gray-600">{task.notes}</p>
                    )}
                  </div>

                  {!task.completed && (
                    <button
                      onClick={() => markTaskComplete(task.gid)}
                      className="bg-green-500 hover:bg-green-700 text-white text-sm py-1 px-2 rounded"
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
