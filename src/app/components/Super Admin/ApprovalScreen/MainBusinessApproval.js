"use client";
import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle, XCircle, Calendar, Building, Mail, FileText, AlertCircle, Users, Download, Search, Filter, ChevronDown, ChevronUp, Clock, ShieldCheck, FileDigit, User, MapPin, Home, Briefcase, FileBadge, CreditCard } from 'lucide-react';
import BusinessTable from './BusinessTable';
import StatsCards from './StatesBar';
import BusinessModal from './BusinessModal';
import { apiFetch } from '@/app/lib/api.js';


const BusinessApprovalSectionUpdated = () => {
  const [businesses, setBusinesses] = useState([]);
  const [approvedBusinesses, setApprovedBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvedLoading, setApprovedLoading] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedBusiness, setExpandedBusiness] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0
  });

  // Fetch both pending and approved businesses on page load
  useEffect(() => {
    const fetchAllBusinesses = async () => {
      try {
        // Fetch all organizations using the new API
        const response = await apiFetch('/orgs');
        const data = await response.json();  
            
        if (data.success) {
          const allOrganizations = data.data;
          
          // Filter for pending organizations
          const pending = allOrganizations.filter(org => {
            const status = org.organization_verified;
            return status === "PENDING";
          });
          
          // Filter for approved organizations
          const approved = allOrganizations.filter(org => {
            const status = org.organization_verified;
            return status === "APPROVED";
          });
          
          setBusinesses(pending);
          setApprovedBusinesses(approved);
          setStats({
            pending: pending.length,
            approved: approved.length
          });
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        showNotification('Error fetching businesses', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchAllBusinesses();
  }, []);

  const fetchApprovedBusinesses = async () => {
    if (approvedBusinesses.length > 0) return;
    
    setApprovedLoading(true);
    try {
      // Fetch all organizations and filter for approved ones
      const response = await apiFetch('/orgs');
      const data = await response.json();
          
      if (data.success) {
        const allOrganizations = data.data;
        const approved = allOrganizations.filter(org => {
          const status = org.organization_verified;
          return status === "APPROVED";
        });
        
        setApprovedBusinesses(approved);
        setStats(prev => ({...prev, approved: approved.length}));
      }
    } catch (error) {
      console.error('Error fetching approved businesses:', error);
      showNotification('Error fetching approved businesses', 'error');
    } finally {
      setApprovedLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'approved') {
      fetchApprovedBusinesses();
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleViewDocument = (business) => {
    setSelectedBusiness(business);
    setIsModalOpen(true);
  };

  const handleApprove = async (businessId) => {
    setActionLoading(true);
    try {
      const response = await apiFetch('/organization-profile/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_key_id: selectedBusiness.org_key_id,
          status: 'APPROVED'
        })
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showNotification(data.message || 'Organization approved successfully', 'success');
        setBusinesses(prevBusinesses => 
          prevBusinesses.filter(business => business.id !== businessId)
        );
        
        if (approvedBusinesses.length > 0) {
          const approvedBusiness = { 
            ...selectedBusiness, 
            organization_verified: 'APPROVED'
          };
          setApprovedBusinesses(prevApproved => [...prevApproved, approvedBusiness]);
        }
        
        setIsModalOpen(false);
        setStats(prev => ({
          pending: prev.pending - 1,
          approved: prev.approved + 1
        }));
      } else {
        throw new Error(data.message || 'Failed to approve organization');
      }
    } catch (error) {
      console.error('Error approving organization:', error);
      showNotification(error.message || 'Failed to approve organization', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (businessId) => {
    setActionLoading(true);
    try {
      const response = await apiFetch('/organization-profile/decision', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          org_key_id: selectedBusiness.org_key_id,
          status: 'DEACTIVATE'
        })
      });

      const data = await response.json();

      if (response.ok && data.status) {
        showNotification(data.message || 'Organization deactivated successfully', 'success');
        setBusinesses(prevBusinesses => 
          prevBusinesses.filter(business => business.id !== businessId)
        );
        setIsModalOpen(false);
        setStats(prev => ({
          ...prev,
          pending: prev.pending - 1
        }));
      } else {
        throw new Error(data.message || 'Failed to deactivate organization');
      }
    } catch (error) {
      console.error('Error deactivating organization:', error);
      showNotification(error.message || 'Failed to deactivate organization', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const toggleExpandBusiness = (businessId) => {
    setExpandedBusiness(expandedBusiness === businessId ? null : businessId);
  };

  const filteredBusinesses = businesses.filter(business => 
    business.business_profile?.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.business_profile?.organization_registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredApprovedBusinesses = approvedBusinesses.filter(business => 
    business.business_profile?.organization_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.business_profile?.organization_registration_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    business.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDownloadDocument = async (documentPath, fileName) => {
    setDownloadLoading(true);
    const fullUrl = `${documentPath}`;
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/pdf',
        },
      });
      
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName || documentPath.split('/').pop();
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        showNotification('Document downloaded successfully', 'success');
      } else {
        throw new Error('Failed to fetch document');
      }
    } catch (error) {
      console.error('Download method 1 failed:', error);
      
      try {
        const link = document.createElement('a');
        link.href = fullUrl;
        link.download = fileName || documentPath.split('/').pop();
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showNotification('Opening document in new tab for download', 'success');
      } catch (directError) {
        console.error('Download method 2 failed:', directError);
        window.open(fullUrl, '_blank');
        showNotification('Document opened in new tab. Use browser\'s download option if needed.', 'success');
      }
    } finally {
      setDownloadLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black rounded-xl shadow-sm border border-gray-800 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-700 rounded-xl w-1/4"></div>
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-4">
              <div className="h-4 bg-gray-700 rounded-xl col-span-2"></div>
              <div className="h-4 bg-gray-700 rounded-xl"></div>
            </div>
            <div className="h-4 bg-gray-700 rounded-xl w-3/4"></div>
          </div>
          <div className="h-10 bg-gray-700 rounded-lg"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black rounded-xl shadow-sm border border-gray-800 overflow-hidden">
      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-xl shadow-lg max-w-xs transform transition-all duration-300 ${
          notification.type === 'success' 
            ? 'bg-gradient-to-r from-emerald-900 to-emerald-800 border border-emerald-700' 
            : 'bg-gradient-to-r from-red-900 to-red-800 border border-red-700'
        } animate-fade-in-up`}>
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-emerald-400 animate-bounce" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400 animate-pulse" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                notification.type === 'success' ? 'text-emerald-200' : 'text-red-200'
              }`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="p-3 sm:p-4 bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-md transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold mb-1 flex items-center">
              <ShieldCheck className="w-5 h-5 mr-2 transition-transform duration-200 hover:scale-110" />
              Organization Management
            </h2>
            <p className="text-gray-300 text-xs">Manage verification requests</p>
          </div>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400 transition-transform duration-200 hover:scale-110" />
            </div>
            <input
              type="text"
              placeholder="Search businesses..."
              className="block w-full pl-9 pr-3 py-2 border border-transparent rounded-lg leading-5 bg-gray-700 bg-opacity-70 text-white placeholder-gray-300 focus:outline-none focus:bg-gray-600 focus:ring-2 focus:ring-white focus:border-transparent text-xs sm:text-sm transition-all duration-200"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      <div className="px-4 sm:px-5 pb-4">
        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-800 p-1 rounded-xl mb-4">
          <button
            onClick={() => handleTabChange('pending')}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'pending'
                ? 'bg-black text-blue-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <Clock className="w-4 h-4 mr-1.5 transition-transform duration-200 hover:scale-110" />
              <span>Pending</span>
            </div>
          </button>
          <button
            onClick={() => handleTabChange('approved')}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg transition-all duration-200 ${
              activeTab === 'approved'
                ? 'bg-black text-emerald-400 shadow-sm hover:shadow-md transform hover:-translate-y-0.5'
                : 'text-gray-300 hover:text-white hover:bg-gray-700'
            }`}
          >
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1.5 transition-transform duration-200 hover:scale-110" />
              <span>Approved</span>
            </div>
          </button>
        </div>

        {/* Business Table */}
        <BusinessTable 
          activeTab={activeTab}
          filteredBusinesses={filteredBusinesses}
          filteredApprovedBusinesses={filteredApprovedBusinesses}
          approvedLoading={approvedLoading}
          handleViewDocument={handleViewDocument}
          expandedBusiness={expandedBusiness}
          toggleExpandBusiness={toggleExpandBusiness}
        />
      </div>

      {/* Business Modal */}
      <BusinessModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        business={selectedBusiness}
        onApprove={handleApprove}
        onReject={handleReject}
        actionLoading={actionLoading}
        downloadLoading={downloadLoading}
        handleDownloadDocument={handleDownloadDocument}
        activeTab={activeTab}
      />
   
    </div>
  );
};

export default BusinessApprovalSectionUpdated;