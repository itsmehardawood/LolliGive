// components/business/BusinessForm.jsx
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
  <main>
      <h2 className="text-2xl font-semibold text-white my-6 px-2">
        Complete Your Organization Profile
      </h2>

      <div className="bg-black rounded-lg shadow-md border border-gray-800 p-6">
        
        {/* Error Message */}
        {submitError && (
          <div className="mb-6 bg-red-900 border border-red-700 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-red-300">✕</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-200">
                  Submission Failed
                </h3>
                <div className="mt-2 text-sm text-red-300">
                  <p>{submitError}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Message */}
        {submitSuccess && (
          <div className="mb-6 bg-green-900 border border-green-700 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <span className="text-green-300">✓</span>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-200">
                  Submission Successful
                </h3>
                <div className="mt-2 text-sm text-green-300">
                  <p>
                    Your business profile has been submitted successfully and is
                    under review. Refreshing status...
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Section Heading */}
          <h3 className="text-lg font-medium text-white">
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
                className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required 
              />
            </div>
          </div>

          {/* Organization Address */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">
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
                className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Please provide the complete business address including street, city, state/province, postal code, and country
              </p>
            </div>
          </div>

          {/* Organization Document Upload */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">
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
                className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="text-xs text-gray-400 mt-1">
                Upload your business registration certificate, articles of incorporation, or business license (PDF, DOC, DOCX, JPG, JPEG, PNG - Max 10MB)
              </p>
            </div>

            {businessInfo.org_document && (
              <div className="bg-gray-900 p-3 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">
                    📄 {businessInfo.org_document.name}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setBusinessInfo((prev) => ({
                        ...prev,
                        org_document: null,
                      }))
                    }
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Account Holder Information */}
          <div className="border-t border-gray-700 pt-6">
            <h3 className="text-lg font-medium text-white mb-4">
              Account Holder Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Account Holder Name *
                </label>
                <input
                  type="text"
                  name="account_holder_name"
                  value={businessInfo.account_holder_name}
                  placeholder="John Smith"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={businessInfo.email}
                  placeholder="john.smith@company.com"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={businessInfo.phone}
                  placeholder="+1 234 567 8901"
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Address *
                </label>
                <textarea
                  name="address"
                  value={businessInfo.address}
                  placeholder="456 Oak Avenue, Apt 7B, Los Angeles, CA 90210, United States"
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Complete address including street, city, state/province, postal code, and country
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
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
                  className="w-full px-3 py-2 border border-gray-700 bg-black text-white rounded-md"
                  required
                />
                <p className="text-xs text-gray-400 mt-1">
                  Upload a clear photo or scan of your ID (JPG, PNG, PDF - Max 10MB)
                </p>
                {businessInfo.document && (
                  <div className="bg-gray-900 mt-2 p-2 rounded text-sm text-gray-300">
                    📄 {businessInfo.document.name}
                  </div>
                )}
              </div>   
            </div>
          </div>

          <div className="flex justify-end pt-6">
            <button
              type="button"
              onClick={handleSubmitWithReload}
              disabled={isSubmitting}
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isSubmitting && (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              )}
              {isSubmitting ? "Submitting..." : "Submit Business Profile"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BusinessForm;