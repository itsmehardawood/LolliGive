// "use client";
// import { useState, useEffect, useRef } from 'react';

// // Environment configuration
// const DEMO_MODE = false; // Set to true for testing
// const HPP_URL = DEMO_MODE 
//   ? 'https://uat.hpp.converge.eu.elavonaws.com'
//   : 'https://hpp.na.elavonpayments.com';

// export default function DonationSection({ donationData, organizationSlug, orgId }) {
//   const {
//     title = "Support Our Mission",
//     subtitle = "Your generous donation helps us continue our important work in the community.",
//     suggestedAmounts = [25, 50, 100, 250, 500],
//     donationReasons = [
//       { value: "general", label: "General Donation" },
//       { value: "tithe", label: "Tithe" },
//       { value: "offering", label: "Offering" },
//       { value: "building_fund", label: "Building Fund" },
//       { value: "missions", label: "Missions" },
//       { value: "youth_ministry", label: "Youth Ministry" },
//       { value: "community_outreach", label: "Community Outreach" },
//       { value: "emergency_relief", label: "Emergency Relief" }
//     ]
//   } = donationData || {};

//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     amount: '',
//     customAmount: '',
//     name: '',
//     email: '',
//     purpose_reason: '',
//     comment: '',
//     billingAddress: {
//       street1: '',
//       city: '',
//       state: '',
//       postalCode: ''
//     }
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [submitMessage, setSubmitMessage] = useState('');
//   const [isDemoMode, setIsDemoMode] = useState(false);
  
//   // Refs for Elavon Hosted Payment Fields
//   const hostedFieldsRef = useRef(null);
//   const [fieldsLoaded, setFieldsLoaded] = useState(false);
//   const [fieldsReady, setFieldsReady] = useState(false);
//   const [sessionId, setSessionId] = useState(null);

//   // Load Elavon Hosted Fields script when moving to step 2
//   useEffect(() => {
//     if (step !== 2) return;

//     // Check if script already loaded
//     if (window.ElavonHostedFields) {
//       console.log('ElavonHostedFields already available');
//       setFieldsLoaded(true);
//       return;
//     }

//     const script = document.createElement('script');
//     script.src = `${HPP_URL}/hosted-fields-client/index.js`;
//     script.async = true;
    
//     script.onload = () => {
//       console.log('✓ Elavon Hosted Fields script loaded');
      
//       // Wait for API to be available
//       let retries = 0;
//       const maxRetries = 50;
      
//       const checkAPI = setInterval(() => {
//         retries++;
        
//         if (window.ElavonHostedFields) {
//           console.log('✓ ElavonHostedFields API ready');
//           clearInterval(checkAPI);
//           setFieldsLoaded(true);
//         } else if (retries >= maxRetries) {
//           console.error('✗ ElavonHostedFields timeout');
//           clearInterval(checkAPI);
//           setErrors({ payment: 'Payment form timeout. Please refresh and try again.' });
//         }
//       }, 100);
//     };
    
//     script.onerror = (error) => {
//       console.error('✗ Failed to load Elavon script:', error);
//       setErrors({ payment: 'Failed to load payment form. Please refresh and try again.' });
//     };
    
//     document.body.appendChild(script);

//     return () => {
//       if (script.parentNode) {
//         document.body.removeChild(script);
//       }
//     };
//   }, [step]);

//   // Create payment session and initialize fields
//   useEffect(() => {
//     if (!fieldsLoaded || sessionId || step !== 2) return;

//     createPaymentSession();
//   }, [fieldsLoaded, step]);

//   // Create payment session via backend
//   const createPaymentSession = async () => {
//     try {
//       console.log('→ Creating payment session...');
      
//       const response = await fetch('/api/elavon/create-session', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           amount: parseFloat(formData.amount).toFixed(2),
//           currency: 'USD',
//           orderId: `ORG-${orgId}-${Date.now()}`,
//           shopperEmailAddress: formData.email,
//           description: `${formData.purpose_reason} donation from ${formData.name}`
//         })
//       });

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         console.error('✗ API error response:', errorData);
//         throw new Error(errorData.error || `Server error: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log('✓ Payment session created:', data);
      
//       if (data.demo) {
//         console.log('🧪 Demo session - Using mock mode');
//         setIsDemoMode(true);
//         setFieldsReady(true); // Skip real field initialization
//         setSessionId(data.sessionId);
//         return; // Don't initialize real hosted fields
//       }
      
//       setSessionId(data.sessionId);
//       initializeHostedFields(data.sessionId);
      
//     } catch (error) {
//       console.error('✗ Session creation failed:', error);
//       setErrors({ 
//         payment: `Failed to initialize payment: ${error.message}. Check console for details.` 
//       });
//     }
//   };

//   // Initialize Elavon Hosted Fields
//   const initializeHostedFields = async (sessionId) => {
//     if (!window.ElavonHostedFields) {
//       console.error('✗ ElavonHostedFields not available');
//       return;
//     }

//     try {
//       console.log('→ Initializing Hosted Payment Fields...');

//       const hostedFields = new window.ElavonHostedFields({
//         sessionId: sessionId,
//         fields: {
//           cardholderName: {
//             wrapperId: 'cardholder-name-field',
//             label: 'Cardholder Name',
//             placeholder: 'John Doe',
//             required: true
//           },
//           cardNumber: {
//             wrapperId: 'card-number-field',
//             label: 'Card Number',
//             placeholder: '1234 5678 9012 3456',
//             required: true
//           },
//           cardExpirationDate: {
//             wrapperId: 'card-expiry-field',
//             label: 'Expiration Date',
//             placeholder: 'MM/YY',
//             required: true
//           },
//           cardCvv: {
//             wrapperId: 'card-cvv-field',
//             label: 'CVV',
//             placeholder: '123',
//             required: true
//           }
//         },
//         styles: {
//           'input': {
//             'font-size': '16px',
//             'color': '#ffffff',
//             'background-color': '#000000',
//             'border': 'none',
//             'padding': '12px',
//             'width': '100%',
//             'box-sizing': 'border-box'
//           },
//           'input:focus': {
//             'outline': 'none'
//           },
//           'input.invalid': {
//             'color': '#ef4444'
//           },
//           '::placeholder': {
//             'color': '#9ca3af'
//           },
//           'label': {
//             'display': 'none'
//           }
//         },
//         onReady: () => {
//           console.log('✓ Hosted Payment Fields ready');
//           setFieldsReady(true);
//         },
//         messageHandler: (message) => {
//           console.log('📨 Message:', message.type, message);
          
//           switch (message.type) {
//             case 'error':
//               console.error('✗ Payment error:', message);
//               if (message.code === 'invalidPaymentSession') {
//                 setErrors({ payment: 'Invalid payment session. Please refresh and try again.' });
//               } else if (message.code === 'cardVerificationFailed') {
//                 setErrors({ payment: '3D Secure verification failed. Please try a different card.' });
//               } else {
//                 setErrors({ payment: message.message || 'Payment error occurred' });
//               }
//               setIsSubmitting(false);
//               break;
              
//             case 'transactionCreated':
//               console.log('✓ Transaction created:', message.transaction);
//               handleTransactionSuccess(message.transaction);
//               break;
              
//             case 'fieldValidityChanged':
//               console.log(`Field ${message.fieldType}: ${message.isValid ? 'valid' : 'invalid'}`);
//               break;
              
//             case 'hostedCardCreated':
//               console.log('✓ Card tokenized:', message.hostedCard);
//               break;
//           }
//         },
//         onSurchargeAcknowledgementRequired: (surchargeInfo, acknowledge) => {
//           console.log('💰 Surcharge required:', surchargeInfo);
          
//           const surchargeAmount = surchargeInfo.surchargeTotal.amount;
//           const newTotal = surchargeInfo.adjustedTotal.amount;
          
//           const confirmed = window.confirm(
//             `A processing fee of $${surchargeAmount} will be applied.\n` +
//             `New total: $${newTotal}\n\n` +
//             `Click OK to proceed with the payment.`
//           );
          
//           if (confirmed) {
//             acknowledge();
//           } else {
//             setIsSubmitting(false);
//             setSubmitMessage('Payment cancelled');
//           }
//         }
//       });

//       hostedFieldsRef.current = hostedFields;
//       console.log('✓ Hosted Fields initialized');
      
//     } catch (error) {
//       console.error('✗ Failed to initialize fields:', error);
//       setErrors({ payment: 'Error initializing payment form. Please try again.' });
//     }
//   };

//   // Handle successful transaction
//   const handleTransactionSuccess = (transaction) => {
//     console.log('✓ Payment successful!', transaction);
//     setSubmitStatus('success');
//     setSubmitMessage('Payment successful! Redirecting...');
    
//     // Redirect to success page
//     setTimeout(() => {
//       const successUrl = `${window.location.origin}/payment-success?` +
//         `txnId=${transaction.id}&` +
//         `amount=${formData.amount}&` +
//         `name=${encodeURIComponent(formData.name)}&` +
//         `purpose=${encodeURIComponent(formData.purpose_reason)}&` +
//         `comment=${encodeURIComponent(formData.comment || '')}&` +
//         `orgId=${orgId}`;
      
//       window.location.href = successUrl;
//     }, 1500);
//   };

//   // Form handlers
//   const handleAmountSelect = (amount) => {
//     setFormData(prev => ({ ...prev, amount: amount.toString(), customAmount: '' }));
//     setErrors(prev => ({ ...prev, amount: '' }));
//   };

//   const handleCustomAmountChange = (e) => {
//     const value = e.target.value;
//     setFormData(prev => ({ ...prev, customAmount: value, amount: value }));
//     setErrors(prev => ({ ...prev, amount: '' }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({ ...prev, [name]: value }));
//     setErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const handleAddressChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       billingAddress: { ...prev.billingAddress, [name]: value }
//     }));
//   };

//   const validateStep1 = () => {
//     const newErrors = {};
    
//     if (!formData.amount || parseFloat(formData.amount) <= 0) {
//       newErrors.amount = 'Please enter a valid donation amount';
//     }
//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }
//     if (!formData.email.trim() || !formData.email.includes('@')) {
//       newErrors.email = 'Valid email is required for 3D Secure';
//     }
//     if (!formData.purpose_reason) {
//       newErrors.purpose_reason = 'Please select a donation reason';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleProceed = () => {
//     if (validateStep1()) {
//       setStep(2);
//     }
//   };

//   const handleSubmitPayment = async () => {
//     // Demo mode - simulate payment
//     if (isDemoMode) {
//       setIsSubmitting(true);
//       setSubmitMessage('🧪 Demo Mode: Processing payment...');
      
//       // Simulate processing
//       setTimeout(() => {
//         setSubmitStatus('success');
//         setSubmitMessage('🧪 Demo payment successful! Redirecting...');
        
//         setTimeout(() => {
//           const successUrl = `${window.location.origin}/payment-success?` +
//             `demo=true&` +
//             `amount=${formData.amount}&` +
//             `name=${encodeURIComponent(formData.name)}&` +
//             `purpose=${encodeURIComponent(formData.purpose_reason)}&` +
//             `comment=${encodeURIComponent(formData.comment || '')}&` +
//             `orgId=${orgId}`;
          
//           window.location.href = successUrl;
//         }, 1500);
//       }, 2000);
      
//       return;
//     }

//     // Production mode - real Elavon payment
//     if (!hostedFieldsRef.current) {
//       setErrors({ payment: 'Payment form not ready. Please try again.' });
//       return;
//     }

//     // Check if fields are valid
//     const state = hostedFieldsRef.current.getState();
//     if (!state.isValid) {
//       setErrors({ payment: 'Please fill in all card details correctly' });
//       return;
//     }

//     setIsSubmitting(true);
//     setErrors({});
//     setSubmitStatus(null);
//     setSubmitMessage('Processing payment...');

//     try {
//       console.log('→ Submitting payment...');
      
//       // Submit with additional data
//       await hostedFieldsRef.current.submit({
//         shopperEmailAddress: formData.email,
//         billTo: {
//           street1: formData.billingAddress.street1,
//           city: formData.billingAddress.city,
//           state: formData.billingAddress.state,
//           postalCode: formData.billingAddress.postalCode
//         }
//       });
      
//       // Transaction result will come through messageHandler
      
//     } catch (error) {
//       console.error('✗ Payment submission failed:', error);
//       setSubmitStatus('error');
//       setSubmitMessage('Payment failed. Please try again.');
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <section className="py-0 sm:py-12 lg:py-16 bg-black px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Demo Mode Banner */}
//         {DEMO_MODE && (
//           <div className="mb-6 bg-yellow-600 text-black px-4 py-3 rounded-lg">
//             <div className="flex items-center">
//               <span className="text-xl mr-2">🧪</span>
//               <div>
//                 <p className="font-semibold">Demo Mode Active</p>
//                 <p className="text-sm">Testing environment - Using UAT sandbox</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="mb-12 text-center">
//           <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-4">
//             {title}
//           </h2>
//           <p className="text-base sm:text-lg text-white max-w-5xl mx-auto">
//             {subtitle}
//           </p>
//         </div>

//         {/* Form Container */}
//         <div className="flex justify-center">
//           <div className="w-full sm:w-[500px] lg:w-[650px] bg-black text-white rounded-xl shadow-xl border border-gray-500 p-6 sm:p-8 lg:p-10">
            
//             {/* STEP 1: Donation Details */}
//             {step === 1 && (
//               <div>
//                 <h3 className="text-xl font-bold text-red-700 mb-6">
//                   Step 1: Donation Details
//                 </h3>

//                 {/* Amount Selection */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-3">
//                     Select Amount *
//                   </label>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
//                     {suggestedAmounts.map((amount) => (
//                       <button
//                         key={amount}
//                         onClick={() => handleAmountSelect(amount)}
//                         className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
//                           formData.amount === amount.toString()
//                             ? 'bg-red-600 text-white border-red-600'
//                             : 'bg-black text-white border-white hover:border-red-600'
//                         }`}
//                       >
//                         ${amount}
//                       </button>
//                     ))}
//                   </div>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">$</span>
//                     <input
//                       type="number"
//                       placeholder="Custom amount"
//                       value={formData.customAmount}
//                       onChange={handleCustomAmountChange}
//                       className="w-full pl-8 pr-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                       min="1"
//                       step="0.01"
//                     />
//                   </div>
//                   {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
//                 </div>

//                 {/* Name */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-2">Full Name *</label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                     placeholder="Enter your full name"
//                   />
//                   {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
//                 </div>

//                 {/* Email (Required for 3D Secure) */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-2">
//                     Email Address * <span className="text-xs text-gray-400">(Required for payment verification)</span>
//                   </label>
//                   <input
//                     type="email"
//                     name="email"
//                     value={formData.email}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                     placeholder="your.email@example.com"
//                   />
//                   {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
//                 </div>

//                 {/* Purpose */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-2">Donation Purpose *</label>
//                   <select
//                     name="purpose_reason"
//                     value={formData.purpose_reason}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600"
//                   >
//                     <option value="">Select donation purpose</option>
//                     {donationReasons.map((reason) => (
//                       <option key={reason.value} value={reason.value}>{reason.label}</option>
//                     ))}
//                   </select>
//                   {errors.purpose_reason && <p className="text-red-500 text-sm mt-1">{errors.purpose_reason}</p>}
//                 </div>

//                 {/* Comment */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-2">Optional Note</label>
//                   <textarea
//                     name="comment"
//                     value={formData.comment}
//                     onChange={handleInputChange}
//                     rows="3"
//                     className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                     placeholder="Add a personal note (optional)"
//                   />
//                 </div>

//                 <button
//                   onClick={handleProceed}
//                   className="w-full bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-500 transition"
//                 >
//                   Proceed to Payment
//                 </button>
//               </div>
//             )}

//             {/* STEP 2: Payment */}
//             {step === 2 && (
//               <div>
//                 <h3 className="text-xl font-bold text-red-700 mb-6">
//                   Step 2: Payment Information
//                 </h3>

//                 {/* Summary */}
//                 <div className="bg-zinc-900 rounded-lg p-4 mb-6">
//                   <h4 className="font-semibold mb-2">Donation Summary</h4>
//                   <div className="text-sm space-y-1">
//                     <div className="flex justify-between">
//                       <span>Amount:</span>
//                       <span className="font-medium">${formData.amount}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Purpose:</span>
//                       <span className="font-medium">
//                         {donationReasons.find(r => r.value === formData.purpose_reason)?.label}
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Donor:</span>
//                       <span className="font-medium">{formData.name}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Loading State */}
//                 {!fieldsReady && (
//                   <div className="mb-6 p-4 bg-zinc-900 rounded-lg">
//                     <div className="flex items-center text-white">
//                       <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
//                       <span>Loading secure payment form...</span>
//                     </div>
//                   </div>
//                 )}

//                 {/* Elavon Hosted Payment Fields */}
//                 <div className="mb-6 space-y-4">
//                   <h4 className="text-lg font-semibold text-white">Card Details</h4>
                  
//                   {isDemoMode ? (
//                     // Demo mode - show mock card fields
//                     <div className="space-y-4">
//                       <div className="bg-yellow-900 border border-yellow-600 rounded-lg p-4 mb-4">
//                         <div className="flex items-center">
//                           <span className="text-2xl mr-2">🧪</span>
//                           <div className="text-yellow-100">
//                             <p className="font-semibold">Demo Mode Active</p>
//                             <p className="text-sm">Card fields are simulated. No real payment will be processed.</p>
//                           </div>
//                         </div>
//                       </div>

//                       {/* Mock card fields */}
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2">Cardholder Name</label>
//                         <input
//                           type="text"
//                           placeholder="John Doe"
//                           disabled
//                           className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-400"
//                         />
//                       </div>

//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2">Card Number</label>
//                         <input
//                           type="text"
//                           placeholder="4111 1111 1111 1111"
//                           disabled
//                           className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-400"
//                         />
//                       </div>

//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-white mb-2">Expiry Date</label>
//                           <input
//                             type="text"
//                             placeholder="12/25"
//                             disabled
//                             className="px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-400"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-white mb-2">CVV</label>
//                           <input
//                             type="text"
//                             placeholder="123"
//                             disabled
//                             className="px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-gray-400"
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   ) : (
//                     // Production mode - real Elavon hosted fields
//                     <>
//                       {/* Cardholder Name */}
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2">Cardholder Name</label>
//                         <div 
//                           id="cardholder-name-field"
//                           className="min-h-[48px] border border-white rounded-lg overflow-hidden bg-black"
//                         />
//                       </div>

//                       {/* Card Number */}
//                       <div>
//                         <label className="block text-sm font-medium text-white mb-2">Card Number</label>
//                         <div 
//                           id="card-number-field"
//                           className="min-h-[48px] border border-white rounded-lg overflow-hidden bg-black"
//                         />
//                       </div>

//                       {/* Expiry and CVV */}
//                       <div className="grid grid-cols-2 gap-4">
//                         <div>
//                           <label className="block text-sm font-medium text-white mb-2">Expiry Date</label>
//                           <div 
//                             id="card-expiry-field"
//                             className="min-h-[48px] border border-white rounded-lg overflow-hidden bg-black"
//                           />
//                         </div>
//                         <div>
//                           <label className="block text-sm font-medium text-white mb-2">CVV</label>
//                           <div 
//                             id="card-cvv-field"
//                             className="min-h-[48px] border border-white rounded-lg overflow-hidden bg-black"
//                           />
//                         </div>
//                       </div>
//                     </>
//                   )}
//                 </div>

//                 {/* Billing Address (Optional but recommended) */}
//                 {!isDemoMode && (
//                   <div className="mb-6">
//                     <h4 className="text-sm font-semibold text-white mb-3">Billing Address (Optional)</h4>
//                     <div className="space-y-3">
//                       <input
//                         type="text"
//                         name="street1"
//                         value={formData.billingAddress.street1}
//                         onChange={handleAddressChange}
//                         placeholder="Street Address"
//                         className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
//                       />
//                       <div className="grid grid-cols-2 gap-3">
//                         <input
//                           type="text"
//                           name="city"
//                           value={formData.billingAddress.city}
//                           onChange={handleAddressChange}
//                           placeholder="City"
//                           className="px-4 py-2 border border-gray-600 rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
//                         />
//                         <input
//                           type="text"
//                           name="state"
//                           value={formData.billingAddress.state}
//                           onChange={handleAddressChange}
//                           placeholder="State"
//                           className="px-4 py-2 border border-gray-600 rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
//                         />
//                       </div>
//                       <input
//                         type="text"
//                         name="postalCode"
//                         value={formData.billingAddress.postalCode}
//                         onChange={handleAddressChange}
//                         placeholder="Zip Code"
//                         className="w-full px-4 py-2 border border-gray-600 rounded-lg bg-black text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-600"
//                       />
//                     </div>
//                   </div>
//                 )}

//                 {/* Status Messages */}
//                 {submitStatus && (
//                   <div className={`mb-6 p-4 rounded-lg ${
//                     submitStatus === 'success' ? 'bg-green-600' : 'bg-red-600'
//                   }`}>
//                     <p className="text-sm text-white">{submitMessage}</p>
//                   </div>
//                 )}

//                 {/* Error Messages */}
//                 {errors.payment && (
//                   <div className="mb-6 p-4 rounded-lg bg-red-600">
//                     <p className="text-sm text-white">{errors.payment}</p>
//                   </div>
//                 )}

//                 {/* Action Buttons */}
//                 <div className="flex space-x-3">
//                   <button
//                     onClick={() => setStep(1)}
//                     disabled={isSubmitting}
//                     className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition disabled:opacity-50"
//                   >
//                     Back
//                   </button>
//                   <button
//                     onClick={handleSubmitPayment}
//                     disabled={isSubmitting || !fieldsReady || submitStatus === 'success'}
//                     className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
//                       isSubmitting || !fieldsReady || submitStatus === 'success'
//                         ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
//                         : 'bg-red-700 text-white hover:bg-red-500'
//                     }`}
//                   >
//                     {isSubmitting ? (
//                       <div className="flex items-center justify-center">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         Processing...
//                       </div>
//                     ) : submitStatus === 'success' ? (
//                       'Payment Complete ✓'
//                     ) : (
//                       'Complete Donation'
//                     )}
//                   </button>
//                 </div>

//                 {/* Security Badge */}
//                 <div className="mt-6 text-center text-xs text-gray-400">
//                   🔒 Secured by Elavon Payment Gateway | Your card details never touch our servers
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

























































// "use client";
// import { useState, useEffect } from 'react';

// // Demo/Production Mode Toggle
// const DEMO_MODE = false; // Set to false for production

// export default function DonationSection({ donationData, organizationSlug, orgId }) {
//   const {
//     title = "Support Our Mission",
//     subtitle = "Your generous donation helps us continue our important work in the community.",
//     suggestedAmounts = [25, 50, 100, 250, 500],
//     donationReasons = [
//       { value: "general", label: "General Donation" },
//       { value: "tithe", label: "Tithe" },
//       { value: "offering", label: "Offering" },
//       { value: "building_fund", label: "Building Fund" },
//       { value: "missions", label: "Missions" },
//       { value: "youth_ministry", label: "Youth Ministry" },
//       { value: "community_outreach", label: "Community Outreach" },
//       { value: "emergency_relief", label: "Emergency Relief" }
//     ],
//     paymentMethods = [
//       { 
//         id: "debit_card", 
//         name: "Debit Card", 
//         icon: "💳",
//         description: "We only accept debit cards for secure donations"
//       }
//     ],
//     // Elavon configuration (these should come from your backend/environment)
//     elavonConfig = {
//       hostedPaymentPageUrl: "https://demo.myvirtualmerchant.com/VirtualMerchant/process.do",
//       // For production: "https://www.myvirtualmerchant.com/VirtualMerchant/process.do"
//     }
//   } = donationData || {};

//   const [step, setStep] = useState(1);
//   const [formData, setFormData] = useState({
//     amount: '',
//     customAmount: '',
//     name: '',
//     purpose_reason: '',
//     comment: '',
//     paymentMethod: ''
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null);
//   const [submitMessage, setSubmitMessage] = useState('');

//   // Remove demo mode check - we'll handle everything on frontend

//   const handleAmountSelect = (amount) => {
//     setFormData(prev => ({
//       ...prev,
//       amount: amount.toString(),
//       customAmount: ''
//     }));
//     setErrors(prev => ({ ...prev, amount: '' }));
//   };

//   const handleCustomAmountChange = (e) => {
//     const value = e.target.value;
//     setFormData(prev => ({
//       ...prev,
//       customAmount: value,
//       amount: value
//     }));
//     setErrors(prev => ({ ...prev, amount: '' }));
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//     setErrors(prev => ({ ...prev, [name]: '' }));
//   };

//   const validateStep1 = () => {
//     const newErrors = {};
    
//     if (!formData.amount || parseFloat(formData.amount) <= 0) {
//       newErrors.amount = 'Please enter a valid donation amount';
//     }
    
//     if (!formData.name.trim()) {
//       newErrors.name = 'Name is required';
//     }
    
//     if (!formData.purpose_reason) {
//       newErrors.purpose_reason = 'Please select a donation reason';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleProceed = () => {
//     if (validateStep1()) {
//       setStep(2);
//     }
//   };

//   const handlePaymentMethodSelect = (methodId) => {
//     setFormData(prev => ({
//       ...prev,
//       paymentMethod: methodId
//     }));
//   };



//   // Handle Elavon Hosted Payment - submits form to new window
//   const handleElavonPayment = async () => {
//     setIsSubmitting(true);
//     setErrors({});

//     try {
//       // Skip transaction creation - we'll do it after payment success
      
//       let elavonData, formAction;

//       if (DEMO_MODE) {
//         // For demo/testing - use a simple test form that shows success
//         console.log('Demo mode: Simulating payment process...');
        
//         // Simulate processing delay
//         setTimeout(() => {
//           // Redirect to success page with demo data
//           const demoUrl = `${window.location.origin}/payment-success?amount=${formData.amount}&name=${encodeURIComponent(formData.name)}&purpose=${encodeURIComponent(formData.purpose_reason)}&comment=${encodeURIComponent(formData.comment || '')}&orgId=${orgId}&demo=true`;
//           window.location.href = demoUrl;
//         }, 2000);

//         setSubmitStatus('success');
//         setSubmitMessage('🧪 Demo Mode: Simulating payment processing... You will be redirected to success page.');
//         setIsSubmitting(false);
//         return;

//       } else {
//         // Production mode - real Elavon payment
//         elavonData = {
//           ssl_merchant_id: "8045256156",
//           ssl_user_id: "8045256156web",
//           ssl_pin: "WVVN6XVVOOF92M73QP4GPV2CJRVMON907KCR3Z2NUZCEEG4PDIR7TJEGNR9VL4VW",
//           ssl_transaction_type: "ccsale",
//           ssl_amount: parseFloat(formData.amount).toFixed(2),
//           ssl_first_name: formData.name.split(' ')[0] || formData.name,
//           ssl_last_name: formData.name.split(' ').slice(1).join(' ') || '',
//           ssl_description: `${formData.purpose_reason} - ${formData.comment || 'Donation'}`,
//           ssl_customer_code: orgId,
//           ssl_show_form: "true",
//           ssl_result_format: "HTML",
//           ssl_receipt_link_method: "REDG",
//           ssl_receipt_link_url: `${window.location.origin}/payment-success?amount=${formData.amount}&name=${encodeURIComponent(formData.name)}&purpose=${encodeURIComponent(formData.purpose_reason)}&comment=${encodeURIComponent(formData.comment || '')}&orgId=${orgId}`
//         };

//         formAction = 'https://api.convergepay.com/VirtualMerchant/process.do';

//         // Create form and submit to production Elavon
//         const form = document.createElement('form');
//         form.method = 'POST';
//         form.action = formAction;
//         form.target = '_self';
//         form.style.display = 'none';

//         // Add all fields to form
//         Object.keys(elavonData).forEach(key => {
//           const input = document.createElement('input');
//           input.type = 'hidden';
//           input.name = key;
//           input.value = elavonData[key];
//           form.appendChild(input);
//         });

//         document.body.appendChild(form);
//         form.submit();
//         document.body.removeChild(form);
//       }

//     } catch (error) {
//       console.error('Error initiating payment:', error);
//       setSubmitStatus('error');
//       setSubmitMessage(error.message || 'Failed to initiate payment. Please try again.');
//       setIsSubmitting(false);
//     }
//   };

//   const closeElavonPopup = () => {
//     // Not needed anymore since we're using window.open
//   };

//   const handleFinalSubmit = async () => {
//     if (!formData.paymentMethod) {
//       setErrors({ paymentMethod: 'Please select a payment method' });
//       return;
//     }

//     if (!orgId) {
//       setErrors({ general: 'Organization ID not found. Please try again.' });
//       return;
//     }

//     // Trigger Elavon hosted payment in popup
//     await handleElavonPayment();
//   };

//   const resetForm = () => {
//     setStep(1);
//     setFormData({
//       amount: '',
//       customAmount: '',
//       name: '',
//       purpose_reason: '',
//       comment: '',
//       paymentMethod: ''
//     });
//     setErrors({});
//     setIsSubmitting(false);
//     setSubmitStatus(null);
//     setSubmitMessage('');
//   };

//   return (
//     <>
//       <section className="py-0 sm:py-12 lg:py-16 bg-black px-4 sm:px-6 lg:px-8">
//       <div className="max-w-7xl mx-auto">
//         {/* Demo Mode Banner */}
//         {DEMO_MODE && (
//           <div className="mb-6 bg-yellow-600 text-black px-4 py-3 rounded-lg border border-yellow-700">
//             <div className="flex items-center">
//               <span className="text-xl mr-2">🧪</span>
//               <div>
//                 <p className="font-semibold">Demo Mode Active</p>
//                 <p className="text-sm">This is a safe testing environment. No real payments will be processed.</p>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Header */}
//         <div className="mb-12 text-center">
//           <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-4">
//             {title}
//           </h2>
//           <p className="text-base sm:text-lg text-white max-w-5xl mx-auto">
//             {subtitle}
//           </p>
//         </div>

//         {/* Form Wrapper */}
//         <div className="flex justify-center">
//           <div className="w-full sm:w-[500px] lg:w-[600px] bg-black text-white rounded-xl shadow-xl border border-gray-500 p-6 sm:p-8 lg:p-10">
//             {step === 1 ? (
//               <div>
//                 <h3 className="text-xl font-bold text-red-700 mb-6">
//                   Step 1: Donation Details
//                 </h3>

//                 {/* Amount Selection */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-3">
//                     Select Amount *
//                   </label>
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
//                     {suggestedAmounts.map((amount) => (
//                       <button
//                         key={amount}
//                         onClick={() => handleAmountSelect(amount)}
//                         className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
//                           formData.amount === amount.toString()
//                             ? 'bg-red-600 text-white border-red-600'
//                             : 'bg-black text-white border-white hover:border-red-600'
//                         }`}
//                       >
//                         ${amount}
//                       </button>
//                     ))}
//                   </div>

//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
//                       $
//                     </span>
//                     <input
//                       type="number"
//                       placeholder="Custom amount"
//                       value={formData.customAmount}
//                       onChange={handleCustomAmountChange}
//                       className="w-full pl-8 pr-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                       min="1"
//                       step="0.01"
//                     />
//                   </div>
//                   {errors.amount && (
//                     <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
//                   )}
//                 </div>

//                 {/* Name */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-2">
//                     Full Name *
//                   </label>
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                     placeholder="Enter your full name"
//                   />
//                   {errors.name && (
//                     <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//                   )}
//                 </div>

//                 {/* Purpose/Reason */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-2">
//                     Donation Purpose *
//                   </label>
//                   <select
//                     name="purpose_reason"
//                     value={formData.purpose_reason}
//                     onChange={handleInputChange}
//                     className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600"
//                   >
//                     <option value="" className="text-white bg-gray-900">Select donation purpose</option>
//                     {donationReasons.map((reason) => (
//                       <option
//                         key={reason.value}
//                         value={reason.value}
//                         className="text-white bg-black"
//                       >
//                         {reason.label}
//                       </option>
//                     ))}
//                   </select>
//                   {errors.purpose_reason && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.purpose_reason}
//                     </p>
//                   )}
//                 </div>

//                 {/* Comment */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-2">
//                     Optional Note
//                   </label>
//                   <textarea
//                     name="comment"
//                     value={formData.comment}
//                     onChange={handleInputChange}
//                     rows="3"
//                     className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                     placeholder="Add a personal note (optional)"
//                   ></textarea>
//                 </div>

//                 <button
//                   onClick={handleProceed}
//                   className="w-full bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-500 transition"
//                 >
//                   Proceed to Payment
//                 </button>
//               </div>
//             ) : (
//               <div>
//                 <h3 className="text-xl font-bold text-red-700 mb-6">
//                   Step 2: Payment Method
//                 </h3>

//                 {/* Donation Summary */}
//                 <div className="bg-zinc-900 text-white rounded-lg p-4 mb-6">
//                   <h4 className="font-semibold mb-2">Donation Summary</h4>
//                   <div className="text-sm space-y-1">
//                     <div className="flex justify-between">
//                       <span>Amount:</span>
//                       <span className="font-medium">${formData.amount}</span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Purpose:</span>
//                       <span className="font-medium">
//                         {
//                           donationReasons.find(
//                             (r) => r.value === formData.purpose_reason
//                           )?.label
//                         }
//                       </span>
//                     </div>
//                     <div className="flex justify-between">
//                       <span>Donor:</span>
//                       <span className="font-medium">{formData.name}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment Methods */}
//                 <div className="mb-6">
//                   <label className="block text-sm font-medium text-white mb-3">
//                     Choose Payment Method *
//                   </label>
                  
//                   <div className="space-y-3">
//                     {paymentMethods.map((method) => (
//                       <div
//                         key={method.id}
//                         onClick={() => handlePaymentMethodSelect(method.id)}
//                         className={`p-4 border rounded-lg cursor-pointer transition ${
//                           formData.paymentMethod === method.id
//                             ? 'border-red-600 bg-red-700 text-white'
//                             : 'border-white text-white hover:border-red-600'
//                         }`}
//                       >
//                         <div className="flex items-center">
//                           <span className="text-2xl mr-3">{method.icon}</span>
//                           <div>
//                             <h5 className="font-medium">{method.name}</h5>
//                             <p className="text-sm text-gray-300">{method.description}</p>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {errors.paymentMethod && (
//                     <p className="text-red-500 text-sm mt-1">
//                       {errors.paymentMethod}
//                     </p>
//                   )}
//                 </div>

//                 {/* Status Messages */}
//                 {submitStatus && (
//                   <div className={`mb-6 p-4 rounded-lg ${
//                     submitStatus === 'success' 
//                       ? 'bg-green-600 text-white' 
//                       : 'bg-red-600 text-white'
//                   }`}>
//                     <p className="text-sm">{submitMessage}</p>
//                   </div>
//                 )}

//                 {/* General Error Messages */}
//                 {errors.general && (
//                   <div className="mb-6 p-4 rounded-lg bg-red-600 text-white">
//                     <p className="text-sm">{errors.general}</p>
//                   </div>
//                 )}

//                 <div className="flex space-x-3">
//                   <button
//                     onClick={() => setStep(1)}
//                     className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition"
//                   >
//                     Back
//                   </button>
//                   <button
//                     onClick={handleFinalSubmit}
//                     disabled={isSubmitting || submitStatus === 'success'}
//                     className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
//                       isSubmitting || submitStatus === 'success'
//                         ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
//                         : 'bg-red-700 text-white hover:bg-red-500'
//                     }`}
//                   >
//                     {isSubmitting ? (
//                       <div className="flex items-center justify-center">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                         {formData.paymentMethod === 'elavon_hosted' ? 'Redirecting...' : 'Processing...'}
//                       </div>
//                     ) : submitStatus === 'success' ? (
//                       'Donation Completed ✓'
//                     ) : (
//                       'Complete Donation'
//                     )}
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//     </>
//   );
// }



















"use client";
import { useState } from 'react';
import Image from "next/image";

export default function DonationSection({ donationData, organizationSlug, orgId }) {
  const {
    title = "Support Our Mission",
    subtitle = "Your generous donation helps us continue our important work in the community.",
    suggestedAmounts = [25, 50, 100, 250, 500],
    donationReasons = [
      { value: "general", label: "General Donation" },
      { value: "tithe", label: "Tithe" },
      { value: "offering", label: "Offering" },
      { value: "building_fund", label: "Building Fund" },
      { value: "missions", label: "Missions" },
      { value: "youth_ministry", label: "Youth Ministry" },
      { value: "community_outreach", label: "Community Outreach" },
      { value: "emergency_relief", label: "Emergency Relief" }
    ],
    paymentMethods = [
      { 
        id: "debit_card", 
        name: "Debit Card", 
        icon: "💳",
        description: "Secure payment with your debit card"
      },
      // { 
      //   id: "credit_card", 
      //   name: "Credit Card", 
      //   icon: "💳",
      //   description: "Pay with Visa, MasterCard, or American Express"
      // },
      // { 
      //   id: "bank_account", 
      //   name: "Bank Account", 
      //   icon: "🏦",
      //   description: "Direct transfer from your bank account"
      // },
      // { 
      //   id: "paypal", 
      //   name: "PayPal", 
      //   icon: "💰",
      //   description: "Pay securely with your PayPal account"
      // }
    ]
  } = donationData || {};

  const [step, setStep] = useState(1); // 1: Amount & Details, 2: Payment Gateway
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    name: '',
    purpose_reason: '',
    comment: '',
    paymentMethod: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState('');

  const handleAmountSelect = (amount) => {
    setFormData(prev => ({
      ...prev,
      amount: amount.toString(),
      customAmount: ''
    }));
    setErrors(prev => ({ ...prev, amount: '' }));
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      customAmount: value,
      amount: value
    }));
    setErrors(prev => ({ ...prev, amount: '' }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid donation amount';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.purpose_reason) {
      newErrors.purpose_reason = 'Please select a donation reason';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceed = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePaymentMethodSelect = (methodId) => {
    setFormData(prev => ({
      ...prev,
      paymentMethod: methodId
    }));
  };

  const handleFinalSubmit = async () => {
    if (!formData.paymentMethod) {
      setErrors({ paymentMethod: 'Please select a payment method' });
      return;
    }

    if (!orgId) {
      setErrors({ general: 'Organization ID not found. Please try again.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSubmitStatus(null);
    setSubmitMessage('');

    try {
      const payload = {
        org_key_id: orgId,
        amount: parseFloat(formData.amount),
        name: formData.name,
        payment_method: formData.paymentMethod,
        purpose_reason: formData.purpose_reason,
        comment: formData.comment || ''
      };

      console.log('Submitting donation:', payload);

      const response = await fetch('https://api.lolligive.com/api/transaction/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      // Success
      setSubmitStatus('success');
      setSubmitMessage('Thank you for your donation! Your transaction has been processed successfully.');
      
      // Reset form after successful submission
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (error) {
      console.error('Error processing donation:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'There was an error processing your donation. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      amount: '',
      customAmount: '',
      name: '',
      purpose_reason: '',
      comment: '',
      paymentMethod: ''
    });
    setErrors({});
    setIsSubmitting(false);
    setSubmitStatus(null);
    setSubmitMessage('');
  };

  // Debug: log orgId when component renders
  // console.log('DonationSection orgId:', orgId);

  return (

    <section className="py-0 sm:py-12 lg:py-16 bg-black px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-12 text-center">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-4">
        {title}
      </h2>
      <p className="text-base sm:text-lg text-white max-w-5xl mx-auto">
        {subtitle}
      </p>
    </div>

    {/* Form Wrapper */}
    <div className="flex justify-center">
      <div className="w-full sm:w-[500px] lg:w-[600px] bg-black text-white rounded-xl shadow-xl border border-gray-500 p-6 sm:p-8 lg:p-10">
        {step === 1 ? (
          <div>
            <h3 className="text-xl font-bold text-red-700 mb-6">
              Step 1: Donation Details
            </h3>

            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Select Amount *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {suggestedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                      formData.amount === amount.toString()
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-black text-white border-white hover:border-red-600'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={formData.customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full pl-8 pr-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                  min="1"
                  step="0.01"
                />
              </div>
              {errors.amount && (
                <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Purpose/Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Donation Purpose *
              </label>
              <select
                name="purpose_reason"
                value={formData.purpose_reason}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="" className="text-white bg-gray-900">Select donation purpose</option>
                {donationReasons.map((reason) => (
                  <option
                    key={reason.value}
                    value={reason.value}
                    className="text-white bg-black"
                  >
                    {reason.label}
                  </option>
                ))}
              </select>
              {errors.purpose_reason && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.purpose_reason}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-2">
                Optional Note
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                placeholder="Add a personal note (optional)"
              ></textarea>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-500 transition"
            >
              Proceed to Payment
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-red-700 mb-6">
              Step 2: Payment Method
            </h3>

            {/* Donation Summary */}
            <div className="bg-zinc-900 text-white rounded-lg p-4 mb-6">
              <h4 className="font-semibold mb-2">Donation Summary</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span className="font-medium">${formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span >Purpose: </span>
                  <span className="font-medium"> 
                    {
                      donationReasons.find(
                        (r) => r.value === formData.purpose_reason
                      )?.label
                    }
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Donor:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                Choose Payment Method *
              </label>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      formData.paymentMethod === method.id
                        ? 'border-red-600 bg-red-700 text-white'
                        : 'border-white text-white hover:border-red-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <div>
                        <h5 className="font-medium">{method.name}</h5>
                        <p className="text-sm text-gray-300">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.paymentMethod}
                </p>
              )}
            </div>

            {/* Status Messages */}
            {submitStatus && (
              <div className={`mb-6 p-4 rounded-lg ${
                submitStatus === 'success' 
                  ? 'bg-green-600 text-white' 
                  : 'bg-red-600 text-white'
              }`}>
                <p className="text-sm">{submitMessage}</p>
              </div>
            )}

            {/* General Error Messages */}
            {errors.general && (
              <div className="mb-6 p-4 rounded-lg bg-red-600 text-white">
                <p className="text-sm">{errors.general}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Back
              </button>
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmitting || submitStatus === 'success'}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                  isSubmitting || submitStatus === 'success'
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-red-700 text-white hover:bg-red-500'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : submitStatus === 'success' ? (
                  'Donation Completed ✓'
                ) : (
                  'Complete Donation'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</section>


  );
}
