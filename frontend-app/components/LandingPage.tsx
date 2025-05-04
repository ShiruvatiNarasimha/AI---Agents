"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import {
  FaArrowRight,
  FaTasks,
  FaWhatsapp,
  FaRobot,
  FaUser,
  FaLock,
  FaSignOutAlt,
} from "react-icons/fa";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export default function LandingPage() {
  const { status } = useSession();
  const [email, setEmail] = useState("");

  const features: Feature[] = [
    {
      icon: <FaTasks className="text-4xl text-blue-600" />,
      title: "Task Management",
      description:
        "Create, track, and complete tasks in Asana with a sleek, intuitive interface.",
    },
    {
      icon: <FaWhatsapp className="text-4xl text-green-600" />,
      title: "WhatsApp Integration",
      description:
        "Send messages and notifications directly through WhatsApp from our platform.",
    },
    {
      icon: <FaRobot className="text-4xl text-purple-600" />,
      title: "AI Assistant",
      description:
        "Get help from our intelligent assistant to manage tasks and communications efficiently.",
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thanks for subscribing with ${email}! We'll keep you updated.`);
    setEmail("");
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <div className="min-h-screen">
      {/* Header/Navigation */}
      <header className="absolute w-full z-10 py-4">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div className="text-white font-bold text-2xl">
              TaskFlow<span className="text-blue-400">AI</span>
            </div>
            <nav className="hidden md:flex space-x-10">
              <a
                href="#features"
                className="text-white hover:text-blue-200 transition"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-white hover:text-blue-200 transition"
              >
                Testimonials
              </a>
              <a
                href="#pricing"
                className="text-white hover:text-blue-200 transition"
              >
                Pricing
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              {status === "authenticated" ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-white hover:text-blue-200 transition flex items-center"
                  >
                    <FaUser className="mr-1" /> Dashboard
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="bg-white text-blue-700 hover:bg-blue-100 transition py-2 px-4 rounded-lg font-medium flex items-center"
                  >
                    <FaSignOutAlt className="mr-1" /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/auth"
                    className="text-white hover:text-blue-200 transition flex items-center"
                  >
                    <FaUser className="mr-1" /> Login
                  </Link>
                  <Link
                    href="/auth"
                    className="bg-white text-blue-700 hover:bg-blue-100 transition py-2 px-4 rounded-lg font-medium flex items-center"
                    onClick={() => {
                      // You could set a query param or store in localStorage to show signup tab
                      localStorage.setItem("authMode", "signup");
                    }}
                  >
                    <FaLock className="mr-1" /> Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section - Updated with a modern design */}
      <section className="relative bg-gradient-to-r from-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 py-28 flex flex-col md:flex-row items-center relative z-0">
          <div className="flex flex-col w-full md:w-1/2 justify-center items-start pt-12 pb-24 px-6">
            <h1 className="font-bold text-5xl my-4 leading-tight">
              Boost Your Productivity
            </h1>
            <p className="leading-relaxed mb-8 text-xl">
              Seamlessly manage tasks and communications with our AI-powered
              Asana and WhatsApp integration platform.
            </p>
            <div className="flex flex-wrap gap-4">
              {status === "authenticated" ? (
                <Link
                  href="/dashboard"
                  className="bg-white text-blue-700 font-bold rounded-lg px-6 py-3 hover:bg-blue-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
                >
                  Go to Dashboard <FaArrowRight className="ml-2" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-white text-blue-700 font-bold rounded-lg px-6 py-3 hover:bg-blue-100 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center"
                  >
                    Get Started <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    href="/auth"
                    className="bg-transparent border-2 border-white text-white font-bold rounded-lg px-6 py-3 hover:bg-white hover:text-blue-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    Try Demo
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="w-full md:w-1/2 py-6 text-center">
            <div className="bg-white rounded-xl shadow-2xl p-6 mx-auto max-w-md transform transition hover:-translate-y-2 hover:shadow-3xl bg-opacity-95 backdrop-blur-sm">
              <div className="flex justify-between items-center border-b pb-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center mr-3">
                    <FaTasks />
                  </div>
                  <div>
                    <h3 className="text-gray-800 font-bold">Weekly Report</h3>
                    <p className="text-gray-500 text-sm">Tasks Overview</p>
                  </div>
                </div>
                <span className="text-gray-400">Today</span>
              </div>
              <div className="py-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">Completed Tasks</span>
                  <span className="text-green-600 font-bold">24</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-gray-700">Pending Tasks</span>
                  <span className="text-yellow-600 font-bold">8</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: "75%" }}
                  ></div>
                </div>
                <p className="text-gray-500 text-sm mt-2">
                  75% tasks completed this week
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="w-full h-auto"
          >
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,117.3C672,107,768,117,864,144C960,171,1056,213,1152,213.3C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Features Section - Updated with cards and animations */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              Features
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              Powerful Features
            </h2>
            <p className="text-gray-600 mt-4 text-xl max-w-2xl mx-auto">
              Everything you need to manage tasks and communications efficiently
            </p>
          </div>

          <div className="flex flex-wrap -mx-4">
            {features.map((feature, index) => (
              <div key={index} className="w-full md:w-1/3 px-4 mb-8">
                <div className="bg-white rounded-xl p-8 shadow-lg h-full transform transition duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100">
                  <div className="mb-6 inline-block p-4 bg-gray-50 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-2xl mb-4 text-gray-800">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Updated with modern cards */}
      <section id="testimonials" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              Testimonials
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              What Our Users Say
            </h2>
            <p className="text-gray-600 mt-4 text-xl">
              Trusted by thousands of teams worldwide
            </p>
          </div>

          <div className="flex flex-wrap -mx-4">
            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 shadow h-full relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl"></div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mr-4 overflow-hidden">
                    <img
                      src="https://randomuser.me/api/portraits/women/42.jpg"
                      alt="Sarah Johnson"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Sarah Johnson</h4>
                    <p className="text-gray-600 text-sm">Product Manager</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  This platform has streamlined our team&apos;s workflow
                  tremendously. The WhatsApp integration is a game-changer!
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/3 px-4 mb-8 md:mt-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 shadow h-full relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl"></div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mr-4 overflow-hidden">
                    <img
                      src="https://randomuser.me/api/portraits/men/32.jpg"
                      alt="Michael Chen"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Michael Chen</h4>
                    <p className="text-gray-600 text-sm">Tech Lead</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  The AI assistant has saved us countless hours. It&apos;s like
                  having an extra team member who&apos;s always available.
                </p>
              </div>
            </div>

            <div className="w-full md:w-1/3 px-4 mb-8">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 shadow h-full relative">
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl"></div>
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full mr-4 overflow-hidden">
                    <img
                      src="https://randomuser.me/api/portraits/women/68.jpg"
                      alt="Emma Rodriguez"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold">Emma Rodriguez</h4>
                    <p className="text-gray-600 text-sm">Startup Founder</p>
                  </div>
                </div>
                <p className="text-gray-600 italic">
                  As a small business owner, this tool helps me stay organized
                  and communicate with my team efficiently. Worth every penny!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section - New addition */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wide">
              Pricing
            </span>
            <h2 className="text-4xl font-bold text-gray-800 mt-2">
              Plans for Every Team
            </h2>
            <p className="text-gray-600 mt-4 text-xl max-w-2xl mx-auto">
              Choose the plan that works best for your needs
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {/* Free Plan */}
            <div className="w-full md:w-1/4 bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Free</h3>
                <div className="text-4xl font-bold mb-6">
                  $0
                  <span className="text-xl text-gray-600 font-normal">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    5 Asana tasks
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    10 WhatsApp messages
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Basic AI assistance
                  </li>
                </ul>
                <Link
                  href="/auth"
                  className="block w-full py-3 px-4 text-center bg-gray-200 text-gray-800 font-medium rounded-lg hover:bg-gray-300 transition"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Pro Plan */}
            <div className="w-full md:w-1/4 bg-white rounded-xl shadow-xl overflow-hidden relative transform transition duration-300 hover:-translate-y-2 hover:shadow-2xl border-2 border-blue-500">
              <div className="absolute top-0 right-0 bg-blue-500 text-white px-3 py-1 text-sm font-bold">
                Popular
              </div>
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Pro</h3>
                <div className="text-4xl font-bold mb-6">
                  $29
                  <span className="text-xl text-gray-600 font-normal">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Unlimited Asana tasks
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    500 WhatsApp messages
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Advanced AI assistance
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Team collaboration
                  </li>
                </ul>
                <Link
                  href="/auth"
                  className="block w-full py-3 px-4 text-center bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Get Started
                </Link>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="w-full md:w-1/4 bg-white rounded-xl shadow-lg overflow-hidden transform transition duration-300 hover:-translate-y-2 hover:shadow-xl">
              <div className="p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  Enterprise
                </h3>
                <div className="text-4xl font-bold mb-6">
                  $99
                  <span className="text-xl text-gray-600 font-normal">/mo</span>
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Unlimited everything
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Dedicated support
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Custom integrations
                  </li>
                  <li className="flex items-center">
                    <svg
                      className="w-5 h-5 text-green-500 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      ></path>
                    </svg>
                    Advanced analytics
                  </li>
                </ul>
                <Link
                  href="/auth"
                  className="block w-full py-3 px-4 text-center bg-gray-800 text-white font-medium rounded-lg hover:bg-black transition"
                >
                  Contact Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Updated with gradient background */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
        <div className="absolute inset-0 bg-[url('/circuit-pattern.svg')] opacity-10"></div>
        <div className="container mx-auto px-6 py-20 relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
            <p className="text-xl mb-12 text-blue-100">
              Join thousands of teams that use our platform to boost
              productivity and streamline communications.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              {status === "authenticated" ? (
                <Link
                  href="/dashboard"
                  className="bg-white text-blue-700 font-bold rounded-lg px-8 py-4 hover:bg-blue-50 transition shadow-lg inline-flex items-center"
                >
                  Go to Dashboard <FaArrowRight className="ml-2" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="bg-white text-blue-700 font-bold rounded-lg px-8 py-4 hover:bg-blue-50 transition shadow-lg inline-flex items-center"
                  >
                    Get Started Now <FaArrowRight className="ml-2" />
                  </Link>
                  <Link
                    href="/auth"
                    className="bg-transparent border-2 border-white text-white font-bold rounded-lg px-8 py-4 hover:bg-white hover:text-blue-700 transition shadow-lg"
                  >
                    Schedule Demo
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="max-w-xl mx-auto text-center">
            <h3 className="text-3xl font-bold mb-4 text-gray-800">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-8">
              Subscribe to our newsletter for the latest features and updates.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex flex-wrap md:flex-nowrap gap-4"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-xl font-bold mb-4">
                TaskFlow<span className="text-blue-400">AI</span>
              </h4>
              <p className="text-gray-400 mb-4">
                Seamlessly manage tasks and communications with our AI-powered
                platform.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                  </svg>
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h5 className="font-bold mb-4">Product</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#features"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Integrations
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Resources</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Support
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Company</h5>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    About
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} TaskFlowAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
