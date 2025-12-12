'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, DollarSign, CreditCard, Building2, Calendar, Search, X } from 'lucide-react';

export default function TransactionFilter() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrgs, setExpandedOrgs] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://api.lolligive.com/api/transaction/all');
      const result = await response.json();
      
      if (result.success && result.data && result.data.transactions) {
        setTransactions(result.data.transactions);
      } else {
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group transactions by org_id and extract organization names
  const groupedTransactions = transactions.reduce((acc, txn) => {
    const orgId = txn.org_id;
    const orgName = txn.user?.business_profile?.organization_name || 'Unknown Organization';
    
    if (!acc[orgId]) {
      acc[orgId] = {
        orgName: orgName,
        transactions: []
      };
    }
    acc[orgId].transactions.push(txn);
    return acc;
  }, {});

  // Filter organizations based on search query
  const filteredOrganizations = Object.entries(groupedTransactions).filter(([orgId, data]) => {
    const searchLower = searchQuery.toLowerCase();
    return data.orgName.toLowerCase().includes(searchLower) || orgId.toLowerCase().includes(searchLower);
  });

  const toggleOrg = (orgId, orgData) => {
    setSelectedOrg({ orgId, ...orgData });
    setShowModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getOrgStats = (orgTransactions) => {
    const totalAmount = orgTransactions.reduce((sum, txn) => sum + parseFloat(txn.amount || 0), 0);
    // Calculate fees as 3% of total amount since fee data not in API
    const totalFees = totalAmount * 0.03;
    const totalReceived = totalAmount - totalFees;
    
    return {
      totalAmount,
      totalReceived,
      totalFees,
      count: orgTransactions.length
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-gray-400">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Transaction Manager</h1>
          <p className="text-gray-400">View transactions organized by organization</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by organization name.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {/* Organizations List */}
        <div className="space-y-4">
          {filteredOrganizations.map(([orgId, orgData]) => {
            const stats = getOrgStats(orgData.transactions);

            return (
              <div key={orgId} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden hover:border-blue-500 transition-colors">
                {/* Organization Card Header */}
                <button
                  onClick={() => toggleOrg(orgId, orgData)}
                  className="w-full p-6 hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500/10 rounded-lg p-3">
                        <Building2 className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-semibold text-white mb-1">{orgData.orgName}</h2>
                        {/* <p className="text-sm text-gray-400">ID: {orgId}</p> */}
                        <p className="text-xs text-gray-500">{stats.count} transactions</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      {/* Stats */}
                      <div className="hidden md:flex gap-6">
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">Total Amount</div>
                          <div className="text-lg font-semibold text-white">
                            {formatCurrency(stats.totalAmount)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">Received</div>
                          <div className="text-lg font-semibold text-green-400">
                            {formatCurrency(stats.totalReceived)}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-400 mb-1">Fees</div>
                          <div className="text-lg font-semibold text-red-400">
                            {formatCurrency(stats.totalFees)}
                          </div>
                        </div>
                      </div>

                      {/* Click indicator */}
                      <div className="ml-4 text-gray-400 text-sm">
                        Click to view →
                      </div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden grid grid-cols-3 gap-4 mt-4">
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Total</div>
                      <div className="text-sm font-semibold text-white">
                        {formatCurrency(stats.totalAmount)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Received</div>
                      <div className="text-sm font-semibold text-green-400">
                        {formatCurrency(stats.totalReceived)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-400 mb-1">Fees</div>
                      <div className="text-sm font-semibold text-red-400">
                        {formatCurrency(stats.totalFees)}
                      </div>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredOrganizations.length === 0 && !loading && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">
              {searchQuery ? 'No organizations found matching your search' : 'No transactions found'}
            </p>
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      {showModal && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 max-w-4xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-blue-500/10 rounded-lg p-3">
                    <Building2 className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">{selectedOrg.orgName}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Total Amount</div>
                  <div className="text-xl font-bold text-white">
                    {formatCurrency(getOrgStats(selectedOrg.transactions).totalAmount)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Amount Received</div>
                  <div className="text-xl font-bold text-green-400">
                    {formatCurrency(getOrgStats(selectedOrg.transactions).totalReceived)}
                  </div>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="text-xs text-gray-400 mb-1">Total Bank Fees</div>
                  <div className="text-xl font-bold text-red-400">
                    {formatCurrency(getOrgStats(selectedOrg.transactions).totalFees)}
                  </div>
                </div>
              </div>
            </div>

            {/* Transactions List */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-280px)]">
              <div className="space-y-3">
                {selectedOrg.transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50 hover:border-gray-600 transition-colors"
                  >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      {/* Transaction Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="bg-purple-500/10 rounded-full p-2">
                            <CreditCard className="w-4 h-4 text-purple-400" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-white">{txn.name || 'N/A'}</h3>
                            <p className="text-xs text-gray-500">{txn.txn_id}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2 ml-11">
                          {txn.purpose && (
                            <p className="text-sm text-gray-400">
                              <span className="text-gray-500">Purpose:</span>{' '}
                              <span className="text-gray-300">
                                {txn.purpose.replace(/_/g, ' ')}
                              </span>
                            </p>
                          )}
                          {txn.comment && txn.comment !== 'N/A' && txn.comment !== 'DECLINED' && (
                            <p className="text-sm text-gray-400">
                              <span className="text-gray-500">Comment:</span>{' '}
                              <span className="text-gray-300">{txn.comment}</span>
                            </p>
                          )}
                          {txn.paymentmethod && (
                            <p className="text-sm text-gray-400">
                              <span className="text-gray-500">Payment Method:</span>{' '}
                              <span className="text-gray-300">{txn.paymentmethod.replace(/_/g, ' ')}</span>
                            </p>
                          )}
                          {txn.status && (
                            <p className="text-sm text-gray-400">
                              <span className="text-gray-500">Status:</span>{' '}
                              <span className={`font-medium ${
                                txn.status === 'APPROVED' ? 'text-green-400' : 'text-red-400'
                              }`}>
                                {txn.status}
                              </span>
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {formatDate(txn.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* Transaction Amounts */}
                      <div className="md:text-right">
                        {txn.amount && (
                          <>
                            <div className="text-2xl font-bold text-white mb-1">
                              {formatCurrency(parseFloat(txn.amount))}
                            </div>
                            <div className="text-sm text-green-400 font-medium mb-1">
                              Received: {formatCurrency(parseFloat(txn.amount) * 0.97)}
                            </div>
                            <div className="text-sm text-red-400 mb-2">
                              Bank Fee: {formatCurrency(parseFloat(txn.amount) * 0.03)}
                            </div>
                          </>
                        )}
                    
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}