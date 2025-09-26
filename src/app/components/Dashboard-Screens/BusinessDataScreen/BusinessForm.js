import React from 'react';

const BusinessForm = ({ 
  businessInfo, 
  setBusinessInfo, 
  handleInputChange, 
  handleSubmitWithReload, 
  isSubmitting, 
  submitError, 
  submitSuccess 
}) => {
  return (
    <main className=" min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-gray-100 mb-8">
          Complete Your Organization Profile
        </h2>

        <div className="bg-gray-800 rounded-lg shadow-sm border border-gray-700 p-8">
          
          {/* Error Message */}
          {submitError && (
            <div className="mb-6 bg-red-900/20 border border-red-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-red-400">✕</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-300">
                    Submission Failed
                  </h3>
                  <div className="mt-2 text-sm text-red-400">
                    <p>{submitError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {submitSuccess && (
            <div className="mb-6 bg-green-900/20 border border-green-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-green-400">✓</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-300">
                    Submission Successful
                  </h3>
                  <div className="mt-2 text-sm text-green-400">
                    <p>
                      Your business profile has been submitted successfully and is
                      under review. Refreshing status...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Section Heading */}
            <h3 className="text-lg font-medium text-gray-100 border-b border-gray-600 pb-3">
              Organization Information
            </h3>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Organization Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization Name *
                </label>
                <input
                  type="text"
                  name="org_name"
                  value={businessInfo.org_name}
                  placeholder="e.g., ABC Corporation, Johnson & Associates LLC"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                  required
                />
              </div>

              {/* Registration Number */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Registration Number *
                </label>
                <input
                  type="text"
                  name="reg_no"
                  value={businessInfo.reg_no}
                  placeholder="e.g., 12345678, EIN-987654321"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                  required
                />
              </div>

              {/* Organization Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization Email *
                </label>
                <input
                  type="email"
                  name="org_email"
                  placeholder="business@company.com"
                  value={businessInfo.org_email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                  required 
                />
              </div>

              {/* Organization Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization Phone *
                </label>
                <input
                  type="tel"
                  name="org_phone"
                  placeholder="+1 234 567 8900"
                  value={businessInfo.org_phone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                  required 
                />
              </div>
            </div>

            {/* Organization Address */}
            <div className="border-t border-gray-600 pt-8">
              <h3 className="text-lg font-medium text-gray-100 mb-4">
                Organization Address
              </h3>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Complete Address *
                </label>
                <textarea
                  name="org_address"
                  value={businessInfo.org_address}
                  placeholder="123 Main Street, Suite 456, New York, NY 10001, United States"
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                  required
                />
                <p className="text-xs text-gray-400 mt-2">
                  Please provide the complete business address including street, city, state/province, postal code, and country
                </p>
              </div>
            </div>

            {/* Organization Document Upload */}
            <div className="border-t border-gray-600 pt-8">
              <h3 className="text-lg font-medium text-gray-100 mb-4">
                Organization Documents
              </h3>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Organization Registration Document *
                </label>
                <input
                  type="file"
                  name="org_document"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) =>
                    setBusinessInfo((prev) => ({
                      ...prev,
                      org_document: e.target.files?.[0] || null,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
                  required
                />
                <p className="text-xs text-gray-400 mt-2">
                  Upload your business registration certificate, articles of incorporation, or business license (PDF, DOC, DOCX, JPG, JPEG, PNG - Max 10MB)
                </p>
              </div>

              {businessInfo.org_document && (
                <div className="bg-gray-700 border border-gray-600 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-200 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      {businessInfo.org_document.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setBusinessInfo((prev) => ({
                          ...prev,
                          org_document: null,
                        }))
                      }
                      className="text-red-400 hover:text-red-300 text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Account Holder Information */}
            <div className="border-t border-gray-200 pt-8">
              <h3 className="text-lg font-medium text-white mb-4">
                Account Holder Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    name="account_holder_name"
                    value={businessInfo.account_holder_name}
                    placeholder="John Smith"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300  text-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={businessInfo.email}
                    placeholder="john.smith@company.com"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300  text-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={businessInfo.phone}
                    placeholder="+1 234 567 8901"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300  text-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={businessInfo.address}
                    placeholder="456 Oak Avenue, Apt 7B, Los Angeles, CA 90210, United States"
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 bg- text-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Complete address including street, city, state/province, postal code, and country
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">
                    Upload ID Document *
                  </label>
                  <input
                    type="file"
                    name="document"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        document: e.target.files?.[0] || null,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 b text-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-300 file:text-gray-700 hover:file:bg-gray-200"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a clear photo or scan of your ID (JPG, PNG, PDF - Max 10MB)
                  </p>
                  {businessInfo.document && (
                    <div className="bg-gray-50 border border-gray-200 mt-3 p-3 rounded-md">
                      <span className="text-sm text-gray-700 flex items-center">
                        <svg className="w-4 h-4 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                        </svg>
                        {businessInfo.document.name}
                      </span>
                    </div>
                  )}
                </div>   
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-gray-200">
              <button
                type="button"
                onClick={handleSubmitWithReload}
                disabled={isSubmitting}
                className="px-6 py-3 bg-gray-700 text-gray-100 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-500 flex items-center transition-colors duration-200"
              >
                {isSubmitting && (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                )}
                {isSubmitting ? "Submitting..." : "Submit Business Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BusinessForm;