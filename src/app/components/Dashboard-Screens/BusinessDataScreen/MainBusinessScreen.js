/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useEffect } from "react";
import ApprovedStatus from "./ApprovedScreen";
import PendingStatus from "./PendingScreen";
import BusinessForm from "./BusinessForm";
import { apiFetch } from "@/app/lib/api.js";


function MainBusinessScreen({
  businessInfo,
  documents,
  setBusinessInfo,
  status,
  isSubmitting,
  submitError,
  submitSuccess,
  handleInputChange,
  handleFileUpload,
  removeDocument,
  handleSubmit,
  router,
}) {
  const [userData, setUserData] = useState(null);
  const [verificationData, setVerificationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Extract the API fetch logic into a separate function
  const fetchBusinessVerificationStatus = async () => {
    try {
      setLoading(true); // Set loading when refetching
      const storedUser = localStorage.getItem("userData");

      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        // console.log("User data found in localStorage:", parsedUser);

        // Handle nested user object structure - extract the user object
        const userObj = parsedUser.user || parsedUser;
        
        // Set userData with organization_verified for easy access
        // Check multiple possible locations for organization_verified
        const orgVerified = userObj.organization_verified || 
                           userObj.business_verified || 
                           parsedUser.organization_verified ||
                           parsedUser.business_verified;
        
        const enhancedUserObj = {
          ...userObj,
          organization_verified: orgVerified,
          business_verified: orgVerified // Keep for compatibility
        };
        
        setUserData(enhancedUserObj);
        // console.log("Enhanced userData set:", enhancedUserObj);

        // Fetch business verification status from API
        const orgKeyId = userObj.org_key_id || localStorage.getItem("org_key_id");
        
        if (orgKeyId) {
          const response = await apiFetch(
            `/organization-profile/get-by-org-key-id?org_key_id=${orgKeyId}`
          );
      
          if (response.ok) {
            const data = await response.json();
            // console.log("Organization verification API response:", data);
            
            // Handle array response structure - take first item if it's an array
            if (data.status && data.data && Array.isArray(data.data) && data.data.length > 0) {
              // Transform array response to match expected structure
              const transformedData = {
                status: data.status,
                data: {
                  business_profile: data.data[0],
                  business_verified: data.data[0].user?.organization_verified,
                  verification_status: data.data[0].user?.organization_verified,
                  verification_reason: data.data[0].user?.verification_reason,
                  user_id: data.data[0].user_id
                }
              };
              // console.log("Transformed verification data:", transformedData);
              setVerificationData(transformedData);
              setApiError(null);
              
              // Update localStorage with the latest verification status
              const latestOrgVerified = data.data[0].user?.organization_verified;
              if (latestOrgVerified && storedUser) {
                try {
                  const updatedStorage = {
                    ...parsedUser,
                    user: {
                      ...(parsedUser.user || parsedUser),
                      organization_verified: latestOrgVerified,
                      business_verified: latestOrgVerified
                    }
                  };
                  localStorage.setItem("userData", JSON.stringify(updatedStorage));
                  // console.log("Updated localStorage with verification status:", latestOrgVerified);
                  
                  // Also update the state
                  setUserData({
                    ...enhancedUserObj,
                    organization_verified: latestOrgVerified,
                    business_verified: latestOrgVerified
                  });
                } catch (err) {
                  console.error("Error updating localStorage:", err);
                }
              }
            } else if (data.status && data.data) {
              // Handle non-array response
              setVerificationData(data);
              setApiError(null);
            } else {
              console.error("Invalid API response structure:", data);
              setApiError("Invalid response from server");
            }
          } else {
            console.error("Failed to fetch organization verification status");
            setApiError("Failed to load organization verification status");
          }
        }
      }
    } catch (error) {
      console.error("Error fetching organization verification status:", error);
      setApiError("Error loading organization verification status");
    } finally {
      setLoading(false);
    }
  };

  // For autofill data from API in input fields 
  useEffect(() => {
    fetchBusinessVerificationStatus();
  }, [reloadTrigger]); // Separate useEffect for API call

  useEffect(() => { 
    const profile = verificationData?.data?.business_profile;
    
    //when 'incomplete' status
    if (status === 'incomplete' && profile) {
      setBusinessInfo((prev) => ({
        organization_name: profile.organization_name || '',
        organization_registration_number: profile.organization_registration_number || '',
        email: profile.email || '',
        street: profile.street || '',
        street_line2: profile.street_line2 || '',
        city: profile.city || '',
        state: profile.state || '',
        zip_code: profile.zip_code || '',
        country: profile.country || '',
        account_holder_first_name: profile.account_holder_first_name || '',
        account_holder_last_name: profile.account_holder_last_name || '',
        account_holder_email: profile.account_holder_email || '',
        account_holder_date_of_birth: profile.account_holder_date_of_birth || '',
        account_holder_street: profile.account_holder_street || '',
        account_holder_street_line2: profile.account_holder_street_line2 || '',
        account_holder_city: profile.account_holder_city || '',
        account_holder_state: profile.account_holder_state || '',
        account_holder_zip_code: profile.account_holder_zip_code || '',
        account_holder_country: profile.account_holder_country || '',
        account_holder_id_type: profile.account_holder_id_type || '',
        account_holder_id_number: profile.account_holder_id_number || '',
        // IMPORTANT: Preserve existing uploaded files if they exist
        account_holder_id_document: prev.account_holder_id_document || null,
        registration_document: prev.registration_document || null
      }));
    }
    // to autofill email when user SignUp first-time and route to dashboard form
    else if (status === 'incomplete-profile') {
      const localData = localStorage.getItem('userData');
    
      if (localData) {
        try {
          const parsedData = JSON.parse(localData);
          // console.log('Parsed userData:', parsedData);
          const userEmail = parsedData?.user?.email || ''; // ← nested inside `user`
          // console.log('Extracted email:', userEmail);
          
          setBusinessInfo((prev) => ({
            ...prev,
            email: userEmail,
          }));
        } catch (error) {
          console.error('Error parsing userData:', error);
        }
      }
    }
  }, [status, verificationData]); // Add verificationData as dependency

  // Enhanced submit handler that triggers reload
  const handleSubmitWithReload = async () => {
    try {
      await handleSubmit(); // Call the original submit function
      
      // Wait a bit for the server to process the submission
      setTimeout(() => {
        setReloadTrigger(prev => prev + 1); // Trigger reload by updating state
      }, 1000); // 1 second delay to allow server processing
      
    } catch (error) {
      console.error("Error during submission:", error);
    }
  };

  // Manual reload function for retry button
  const handleManualReload = () => {
    setReloadTrigger(prev => prev + 1);
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="bg-black rounded-lg shadow-sm  p-6">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12  border-blue-600 mx-auto mb-4"></div>
          <p className="text-white">
            Loading Organization verification status...
          </p>
        </div>
      </div>
    );
  }

  // Show error state if API call failed
  if (apiError) {
    return (
      <div className="bg-black rounded-lg shadow-sm border border-gray-800 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h2 className="text-xl font-semibold text-white mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-300 mb-6">{apiError}</p>
          <button
            onClick={handleManualReload} // Use the manual reload function
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Check verification status and render appropriate view
  // Handle both old and new API response structures
  const verificationStatus = verificationData?.data?.business_verified;
  
  // Also check organization_verified from userData (stored in localStorage during login)
  // Check both organization_verified and business_verified for backward compatibility
  const organizationVerified = userData?.organization_verified || userData?.business_verified;

  // Priority: Use organization_verified from userData if available, fallback to verification status from API
  const currentStatus = organizationVerified || verificationStatus;
  
  // console.log("Current verification status:", {
  //   fromUserData: organizationVerified,
  //   fromAPI: verificationStatus,
  //   final: currentStatus,
  //   userDataKeys: userData ? Object.keys(userData) : 'no userData'
  // });

  if (currentStatus === "APPROVED" || currentStatus === "VERIFIED" || currentStatus === "ACTIVE") {
    return <ApprovedStatus verificationData={verificationData} />;
  }

  if (currentStatus === "PENDING" || status === "pending") {
    return (
      <PendingStatus 
        verificationData={verificationData}
        userData={userData}
        submitSuccess={submitSuccess}
        handleManualReload={handleManualReload}
        router={router}
      />
    );
  }

  return (
    <BusinessForm 
      businessInfo={businessInfo}
      setBusinessInfo={setBusinessInfo}
      handleInputChange={handleInputChange}
      handleSubmitWithReload={handleSubmitWithReload}
      isSubmitting={isSubmitting}
      submitError={submitError}
      submitSuccess={submitSuccess}
    />
  );
}

export default MainBusinessScreen;