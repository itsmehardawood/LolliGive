import React, { useState, useEffect } from 'react';
import { Check, X, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { apiFetch } from '@/app/lib/api.js';

const PricingSection = ({ isDark = false }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userData, setUserData] = useState(null);
  const [businessVerification, setBusinessVerification] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [verificationLoading, setVerificationLoading] = useState(false);

  // Static features that apply to all plans
  const staticFeatures = [
    { text: 'Front-side card scan', included: true },
    { text: 'Back-side scan', included: true },
    { text: 'AI fraud detection', included: true },
    { text: 'CardNest protection', included: true },
    { text: 'ML data accuracy', included: true },
    { text: 'PCI/DSS security', included: true },
    { text: 'API integration', included: true },
    { text: '24/7 fraud watch', included: true }
  ];

  // Function to map API data to component format
  const mapApiDataToPlans = (apiData) => {
    const planStyles = {
      'Standard': {
        gradient: 'from-purple-500 to-purple-700',
        bgGradient: 'from-purple-100 to-purple-50',
        buttonColor: 'bg-purple-500 hover:bg-purple-600',
        popular: false
      },
      'Premium': {
        gradient: 'from-cyan-400 to-blue-500',
        bgGradient: 'from-cyan-50 to-blue-50',
        buttonColor: 'bg-cyan-500 hover:bg-cyan-600',
        popular: true
      },
      'Enterprise': {
        gradient: 'from-pink-500 to-purple-600',
        bgGradient: 'from-pink-50 to-purple-50',
        buttonColor: 'bg-pink-500 hover:bg-pink-600',
        popular: false
      }
    };

    return apiData.map(plan => {
      const style = planStyles[plan.package_name] || planStyles['Standard'];
      const isEnterprise = plan.package_name === 'Enterprise';
      
      // Create features array
      const features = [...staticFeatures];
      
      // Add overage rate feature
      if (isEnterprise) {
        features.push({ text: 'Card-at-Present (CaP) real-time scan', included: true });
      } else {
        features.push({ text: `Card-at-Present (CaP) real-time scan`, included: true });
      }

      return {
        id: plan.id,
        name: plan.package_name.toUpperCase(),
        subtitle: isEnterprise ? 'CONTACT SUPPORT' : 'FOR BUSINESS',
        price: isEnterprise ? 'CONTACT US' : `$${plan.package_price}`,
        period: plan.package_period.toUpperCase(),
        apiScans: isEnterprise ? 'UNLIMITED*' : `${plan.monthly_limit} API SCANS`,
        gradient: style.gradient,
        bgGradient: style.bgGradient,
        buttonColor: style.buttonColor,
        popular: style.popular,
        features: features,
        originalData: plan // Keep original data for reference
      };
    });
  };

  // Check user data and business verification
  useEffect(() => {
    const checkUserAndVerification = async () => {
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // console.log('User data found in localStorage:', parsedUser);
          
          // Handle nested user object structure
          const userObj = parsedUser.user || parsedUser;
          setUserData(userObj);

          // Fetch business verification status
          if (userObj.id) {
            setVerificationLoading(true);
            const verificationResponse = await apiFetch(
              `/business-profile/business-verification-status?user_id=${userObj.id}`
            );
            
            if (verificationResponse.ok) {
              const verificationData = await verificationResponse.json();
              if (verificationData.status && verificationData.data) {
                setBusinessVerification(verificationData.data);
              }
            }
            setVerificationLoading(false);
          }
        } catch (error) {
          console.error('Error parsing user data or fetching verification:', error);
          setVerificationLoading(false);
        }
      }
    };

    checkUserAndVerification();
  }, []);

  // Fetch plans from API
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const response = await apiFetch('/Packages');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status && data.data) {
          const mappedPlans = mapApiDataToPlans(data.data);
          setPlans(mappedPlans);
        } else {
          throw new Error('Invalid API response format');
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  // Handle plan selection with enterprise redirect logic
  const handlePlanClick = (planId, planName) => {
    // If no user data, redirect to login
    if (!userData) {
      window.location.href = '/login';
      return;
    }

    // If business verification is 'INCOMPLETE PROFILE', show modal
    if (businessVerification && businessVerification.business_verified === 'INCOMPLETE PROFILE') {
      setShowModal(true);
      return;
    }

    // *** UPDATED LOGIC: Check if it's Enterprise plan (Plan 3) ***
    if (planId === 3 || planName === 'ENTERPRISE') {
      // Redirect to enterprise selection page instead of direct payment
      window.location.href = '/enterprise';
      return;
    }

    // For any other plans (1, 2), proceed to payment as usual
    window.location.href = `/payments/${planId}`;
  };

  // Helper function to check if user should be redirected to payments
  const shouldRedirectToPayments = () => {
    if (!userData) return false;
    if (!businessVerification) return true; // If no verification data, allow payment
    return businessVerification.business_verified !== 'INCOMPLETE PROFILE';
  };

  // *** UPDATED: Get redirect path based on plan ***
  const getRedirectPath = (planId, planName) => {
    if (planId === 3 || planName === 'ENTERPRISE') {
      return '/enterprise';
    }
    return `/payments/${planId}`;
  };

  // Modal component
  const VerificationModal = () => (
    <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <AlertCircle className="w-6 h-6 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Profile Incomplete</h3>
          </div>
          <button
            onClick={() => setShowModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="">
          <p className="text-gray-600 mb-3">
            Your profile is not complete yet. You cannot proceed with payment until your business application is approved.
          </p>
          
          {businessVerification && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
              <p className="text-sm text-orange-800 font-medium">
                Status: {businessVerification.business_verified}
              </p>
              {businessVerification.verification_reason && (
                <p className="text-sm text-orange-700 mt-1">
                  Reason: {businessVerification.verification_reason}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Loading state
  if (loading) {
    return (
      <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} py-8 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-3`}>
              Subscription Plans
            </h2>
          </div>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} py-8 px-4`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-3`}>
              Subscription Plans
            </h2>
          </div>
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">Error loading plans: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-4 py-2 rounded-lg"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDark ? 'bg-slate-900' : 'bg-white'} py-8 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-black'} mb-3 px-4`}>
            Subscription Plans
          </h2>
          <p className={`${isDark ? 'text-gray-300' : 'text-gray-400'} text-sm sm:text-base px-4`}>
            Protect your transactions with AI-powered card fraud detection
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.id}
              className={`relative rounded-2xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-cyan-400' : ''
              } w-full`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-cyan-400 text-white px-2 sm:px-3 py-1 text-xs font-semibold rounded-bl-lg z-20">
                  POPULAR
                </div>
              )}
                         
              {/* Header with gradient */}
               <div className={`bg-gradient-to-br ${plan.gradient} p-4 sm:p-6 text-white relative overflow-hidden`}>
                {/* Transparent decorative circles using rgba */}
                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 w-6 sm:w-8 h-6 sm:h-8 rounded-full" style={{backgroundColor: 'rgba(255, 255, 255, 0.1)'}}></div>
                <div className="absolute top-4 sm:top-6 right-4 sm:right-6 w-3 sm:w-4 h-3 sm:h-4 rounded-full" style={{backgroundColor: 'rgba(255, 255, 255, 0.08)'}}></div>
                <div className="absolute bottom-2 sm:bottom-3 left-4 sm:left-6 w-2 sm:w-3 h-2 sm:h-3 rounded-full" style={{backgroundColor: 'rgba(255, 255, 255, 0.06)'}}></div>
                <div className="absolute bottom-4 sm:bottom-6 right-2 sm:right-3 w-4 sm:w-6 h-4 sm:h-6 rounded-full" style={{backgroundColor: 'rgba(255, 255, 255, 0.12)'}}></div>
                
                <div className="relative z-10 w-full flex-col flex justify-center items-center">
                  <h3 className="text-xl sm:text-2xl font-bold text-center">{plan.name}</h3>
                  <p className="text-xs text-gray-300 mb-2 sm:mb-3 text-center">{plan.period}</p>

                  <div className="bg-white/30 flex flex-col items-center justify-center rounded-full h-20 w-20 sm:h-24 sm:w-24 lg:h-30 lg:w-30 mb-2">
                    <span className="text-sm sm:text-lg lg:text-xl font-bold text-center text-white px-2">{plan.price}</span>
                  </div>
                  
                  <div className="text-center">
                    <span className="text-xs font-semibold bg-white/20 px-2 py-1 rounded-full">
                      {plan.apiScans}
                    </span>
                  </div>
                </div>
                
                {/* Wavy bottom border */}
                <div className="absolute bottom-0 left-0 w-full">
                  <svg viewBox="0 0 400 40" className="w-full h-4 sm:h-6" preserveAspectRatio="none">
                    <path 
                      d="M0,20 Q100,0 200,20 T400,20 L400,40 L0,40 Z" 
                      className={`fill-current ${plan.bgGradient.includes('purple') ? 'text-purple-50' : 
                        plan.bgGradient.includes('cyan') ? 'text-cyan-50' : 'text-pink-50'}`}
                    />
                  </svg>
                </div>
              </div>
              
              {/* Features */}
              <div className={`bg-gradient-to-br ${plan.bgGradient} p-4 sm:p-6 relative`}>
                {/* Light wavy overlay at the bottom - behind content */}
                <div className="absolute bottom-0 left-0 w-full pointer-events-none">
                  <svg viewBox="0 0 400 60" className="w-full h-6 sm:h-8" preserveAspectRatio="none">
                    <path 
                      d="M0,30 Q100,10 200,30 T400,30 L400,60 L0,60 Z" 
                      className={`fill-current ${isDark ? 'text-blue-800 opacity-40' : 'text-white opacity-60'}`}
                    />
                  </svg>
                </div>
                
                {/* Content with higher z-index to stay above the wave */}
                <div className="relative z-10">
                  <ul className="space-y-1 sm:space-y-1.5 mb-4 sm:mb-6">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        {feature.included ? (
                          <Check className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 mr-2 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-xs leading-relaxed ${
                          feature.included 
                            ? (isDark ? 'text-gray-900' : 'text-gray-700')
                            : (isDark ? 'text-gray-400' : 'text-gray-400')
                        }`}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  {/* *** UPDATED: Conditional button rendering with enterprise logic *** */}
                  {!userData ? (
                    <button
                      onClick={() => handlePlanClick(plan.id, plan.name)}
                      className={`w-full ${plan.buttonColor} text-white block text-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
                    >
                      {plan.name === 'ENTERPRISE' ? 'SUBSCRIBE NOW →' : 'SUBSCRIBE NOW →'}
                    </button>
                  ) : shouldRedirectToPayments() ? (
                    <Link 
                      href={getRedirectPath(plan.id, plan.name)}
                      className={`w-full ${plan.buttonColor} text-white block text-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
                    >
                      {plan.name === 'ENTERPRISE' ? 'SUBSCRIBE NOW →' : 'SUBSCRIBE NOW →'}
                    </Link>
                  ) : (
                    <button
                      onClick={() => handlePlanClick(plan.id, plan.name)}
                      className={`w-full ${plan.buttonColor} text-white block text-center py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5`}
                    >
                      {plan.name === 'ENTERPRISE' ? 'SUBSCRIBE NOW →' : 'SUBSCRIBE NOW →'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Additional info */}
        <div className="text-center mt-6 sm:mt-8 px-4">
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-500'} text-xs`}>
            * Enterprise plan includes unlimited scans. Standard and Premium plans include ${plans.length > 0 ? `$${plans[0]?.originalData?.overage_rate || '0.10'}` : '$0.10'} per additional scan after monthly limit.
          </p>
        </div>
      </div>

      {/* Modal */}
      {showModal && <VerificationModal />}
    </div>
  );
};

export default PricingSection;

