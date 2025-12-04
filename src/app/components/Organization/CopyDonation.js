"use client";
import { useState, useEffect } from 'react';
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
      }
    ]
  } = donationData || {};

  const [step, setStep] = useState(1); // 1: Amount & Details, 2: Payment Gateway
  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    name: '',
    purpose_reason: '',
    comment: '',
    paymentMethod:  'debit_card' //always debit card
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
  const [submitMessage, setSubmitMessage] = useState('');
  const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
  const [paymentWindow, setPaymentWindow] = useState(null);

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
  console.log('🚀 [DONATION] handleFinalSubmit called');
  console.log('📋 [DONATION] Form data:', formData);
  console.log('🏢 [DONATION] Organization ID:', orgId);

  if (!formData.paymentMethod) {
    setErrors({ paymentMethod: 'Please select a payment method' });
    console.error('❌ Payment method not selected');
    return;
  }

  if (!orgId) {
    setErrors({ general: 'Organization ID not found. Please try again.' });
    console.error('❌ Organization ID missing');
    return;
  }

  setIsSubmitting(true);
  setErrors({});
  setSubmitStatus(null);
  setSubmitMessage('');

  try {
    // 1️⃣ Request transaction token from Laravel backend
    console.log('📤 Requesting transaction token from Laravel API...');
    const tokenResponse = await fetch('https://api.lolligive.com/api/getTransactionToken', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: formData.amount })
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.json();
      throw new Error(errorData.error || 'Failed to get transaction token');
    }

    const { ssl_txn_auth_token } = await tokenResponse.json();
    if (!ssl_txn_auth_token) throw new Error('No transaction token received');

    console.log('🎫 Transaction token received:', ssl_txn_auth_token.substring(0, 20) + '...');

    // 2️⃣ Open popup window
    const width = 500, height = 650;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;
    const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=yes`;
    const popup = window.open('', 'PaymentWindow', windowFeatures);

    if (!popup) throw new Error('Please allow popups for this site to complete the payment.');

    console.log(' Popup window opened');

    // 3️⃣ Create form to submit to ConvergePay HPP
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://api.convergepay.com/hosted-payments';
    form.target = 'PaymentWindow';
    form.style.display = 'none';

    // Token
    const tokenInput = document.createElement('input');
    tokenInput.type = 'hidden';
    tokenInput.name = 'ssl_txn_auth_token';
    tokenInput.value = ssl_txn_auth_token;
    form.appendChild(tokenInput);

    // Custom Fields for Converge HPP
    const nameInput = document.createElement('input');
    nameInput.type = 'hidden';
    nameInput.name = 'name';
    nameInput.value = formData.name;
    form.appendChild(nameInput);

    const commentInput = document.createElement('input');
    commentInput.type = 'hidden';
    commentInput.name = 'comment';
    commentInput.value = formData.comment;
    form.appendChild(commentInput);

    const orgIdInput = document.createElement('input');
    orgIdInput.type = 'hidden';
    orgIdInput.name = 'org_id';
    orgIdInput.value = orgId;
    form.appendChild(orgIdInput);

    const purposeInput = document.createElement('input');
    purposeInput.type = 'hidden';
    purposeInput.name = 'purpose';
    purposeInput.value = formData.purpose_reason;
    form.appendChild(purposeInput);

    const paymentMethodInput = document.createElement('input');
    paymentMethodInput.type = 'hidden';
    paymentMethodInput.name = 'paymentmethod';
    paymentMethodInput.value = formData.paymentMethod;
    form.appendChild(paymentMethodInput);

    const amountInput = document.createElement('input');
    amountInput.type = 'hidden';
    amountInput.name = 'amount';
    amountInput.value = formData.amount;
    form.appendChild(amountInput);

//   console.log("📨 SENDING TO CONVERGE HPP:", {
//   ssl_txn_auth_token,
//   name: formData.name,
//   comment: formData.comment,
//   org_id: orgId,
//   purpose: formData.purpose_reason,
//   paymentmethod: formData.paymentMethod,
//   callback_url: 'http://localhost:3000/api/elavon/hpp-callback'
// });

    // Append & submit
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);

    setPaymentWindow(popup);
    setShowPaymentOverlay(true);
    setSubmitStatus("success");
    setSubmitMessage("Payment window opened. Complete payment in the popup window.");
    console.log('✅ Form submitted to Converge HPP');

    // 4️⃣ Monitor popup for close and successful redirect
    const checkWindow = setInterval(() => {
      try {
        // Check if popup is closed
        if (popup.closed) {
          console.log('🪟 Payment window closed by user');
          clearInterval(checkWindow);
          setShowPaymentOverlay(false);
          setPaymentWindow(null);
          setSubmitMessage("Payment window closed. Check your donation status in a moment.");
          return;
        }

        // Try to access popup URL to detect redirect to lolligive.com/success
        try {
          const popupUrl = popup.location.href;
          console.log('🔍 Checking popup URL:', popupUrl);
          
          // Check if redirected to success page
          if (popupUrl.includes('lolligive.com/success')) {
            console.log('✅ Payment successful - detected redirect to lolligive.com/success');
            clearInterval(checkWindow);
            
            // Call the transaction API to track the donation
            const payload = {
              org_key_id: orgId,
              amount: parseFloat(formData.amount),
              name: formData.name,
              payment_method: formData.paymentMethod,
              purpose_reason: formData.purpose_reason,
              comment: formData.comment || ''
            };

            console.log('📤 Submitting donation to tracking API:', payload);

            fetch('https://api.lolligive.com/api/transaction/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(payload),
            })
            .then(response => {
              if (!response.ok) {
                throw new Error('Failed to record transaction');
              }
              return response.json();
            })
            .then(data => {
              console.log('✅ Transaction recorded successfully:', data);
            })
            .catch(error => {
              console.error('❌ Error recording transaction:', error);
            });

            // Close popup and show success message
            popup.close();
            setPaymentWindow(null);
            setSubmitStatus("success");
            setSubmitMessage("Payment completed successfully! Thank you for your donation.");
            
            // Auto-hide success message after 5 seconds
            setTimeout(() => {
              setShowPaymentOverlay(false);
              // Reset form
              setStep(1);
              setFormData({
                amount: '',
                customAmount: '',
                name: '',
                purpose_reason: '',
                comment: '',
                paymentMethod: 'debit_card'
              });
            }, 5000);
          }
        } catch (e) {
          // Cross-origin error - popup is still on payment gateway domain
          // This is expected and normal, just continue monitoring
        }
      } catch (error) {
        console.error('Error monitoring popup:', error);
      }
    }, 500);

  } catch (error) {
    console.error('💥 Error processing donation:', error);
    setSubmitStatus('error');
    setSubmitMessage(error.message || 'There was an error processing your donation.');
  } finally {
    setIsSubmitting(false);
    console.log('🏁 handleFinalSubmit completed');
  }
};







  const handleClosePaymentWindow = () => {
    if (paymentWindow && !paymentWindow.closed) {
      paymentWindow.close();
    }
    setShowPaymentOverlay(false);
    setPaymentWindow(null);
  };

 

  return (
    <>
    {/* Payment Processing Overlay */}
    {showPaymentOverlay && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-80 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6">
            <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
              submitStatus === 'success' && submitMessage.includes('completed successfully')
                ? 'bg-green-600'
                : 'bg-red-700'
            }`}>
              {submitStatus === 'success' && submitMessage.includes('completed successfully') ? (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {submitStatus === 'success' && submitMessage.includes('completed successfully')
                ? 'Payment Successful!'
                : 'Payment Window Open'}
            </h3>
            <p className="text-gray-600 mb-4">
              {submitMessage.includes('completed successfully')
                ? 'Your donation has been processed successfully. Thank you for your generosity!'
                : 'Please complete your payment in the popup window.'}
            </p>
            {!submitMessage.includes('completed successfully') && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Do not close this page until your payment is complete.
                </p>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            {submitMessage.includes('completed successfully') ? (
              <button
                onClick={() => {
                  setShowPaymentOverlay(false);
                  setStep(1);
                  setFormData({
                    amount: '',
                    customAmount: '',
                    name: '',
                    purpose_reason: '',
                    comment: '',
                    paymentMethod: 'debit_card'
                  });
                }}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                Make Another Donation
              </button>
            ) : (
              <>
                <button
                  onClick={handleClosePaymentWindow}
                  className="w-full bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Cancel Payment
                </button>
                <p className="text-xs text-gray-500">
                  Window will close automatically when payment is complete
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    )}

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
              Step 1: Giving Details
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
                Giving Purpose *
              </label>
              <select
                name="purpose_reason"
                value={formData.purpose_reason}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600"
              >
                <option value="" className="text-white bg-gray-900">Select giving purpose</option>
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
              <h4 className="font-semibold mb-2">Giving Summary For Today</h4>
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
                  <span>Name:</span>
                  <span className="font-medium">{formData.name}</span>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-white mb-3">
                <span className="inline-block bg-yellow-500/90 text-black font-bold px-3 py-1.5 rounded">
                  **For Security Reasons ONLY DEBIT CARDS are allowed *
                </span>
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
                  'Payment Completed ✓'
                ) : (
                  'Complete Payment'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
</section>
</>

  );
}





// "use client";
// import { useState, useEffect } from 'react';
// import Image from "next/image";

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
//         description: "Secure payment with your debit card"
//       }
//     ]
//   } = donationData || {};

//   const [step, setStep] = useState(1); // 1: Amount & Details, 2: Payment Gateway
//   const [formData, setFormData] = useState({
//     amount: '',
//     customAmount: '',
//     name: '',
//     purpose_reason: '',
//     comment: '',
//     paymentMethod:  'debit_card' //always debit card
//   });
//   const [errors, setErrors] = useState({});
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error'
//   const [submitMessage, setSubmitMessage] = useState('');
//   const [showPaymentOverlay, setShowPaymentOverlay] = useState(false);
//   const [paymentWindow, setPaymentWindow] = useState(null);

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




// const handleFinalSubmit = async () => {
//   console.log('🚀 [DONATION] handleFinalSubmit called');
//   console.log('📋 [DONATION] Form data:', formData);
//   console.log('🏢 [DONATION] Organization ID:', orgId);

//   if (!formData.paymentMethod) {
//     setErrors({ paymentMethod: 'Please select a payment method' });
//     console.error('❌ Payment method not selected');
//     return;
//   }

//   if (!orgId) {
//     setErrors({ general: 'Organization ID not found. Please try again.' });
//     console.error('❌ Organization ID missing');
//     return;
//   }

//   setIsSubmitting(true);
//   setErrors({});
//   setSubmitStatus(null);
//   setSubmitMessage('');

//   try {
//     // 1️⃣ Request transaction token from Laravel backend
//     console.log('📤 Requesting transaction token from Laravel API...');
//     const tokenResponse = await fetch('https://api.lolligive.com/api/getTransactionToken', {
//       method: 'POST',
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ amount: formData.amount })
//     });

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json();
//       throw new Error(errorData.error || 'Failed to get transaction token');
//     }

//     const { ssl_txn_auth_token } = await tokenResponse.json();
//     if (!ssl_txn_auth_token) throw new Error('No transaction token received');

//     console.log('🎫 Transaction token received:', ssl_txn_auth_token.substring(0, 20) + '...');

//     // 2️⃣ Open popup window
//     const width = 500, height = 650;
//     const left = (window.screen.width - width) / 2;
//     const top = (window.screen.height - height) / 2;
//     const windowFeatures = `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes,toolbar=no,menubar=no,location=yes`;
//     const popup = window.open('', 'PaymentWindow', windowFeatures);

//     if (!popup) throw new Error('Please allow popups for this site to complete the payment.');

//     console.log(' Popup window opened');

//     // 3️⃣ Create form to submit to ConvergePay HPP
//     const form = document.createElement('form');
//     form.method = 'POST';
//     form.action = 'https://api.convergepay.com/hosted-payments';
//     form.target = 'PaymentWindow';
//     form.style.display = 'none';

//     // Token
//     const tokenInput = document.createElement('input');
//     tokenInput.type = 'hidden';
//     tokenInput.name = 'ssl_txn_auth_token';
//     tokenInput.value = ssl_txn_auth_token;
//     form.appendChild(tokenInput);

//     // Custom Fields for Converge HPP
//     const nameInput = document.createElement('input');
//     nameInput.type = 'hidden';
//     nameInput.name = 'name';
//     nameInput.value = formData.name;
//     form.appendChild(nameInput);

//     const commentInput = document.createElement('input');
//     commentInput.type = 'hidden';
//     commentInput.name = 'comment';
//     commentInput.value = formData.comment;
//     form.appendChild(commentInput);

//     const orgIdInput = document.createElement('input');
//     orgIdInput.type = 'hidden';
//     orgIdInput.name = 'org_id';
//     orgIdInput.value = orgId;
//     form.appendChild(orgIdInput);

//     const purposeInput = document.createElement('input');
//     purposeInput.type = 'hidden';
//     purposeInput.name = 'purpose';
//     purposeInput.value = formData.purpose_reason;
//     form.appendChild(purposeInput);

//     const paymentMethodInput = document.createElement('input');
//     paymentMethodInput.type = 'hidden';
//     paymentMethodInput.name = 'paymentmethod';
//     paymentMethodInput.value = formData.paymentMethod;
//     form.appendChild(paymentMethodInput);

//     const amountInput = document.createElement('input');
//     amountInput.type = 'hidden';
//     amountInput.name = 'amount';
//     amountInput.value = formData.amount;
//     form.appendChild(amountInput);

// //   console.log("📨 SENDING TO CONVERGE HPP:", {
// //   ssl_txn_auth_token,
// //   name: formData.name,
// //   comment: formData.comment,
// //   org_id: orgId,
// //   purpose: formData.purpose_reason,
// //   paymentmethod: formData.paymentMethod,
// //   callback_url: 'http://localhost:3000/api/elavon/hpp-callback'
// // });

//     // Append & submit
//     document.body.appendChild(form);
//     form.submit();
//     document.body.removeChild(form);

//     setPaymentWindow(popup);
//     setShowPaymentOverlay(true);
//     setSubmitStatus("success");
//     setSubmitMessage("Payment window opened. Complete payment in the popup window.");
//     console.log('✅ Form submitted to Converge HPP');

//     // 4️⃣ Monitor popup for close and successful redirect
//     const checkWindow = setInterval(() => {
//       try {
//         // Check if popup is closed
//         if (popup.closed) {
//           console.log('🪟 Payment window closed by user');
//           clearInterval(checkWindow);
//           setShowPaymentOverlay(false);
//           setPaymentWindow(null);
//           setSubmitMessage("Payment window closed. Check your donation status in a moment.");
//           return;
//         }

//         // Try to access popup URL to detect redirect to lolligive.com
//         try {
//           const popupUrl = popup.location.href;
//           console.log('🔍 Checking popup URL:', popupUrl);
          
//           // Check if redirected to success page
//           if (popupUrl.includes('lolligive.com')) {
//             console.log('✅ Payment successful - detected redirect to lolligive.com');
//             clearInterval(checkWindow);
//             popup.close();
//             setPaymentWindow(null);
//             setSubmitStatus("success");
//             setSubmitMessage("Payment completed successfully! Thank you for your donation.");
            
//             // Auto-hide success message after 5 seconds
//             setTimeout(() => {
//               setShowPaymentOverlay(false);
//               // Optional: Reset form
//               setStep(1);
//               setFormData({
//                 amount: '',
//                 customAmount: '',
//                 name: '',
//                 purpose_reason: '',
//                 comment: '',
//                 paymentMethod: 'debit_card'
//               });
//             }, 5000);
//           }
//         } catch (e) {
//           // Cross-origin error - popup is still on payment gateway domain
//           // This is expected and normal, just continue monitoring
//         }
//       } catch (error) {
//         console.error('Error monitoring popup:', error);
//       }
//     }, 500);

//   } catch (error) {
//     console.error('💥 Error processing donation:', error);
//     setSubmitStatus('error');
//     setSubmitMessage(error.message || 'There was an error processing your donation.');
//   } finally {
//     setIsSubmitting(false);
//     console.log('🏁 handleFinalSubmit completed');
//   }
// };







//   const handleClosePaymentWindow = () => {
//     if (paymentWindow && !paymentWindow.closed) {
//       paymentWindow.close();
//     }
//     setShowPaymentOverlay(false);
//     setPaymentWindow(null);
//   };

 

//   return (
//     <>
//     {/* Payment Processing Overlay */}
//     {showPaymentOverlay && (
//       <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-80 p-4">
//         <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
//           <div className="mb-6">
//             <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
//               submitStatus === 'success' && submitMessage.includes('completed successfully')
//                 ? 'bg-green-600'
//                 : 'bg-red-700'
//             }`}>
//               {submitStatus === 'success' && submitMessage.includes('completed successfully') ? (
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//               ) : (
//                 <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                 </svg>
//               )}
//             </div>
//             <h3 className="text-2xl font-bold text-gray-900 mb-2">
//               {submitStatus === 'success' && submitMessage.includes('completed successfully')
//                 ? 'Payment Successful!'
//                 : 'Payment Window Open'}
//             </h3>
//             <p className="text-gray-600 mb-4">
//               {submitMessage.includes('completed successfully')
//                 ? 'Your donation has been processed successfully. Thank you for your generosity!'
//                 : 'Please complete your payment in the popup window.'}
//             </p>
//             {!submitMessage.includes('completed successfully') && (
//               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
//                 <p className="text-sm text-yellow-800">
//                   <strong>Note:</strong> Do not close this page until your payment is complete.
//                 </p>
//               </div>
//             )}
//           </div>
          
//           <div className="space-y-3">
//             {submitMessage.includes('completed successfully') ? (
//               <button
//                 onClick={() => {
//                   setShowPaymentOverlay(false);
//                   setStep(1);
//                   setFormData({
//                     amount: '',
//                     customAmount: '',
//                     name: '',
//                     purpose_reason: '',
//                     comment: '',
//                     paymentMethod: 'debit_card'
//                   });
//                 }}
//                 className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition"
//               >
//                 Make Another Donation
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={handleClosePaymentWindow}
//                   className="w-full bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-600 transition"
//                 >
//                   Cancel Payment
//                 </button>
//                 <p className="text-xs text-gray-500">
//                   Window will close automatically when payment is complete
//                 </p>
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     )}

//     <section className="py-0 sm:py-12 lg:py-16 bg-black px-4 sm:px-6 lg:px-8">
//   <div className="max-w-7xl mx-auto">
//     {/* Header */}
//     <div className="mb-12 text-center">
//       <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-4">
//         {title}
//       </h2>
//       <p className="text-base sm:text-lg text-white max-w-5xl mx-auto">
//         {subtitle}
//       </p>
//     </div>

//     {/* Form Wrapper */}
//     <div className="flex justify-center">
//       <div className="w-full sm:w-[500px] lg:w-[600px] bg-black text-white rounded-xl shadow-xl border border-gray-500 p-6 sm:p-8 lg:p-10">
//         {step === 1 ? (
//           <div>
//             <h3 className="text-xl font-bold text-red-700 mb-6">
//               Step 1: Giving Details
//             </h3>

//             {/* Amount Selection */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-white mb-3">
//                 Select Amount *
//               </label>
//               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
//                 {suggestedAmounts.map((amount) => (
//                   <button
//                     key={amount}
//                     onClick={() => handleAmountSelect(amount)}
//                     className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
//                       formData.amount === amount.toString()
//                         ? 'bg-red-600 text-white border-red-600'
//                         : 'bg-black text-white border-white hover:border-red-600'
//                     }`}
//                   >
//                     ${amount}
//                   </button>
//                 ))}
//               </div>

//               <div className="relative">
//                 <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white">
//                   $
//                 </span>
//                 <input
//                   type="number"
//                   placeholder="Custom amount"
//                   value={formData.customAmount}
//                   onChange={handleCustomAmountChange}
//                   className="w-full pl-8 pr-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                   min="1"
//                   step="0.01"
//                 />
//               </div>
//               {errors.amount && (
//                 <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
//               )}
//             </div>

//             {/* Name */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-white mb-2">
//                 Full Name *
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                 placeholder="Enter your full name"
//               />
//               {errors.name && (
//                 <p className="text-red-500 text-sm mt-1">{errors.name}</p>
//               )}
//             </div>

//             {/* Purpose/Reason */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-white mb-2">
//                 Giving Purpose *
//               </label>
//               <select
//                 name="purpose_reason"
//                 value={formData.purpose_reason}
//                 onChange={handleInputChange}
//                 className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white focus:outline-none focus:ring-2 focus:ring-red-600"
//               >
//                 <option value="" className="text-white bg-gray-900">Select giving purpose</option>
//                 {donationReasons.map((reason) => (
//                   <option
//                     key={reason.value}
//                     value={reason.value}
//                     className="text-white bg-black"
//                   >
//                     {reason.label}
//                   </option>
//                 ))}
//               </select>
//               {errors.purpose_reason && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.purpose_reason}
//                 </p>
//               )}
//             </div>

//             {/* Comment */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-white mb-2">
//                 Optional Note
//               </label>
//               <textarea
//                 name="comment"
//                 value={formData.comment}
//                 onChange={handleInputChange}
//                 rows="3"
//                 className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
//                 placeholder="Add a personal note (optional)"
//               ></textarea>
//             </div>

//             <button
//               onClick={handleProceed}
//               className="w-full bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-500 transition"
//             >
//               Proceed to Payment
//             </button>
//           </div>
//         ) : (
//           <div>
//             <h3 className="text-xl font-bold text-red-700 mb-6">
//               Step 2: Payment Method
//             </h3>

//             {/* Donation Summary */}
//             <div className="bg-zinc-900 text-white rounded-lg p-4 mb-6">
//               <h4 className="font-semibold mb-2">Giving Summary For Today</h4>
//               <div className="text-sm space-y-1">
//                 <div className="flex justify-between">
//                   <span>Amount:</span>
//                   <span className="font-medium">${formData.amount}</span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span >Purpose: </span>
//                   <span className="font-medium"> 
//                     {
//                       donationReasons.find(
//                         (r) => r.value === formData.purpose_reason
//                       )?.label
//                     }
//                   </span>
//                 </div>
//                 <div className="flex justify-between">
//                   <span>Name:</span>
//                   <span className="font-medium">{formData.name}</span>
//                 </div>
//               </div>
//             </div>

//             {/* Payment Methods */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium text-white mb-3">
//                 <span className="inline-block bg-yellow-500/90 text-black font-bold px-3 py-1.5 rounded">
//                   **For Security Reasons ONLY DEBIT CARDS are allowed *
//                 </span>
//               </label>
//               <div className="space-y-3">
//                 {paymentMethods.map((method) => (
//                   <div
//                     key={method.id}
//                     onClick={() => handlePaymentMethodSelect(method.id)}
//                     className={`p-4 border rounded-lg cursor-pointer transition ${
//                       formData.paymentMethod === method.id
//                         ? 'border-red-600 bg-red-700 text-white'
//                         : 'border-white text-white hover:border-red-600'
//                     }`}
//                   >
//                     <div className="flex items-center">
//                       <span className="text-2xl mr-3">{method.icon}</span>
//                       <div>
//                         <h5 className="font-medium">{method.name}</h5>
//                         <p className="text-sm text-gray-300">
//                           {method.description}
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {errors.paymentMethod && (
//                 <p className="text-red-500 text-sm mt-1">
//                   {errors.paymentMethod}
//                 </p>
//               )}
//             </div>

//             {/* Status Messages */}
//             {submitStatus && (
//               <div className={`mb-6 p-4 rounded-lg ${
//                 submitStatus === 'success' 
//                   ? 'bg-green-600 text-white' 
//                   : 'bg-red-600 text-white'
//               }`}>
//                 <p className="text-sm">{submitMessage}</p>
//               </div>
//             )}

//             {/* General Error Messages */}
//             {errors.general && (
//               <div className="mb-6 p-4 rounded-lg bg-red-600 text-white">
//                 <p className="text-sm">{errors.general}</p>
//               </div>
//             )}

//             <div className="flex space-x-3">
//               <button
//                 onClick={() => setStep(1)}
//                 className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition"
//               >
//                 Back
//               </button>
//               <button
//                 onClick={handleFinalSubmit}
//                 disabled={isSubmitting || submitStatus === 'success'}
//                 className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
//                   isSubmitting || submitStatus === 'success'
//                     ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
//                     : 'bg-red-700 text-white hover:bg-red-500'
//                 }`}
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center justify-center">
//                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                     Processing...
//                   </div>
//                 ) : submitStatus === 'success' ? (
//                   'Payment Completed ✓'
//                 ) : (
//                   'Complete Payment'
//                 )}
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   </div>
// </section>
// </>

//   );
// }
