'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

const InputField = ({ label, name, type = 'text', required = false, placeholder, className = '', children, formData, handleInputChange, errors, ...props }) => (
  <div className="space-y-2">
    <label className="block text-sm font-medium text-gray-300">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children || (
      <input
        type={type}
        name={name}
        value={formData[name] ?? ''}
        onChange={handleInputChange}
        required={required}
        placeholder={placeholder}
        className={`w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${className}`}
        {...props}
      />
    )}
    {errors[name] && (
      <p className="text-red-400 text-sm flex items-center gap-1">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        {errors[name]}
      </p>
    )}
  </div>
);

export default function OrganizationRegistration() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    alias: '',
    logo: null,
    description: '',
    video: '',
    purpose_reason: [''],
    location: ''
  });

  const stepTitles = ['Basic Info', 'Media', 'Purpose & Location'];
  const totalSteps = 3;

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Organization name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.description.length < 50) {
          newErrors.description = 'Description should be at least 50 characters';
        }
        break;
      case 2:
        if (!formData.logo) newErrors.logo = 'Logo is required';
        if (formData.video && !isValidUrl(formData.video)) {
          newErrors.video = 'Please enter a valid URL';
        }
        break;
      case 3:
        if (formData.purpose_reason.filter(reason => reason.trim()).length === 0) {
          newErrors.purpose_reason = 'At least one purpose/reason is required';
        }
        if (!formData.location.trim()) newErrors.location = 'Location is required';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'logo' && files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, logo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target.result);
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handlePurposeReasonChange = (index, value) => {
    const updatedReasons = [...formData.purpose_reason];
    updatedReasons[index] = value;
    setFormData(prev => ({ ...prev, purpose_reason: updatedReasons }));
    
    if (errors.purpose_reason) {
      setErrors(prev => ({ ...prev, purpose_reason: '' }));
    }
  };

  const addPurposeReason = () => {
    setFormData(prev => ({
      ...prev,
      purpose_reason: [...prev.purpose_reason, '']
    }));
  };

  const removePurposeReason = (index) => {
    if (formData.purpose_reason.length > 1) {
      const updatedReasons = formData.purpose_reason.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, purpose_reason: updatedReasons }));
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => prev + 1);
    }
  };
  
  const prevStep = () => setStep(prev => prev - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateStep(step)) return;
    
    setIsSubmitting(true);

    try {
      // Clean up purpose_reason array by removing empty strings
      const cleanedData = {
        ...formData,
        purpose_reason: formData.purpose_reason.filter(reason => reason.trim())
      };

      const submitData = new FormData();
      Object.keys(cleanedData).forEach(key => {
        if (key === 'purpose_reason') {
          submitData.append(key, JSON.stringify(cleanedData[key]));
        } else if (cleanedData[key] !== null && cleanedData[key] !== '') {
          submitData.append(key, cleanedData[key]);
        }
      });

      const response = await fetch('/api/organizations/register', {
        method: 'POST',
        body: submitData,
      });

      if (response.ok) {
        const { organizationId } = await response.json();
        router.push(`/organization/${organizationId}`);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: error.message || 'Registration failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br  to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Organization Registration</h1>
          <p className="text-gray-400">Join our community and make a difference</p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700 overflow-hidden">
          {/* Progress Bar */}
          <div className="p-6 bg-gray-800/30 border-b border-gray-700">
            <div className="flex items-center justify-between mb-4">
              {stepTitles.map((title, index) => {
                const stepNum = index + 1;
                const isActive = step === stepNum;
                const isCompleted = step > stepNum;
                
                return (
                  <div key={stepNum} className="flex items-center">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300 ${
                      isCompleted 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : isActive 
                          ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' 
                          : 'border-gray-600 text-gray-400'
                    }`}>
                      {isCompleted ? (
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        stepNum
                      )}
                    </div>
                    <div className="ml-3 hidden sm:block">
                      <p className={`text-sm font-medium ${isActive ? 'text-blue-400' : isCompleted ? 'text-green-400' : 'text-gray-500'}`}>
                        Step {stepNum}
                      </p>
                      <p className={`text-xs ${isActive ? 'text-white' : 'text-gray-400'}`}>
                        {title}
                      </p>
                    </div>
                    {index < stepTitles.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-4 ${step > stepNum ? 'bg-green-500' : 'bg-gray-600'}`} />
                    )}
                  </div>
                );
              })}
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-8">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
                  <p className="text-gray-400">Tell us about your organization</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <InputField
                    label="Organization Name"
                    name="name"
                    required
                    placeholder="Enter your organization name"
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                  />

                  <InputField
                    label="Alias/Short Name"
                    name="alias"
                    placeholder="Enter a short name or acronym"
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe your organization's mission, activities, and the communities you serve..."
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.description}
                    </p>
                  )}
                </div>
                <p className="text-gray-400 text-sm -mt-2">
                  {formData.description.length}/500 characters (minimum 50 required)
                </p>
              </div>
            )}

            {/* Step 2: Logo & Media */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Logo & Media</h2>
                  <p className="text-gray-400">Upload your organizations visual identity</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <InputField
                    label="Organization Logo"
                    name="logo"
                    type="file"
                    required
                    accept="image/*"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                  />

                  {logoPreview && (
                    <div className="flex justify-center">
                      <div className="text-center">
                        <p className="text-gray-300 text-sm mb-2">Preview:</p>
                        <div className="w-32 h-32 border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-700">
                          <Image
                            src={logoPreview} 
                            alt="Logo preview" 
                            className="w-full h-full object-cover"
                            width={128}
                            height={128}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Recommended: Square image (1:1 ratio), minimum 300×300px, max 5MB
                </p>

                <InputField
                  label="Video URL (Optional)"
                  name="video"
                  type="url"
                  placeholder="https://youtube.com/watch?v=..."
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
                <p className="text-gray-400 text-sm -mt-2">
                  Add a video to showcase your organization (YouTube, Vimeo, or direct link)
                </p>
              </div>
            )}

            {/* Step 3: Purpose & Location */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Purpose & Location</h2>
                  <p className="text-gray-400">Define your organizations purpose and location</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium text-gray-300">
                      Purpose & Reasons <span className="text-red-400">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={addPurposeReason}
                      className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-all"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Reason
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.purpose_reason.map((reason, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={reason}
                          onChange={(e) => handlePurposeReasonChange(index, e.target.value)}
                          placeholder={`Purpose/Reason ${index + 1}`}
                          className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                        {formData.purpose_reason.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePurposeReason(index)}
                            className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {errors.purpose_reason && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.purpose_reason}
                    </p>
                  )}
                </div>

                <InputField
                  label="Location"
                  name="location"
                  required
                  placeholder="City, State, Country"
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />

                {errors.submit && (
                  <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
                    <p className="text-red-400 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.submit}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-700">
              <button
                type="button"
                onClick={prevStep}
                disabled={step === 1}
                className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>

              {step < totalSteps ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20"
                >
                  Next
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg disabled:opacity-50 hover:from-green-700 hover:to-green-800 transition-all shadow-lg shadow-green-600/20"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Registering...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Complete Registration
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
