'use client';
import React, { useState, useEffect } from 'react';
import { DollarSign, Building2, Phone, Mail, User, MapPin, Hash, Calendar, CheckCircle, XCircle, Clock, Smartphone, Search } from 'lucide-react';

const WithdrawalRequests = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [processingId, setProcessingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // Toast notification helper
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: '' });
    }, 3000);
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.lolligive.com/api/withdrawl-details');
      const result = await response.json();
      
      if (result.success) {
        setWithdrawals(result.data);
      } else {
        setError('Failed to fetch withdrawal requests');
      }
    } catch (err) {
      setError('Error fetching withdrawal requests: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateWithdrawalStatus = async (withdrawal, newStatus) => {
    try {
      setProcessingId(withdrawal.id);
      
      const payload = {
        org_id: withdrawal.org_id,
        id: withdrawal.id,
        withdrawal_status: newStatus
      };

      console.log('Sending payload:', payload);

      const response = await fetch('https://api.lolligive.com/api/withdrawals/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Response status:', response.status);
      const contentType = response.headers.get('content-type');
      console.log('Content-Type:', contentType);

      // Check if response is JSON
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text.substring(0, 200));
        throw new Error('Server returned an invalid response. Please check the API endpoint.');
      }

      const result = await response.json();
      console.log('Response result:', result);

      if (result.success || response.ok) {
        // Update the local state
        setWithdrawals(prevWithdrawals =>
          prevWithdrawals.map(w =>
            w.id === withdrawal.id
              ? { ...w, withdrawal_status: newStatus, updated_at: new Date().toISOString() }
              : w
          )
        );
        
        // Show success message
        showToast(`Withdrawal ${newStatus === 1 ? 'approved' : 'rejected'} successfully!`, 'success');
      } else {
        throw new Error(result.message || 'Failed to update withdrawal status');
      }
    } catch (err) {
      showToast('Error updating withdrawal status: ' + err.message, 'error');
      console.error('Error updating withdrawal status:', err);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusInfo = (status) => {
    switch (status) {
      case 0:
        return {
          label: 'Pending',
          icon: Clock,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-900/30',
          borderColor: 'border-yellow-800'
        };
      case 1:
        return {
          label: 'Approved',
          icon: CheckCircle,
          color: 'text-green-400',
          bgColor: 'bg-green-900/30',
          borderColor: 'border-green-800'
        };
      case 2:
        return {
          label: 'Rejected',
          icon: CheckCircle,
          color: 'text-white',
          bgColor: 'bg-red-900/50',
          borderColor: 'border-red-800'
        };
      case 3:
        return {
          label: 'Rejected',
          icon: XCircle,
          color: 'text-red-400',
          bgColor: 'bg-red-900/30',
          borderColor: 'border-red-800'
        };
      default:
        return {
          label: 'Unknown',
          icon: Clock,
          color: 'text-gray-400',
          bgColor: 'bg-gray-900/30',
          borderColor: 'border-gray-800'
        };
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Get unique organizations with their names
  const organizations = [...new Map(
    withdrawals
      .filter(w => w.user?.business_profile?.organization_name)
      .map(w => [
        w.user.business_profile.organization_name,
        {
          name: w.user.business_profile.organization_name,
          org_id: w.org_id
        }
      ])
  ).values()].sort((a, b) => a.name.localeCompare(b.name));

  const filteredWithdrawals = withdrawals.filter(w => {
    const statusMatch = filterStatus === 'all' || w.withdrawal_status === parseInt(filterStatus);
    const orgName = w.user?.business_profile?.organization_name || '';
    const orgMatch = selectedOrg === 'all' || orgName === selectedOrg;
    const searchMatch = !searchQuery || orgName.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && orgMatch && searchMatch;
  });

  const getStatusCount = (status) => {
    const filtered = selectedOrg === 'all' 
      ? withdrawals 
      : withdrawals.filter(w => w.user?.business_profile?.organization_name === selectedOrg);
    
    const searchFiltered = !searchQuery
      ? filtered
      : filtered.filter(w => w.user?.business_profile?.organization_name?.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (status === 'all') return searchFiltered.length;
    return searchFiltered.filter(w => w.withdrawal_status === parseInt(status)).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-800 rounded-lg p-6">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in">
          <div className={`px-6 py-4 rounded-lg shadow-lg border ${
            toast.type === "success" 
              ? "bg-green-900/90 border-green-700 text-green-100" 
              : "bg-red-900/90 border-red-700 text-red-100"
          }`}>
            <div className="flex items-center gap-3">
              {toast.type === "success" ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              )}
              <p className="font-medium">{toast.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Withdrawal Requests</h2>
        <p className="text-gray-400">Manage and track all withdrawal requests from organizations</p>
      </div>

      {/* Search Bar */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search by organization name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
            >
              <span className="text-xl">&times;</span>
            </button>
          )}
        </div>
      </div>

      {/* Organization Filter */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
          <Building2 className="w-4 h-4" />
          Filter by Organization
        </label>
        <select
          value={selectedOrg}
          onChange={(e) => setSelectedOrg(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Organizations ({withdrawals.length})</option>
          {organizations.map(org => {
            const count = withdrawals.filter(w => w.user?.business_profile?.organization_name === org.name).length;
            return (
              <option key={org.name} value={org.name}>
                {org.name} ({count})
              </option>
            );
          })}
        </select>
      </div>

      {/* Filter Tabs */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-4">
        <label className="text-sm font-medium text-gray-300 mb-3 block">Filter by Status</label>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: '0', label: 'Pending' },
            { value: '1', label: 'Approved' },
            { value: '2', label: 'Rejected' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setFilterStatus(filter.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === filter.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              {filter.label}
              <span className="ml-2 text-xs opacity-75">
                ({getStatusCount(filter.value)})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Withdrawals Grid */}
      <div className="grid grid-cols-1 gap-6">
        {filteredWithdrawals.map((withdrawal) => {
          const statusInfo = getStatusInfo(withdrawal.withdrawal_status);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={withdrawal.id}
              className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-green-900/30">
                    <DollarSign className="w-8 h-8 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {formatAmount(withdrawal.amount)}
                    </h3>
                    <p className="text-sm text-blue-400 font-medium">
                      {withdrawal.user?.business_profile?.organization_name || 'Unknown Organization'}
                    </p>
                    <p className="text-xs text-gray-500">Org ID: {withdrawal.org_id}</p>
                  </div>
                </div>
                <span className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} border ${statusInfo.borderColor}`}>
                  <StatusIcon className="w-4 h-4" />
                  {statusInfo.label}
                </span>
              </div>

              {/* Payment Method Details */}
              <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2">
                  {withdrawal.isZelle ? (
                    <>
                      <Smartphone className="w-4 h-4" />
                      Zelle Payment Details
                    </>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4" />
                      Bank Transfer Details
                    </>
                  )}
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {withdrawal.isZelle ? (
                    // Zelle Details
                    <>
                      {withdrawal.zelle_name && (
                        <div className="flex items-center gap-3 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Name:</span>
                          <span className="text-white font-medium">{withdrawal.zelle_name}</span>
                        </div>
                      )}
                      {withdrawal.zelle_email && (
                        <div className="flex items-center gap-3 text-sm">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Email:</span>
                          <span className="text-white font-medium">{withdrawal.zelle_email}</span>
                        </div>
                      )}
                      {withdrawal.zelle_phone && (
                        <div className="flex items-center gap-3 text-sm">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Phone:</span>
                          <span className="text-white font-medium">{withdrawal.zelle_phone}</span>
                        </div>
                      )}
                    </>
                  ) : (
                    // Bank Details
                    <>
                      {withdrawal.bank_name && (
                        <div className="flex items-center gap-3 text-sm">
                          <Building2 className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Bank:</span>
                          <span className="text-white font-medium">{withdrawal.bank_name}</span>
                        </div>
                      )}
                      {withdrawal.account_holder_name && (
                        <div className="flex items-center gap-3 text-sm">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Account Holder:</span>
                          <span className="text-white font-medium">{withdrawal.account_holder_name}</span>
                        </div>
                      )}
                      {withdrawal.account_no && (
                        <div className="flex items-center gap-3 text-sm">
                          <Hash className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">Account No:</span>
                          <span className="text-white font-medium">{withdrawal.account_no}</span>
                        </div>
                      )}
                      {withdrawal.iban && (
                        <div className="flex items-center gap-3 text-sm">
                          <Hash className="w-4 h-4 text-gray-500" />
                          <span className="text-gray-400">IBAN:</span>
                          <span className="text-white font-medium">{withdrawal.iban}</span>
                        </div>
                      )}
                      {withdrawal.branch_address && (
                        <div className="flex items-start gap-3 text-sm col-span-2">
                          <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                          <span className="text-gray-400">Branch:</span>
                          <span className="text-white font-medium flex-1">{withdrawal.branch_address}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Action Buttons - Only show for pending requests */}
              {withdrawal.withdrawal_status === 0 && (
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={() => updateWithdrawalStatus(withdrawal, 1)}
                    disabled={processingId === withdrawal.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    {processingId === withdrawal.id ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => updateWithdrawalStatus(withdrawal, 2)}
                    disabled={processingId === withdrawal.id}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-6 py-3 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" />
                    {processingId === withdrawal.id ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}

              {/* Footer with timestamps */}
              <div className="flex items-center justify-between text-xs text-gray-500 border-t border-gray-800 pt-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" />
                  <span>Requested: {formatDate(withdrawal.created_at)}</span>
                </div>
                {withdrawal.updated_at !== withdrawal.created_at && (
                  <span>Updated: {formatDate(withdrawal.updated_at)}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredWithdrawals.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <DollarSign className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Withdrawal Requests Found</h3>
          <p className="text-gray-400">
            {filterStatus === 'all' 
              ? 'No withdrawal requests have been submitted yet.' 
              : `No ${getStatusInfo(parseInt(filterStatus)).label.toLowerCase()} withdrawal requests.`}
          </p>
        </div>
      )}
    </div>
  );
};

export default WithdrawalRequests;
