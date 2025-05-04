"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface NotificationData {
  to: string;
  task_name: string;
  status: "created" | "updated" | "completed";
  due_date?: string;
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export default function TaskNotifications() {
  const router = useRouter();
  const [notification, setNotification] = useState<NotificationData>({
    to: "",
    task_name: "",
    status: "created",
    due_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNotification((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    // Validate the form
    if (!notification.to || !notification.task_name) {
      setError("Phone number and task name are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/whatsapp/notify`,
        notification
      );
      setSuccess(
        `Notification sent successfully! SID: ${response.data.message_sid}`
      );
      setNotification({
        to: "",
        task_name: "",
        status: "created",
        due_date: "",
      });
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.detail || "Failed to send notification"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Task Notifications
            </h1>
            <button
              onClick={() => router.back()}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              &larr; Back
            </button>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
              {success}
            </div>
          )}

          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="to"
                >
                  Recipient Phone Number
                </label>
                <input
                  type="text"
                  id="to"
                  name="to"
                  value={notification.to}
                  onChange={handleInputChange}
                  placeholder="+1234567890"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Include country code (e.g., +1 for US)
                </p>
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="task_name"
                >
                  Task Name
                </label>
                <input
                  type="text"
                  id="task_name"
                  name="task_name"
                  value={notification.task_name}
                  onChange={handleInputChange}
                  placeholder="Quarterly Report"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  required
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="status"
                >
                  Task Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={notification.status}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="created">Created</option>
                  <option value="updated">Updated</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="mb-6">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="due_date"
                >
                  Due Date (Optional)
                </label>
                <input
                  type="date"
                  id="due_date"
                  name="due_date"
                  value={notification.due_date}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="submit"
                  className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Notification"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
