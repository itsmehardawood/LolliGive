"use client";
import { useState } from 'react';
import Image from "next/image";

export default function DonationSection({ donationData, organizationSlug }) {
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

  const handleFinalSubmit = () => {
    if (!formData.paymentMethod) {
      setErrors({ paymentMethod: 'Please select a payment method' });
      return;
    }

    // Here you would integrate with your payment processor
    console.log('Processing donation:', formData);
    alert('Donation processing... (This would integrate with your payment gateway)');
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
  };

  return (
 <section className="py-0 sm:py-12 lg:py-16 bg-white px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto">
    {/* Header */}
    <div className="mb-12 text-center">
      <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-red-800 mb-4">
        {title}
      </h2>
      <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
        {subtitle}
      </p>
    </div>

    {/* Form Wrapper */}
    <div className="flex justify-center">
      <div className="w-full sm:w-[500px] lg:w-[600px] bg-white rounded-xl shadow-xl border p-6 sm:p-8 lg:p-10">
        {step === 1 ? (
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-6">
              Step 1: Donation Details
            </h3>

            {/* Amount Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Select Amount *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-4">
                {suggestedAmounts.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleAmountSelect(amount)}
                    className={`py-2 px-3 rounded-lg border text-sm font-medium transition ${
                      formData.amount === amount.toString()
                        ? 'bg-red-800 text-white border-red-800'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-red-800'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>

              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                  $
                </span>
                <input
                  type="number"
                  placeholder="Custom amount"
                  value={formData.customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                  min="1"
                  step="0.01"
                />
              </div>
              {errors.amount && (
                <p className="text-red-600 text-sm mt-1">{errors.amount}</p>
              )}
            </div>

            {/* Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Purpose/Reason */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Donation Purpose *
              </label>
              <select
                name="purpose_reason"
                value={formData.purpose_reason}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
              >
                <option value="">Select donation purpose</option>
                {donationReasons.map((reason) => (
                  <option key={reason.value} value={reason.value}>
                    {reason.label}
                  </option>
                ))}
              </select>
              {errors.purpose_reason && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.purpose_reason}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Optional Note
              </label>
              <textarea
                name="comment"
                value={formData.comment}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-800"
                placeholder="Add a personal note (optional)"
              ></textarea>
            </div>

            <button
              onClick={handleProceed}
              className="w-full bg-red-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Proceed to Payment
            </button>
          </div>
        ) : (
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-6">
              Step 2: Payment Method
            </h3>

            {/* Donation Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-800 mb-2">
                Donation Summary
              </h4>
              <div className="text-sm text-gray-600 space-y-1">
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
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Choose Payment Method *
              </label>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => handlePaymentMethodSelect(method.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition ${
                      formData.paymentMethod === method.id
                        ? 'border-red-800 bg-red-50'
                        : 'border-gray-300 hover:border-red-800'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className="text-2xl mr-3">{method.icon}</span>
                      <div>
                        <h5 className="font-medium text-gray-800">
                          {method.name}
                        </h5>
                        <p className="text-sm text-gray-600">
                          {method.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.paymentMethod && (
                <p className="text-red-600 text-sm mt-1">
                  {errors.paymentMethod}
                </p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setStep(1)}
                className="flex-1 bg-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                Back
              </button>
              <button
                onClick={handleFinalSubmit}
                className="flex-1 bg-red-800 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 transition"
              >
                Complete Donation
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