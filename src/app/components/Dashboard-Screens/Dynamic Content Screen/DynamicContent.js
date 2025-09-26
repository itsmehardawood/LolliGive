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
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [aboutUsImagePreview, setAboutUsImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    // Basic Info
    name: '',
    alias: '',
    logo: null,
    mainImage: null,
    
    // Content
    welcomeText: '',
    testimonyText: '',
    aboutUsText: '',
    aboutUsImage: null,
    donationMessage: '',
    videoUrl: '',
    
    // Contact Info
    contactInfo: {
      address: '',
      phone: '',
      email: ''
    },
    
    // Purpose
    purpose_reason: ['']
  });

  const stepTitles = ['Basic Info', 'Content & Media', 'About Us', 'Contact & Purpose'];
  const totalSteps = 4;

  const validateStep = (currentStep) => {
    const newErrors = {};
    
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Organization name is required';
        if (!formData.welcomeText.trim()) newErrors.welcomeText = 'Welcome text is required';
        if (formData.welcomeText.length < 30) {
          newErrors.welcomeText = 'Welcome text should be at least 30 characters';
        }
        if (!formData.logo) newErrors.logo = 'Logo is required';
        if (!formData.mainImage) newErrors.mainImage = 'Main image is required';
        break;
      case 2:
        if (!formData.testimonyText.trim()) newErrors.testimonyText = 'Testimony text is required';
        if (!formData.donationMessage.trim()) newErrors.donationMessage = 'Donation message is required';
        if (formData.videoUrl && !isValidUrl(formData.videoUrl)) {
          newErrors.videoUrl = 'Please enter a valid URL';
        }
        break;
      case 3:
        if (!formData.aboutUsText.trim()) newErrors.aboutUsText = 'About us text is required';
        if (formData.aboutUsText.length < 50) {
          newErrors.aboutUsText = 'About us text should be at least 50 characters';
        }
        if (!formData.aboutUsImage) newErrors.aboutUsImage = 'About us image is required';
        break;
      case 4: 
        if (!formData.contactInfo.address.trim()) newErrors.address = 'Address is required';
        if (!formData.contactInfo.phone.trim()) newErrors.phone = 'Phone number is required';
        if (!formData.contactInfo.email.trim()) newErrors.email = 'Email is required';
        if (formData.contactInfo.email && !isValidEmail(formData.contactInfo.email)) {
          newErrors.email = 'Please enter a valid email address';
        }
        if (formData.purpose_reason.filter(reason => reason.trim()).length === 0) {
          newErrors.purpose_reason = 'At least one purpose/reason is required';
        }
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

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (files && files[0]) {
      const file = files[0];
      setFormData(prev => ({ ...prev, [name]: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        if (name === 'logo') setLogoPreview(e.target.result);
        if (name === 'mainImage') setMainImagePreview(e.target.result);
        if (name === 'aboutUsImage') setAboutUsImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContactInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      contactInfo: {
        ...prev.contactInfo,
        [name]: value
      }
    }));
    
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
      
      // Add text fields
      submitData.append('name', cleanedData.name);
      if (cleanedData.alias) submitData.append('alias', cleanedData.alias);
      submitData.append('welcomeText', cleanedData.welcomeText);
      submitData.append('testimonyText', cleanedData.testimonyText);
      submitData.append('aboutUsText', cleanedData.aboutUsText);
      submitData.append('donationMessage', cleanedData.donationMessage);
      if (cleanedData.videoUrl) submitData.append('videoUrl', cleanedData.videoUrl);
      
      // Add contact info
      submitData.append('contactInfo', JSON.stringify(cleanedData.contactInfo));
      
      // Add purpose reasons
      submitData.append('purpose_reason', JSON.stringify(cleanedData.purpose_reason));
      
      // Add files
      if (cleanedData.logo) submitData.append('logo', cleanedData.logo);
      if (cleanedData.mainImage) submitData.append('mainImage', cleanedData.mainImage);
      if (cleanedData.aboutUsImage) submitData.append('aboutUsImage', cleanedData.aboutUsImage);

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
    <div className="min-h-screen py-8 px-4">
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
            {/* Step 1: Basic Information & Images */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Basic Information</h2>
                  <p className="text-gray-400">Tell us about your organization and upload key images</p>
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
                    Welcome Text <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="welcomeText"
                    value={formData.welcomeText}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Write a welcoming message for visitors to your organization's page..."
                  />
                  {errors.welcomeText && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.welcomeText}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm">
                    {formData.welcomeText.length}/300 characters (minimum 30 required)
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
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
                      <div className="mt-3">
                        <p className="text-gray-300 text-sm mb-2">Logo Preview:</p>
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
                    )}
                  </div>

                  <div>
                    <InputField
                      label="Main/Hero Image"
                      name="mainImage"
                      type="file"
                      required
                      accept="image/*"
                      className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                      formData={formData}
                      handleInputChange={handleInputChange}
                      errors={errors}
                    />
                    {mainImagePreview && (
                      <div className="mt-3">
                        <p className="text-gray-300 text-sm mb-2">Main Image Preview:</p>
                        <div className="w-full h-32 border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-700">
                          <Image
                            src={mainImagePreview} 
                            alt="Main image preview" 
                            className="w-full h-full object-cover"
                            width={300}
                            height={128}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Content & Media */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Content & Media</h2>
                  <p className="text-gray-400">Add testimony, donation message, and video content</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Testimony Text <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="testimonyText"
                    value={formData.testimonyText}
                    onChange={handleInputChange}
                    required
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Share testimonials or success stories from people you've helped..."
                  />
                  {errors.testimonyText && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.testimonyText}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Donation Message <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="donationMessage"
                    value={formData.donationMessage}
                    onChange={handleInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Explain how donations help your cause and encourage people to contribute..."
                  />
                  {errors.donationMessage && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.donationMessage}
                    </p>
                  )}
                </div>

                <InputField
                  label="Video URL (Optional)"
                  name="videoUrl"
                  type="url"
                  placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  formData={formData}
                  handleInputChange={handleInputChange}
                  errors={errors}
                />
                <p className="text-gray-400 text-sm -mt-2">
                  Add a video to showcase your organization (YouTube, Vimeo, or direct link)
                </p>
              </div>
            )}

            {/* Step 3: About Us */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">About Us</h2>
                  <p className="text-gray-400">Tell your organizations story</p>
                </div>
                
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">
                    About Us Text <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="aboutUsText"
                    value={formData.aboutUsText}
                    onChange={handleInputChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    placeholder="Describe your organization's history, mission, values, and the impact you make in your community..."
                  />
                  {errors.aboutUsText && (
                    <p className="text-red-400 text-sm flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.aboutUsText}
                    </p>
                  )}
                  <p className="text-gray-400 text-sm">
                    {formData.aboutUsText.length}/1000 characters (minimum 50 required)
                  </p>
                </div>

                <div>
                  <InputField
                    label="About Us Image"
                    name="aboutUsImage"
                    type="file"
                    required
                    accept="image/*"
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
                    formData={formData}
                    handleInputChange={handleInputChange}
                    errors={errors}
                  />
                  {aboutUsImagePreview && (
                    <div className="mt-3">
                      <p className="text-gray-300 text-sm mb-2">About Us Image Preview:</p>
                      <div className="w-full h-48 border-2 border-gray-600 rounded-lg overflow-hidden bg-gray-700">
                        <Image
                          src={aboutUsImagePreview} 
                          alt="About us image preview" 
                          className="w-full h-full object-cover"
                          width={400}
                          height={192}
                        />
                      </div>
                    </div>
                  )}
                  <p className="text-gray-400 text-sm mt-2">
                    Upload an image that represents your organizations work or team
                  </p>
                </div>
              </div>
            )}

            {/* Step 4: Contact & Purpose */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-white mb-2">Contact & Purpose</h2>
                  <p className="text-gray-400">Provide contact information and define your purpose</p>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Contact Information</h3>
                  
                  <InputField
                    label="Address"
                    name="address"
                    required
                    placeholder="Full address including city, state/province, country"
                    formData={formData.contactInfo}
                    handleInputChange={handleContactInfoChange}
                    errors={errors}
                  />

                  <div className="grid md:grid-cols-2 gap-4">
                    <InputField
                      label="Phone Number"
                      name="phone"
                      required
                      placeholder="+1 (555) 123-4567"
                      formData={formData.contactInfo}
                      handleInputChange={handleContactInfoChange}
                      errors={errors}
                    />

                    <InputField
                      label="Email Address"
                      name="email"
                      type="email"
                      required
                      placeholder="contact@organization.org"
                      formData={formData.contactInfo}
                      handleInputChange={handleContactInfoChange}
                      errors={errors}
                    />
                  </div>
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