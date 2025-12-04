"use client";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

function CheckoutForm({ formData, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsSubmitting(true);

    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
      });

      if (result.error) {
        onError(result.error.message);
      } else if (result.paymentIntent && result.paymentIntent.status === 'succeeded') {
        // Payment successful - call success handler
        onSuccess();
      }
    } catch (err) {
      onError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement 
        className="mb-4"
        options={{
          layout: {
            type: 'accordion',
            defaultCollapsed: false,
            radios: false,
            spacedAccordionItems: false,
          },
        }}
      />
      <button 
        type="submit" 
        disabled={isSubmitting || !stripe}
        className="w-full bg-red-700 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-500 transition disabled:bg-gray-600 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Processing...
          </div>
        ) : (
          'Complete Payment'
        )}
      </button>
    </form>
  );
}

function StripePaymentForm({ formData, clientSecret, onSuccess, onError, onCancel }) {
  const options = {
    clientSecret,
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#dc2626',
        colorBackground: '#000000',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        borderRadius: '8px',
      },
    },
    fields: {
      billingDetails: {
        name: 'never',
        email: 'never',
        phone: 'never',
        address: 'never',
      },
    },
    terms: {
      card: 'never',
    },
  };

  return (
    <div className="bg-black text-white rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold text-red-700">Complete Payment</h3>
        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-white transition"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="bg-zinc-900 rounded-lg p-4 mb-6">
        <h4 className="font-semibold mb-2">Payment Summary</h4>
        <div className="text-sm space-y-1">
          <div className="flex justify-between">
            <span>Amount:</span>
            <span className="font-medium">${formData.amount}</span>
          </div>
          <div className="flex justify-between">
            <span>Name:</span>
            <span className="font-medium">{formData.name}</span>
          </div>
        </div>
      </div>

      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm formData={formData} onSuccess={onSuccess} onError={onError} />
      </Elements>
    </div>
  );
}


function DonationSection({ donationData, organizationSlug, orgId }) {
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
  const [clientSecret, setClientSecret] = useState(null);
  const [showStripeForm, setShowStripeForm] = useState(false);

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
  // console.log('🚀 [DONATION] handleFinalSubmit called');
  // console.log('📋 [DONATION] Form data:', formData);
  // console.log('🏢 [DONATION] Organization ID:', orgId);

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
    // Create Stripe PaymentIntent and get clientSecret
    // console.log('📤 Creating Stripe PaymentIntent...');
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(formData.amount),
        name: formData.name,
        orgId: orgId,
        purpose_reason: formData.purpose_reason,
        comment: formData.comment || '',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to create payment intent');
    }

    const { clientSecret: secret } = await response.json();
    if (!secret) {
      throw new Error('No client secret received');
    }

    // console.log('✅ Client secret received');
    setClientSecret(secret);
    setShowStripeForm(true);

  } catch (error) {
    console.error('💥 Error creating payment intent:', error);
    setSubmitStatus('error');
    setSubmitMessage(error.message || 'There was an error processing your donation.');
  } finally {
    setIsSubmitting(false);
  }
};

const handleStripePaymentSuccess = async () => {
  // console.log('✅ Stripe payment successful');
  
  // Record transaction in your backend
  try {
    const payload = {
      org_key_id: orgId,
      amount: parseFloat(formData.amount),
      name: formData.name,
      payment_method: formData.paymentMethod,
      purpose_reason: formData.purpose_reason,
      comment: formData.comment || ''
    };

    // console.log('📤 Recording transaction:', payload);
    const response = await fetch('https://api.lolligive.com/api/transaction/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      // console.log('✅ Transaction recorded successfully');
    }
  } catch (error) {
    console.error('❌ Error recording transaction:', error);
  }

  setShowStripeForm(false);
  setSubmitStatus('success');
  setSubmitMessage('Payment completed successfully! Thank you for your donation.');
  
  // Reset form after 3 seconds
  setTimeout(() => {
    setStep(1);
    setFormData({
      amount: '',
      customAmount: '',
      name: '',
      purpose_reason: '',
      comment: '',
      paymentMethod: 'debit_card'
    });
    setSubmitStatus(null);
    setClientSecret(null);
  }, 3000);
};

const handleStripePaymentError = (errorMessage) => {
  console.error('❌ Stripe payment error:', errorMessage);
  setSubmitStatus('error');
  setSubmitMessage(errorMessage);
  setShowStripeForm(false);
  setClientSecret(null);
};

const handleCancelStripePayment = () => {
  setShowStripeForm(false);
  setClientSecret(null);
  setIsSubmitting(false);
};

  return (
    <>
    {/* Stripe Payment Form Modal */}
    {showStripeForm && clientSecret && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 bg-opacity-80 p-4">
        <div className="max-w-md w-full">
          <StripePaymentForm
            formData={formData}
            clientSecret={clientSecret}
            onSuccess={handleStripePaymentSuccess}
            onError={handleStripePaymentError}
            onCancel={handleCancelStripePayment}
          />
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
    
    {/* Step 1 */}
    {step === 1 && (
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
            <option value="" className="text-white bg-gray-900">
              Select giving purpose
            </option>
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
    )}

    {/* Step 2 */}
    {step === 2 && (
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
              <span>Purpose: </span>
              <span className="font-medium">
                {donationReasons.find(
                  (r) => r.value === formData.purpose_reason
                )?.label}
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
                    <p className="text-sm text-gray-300">{method.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {errors.paymentMethod && (
            <p className="text-red-500 text-sm mt-1">{errors.paymentMethod}</p>
          )}
        </div>

        {/* Status Messages */}
        {submitStatus && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              submitStatus === 'success'
                ? 'bg-green-600 text-white'
                : 'bg-red-600 text-white'
            }`}
          >
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
              'Complete Payment'
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

export default DonationSection;
