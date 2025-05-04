"use client";

import ChatPopup from "../components/ChatPopup";
import LandingPage from "../components/LandingPage";
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      {/* Chat Popup - Available on all pages */}
      <LandingPage />
      <ChatPopup />
    </main>
  );
}
