"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState, useEffect, Suspense } from "react";
import DocumentsScreen from "../components/Dashboard-Screens/DocumentScreens_new";
import DevelopersScreen from "../components/Dashboard-Screens/Developer";
import Sidebar from "../components/Dashboard-Screens/Sidebar";
import HomeScreen from "../components/Dashboard-Screens/Homescreen_new";
import CardFeatureScreen from "../components/Dashboard-Screens/CardFeatureScreen_new";
import SubscriptionsScreen from "../components/Dashboard-Screens/SubscriptionScreen_new";
import MainBusinessScreen from "../components/Dashboard-Screens/BusinessDataScreen/MainBusinessScreen";
import { apiFetch } from "../lib/api.js";
import ScanHistorySection from "../components/Dashboard-Screens/Scanhistory/ScanHistory";
import BillingLogsSection from "../components/Dashboard-Screens/BillingLogsSection/BillingLogsSection";
import DisplaySettings from "../components/Dashboard-Screens/DisplaySettings";
import SubBusinessesScreen from "../components/Dashboard-Screens/SubBusinessesScreen";
import useAutoLogout from "../hooks/Autologout";
import OrganizationRegistration from "../components/Dashboard-Screens/Dynamic Content Screen/DynamicContent";
import SharePageCard from "../components/Dashboard-Screens/Dynamic Content Screen/MyPage";
import Transactions from "../components/Dashboard-Screens/TransactionScreen/Transactions";
import BankInfoForm from "../components/Dashboard-Screens/WithdrawMoney/WithdrawMoney";
import TransactionsAnalytics from "../components/Dashboard-Screens/Reports Screen/Resports";

// Loading component for Suspense fallback
function DashboardLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading dashboard...</p>
      </div>
    </div>
  );
}

// Updated getStatusFromBusinessVerified function
// Function to map business_verified value to status - UPDATE THIS FUNCTION
function getStatusFromBusinessVerified(businessVerified) {
  if (
    businessVerified === null ||
    businessVerified === undefined ||
    businessVerified === ""
  ) {
    return "incomplete-profile";
  }

  switch (businessVerified.toString().toUpperCase()) {
    case "INCOMPLETE PROFILE":
    case "INCOMPLETE_PROFILE":
      return "incomplete-profile";
    case "INCOMPLETE":
      return "incomplete";
    case "PENDING":
      return "pending";
    case "APPROVED":
    case "VERIFIED":
    case "ACTIVE":
      return "approved";
    case "REJECTED":
    case "DECLINED":
      return "rejected";
    case "0":
      return "pending";
    case "1":
      return "approved";
    case "2":
      return "incomplete";
    default:
      return "incomplete-profile";
  }
}

// Separate component that uses useSearchParams
function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
   useAutoLogout(); 


  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [businessName, setBusinessName] = useState(""); // New state for business name

  // Add this function to your dashboard component
  const getUserDataFromStorage = () => {
    try {
      const userData = localStorage.getItem("userData");
      if (!userData) return null;

      const parsedData = JSON.parse(userData);
      return parsedData;
    } catch (error) {
      console.error("Error parsing user data from localStorage:", error);
      return null;
    }
  };

  useEffect(() => {
    // Check authentication and authorization
    const checkAuth = () => {
      const userData = getUserDataFromStorage();

      if (!userData) {
        // No user data found or expired
        // console.log("No valid user data found, redirecting to login");
        router.push("/login");
        return;
      }

      // const userRole = userData.user?.role;

      // if (userRole !== "BUSINESS_USER" && userRole !== "ENTERPRISE_USER") {
      //   // User is not a business user
      //   // console.log("Access denied: User is not a business user");

      //   // Redirect based on their actual role
      //   if (userRole === "SUPER_ADMIN") {
      //     router.push("/admin");
      //   } else {
      //     router.push("/login");
      //   }
      //   return;
      // }

      // User is authenticated and is a business user
      // console.log("Access granted: User is a business user");
      setIsAuthenticated(true);

      // Set user data to state since access is granted
      const userObj = userData.user || userData;
      setUserData(userObj);

      // Extract and set business verification status
      const businessVerifiedStatus = getStatusFromBusinessVerified(
        userObj.business_verified
      );
      setStatus(businessVerifiedStatus);

      // console.log("User object:", userObj);
      // console.log("Business verified status:", userObj.business_verified);
      // console.log("Mapped status:", businessVerifiedStatus);
    };

    checkAuth();
  }, [router]);

  // Check if user came from OTP verification
  useEffect(() => {
    const verified = searchParams.get("verified");
    if (verified === "true") {
      // console.log("User verified via OTP");
    }
    setIsLoading(false);
  }, [searchParams]);

  // Handle screen size changes and set initial sidebar state
  useEffect(() => {
    const checkScreenSize = () => {
      const isLg = window.innerWidth >= 1024; // lg breakpoint is 1024px
      setIsLargeScreen(isLg);

      setSidebarOpen(isLg);
    };

    // Check initial screen size
    checkScreenSize();

    // Add event listener for resize
    window.addEventListener("resize", checkScreenSize);

    // Cleanup event listener
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Auto-close sidebar when switching tabs on small screens
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);

    // Auto-close sidebar on small screens when a tab is selected
    if (!isLargeScreen) {
      setSidebarOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("rememberLogin");
    localStorage.removeItem("savedEmail");
    localStorage.removeItem("savedCountryCode");
    localStorage.removeItem("businessSubmissionId");

    router.replace("/login");
  };

  const [businessInfo, setBusinessInfo] = useState({
    // Business Info
    organization_name: "",
    organization_registration_number: "",
    email: "",
    // Business Address
    street: "",
    street_line2: "",
    city: "",
    state: "",
    zip_code: "",
    country: "United States of America",
    // Account Holder Info
    account_holder_first_name: "",
    account_holder_last_name: "",
    account_holder_email: "",
    account_holder_date_of_birth: "", // Format: YYYY-MM-DD
    account_holder_street: "",
    account_holder_street_line2: "",
    account_holder_city: "",
    account_holder_state: "",
    account_holder_zip_code: "",
    account_holder_country: "",
    account_holder_id_type: "",
    account_holder_id_number: "",
    account_holder_id_document: null, // File object
    // Uploads
    registration_document: null, // File object
  });

  const [documents, setDocuments] = useState([]);
  const [status, setStatus] = useState("incomplete"); // Initialize as incomplete
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API Integration States
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Sidebar items for header title lookup
  const sidebarItems = [
    { id: "home", label: "Home" },
    { id: "profile", label: "Profile Setup" },
    { id: "sub-businesses", label: "Sub Businesses" },
    { id: "balance", label: "Balance" },
    { id: "subscriptions", label: "Subscriptions" },
    { id: "documents", label: "Documents" },
    { id: "Card", label: "Features Settings" },
    { id: "scanshistory", label: "Scan History" },
    { id: "billing", label: "Billing Logs" },
    { id: "displaysettings", label: "Display Settings" },
    { id: "content-setup", label: "Content Setup" },
    { id: "mypage", label: "My Page" },
    { id: "transactions", label: "Transactions" },
    { id: "withdraw-funds", label: "Withdraw Funds" },
    { id: "reports", label: "Reports" },

    

    { id: "developers", label: "Developers", icon: "⚡" },
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      setBusinessInfo((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else {
      setBusinessInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setDocuments((prev) => [...prev, ...files]);
  };

  const removeDocument = (index) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  // API INTEGRATION - Fixed handleSubmit function

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);
    // Validation
    // const requiredFields = ['business_name', 'business_registration_number', 'account_holder_first_name', 'account_holder_last_name', 'street', 'city', 'state', 'country', 'email'];
    // const missingFields = requiredFields.filter(field => !businessInfo[field]?.trim());
    const requiredFields = [
      // Business Info
      "organization_name",
      "organization_registration_number",
      "email",
      "street",
      "city",
      "state",
      "country",
      // Account Holder Info
      "account_holder_first_name",
      "account_holder_last_name",
      "account_holder_email",
      "account_holder_date_of_birth",
      "account_holder_street",
      "account_holder_city",
      "account_holder_state",
      "account_holder_country",
      "account_holder_id_type",
      "account_holder_id_number",
    ];
    const missingFields = requiredFields.filter(
      (field) =>
        !businessInfo[field] || businessInfo[field].toString().trim() === ""
    );
    //check for all Required fields in case of Incomplete profile
    if (missingFields.length > 0) {
      setSubmitError("Please fill in all required field");
      setIsSubmitting(false);
      return;
    }
    if (!businessInfo.account_holder_id_document) {
      setSubmitError(
        "Please upload an identity document for the account holder"
      );
      setIsSubmitting(false);
      return;
    }
    if (!businessInfo.registration_document) {
      setSubmitError("Please upload a business registration document");
      setIsSubmitting(false);
      return;
    }
    try {
      // Prepare FormData for API submission
      const formData = new FormData();
      
      // Debug: Check businessInfo state before adding to FormData
      console.log("=== BusinessInfo State ===");
      console.log("registration_document:", businessInfo.registration_document);
      console.log("account_holder_id_document:", businessInfo.account_holder_id_document);
      console.log("========================");
      
      // Add all business information fields individually
      Object.keys(businessInfo).forEach((key) => {
        const value = businessInfo[key];
        
        // Handle file fields specifically
        if (key === "registration_document" || key === "account_holder_id_document") {
          // Only append if it's an actual File object
          if (value instanceof File) {
            formData.append(key, value);
            console.log(`✓ Added file: ${key} - ${value.name}`);
          } else if (value && typeof value === 'object' && Object.keys(value).length === 0) {
            console.warn(`⚠ Skipping empty object for: ${key}`);
          } else {
            console.warn(`⚠ Invalid file type for ${key}:`, typeof value);
          }
        } 
        // Handle regular fields
        else if (value && value !== "") {
          formData.append(key, value);
        }
      });
      
      //Checking on console
      console.log("=== FormData Debug ===");
      for (let [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(`${key}: [File] ${value.name} (${value.size} bytes, ${value.type})`);
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      console.log("===================");
      
      // Get JWT token from localStorage for authentication
      const storedUserData = localStorage.getItem("userData");
      let jwtToken = null;
      
      if (storedUserData) {
        try {
          const parsedData = JSON.parse(storedUserData);
          jwtToken = parsedData.JWT_token;
        } catch (error) {
          console.error("Error parsing userData for token:", error);
        }
      }

      // Prepare headers with authentication
      // IMPORTANT: Do NOT set Content-Type for FormData with files - browser sets it automatically with boundary
      const headers = {};
      if (jwtToken) {
        headers["Authorization"] = `Bearer ${jwtToken}`;
      }

      // Make API call
      const response = await fetch(
        "http://54.167.124.195:8002/api/organization-profile",
        {
          method: "POST",
          headers: headers,
          body: formData,
        }
      );
      // Check if response is successful
      if (response.ok) {
        let result;
        try {
          result = await response.json();
        } catch (parseError) {
          // If JSON parsing fails, treat as success if status is ok
          result = { message: "Business profile submitted successfully" };
        }
        // FIXED: Handle different success response formats including your API's structure
        const isSuccess =
          result.status === true || // Your API returns status: true
          result.success === true ||
          result.success === "true" ||
          result.message?.includes("successfully") ||
          result.status === "success" ||
          response.status === 200 ||
          response.status === 201;
        if (isSuccess) {
          setStatus("pending");
          setActiveTab("profile");
          setSubmitSuccess(true);
          // Store submission ID for tracking - check your API response structure
          if (typeof window !== "undefined") {
            const submissionId =
              result.data?.id ||
              result.submissionId ||
              result.id ||
              Date.now().toString();
            localStorage.setItem("businessSubmissionId", submissionId);
          }
          // Update userData in localStorage with new business_verified status
          if (userData) {
            // Get the original stored data structure
            const storedUserData = JSON.parse(
              localStorage.getItem("userData") || "{}"
            );
            let updatedUserData;
            if (storedUserData.user) {
              // If nested structure, update the nested user object
              updatedUserData = {
                ...storedUserData,
                user: {
                  ...storedUserData.user,
                  business_verified: "PENDING",
                },
              };
            } else {
              // If flat structure, update directly
              updatedUserData = {
                ...storedUserData,
                business_verified: "PENDING",
              };
            }
            localStorage.setItem("userData", JSON.stringify(updatedUserData));
            // Update state with the user object (not the wrapper)
            const userObj = updatedUserData.user || updatedUserData;
            setUserData(userObj);
            // Immediately check the new status via API
            setTimeout(() => {
              checkBusinessVerificationStatus(userObj.id);
            }, 2000); // Check after 2 seconds to allow server processing
          }
          // console.log("Submission successful:", result);
        } else {
          throw new Error(
            result.error || result.message || "Submission failed"
          );
        }
      } else {
        // Handle HTTP error status codes
        const errorData = await response.json().catch(() => ({}));
        console.error("=== API Error Response ===");
        console.error("Status:", response.status);
        console.error("Error Data:", errorData);
        console.error("========================");
        
        // Format detailed error message if validation errors exist
        let errorMessage = errorData.message || `HTTP error! status: ${response.status}`;
        
        if (errorData.errors && typeof errorData.errors === 'object') {
          const errorDetails = Object.entries(errorData.errors)
            .map(([field, messages]) => {
              const fieldName = field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
              return `${fieldName}: ${Array.isArray(messages) ? messages.join(', ') : messages}`;
            })
            .join('\\n');
          errorMessage += `\\n\\n${errorDetails}`;
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error("Submission failed:", error);
      console.log("data we are sending:", businessInfo);
      // Handle different types of errors
      if (error.message.includes("400")) {
        setSubmitError(
          "Invalid data submitted. Please check your information."
        );
      } else if (error.message.includes("422") || error.message.includes("Validation Error")) {
        setSubmitError(error.message || 
          "Validation Error: Please check all required fields and file formats."
        );
      } else if (error.message.includes("500")) {
        setSubmitError("Server error. Please try again later.");
      } else if (error.message.includes("Failed to fetch")) {
        setSubmitError("Network error. Please check your connection.");
      } else {
        setSubmitError(
          error.message || "An unexpected error occurred. Please try again."
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // API function to check organization verification status and fetch business name
  const checkBusinessVerificationStatus = async (userId) => {
    try {
      // Use org_key_id from localStorage or userData
      const storedOrgKeyId = localStorage.getItem("org_key_id");
      const userOrgKeyId = userData?.org_key_id;
      const orgKeyId = storedOrgKeyId || userOrgKeyId;
      
      if (!orgKeyId) {
        console.warn("No org_key_id found, cannot check verification status");
        return;
      }

      const response = await apiFetch(
        `/organization-profile/get-by-org-key-id?org_key_id=${orgKeyId}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Organization verification API response:", result);

      if (result.status === true) {
        // Handle array response structure - take first item if it's an array
        let businessData;
        let organizationVerified;
        let fetchedBusinessName;
        let verificationReason;
        
        if (Array.isArray(result.data) && result.data.length > 0) {
          businessData = result.data[0];
          organizationVerified = businessData.user?.organization_verified;
          fetchedBusinessName = businessData.organization_name;
          verificationReason = businessData.user?.verification_reason;
        } else if (result.data) {
          businessData = result.data;
          organizationVerified = businessData.business_verified || businessData.user?.organization_verified;
          fetchedBusinessName = businessData.business_profile?.organization_name || businessData.organization_name;
          verificationReason = businessData.verification_reason;
        }
        
        console.log("Organization verified status:", organizationVerified);
        console.log("Organization name:", fetchedBusinessName);

        // Update business name state
        if (fetchedBusinessName) {
          setBusinessName(fetchedBusinessName);
        }

        // Map the organization_verified value to our internal status
        const newStatus = getStatusFromBusinessVerified(organizationVerified);
        setStatus(newStatus);
        console.log("Mapped status:", newStatus);

        // Update localStorage if the status has changed
        if (userData && (userData.organization_verified !== organizationVerified || userData.business_verified !== organizationVerified)) {
          // Get the original stored data structure
          const storedUserData = JSON.parse(
            localStorage.getItem("userData") || "{}"
          );

          let updatedUserData;
          if (storedUserData.user) {
            // If nested structure, update the nested user object
            updatedUserData = {
              ...storedUserData,
              user: {
                ...storedUserData.user,
                organization_verified: organizationVerified,
                business_verified: organizationVerified, // Keep for compatibility
                verification_reason: verificationReason,
              },
            };
          } else {
            // If flat structure, update directly
            updatedUserData = {
              ...storedUserData,
              organization_verified: organizationVerified,
              business_verified: organizationVerified, // Keep for compatibility
              verification_reason: verificationReason,
            };
          }

          localStorage.setItem("userData", JSON.stringify(updatedUserData));

          // Update state with the user object (not the wrapper)
          const userObj = updatedUserData.user || updatedUserData;
          setUserData(userObj);

          console.log("Updated user data in localStorage:", updatedUserData);
        }

        return businessData;
      } else {
        console.warn("API response indicates failure:", result);
        throw new Error(
          result.message || "Failed to retrieve organization verification status"
        );
      }
    } catch (error) {
      console.error("Failed to check organization verification status:", error);

      // Fallback to checking localStorage data if API fails
      if (userData?.organization_verified || userData?.business_verified) {
        const fallbackStatus = getStatusFromBusinessVerified(
          userData.organization_verified || userData.business_verified
        );
        setStatus(fallbackStatus);
        console.log("Using fallback status from localStorage:", fallbackStatus);
      }
    }
  };

  // Legacy API function to check business status (keeping as backup)
  const checkBusinessStatus = async () => {
    try {
      const response = await apiFetch(`/business-profile`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        // Check the business_verified field to determine status
        const businessVerified = result.data?.user?.business_verified;

        const newStatus = getStatusFromBusinessVerified(businessVerified);
        setStatus(newStatus);

        // Update localStorage if the status has changed
        if (userData && userData.business_verified !== businessVerified) {
          // Get the original stored data structure
          const storedUserData = JSON.parse(
            localStorage.getItem("userData") || "{}"
          );

          let updatedUserData;
          if (storedUserData.user) {
            // If nested structure, update the nested user object
            updatedUserData = {
              ...storedUserData,
              user: {
                ...storedUserData.user,
                business_verified: businessVerified,
              },
            };
          } else {
            // If flat structure, update directly
            updatedUserData = {
              ...storedUserData,
              business_verified: businessVerified,
            };
          }

          localStorage.setItem("userData", JSON.stringify(updatedUserData));

          // Update state with the user object (not the wrapper)
          const userObj = updatedUserData.user || updatedUserData;
          setUserData(userObj);
        }

        return result.data;
      }
    } catch (error) {
      console.error("Failed to check business status:", error);
    }
  };

  // Update businessInfo email when userData becomes available
  useEffect(() => {
    if (userData?.email && businessInfo.email === "") {
      setBusinessInfo((prev) => ({
        ...prev,
        email: userData.email,
      }));
    }
  }, [userData?.email]);

  // Check status on component mount and periodically
  useEffect(() => {
    // Get org_key_id from localStorage or userData
    const storedOrgKeyId = localStorage.getItem("org_key_id");
    const userOrgKeyId = userData?.org_key_id;
    const orgKeyId = storedOrgKeyId || userOrgKeyId;
    
    if (orgKeyId) {
      // Initial status check when org_key_id is available
      checkBusinessVerificationStatus();

      // Set up periodic status checking (every 30 seconds)
      const statusCheckInterval = setInterval(() => {
        checkBusinessVerificationStatus();
      }, 30000);

      // Cleanup interval on component unmount
      return () => clearInterval(statusCheckInterval);
    }
  }, [userData?.org_key_id]);

  // Legacy status check (keeping for backward compatibility)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const submissionId = localStorage.getItem("businessSubmissionId");
      if (submissionId && !userData?.id) {
        // Only use legacy method if user ID is not available
        checkBusinessStatus();
      }
    }
  }, [userData?.id]);

  // Function to get header title
  const getHeaderTitle = () => {
    if (businessName) {
      return `Welcome ${businessName}`;
    }
    // Fallback to current tab name if business name is not available
    return sidebarItems.find((item) => item.id === activeTab)?.label || "Dashboard";
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <HomeScreen status={status} setActiveTab={handleTabChange} />;

      case "profile":
        return (
          <MainBusinessScreen
            businessInfo={businessInfo}
            documents={documents}
            status={status}
            setBusinessInfo={setBusinessInfo}
            isSubmitting={isSubmitting}
            submitError={submitError}
            submitSuccess={submitSuccess}
            handleInputChange={handleInputChange}
            handleFileUpload={handleFileUpload}
            removeDocument={removeDocument}
            handleSubmit={handleSubmit}
            router={router}
          />
        );

      case "subscriptions":
        return <SubscriptionsScreen />;

      case "Card":
        return <CardFeatureScreen />;

      case "documents":
        return (
          <DocumentsScreen
            documents={documents}
            setActiveTab={handleTabChange}
            handleFileUpload={handleFileUpload}
          />
        );

      case "scanshistory":
        return <ScanHistorySection />;
      case "billing":
        return <BillingLogsSection />;
      case "displaysettings":
        return <DisplaySettings />;

        case "sub-businesses":
  return <SubBusinessesScreen />;
      case "developers":
        return <DevelopersScreen />;

      case "content-setup":
        return <OrganizationRegistration />;

      case "mypage":
        return <SharePageCard />;

      case "transactions":
        return <Transactions />;

        case "withdraw-funds":
        return <BankInfoForm/>

        case "reports":
          return <TransactionsAnalytics/>;




      default:
        return null;
    }
  };

  if (isLoading) {
    return <DashboardLoader />;
  }

  return (
    <div className="h-screen bg-black text-black flex overflow-hidden">
      {/* Fixed Sidebar - No scrolling */}
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        status={status}
        isLargeScreen={isLargeScreen}
      />

      {/* Main Content Area - Scrollable */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <header className="flex-shrink-0 bg-gray-900 text-white shadow-sm border-b border-gray-700">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              {/* Mobile menu button - only show on small screens */}
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">
                  {getHeaderTitle()}
                </h2>
              </div>
              <div className="flex items-center space-x-4">
                {/* <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
    {businessInfo.account_holder_first_name ? businessInfo.account_holder_first_name.charAt(0).toUpperCase() : 'U'}
  </div> */}
                <button
                  onClick={handleLogout}
                  className="text-sm text-red-400 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className=" p-3 bg-black">{renderContent()}</div>
        </div>
      </div>

      {/* Overlay for mobile when sidebar is open */}
      {sidebarOpen && !isLargeScreen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

// Main component wrapped with Suspense
function ClientDashboard() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <DashboardContent />
    </Suspense>
  );
}

export default ClientDashboard;