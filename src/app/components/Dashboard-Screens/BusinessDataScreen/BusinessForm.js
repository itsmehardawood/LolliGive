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
  const [fileError, setFileError] = React.useState('');

  // File validation helper
  const validateFile = (file, fieldName) => {
    setFileError('');
    
    if (!file) return false;
    
    // Check file size (10MB = 10 * 1024 * 1024 bytes)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setFileError(`${fieldName}: File size must be less than 10MB`);
      return false;
    }
    
    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/jpg',
      'image/png'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      setFileError(`${fieldName}: Please upload a PDF, DOC, DOCX, JPG, or PNG file`);
      return false;
    }
    
    return true;
  };

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

          {/* File Error Message */}
          {fileError && (
            <div className="mb-6 bg-yellow-900/20 border border-yellow-800 rounded-md p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <span className="text-yellow-400">⚠</span>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-300">
                    File Upload Warning
                  </h3>
                  <div className="mt-2 text-sm text-yellow-400">
                    <p>{fileError}</p>
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
                  name="organization_name"
                  value={businessInfo.organization_name || ""}
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
                  name="organization_registration_number"
                  value={businessInfo.organization_registration_number || ""}
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
                  name="email"
                  placeholder="business@company.com"
                  value={businessInfo.email || ""}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={businessInfo.street || ""}
                    placeholder="123 Main Street"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Street Address Line 2
                  </label>
                  <input
                    type="text"
                    name="street_line2"
                    value={businessInfo.street_line2 || ""}
                    placeholder="Suite 456 (Optional)"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={businessInfo.city || ""}
                    placeholder="New York"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={businessInfo.state || ""}
                    placeholder="NY"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zip_code"
                    value={businessInfo.zip_code || ""}
                    placeholder="10001"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={businessInfo.country || ""}
                    placeholder="United States"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>
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
                  name="registration_document"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && validateFile(file, 'Registration Document')) {
                      setBusinessInfo((prev) => ({
                        ...prev,
                        registration_document: file,
                      }));
                    } else if (!file) {
                      setBusinessInfo((prev) => ({
                        ...prev,
                        registration_document: null,
                      }));
                    } else {
                      e.target.value = ''; // Clear invalid file
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
                  required
                />
                <p className="text-xs text-gray-400 mt-2">
                  Upload your business registration certificate, articles of incorporation, or business license (PDF, DOC, DOCX, JPG, JPEG, PNG - Max 10MB)
                </p>
              </div>

              {businessInfo.registration_document && (
                <div className="bg-gray-700 border border-gray-600 p-3 rounded-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-200 flex items-center">
                      <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                      {businessInfo.registration_document.name}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setBusinessInfo((prev) => ({
                          ...prev,
                          registration_document: null,
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
            <div className="border-t border-gray-600 pt-8">
              <h3 className="text-lg font-medium text-gray-100 mb-4">
                Account Holder Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="account_holder_first_name"
                    value={businessInfo.account_holder_first_name || ""}
                    placeholder="John"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="account_holder_last_name"
                    value={businessInfo.account_holder_last_name || ""}
                    placeholder="Smith"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="account_holder_email"
                    value={businessInfo.account_holder_email || ""}
                    placeholder="john.smith@company.com"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="account_holder_date_of_birth"
                    value={businessInfo.account_holder_date_of_birth || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="account_holder_street"
                    value={businessInfo.account_holder_street || ""}
                    placeholder="456 Oak Avenue"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Street Address Line 2
                  </label>
                  <input
                    type="text"
                    name="account_holder_street_line2"
                    value={businessInfo.account_holder_street_line2 || ""}
                    placeholder="Apt 7B (Optional)"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="account_holder_city"
                    value={businessInfo.account_holder_city || ""}
                    placeholder="Los Angeles"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="account_holder_state"
                    value={businessInfo.account_holder_state || ""}
                    placeholder="CA"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="account_holder_zip_code"
                    value={businessInfo.account_holder_zip_code || ""}
                    placeholder="90210"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="account_holder_country"
                    value={businessInfo.account_holder_country || ""}
                    placeholder="United States"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ID Type *
                  </label>
                  <select
                    name="account_holder_id_type"
                    value={businessInfo.account_holder_id_type || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                    required
                  >
                    <option value="">Select ID Type</option>
                    <option value="Passport">Passport</option>
                    <option value="Driver's License">Drivers License</option>
                    <option value="National ID">National ID</option>
                    <option value="SSN">Social Security Number</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    ID Number *
                  </label>
                  <input
                    type="text"
                    name="account_holder_id_number"
                    value={businessInfo.account_holder_id_number || ""}
                    placeholder="ID Number"
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Upload ID Document *
                  </label>
                  <input
                    type="file"
                    name="account_holder_id_document"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && validateFile(file, 'ID Document')) {
                        setBusinessInfo((prev) => ({
                          ...prev,
                          account_holder_id_document: file,
                        }));
                      } else if (!file) {
                        setBusinessInfo((prev) => ({
                          ...prev,
                          account_holder_id_document: null,
                        }));
                      } else {
                        e.target.value = ''; // Clear invalid file
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-600 file:text-gray-200 hover:file:bg-gray-500"
                    required
                  />
                  <p className="text-xs text-gray-400 mt-2">
                    Upload a clear photo or scan of your ID (JPG, PNG, PDF - Max 10MB)
                  </p>
                  {businessInfo.account_holder_id_document && (
                    <div className="bg-gray-700 border border-gray-600 mt-3 p-3 rounded-md">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-200 flex items-center">
                          <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                          </svg>
                          {businessInfo.account_holder_id_document.name}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setBusinessInfo((prev) => ({
                              ...prev,
                              account_holder_id_document: null,
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
              </div>
            </div>

            <div className="flex justify-end pt-8 border-t border-gray-600">
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