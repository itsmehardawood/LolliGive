'use client';

import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, DollarSign, CreditCard, Building2, Calendar } from 'lucide-react';

export default function TransactionFilter() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrgs, setExpandedOrgs] = useState({});

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('https://api.lolligive.com/api/transaction/all');
      const data = await response.json();
      if (data.success) {
        setTransactions(data.data.transactions);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group transactions by org_key_id
  const groupedTransactions = transactions.reduce((acc, txn) => {
    if (!acc[txn.org_key_id]) {
      acc[txn.org_key_id] = [];
    }
    acc[txn.org_key_id].push(txn);
    return acc;
  }, {});

  const toggleOrg = (orgKey) => {
    setExpandedOrgs(prev => ({
      ...prev,
      [orgKey]: !prev[orgKey]
    }));
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
    return {
      totalAmount: orgTransactions.reduce((sum, txn) => sum + parseFloat(txn.amount), 0),
      totalReceived: orgTransactions.reduce((sum, txn) => sum + parseFloat(txn.amount_received), 0),
      totalFees: orgTransactions.reduce((sum, txn) => sum + parseFloat(txn.bank_fee), 0),
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

        {/* Organizations List */}
        <div className="space-y-4">
          {Object.entries(groupedTransactions).map(([orgKey, orgTransactions]) => {
            const stats = getOrgStats(orgTransactions);
            const isExpanded = expandedOrgs[orgKey];

            return (
              <div key={orgKey} className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
                {/* Organization Card Header */}
                <button
                  onClick={() => toggleOrg(orgKey)}
                  className="w-full p-6 hover:bg-gray-750 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-500/10 rounded-lg p-3">
                        <Building2 className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-semibold text-white mb-1">{orgKey}</h2>
                        <p className="text-sm text-gray-400">{stats.count} transactions</p>
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

                      {/* Expand Icon */}
                      <div className="ml-4">
                        {isExpanded ? (
                          <ChevronUp className="w-6 h-6 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-gray-400" />
                        )}
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

                {/* Transactions Dropdown */}
                {isExpanded && (
                  <div className="border-t border-gray-700 bg-gray-850">
                    <div className="p-4 space-y-3">
                      {orgTransactions.map((txn) => (
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
                                  <h3 className="font-semibold text-white">{txn.name}</h3>
                                  <p className="text-xs text-gray-500">{txn.tid}</p>
                                </div>
                              </div>
                              
                              <div className="space-y-2 ml-11">
                                {txn.purpose_reason && (
                                  <p className="text-sm text-gray-400">
                                    <span className="text-gray-500">Purpose:</span>{' '}
                                    <span className="text-gray-300">
                                      {txn.purpose_reason.replace(/_/g, ' ')}
                                    </span>
                                  </p>
                                )}
                                {txn.comment && (
                                  <p className="text-sm text-gray-400">
                                    <span className="text-gray-500">Comment:</span>{' '}
                                    <span className="text-gray-300">{txn.comment}</span>
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
                              <div className="text-2xl font-bold text-white mb-1">
                                {formatCurrency(txn.amount)}
                              </div>
                              <div className="text-sm text-green-400 font-medium mb-1">
                                Received: {formatCurrency(txn.amount_received)}
                              </div>
                              <div className="text-sm text-red-400 mb-2">
                                Fee: {formatCurrency(txn.bank_fee)}
                              </div>
                              <span className="inline-block px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                                {txn.payment_method.replace(/_/g, ' ')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {Object.keys(groupedTransactions).length === 0 && (
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-12 text-center">
            <Building2 className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
}