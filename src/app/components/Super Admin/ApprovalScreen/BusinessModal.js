"use client";
import React from 'react';
import { 
  X, 
  Building, 
  Mail, 
  MapPin, 
  User, 
  CreditCard, 
  FileText, 
  Download, 
  Calendar,
  Hash,
  Home,
  Globe,
  Phone,
  IdCard,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

const BusinessModal = ({ 
  isOpen, 
  onClose, 
  business, 
  onApprove, 
  onReject, 
  actionLoading, 
  downloadLoading, 
  handleDownloadDocument,
  activeTab
}) => {
  if (!isOpen || !business) return null;

  const businessProfile = business.business_profile;
  const company = business.company;

  const InfoCard = ({ title, children, icon: Icon }) => (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      <div className="flex items-center mb-3">
        <Icon className="w-5 h-5 text-blue-400 mr-2" />
        <h4 className="text-lg font-semibold text-white">{title}</h4>
      </div>
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );

  const InfoRow = ({ label, value, icon: Icon }) => {
    if (!value) return null;
    
    return (
      <div className="flex items-start justify-between py-2 border-b border-gray-700 last:border-b-0">
        <div className="flex items-center">
          {Icon && <Icon className="w-4 h-4 text-gray-400 mr-2 mt-0.5" />}
          <span className="text-gray-400 text-sm font-medium">{label}:</span>
        </div>
        <span className="text-white text-sm ml-4 text-right max-w-xs break-words">
          {value}
        </span>
      </div>
    );
  };

  const DocumentDownload = ({ path, label }) => {
    if (!path) return null;
    
    return (
      <button
        onClick={() => handleDownloadDocument(path, `${label}.pdf`)}
        disabled={downloadLoading}
        className="flex items-center justify-between w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-all duration-200 group"
      >
        <div className="flex items-center">
          <FileText className="w-4 h-4 text-blue-400 mr-2" />
          <span className="text-white text-sm font-medium">{label}</span>
        </div>
        <Download className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
      </button>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden border border-gray-700">
        {/* Header */}
        <div className="bg-gradient-to-r bg-gray-900 0 px-6 py-4 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center">
                <Building className="w-6 h-6 mr-2 text-blue-400" />
                {businessProfile?.organization_name || company?.name || 'Organization Details'}
              </h3>
              <p className="text-gray-300 text-sm mt-1">
                Registration: {businessProfile?.organization_registration_number || 'N/A'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-600 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="max-h-[calc(90vh-200px)] overflow-y-auto p-6 bg-zinc-950">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Organization Information */}
            <InfoCard title="Organization Information" icon={Building}>
              <InfoRow label="Organization Name" value={businessProfile?.organization_name} icon={Building} />
              <InfoRow label="Registration Number" value={businessProfile?.organization_registration_number} icon={Hash} />
              <InfoRow label="Email" value={businessProfile?.email} icon={Mail} />
              <InfoRow label="Company Name" value={company?.name} />
              <InfoRow label="Company Alias" value={company?.alias} />
              <InfoRow label="Description" value={company?.description} />
              {company?.purpose_reason && (
                <div className="py-2">
                  <span className="text-gray-400 text-sm font-medium">Purpose:</span>
                  <ul className="mt-2 space-y-1">
                    {company.purpose_reason.map((purpose, index) => (
                      <li key={index} className="text-white text-sm ml-4 list-disc">
                        {purpose}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </InfoCard>

            {/* Organization Address */}
            <InfoCard title="Organization Address" icon={MapPin}>
              <InfoRow label="Street" value={businessProfile?.street} icon={Home} />
              <InfoRow label="Street Line 2" value={businessProfile?.street_line2} />
              <InfoRow label="City" value={businessProfile?.city} />
              <InfoRow label="State" value={businessProfile?.state} />
              <InfoRow label="ZIP Code" value={businessProfile?.zip_code} />
              <InfoRow label="Country" value={businessProfile?.country} icon={Globe} />
            </InfoCard>

            {/* Account Holder Information */}
            <InfoCard title="Account Holder Information" icon={User}>
              <InfoRow 
                label="Full Name" 
                value={`${businessProfile?.account_holder_first_name || ''} ${businessProfile?.account_holder_last_name || ''}`.trim()} 
                icon={User} 
              />
              <InfoRow label="Email" value={businessProfile?.account_holder_email} icon={Mail} />
              <InfoRow label="Date of Birth" value={businessProfile?.account_holder_date_of_birth} icon={Calendar} />
              <InfoRow label="ID Type" value={businessProfile?.account_holder_id_type} icon={IdCard} />
              <InfoRow label="ID Number" value={businessProfile?.account_holder_id_number} icon={Hash} />
            </InfoCard>

            {/* Account Holder Address */}
            <InfoCard title="Account Holder Address" icon={Home}>
              <InfoRow label="Street" value={businessProfile?.account_holder_street} icon={Home} />
              <InfoRow label="Street Line 2" value={businessProfile?.account_holder_street_line2} />
              <InfoRow label="City" value={businessProfile?.account_holder_city} />
              <InfoRow label="State" value={businessProfile?.account_holder_state} />
              <InfoRow label="ZIP Code" value={businessProfile?.account_holder_zip_code} />
              <InfoRow label="Country" value={businessProfile?.account_holder_country} icon={Globe} />
            </InfoCard>

            {/* Contact Information */}
            <InfoCard title="Contact Information" icon={Phone}>
              <InfoRow label="Email" value={business?.email} icon={Mail} />
              <InfoRow label="Phone" value={`${business?.country_code || ''} ${business?.phone_no || ''}`.trim()} icon={Phone} />
              <InfoRow label="Country" value={business?.country_name} icon={Globe} />
              <InfoRow label="Organization Key" value={business?.org_key_id} icon={Hash} />
              <InfoRow label="Status" value={business?.organization_verified} />
              <InfoRow label="Created Date" value={new Date(business?.created_at).toLocaleDateString()} icon={Calendar} />
            </InfoCard>

            {/* Documents */}
            <InfoCard title="Documents" icon={FileText}>
              <div className="space-y-3">
                <DocumentDownload 
                  path={businessProfile?.account_holder_id_document_path}
                  label="Account Holder ID Document"
                />
                <DocumentDownload 
                  path={businessProfile?.registration_document_path}
                  label="Organization Registration Document"
                />
                {company?.logo && (
                  <DocumentDownload 
                    path={`http://localhost:8000/storage/${company.logo}`}
                    label="Company Logo"
                  />
                )}
              </div>
            </InfoCard>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-gray-900 px-6 py-4 border-t border-gray-600">
          <div className="flex justify-between items-center">
            <div className="flex items-center text-sm text-gray-400">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Review all information carefully before making a decision
            </div>
            <div className="flex space-x-3">
              {activeTab === 'pending' ? (
                // Show Approve and Reject buttons for pending tab
                <>
                  <button
                    onClick={() => onReject(business.id)}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {actionLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => onApprove(business.id)}
                    disabled={actionLoading}
                    className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {actionLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </>
                    )}
                  </button>
                </>
              ) : activeTab === 'approved' ? (
                // Show only Deactivate button for approved tab
                <button
                  onClick={() => onReject(business.id)}
                  disabled={actionLoading}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {actionLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4 mr-2" />
                      Deactivate
                    </>
                  )}
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessModal;