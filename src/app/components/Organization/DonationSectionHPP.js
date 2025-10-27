"use client";
import { useState } from 'react';

// Demo/Production Mode Toggle
const DEMO_MODE = false; // Set to true for testing with demo environment

export default function DonationSectionHPP({ donationData, organizationSlug, orgId }) {
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
    ]
  } = donationData || {};

  const [formData, setFormData] = useState({
    amount: '',
    customAmount: '',
    name: '',
    email: '',
    purpose_reason: '',
    comment: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Form handlers
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid donation amount';
    }
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim() || !formData.email.includes('@')) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!formData.purpose_reason) {
      newErrors.purpose_reason = 'Please select a donation reason';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle payment submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!orgId) {
      setErrors({ general: 'Organization ID not found. Please try again.' });
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    setSubmitMessage('Preparing secure payment page...');

    try {
      console.log('→ Requesting HPP session token...');
      
      const invoiceNumber = `ORG-${orgId}-${Date.now()}`;
      const returnUrl = `${window.location.origin}/payment-success?` +
        `amount=${formData.amount}&` +
        `name=${encodeURIComponent(formData.name)}&` +
        `purpose=${encodeURIComponent(formData.purpose_reason)}&` +
        `comment=${encodeURIComponent(formData.comment || '')}&` +
        `orgId=${orgId}&` +
        `invoice=${invoiceNumber}`;

      // Request session token from backend
      const response = await fetch('/api/elavon/hpp-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: parseFloat(formData.amount).toFixed(2),
          firstName: formData.name.split(' ')[0] || formData.name,
          lastName: formData.name.split(' ').slice(1).join(' ') || 'Donor',
          email: formData.email,
          description: `${formData.purpose_reason} - ${formData.comment || 'Donation'}`,
          invoiceNumber: invoiceNumber,
          returnUrl: returnUrl,
          orgId: orgId
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✓ HPP session token received');

      if (data.demo) {
        // Demo mode - simulate redirect
        console.log('🧪 Demo Mode: Simulating HPP redirect...');
        setSubmitMessage('🧪 Demo Mode: Redirecting to payment page...');
        
        setTimeout(() => {
          window.location.href = returnUrl + '&demo=true';
        }, 1500);
      } else {
        // Production mode - redirect to Converge HPP
        console.log('→ Redirecting to Converge Hosted Payment Page...');
        setSubmitMessage('Redirecting to secure payment page...');
        
        // Redirect to Converge HPP with session token
        const hppUrl = data.hostedPaymentUrl || data.paymentUrl;
        
        if (!hppUrl) {
          throw new Error('Payment URL not received from server');
        }
        
        // Redirect after a brief moment
        setTimeout(() => {
          window.location.href = hppUrl;
        }, 500);
      }

    } catch (error) {
      console.error('✗ Payment initialization failed:', error);
      setErrors({ 
        general: error.message || 'Failed to initialize payment. Please try again.' 
      });
      setSubmitMessage('');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-0 sm:py-12 lg:py-16 bg-black px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Demo Mode Banner */}
        {DEMO_MODE && (
          <div className="mb-6 bg-yellow-600 text-black px-4 py-3 rounded-lg border border-yellow-700">
            <div className="flex items-center">
              <span className="text-xl mr-2">🧪</span>
              <div>
                <p className="font-semibold">Demo Mode Active</p>
                <p className="text-sm">Testing environment - No real payments will be processed.</p>
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

        {/* Donation Form */}
        <div className="flex justify-center">
          <div className="w-full sm:w-[500px] lg:w-[600px] bg-black text-white rounded-xl shadow-xl border border-gray-500 p-6 sm:p-8 lg:p-10">
            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-bold text-red-700 mb-6">
                Donation Information
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
                      type="button"
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

              {/* Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-white mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-white rounded-lg bg-black text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Purpose */}
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
                  <option value="">Select donation purpose</option>
                  {donationReasons.map((reason) => (
                    <option key={reason.value} value={reason.value}>
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
                />
              </div>

              {/* Status Messages */}
              {submitMessage && (
                <div className="mb-6 p-4 rounded-lg bg-blue-600 text-white">
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-3"></div>
                    <p className="text-sm">{submitMessage}</p>
                  </div>
                </div>
              )}

              {/* Error Messages */}
              {errors.general && (
                <div className="mb-6 p-4 rounded-lg bg-red-600 text-white">
                  <p className="text-sm">{errors.general}</p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-6 rounded-lg font-semibold transition ${
                  isSubmitting
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-red-700 text-white hover:bg-red-500'
                }`}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  'Continue to Secure Payment'
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-6 text-center text-xs text-gray-400">
                🔒 Secured by Elavon Converge | PCI-DSS SAQ-A Compliant
                <br />
                You will be redirected to a secure payment page
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
