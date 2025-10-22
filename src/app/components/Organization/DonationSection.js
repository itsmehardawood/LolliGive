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
      { 
        id: "credit_card", 
        name: "Credit Card", 
        icon: "💳",
        description: "Pay with Visa, MasterCard, or American Express"
      },
      { 
        id: "bank_account", 
        name: "Bank Account", 
        icon: "🏦",
        description: "Direct transfer from your bank account"
      },
      { 
        id: "paypal", 
        name: "PayPal", 
        icon: "💰",
        description: "Pay securely with your PayPal account"
      }
    ]
  } = donationData || {};

  const [step, setStep] = useState(1); // 1: Amount & Details, 2: Payment Method, 3: QR Code
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

  const handleProceedToPayment = () => {
    if (!formData.paymentMethod) {
      setErrors({ paymentMethod: 'Please select a payment method' });
      return;
    }

    // If debit or credit card, go to QR code step
    if (formData.paymentMethod === 'debit_card' || formData.paymentMethod === 'credit_card') {
      setStep(3);
    } else {
      // For other payment methods, proceed to final submission
      handleFinalSubmit();
    }
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
        ) : step === 2 ? (
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

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition"
              >
                Back
              </button>
              <button
                onClick={handleProceedToPayment}
                className="flex-1 bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-500 transition"
              >
                Continue
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-red-700 mb-6">
              Step 3: Scan QR Code
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
                <div className="flex justify-between">
                  <span>Payment Method:</span>
                  <span className="font-medium">
                    {
                      paymentMethods.find(
                        (m) => m.id === formData.paymentMethod
                      )?.name
                    }
                  </span>
                </div>
              </div>
            </div>

            {/* QR Code Display */}
            <div className="mb-6 p-6 bg-zinc-900 rounded-lg border border-red-600">
              <h4 className="text-lg font-semibold text-white mb-4 text-center">
                Scan QR Code to Complete Payment
              </h4>
              <div className="flex flex-col items-center">
                <div className="bg-white p-4 rounded-lg mb-4">
                  <Image
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent('https://auth.cardnest.io/LolliCash%20LLC/3349a8ac')}`}
                    alt="Payment QR Code"
                    width={200}
                    height={200}
                    className="w-48 h-48"
                  />
                </div>
                <p className="text-sm text-gray-300 text-center mb-2">
                  Scan this QR code with your mobile device to complete the payment
                </p>
                <a
                  href="https://auth.cardnest.io/LolliCash%20LLC/3349a8ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 text-sm underline"
                >
                  Or click here to open payment link
                </a>
              </div>
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
                onClick={() => setStep(2)}
                disabled={isSubmitting}
                className={`flex-1 py-3 px-6 rounded-lg font-semibold transition ${
                  isSubmitting 
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-white text-black hover:bg-gray-200'
                }`}
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