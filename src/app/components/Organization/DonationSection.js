"use client";
import { useState, useEffect } from 'react';

// Demo/Production Mode Toggle
const DEMO_MODE = false; // Set to false for production

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
        description: "We only accept debit cards for secure donations"
      }
    ],
    // Elavon configuration (these should come from your backend/environment)
    elavonConfig = {
      hostedPaymentPageUrl: "https://demo.myvirtualmerchant.com/VirtualMerchant/process.do",
      // For production: "https://www.myvirtualmerchant.com/VirtualMerchant/process.do"
    }
  } = donationData || {};

  const [step, setStep] = useState(1);
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
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState('');

  // Remove demo mode check - we'll handle everything on frontend

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



  // Handle Elavon Hosted Payment - submits form to new window
  const handleElavonPayment = async () => {
    setIsSubmitting(true);
    setErrors({});

    try {
      // Skip transaction creation - we'll do it after payment success
      
      let elavonData, formAction;

      if (DEMO_MODE) {
        // For demo/testing - use a simple test form that shows success
        console.log('Demo mode: Simulating payment process...');
        
        // Simulate processing delay
        setTimeout(() => {
          // Redirect to success page with demo data
          const demoUrl = `${window.location.origin}/payment-success?amount=${formData.amount}&name=${encodeURIComponent(formData.name)}&purpose=${encodeURIComponent(formData.purpose_reason)}&comment=${encodeURIComponent(formData.comment || '')}&orgId=${orgId}&demo=true`;
          window.location.href = demoUrl;
        }, 2000);

        setSubmitStatus('success');
        setSubmitMessage('🧪 Demo Mode: Simulating payment processing... You will be redirected to success page.');
        setIsSubmitting(false);
        return;

      } else {
        // Production mode - real Elavon payment
        elavonData = {
          ssl_merchant_id: "2693813",
          ssl_user_id: "8045256156web",
          ssl_pin: "WVVN6XVVOOF92M73QP4GPV2CJRVMON907KCR3Z2NUZCEEG4PDIR7TJEGNR9VL4VW",
          ssl_transaction_type: "ccsale",
          ssl_amount: parseFloat(formData.amount).toFixed(2),
          ssl_first_name: formData.name.split(' ')[0] || formData.name,
          ssl_last_name: formData.name.split(' ').slice(1).join(' ') || '',
          ssl_description: `${formData.purpose_reason} - ${formData.comment || 'Donation'}`,
          ssl_customer_code: orgId,
          ssl_show_form: "true",
          ssl_result_format: "HTML",
          ssl_receipt_link_method: "REDG",
          ssl_receipt_link_url: `${window.location.origin}/payment-success?amount=${formData.amount}&name=${encodeURIComponent(formData.name)}&purpose=${encodeURIComponent(formData.purpose_reason)}&comment=${encodeURIComponent(formData.comment || '')}&orgId=${orgId}`
        };

        formAction = 'https://www.myvirtualmerchant.com/VirtualMerchant/process.do';

        // Create form and submit to production Elavon
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = formAction;
        form.target = '_self';
        form.style.display = 'none';

        // Add all fields to form
        Object.keys(elavonData).forEach(key => {
          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = key;
          input.value = elavonData[key];
          form.appendChild(input);
        });

        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
      }

    } catch (error) {
      console.error('Error initiating payment:', error);
      setSubmitStatus('error');
      setSubmitMessage(error.message || 'Failed to initiate payment. Please try again.');
      setIsSubmitting(false);
    }
  };

  const closeElavonPopup = () => {
    // Not needed anymore since we're using window.open
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

    // Trigger Elavon hosted payment in popup
    await handleElavonPayment();
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

  return (
    <>
      <section className="py-0 sm:py-12 lg:py-16 bg-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Demo Mode Banner */}
        {DEMO_MODE && (
          <div className="mb-6 bg-yellow-600 text-black px-4 py-3 rounded-lg border border-yellow-700">
            <div className="flex items-center">
              <span className="text-xl mr-2">🧪</span>
              <div>
                <p className="font-semibold">Demo Mode Active</p>
                <p className="text-sm">This is a safe testing environment. No real payments will be processed.</p>
              </div>
            </div>
          </div>
        )}

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
                      <span>Purpose:</span>
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
                            <p className="text-sm text-gray-300">{method.description}</p>
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
                        {formData.paymentMethod === 'elavon_hosted' ? 'Redirecting...' : 'Processing...'}
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
    </>
  );
}