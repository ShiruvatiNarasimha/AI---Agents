"use client";

import { useState } from "react";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

interface MessageData {
  to: string;
  message: string;
}

interface ApiError {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

export default function WhatsAppMessaging() {
  const [message, setMessage] = useState<MessageData>({ to: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${API_URL}/whatsapp/send`, message);
      setSuccess(
        `Message sent successfully! SID: ${response.data.message_sid}`
      );
      setMessage({ to: "", message: "" }); // Clear form
    } catch (err: unknown) {
      const apiError = err as ApiError;
      setError(
        apiError.response?.data?.detail || "Failed to send WhatsApp message"
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setMessage((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Send WhatsApp Message</h1>

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

      <form
        onSubmit={sendMessage}
        className="mb-6 p-4 bg-gray-50 rounded shadow"
      >
        <div className="mb-3">
          <label className="block text-gray-700 mb-1">
            Phone Number{" "}
            <span className="text-sm text-gray-500">(e.g., +123456789)</span>
          </label>
          <input
            type="text"
            name="to"
            value={message.to}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            placeholder="+123456789"
            required
          />
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 mb-1">Message</label>
          <textarea
            name="message"
            value={message.message}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded"
            rows={5}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-gray-50 rounded shadow">
        <h2 className="text-xl font-semibold mb-3">Task Notification</h2>

        <p className="mb-3 text-gray-700">
          Need to send a task notification? Use the task notification feature to
          inform team members about task updates.
        </p>

        <a
          href="/task-notifications"
          className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Task Notifications
        </a>
      </div>
    </div>
  );
}
