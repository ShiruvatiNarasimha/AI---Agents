"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  FaTasks,
  FaCalendarAlt,
  FaListUl,
  FaChartLine,
  FaCog,
  FaBell,
  FaUser,
  FaSearch,
  FaWhatsapp,
  FaRobot,
  FaSignOutAlt,
} from "react-icons/fa";
import TaskList from "../../components/TaskList";
import WhatsAppMessaging from "../../components/WhatsAppMessaging";
import AssistantChat from "../../components/AssistantChat";
import ChatPopup from "../../components/ChatPopup";

type Tab = "overview" | "tasks" | "whatsapp" | "assistant";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    } else if (status === "authenticated") {
      setLoading(false);
    }
  }, [status, router]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <h2 className="text-xl font-semibold text-gray-700 mt-4">
            Loading your dashboard...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full z-10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-blue-600">
            TaskFlow<span className="text-blue-400">AI</span>
          </h1>
        </div>
        <nav className="mt-6">
          <div className="px-4 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Main
          </div>
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "overview"
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaChartLine className="mr-3" /> Overview
          </button>
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "tasks"
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaTasks className="mr-3" /> Tasks
          </button>
          <button
            onClick={() => setActiveTab("whatsapp")}
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "whatsapp"
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaWhatsapp className="mr-3" /> WhatsApp
          </button>
          <button
            onClick={() => setActiveTab("assistant")}
            className={`flex items-center px-6 py-3 w-full ${
              activeTab === "assistant"
                ? "bg-blue-50 text-blue-600 border-r-4 border-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaRobot className="mr-3" /> Assistant
          </button>

          <div className="px-4 mt-8 mb-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Settings
          </div>
          <Link
            href="/profile"
            className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
          >
            <FaUser className="mr-3" /> Profile
          </Link>
          <Link
            href="/settings"
            className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100"
          >
            <FaCog className="mr-3" /> Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="flex items-center px-6 py-3 w-full text-gray-600 hover:bg-gray-100"
          >
            <FaSignOutAlt className="mr-3" /> Sign Out
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6">
          <div className="flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center">
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FaBell className="text-gray-600" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </div>
            <div className="ml-4 flex items-center">
              {session?.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                  {session?.user?.name?.charAt(0) || "U"}
                </div>
              )}
              <span className="ml-2 font-medium">
                {session?.user?.name || "User"}
              </span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-6">
          {activeTab === "overview" && (
            <div>
              <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Total Tasks</p>
                      <p className="text-2xl font-bold">32</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <FaListUl className="text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm flex justify-between">
                      <span className="text-green-500">+4.6%</span>
                      <span className="text-gray-400">vs last week</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Completed</p>
                      <p className="text-2xl font-bold">24</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FaTasks className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm flex justify-between">
                      <span className="text-green-500">+12.2%</span>
                      <span className="text-gray-400">vs last week</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">Messages Sent</p>
                      <p className="text-2xl font-bold">164</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <FaWhatsapp className="text-green-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm flex justify-between">
                      <span className="text-green-500">+8.1%</span>
                      <span className="text-gray-400">vs last week</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-500 text-sm">AI Interactions</p>
                      <p className="text-2xl font-bold">47</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FaRobot className="text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="text-sm flex justify-between">
                      <span className="text-green-500">+23.4%</span>
                      <span className="text-gray-400">vs last week</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Tasks and Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Recent Tasks</h3>
                    <button className="text-blue-600 text-sm flex items-center">
                      View All <FaChartLine className="ml-1" />
                    </button>
                  </div>

                  <div className="space-y-4">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between border-b pb-3"
                        >
                          <div className="flex items-center">
                            <div
                              className={`w-2 h-2 rounded-full mr-3 ${
                                i % 3 === 0
                                  ? "bg-red-500"
                                  : i % 3 === 1
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                              }`}
                            ></div>
                            <div>
                              <p className="font-medium">
                                {
                                  [
                                    "Website Redesign",
                                    "Marketing Campaign",
                                    "Product Meeting",
                                    "Client Presentation",
                                    "Bug Fixes",
                                  ][i]
                                }
                              </p>
                              <p className="text-sm text-gray-500">
                                Due{" "}
                                {
                                  [
                                    "Today",
                                    "Tomorrow",
                                    "in 2 days",
                                    "Next week",
                                    "in 3 days",
                                  ][i]
                                }
                              </p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500">
                            {i % 2 === 0 ? "High" : "Medium"} Priority
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg">Upcoming</h3>
                    <button className="text-blue-600 text-sm flex items-center">
                      <FaCalendarAlt className="mr-1" /> Calendar
                    </button>
                  </div>

                  <div className="space-y-4">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center border-b pb-3"
                        >
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <span className="font-bold text-blue-600">
                              {["12", "15", "18", "22"][i]}
                            </span>
                          </div>
                          <div>
                            <p className="font-medium">
                              {
                                [
                                  "Team Meeting",
                                  "Client Call",
                                  "Project Deadline",
                                  "Review Session",
                                ][i]
                              }
                            </p>
                            <p className="text-sm text-gray-500">
                              {
                                ["10:00 AM", "2:30 PM", "6:00 PM", "11:00 AM"][
                                  i
                                ]
                              }
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && <TaskList />}
          {activeTab === "whatsapp" && <WhatsAppMessaging />}
          {activeTab === "assistant" && <AssistantChat />}
        </main>
      </div>

      {/* Chat Popup - Available on all pages */}
      <ChatPopup />
    </div>
  );
}
