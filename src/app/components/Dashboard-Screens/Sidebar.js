"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  User,
  FileText,
  BadgeDollarSign,
  ClipboardList,
  Zap,
  ChevronLeft,
  ChevronRight,
  History,
  Receipt,
  Settings,
  Building2,
  Globe,
  SeparatorVerticalIcon,
  HistoryIcon,
} from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  status,
}) => {
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const userEmail = parsed?.user?.email || parsed?.email;
        const role = parsed?.user?.role;

        if (userEmail) setEmail(userEmail);
        if (role) setUserRole(role);
      } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
      }
    }
  }, []);

  const baseSidebarItems = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    {
      id: "content-setup",
      label: "Content Setup",
      icon: <SeparatorVerticalIcon className="w-5 h-5" />,
    },
        { id: "mypage", label: "My Page", icon: <Globe className="w-5 h-5" /> },

          {
      id: "transactions",
      label: "Transactions",
      icon: <HistoryIcon className="w-5 h-5" />,
    },

    {
      id: "reports",
      label: "Reports",
      icon: <ClipboardList className="w-5 h-5" />,
    },
  


    {
      id: "withdraw-funds",
      label: "Withdraw Funds",
      icon: <FileText className="w-5 h-5" />,
    },
  ];

  // Add Sub Businesses tab for enterprise users
  const sidebarItems =
    userRole === "ENTERPRISE_USER"
      ? [
          ...baseSidebarItems.slice(0, 2), // Home and Business Profile
          ...baseSidebarItems.slice(2), // Rest of the items
        ]
      : baseSidebarItems;

  const statusColor = {
    active: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-blue-100 text-blue-800",
    "incomplete-profile": "bg-orange-100 text-orange-800",
    incomplete: "bg-red-100 text-red-800",
  };

  return (
    <div
      className={`${
        sidebarOpen ? "w-64" : "w-16"
      } bg-gray-900 shadow-lg border-r border-gray-700 transition-all duration-300 ease-in-out flex flex-col h-screen z-40`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-gray-700">
        {sidebarOpen && (
          <h1 className="text-xl font-bold" style={{ color: "#ffffff" }}>
            Dashboard
          </h1>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded hover:bg-gray-800 transition-colors"
        >
          {sidebarOpen ? (
            <ChevronLeft className="w-5 h-5" style={{ color: "#ffffff" }} />
          ) : (
            <ChevronRight className="w-5 h-5" style={{ color: "#ffffff" }} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className={`${sidebarOpen ? "px-4" : "px-2"} space-y-1`}>
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`group relative w-full flex items-center ${
                sidebarOpen ? "px-4 py-3" : "px-2 py-3 justify-center"
              } text-left rounded-lg transition-colors ${
                activeTab === item.id
                  ? "bg-gray-800 border border-gray-600"
                  : "hover:bg-gray-800"
              }`}
              style={{ color: activeTab === item.id ? "#ffffff" : "#ffffff" }}
            >
              {item.icon}
              {sidebarOpen && (
                <span className="ml-3 font-medium">{item.label}</span>
              )}
              {!sidebarOpen && (
                <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap z-50">
                  {item.label}
                </span>
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Status & User Info */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700 space-y-3">
        {sidebarOpen && (
          <>
            <div
              className={`text-sm font-medium text-center rounded-full px-3 py-2 ${
                statusColor[status] || "bg-gray-800 text-gray-200"
              }`}
            >
              Status:{" "}
              {status === "incomplete-profile"
                ? "Incomplete Profile"
                : status?.charAt(0).toUpperCase() + status?.slice(1)}
            </div>
            <div className="flex items-center space-x-2 bg-gray-800 px-3 py-2 rounded-lg">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                {userRole === "enterprise_user" ? "E" : "U"}
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "#ffffff" }}
                >
                  {userRole === "enterprise_user"
                    ? "Enterprise Account"
                    : "User Account"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {email || "Loading..."}
                </p>
              </div>
            </div>
          </>
        )}

        {!sidebarOpen && (
          <div className="flex justify-center relative group">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
              {userRole === "enterprise_user" ? "E" : "U"}
            </div>
            <div className="absolute left-10 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
              {email || "Loading..."}
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-800 rotate-45"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
