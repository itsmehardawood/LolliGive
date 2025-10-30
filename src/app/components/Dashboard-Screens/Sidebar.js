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
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { FaMoneyBill } from "react-icons/fa";

const Sidebar = ({
  sidebarOpen,
  setSidebarOpen,
  activeTab,
  setActiveTab,
  status,
  selectedOrg,
  setSelectedOrg,
}) => {
  const [email, setEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  const [expandedOrg, setExpandedOrg] = useState(null);

  // Mock organizations data for leader role (replace with API call when ready)
  const [leaderOrganizations, setLeaderOrganizations] = useState([
    { id: 1, name: "Organization A", slug: "org-a" },
    { id: 2, name: "Organization B", slug: "org-b" },
    { id: 3, name: "Organization C", slug: "org-c" },
    { id: 4, name: "Organization D", slug: "org-d" },
  ]);

  useEffect(() => {
    const storedData = localStorage.getItem("userData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const userEmail = parsed?.user?.email || parsed?.email;
        const role = parsed?.user?.role;

        if (userEmail) setEmail(userEmail);
        if (role) setUserRole(role);

        // For testing: Uncomment to test leader role
        // setUserRole("LEADER");



        // Set first org as default for leader
        if ( 
          role === "LEADER" &&
          leaderOrganizations.length > 0 &&
          !selectedOrg
        ) {
          setSelectedOrg(leaderOrganizations[0]);
        }
      } catch (err) {
        console.error("Error parsing user data from localStorage:", err);
      }
    }
  }, []);

  // Handle organization toggle
  const toggleOrg = (org) => {
    if (expandedOrg?.id === org.id) {
      setExpandedOrg(null);
    } else {
      setExpandedOrg(org);
    }
  };

  // Handle tab selection for leader role
  const handleLeaderTabClick = (org, tabId) => {
    setSelectedOrg(org);
    setActiveTab(tabId);
    setExpandedOrg(null); // Collapse dropdown after selection
  }; 

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
          {userRole === "LEADER" ? (
            // Leader Role: Show organizations with dropdown tabs
            <>
              {sidebarOpen && (
                <div className="text-xs text-gray-400 uppercase tracking-wider mb-3 px-2">
                  Your Organizations
                </div>
              )}
              {leaderOrganizations.map((org) => (
                <div key={org.id} className="mb-2">
                  {/* Organization Header */}
                  <button
                    onClick={() => toggleOrg(org)}
                    className={`group relative w-full flex items-center ${
                      sidebarOpen ? "px-4 py-3" : "px-2 py-3 justify-center"
                    } text-left rounded-lg transition-colors ${
                      selectedOrg?.id === org.id
                        ? "bg-blue-800 border border-blue-600"
                        : "bg-gray-800 hover:bg-gray-700"
                    }`}
                    style={{ color: "#ffffff" }}
                  >
                    <Building2 className="w-5 h-5 flex-shrink-0" />
                    {sidebarOpen && (
                      <>
                        <span className="ml-3 font-medium flex-1 truncate">
                          {org.name}
                        </span>
                        {expandedOrg?.id === org.id ? (
                          <ChevronUp className="w-4 h-4 ml-2" />
                        ) : (
                          <ChevronDown className="w-4 h-4 ml-2" />
                        )}
                      </>
                    )}
                    {!sidebarOpen && (
                      <span className="absolute left-14 top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition duration-200 whitespace-nowrap z-50">
                        {org.name}
                      </span>
                    )}
                  </button>

                  {/* Dropdown Tabs for this Organization */}
                  {sidebarOpen && expandedOrg?.id === org.id && (
                    <div className="mt-1 ml-4 space-y-1 border-l-2 border-gray-700 pl-2">
                      {baseSidebarItems.map((item) => (
                        <button
                          key={`${org.id}-${item.id}`}
                          onClick={() => handleLeaderTabClick(org, item.id)}
                          className={`w-full flex items-center px-3 py-2 text-left rounded-lg transition-colors ${
                            activeTab === item.id && selectedOrg?.id === org.id
                              ? "bg-gray-700 border border-gray-600"
                              : "hover:bg-gray-800"
                          }`}
                          style={{ color: "#ffffff" }}
                        >
                          <span className="w-4 h-4 mr-2">{item.icon}</span>
                          <span className="text-sm">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </>
          ) : (
            // Regular User/Enterprise Role: Show normal tabs
            <>
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
                  style={{
                    color: activeTab === item.id ? "#ffffff" : "#ffffff",
                  }}
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
            </>
          )}
        </nav>
      </div>

      {/* Status & User Info */}
      <div className="flex-shrink-0 p-4 border-t border-gray-700 space-y-3">
        {sidebarOpen && (
          <>
            {userRole === "LEADER" && selectedOrg && (
              <div className="text-xs text-gray-400 bg-gray-800 px-3 py-2 rounded-lg text-center">
                Viewing:{" "}
                <span className="font-medium text-blue-400">
                  {selectedOrg.name}
                </span>
              </div>
            )}
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
                {userRole === "LEADER"
                  ? "L"
                  : userRole === "ENTERPRISE_USER"
                  ? "E"
                  : "U"}
              </div>
              <div className="min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "#ffffff" }}
                >
                  {userRole === "LEADER"
                    ? "Leader Account"
                    : userRole === "ENTERPRISE_USER"
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
              {userRole === "LEADER"
                ? "L"
                : userRole === "ENTERPRISE_USER"
                ? "E"
                : "U"}
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

//  https://api.lolligive.com/api/transaction/show and  https://api.lolligive.com/api/organization-profile/get-by-org-key-id?org_key_id=9032433V31Q43796
// These are two api endpoints used in the application we can utilise them as it is in case of leader board and organization profile. We need to return all org_key_ids associated with that specific leader in login API response in case of role will be leader.
