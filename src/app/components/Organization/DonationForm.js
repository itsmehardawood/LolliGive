// components/DonationForm.js
'use client';

import { useState } from 'react';

export default function DonationForm({ orgName }) {
  const [formData, setFormData] = useState({
    name: '',
    purpose: '',
    reason: '',
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // In a real app, you would send this data to your backend API
      console.log('Donation form submitted:', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSubmitStatus({
        type: 'success',
        message: 'Thank you for your donation submission! We will contact you shortly.'
      });
      
      // Reset form
      setFormData({
        name: '',
        purpose: '',
        reason: '',
        comment: ''
      });
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'There was an error submitting your donation. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#18181b] p-8 rounded-lg shadow-md max-w-2xl mx-auto my-12 border border-[#27272a]">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Support {orgName}</h2>
      {submitStatus && (
        <div className={`p-4 mb-6 rounded-lg ${
          submitStatus.type === 'success'
            ? 'bg-green-900 text-green-200 border border-green-700'
            : 'bg-red-900 text-red-200 border border-red-700'
        }`}>
          {submitStatus.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#27272a] bg-[#23232b] text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            required
            placeholder="Enter your full name"
          />
        </div>
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-gray-200 mb-1">
            Donation Purpose *
          </label>
          <select
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-[#27272a] bg-[#23232b] text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            required
          >
            <option value="">Select a purpose</option>
            <option value="general">General Support</option>
            <option value="education">Education Programs</option>
            <option value="research">Research & Development</option>
            <option value="community">Community Outreach</option>
            <option value="environment">Environmental Initiatives</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="reason" className="block text-sm font-medium text-gray-200 mb-1">
            Why are you choosing to donate? *
          </label>
          <textarea
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 border border-[#27272a] bg-[#23232b] text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            required
            placeholder="Please share your motivation for donating"
          />
        </div>
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-200 mb-1">
            Additional Comments
          </label>
          <textarea
            id="comment"
            name="comment"
            value={formData.comment}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-2 border border-[#27272a] bg-[#23232b] text-white rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            placeholder="Any additional information you'd like to share"
          />
        </div>
        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-blue-700 text-white rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Donation'}
          </button>
        </div>
        <p className="text-sm text-gray-400 text-center">
          * indicates required field
        </p>
      </form>
    </div>
  );
}