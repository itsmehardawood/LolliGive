'use client';
import React, { useState, useEffect } from 'react';
import { CreditCard, Building2, Phone, Mail, User, MapPin, Hash, Calendar, Smartphone } from 'lucide-react';

const PaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentMethods();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.lolligive.com/api/bank-details');
      const result = await response.json();
      
      if (result.success) {
        setPaymentMethods(result.data);
      } else {
        setError('Failed to fetch payment methods');
      }
    } catch (err) {
      setError('Error fetching payment methods: ' + err.message);
    } finally {
      setLoading(false);
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
      {/* Header */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h2 className="text-2xl font-bold text-white mb-2">Payment Methods Added by Organizations</h2>
        <p className="text-gray-400">View all payment methods registered by organizations</p>
        <div className="mt-4 text-sm text-gray-500">
          Total Payment Methods: <span className="text-white font-semibold">{paymentMethods.length}</span>
        </div>
      </div>

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className="bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-gray-700 transition-colors"
          >
            {/* Header with Payment Type Badge */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-lg ${method.isZelle ? 'bg-purple-900/30' : 'bg-blue-900/30'}`}>
                  {method.isZelle ? (
                    <Smartphone className="w-6 h-6 text-purple-400" />
                  ) : (
                    <Building2 className="w-6 h-6 text-blue-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {method.isZelle ? 'Zelle' : 'Bank Account'}
                  </h3>
                  <p className="text-sm text-gray-400">Org ID: {method.org_id}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                method.isZelle 
                  ? 'bg-purple-900/30 text-purple-300 border border-purple-800' 
                  : 'bg-blue-900/30 text-blue-300 border border-blue-800'
              }`}>
                {method.isZelle ? 'Zelle' : 'Bank Transfer'}
              </span>
            </div>

            {/* Payment Details */}
            <div className="space-y-3">
              {method.isZelle ? (
                // Zelle Details
                <>
                  {method.zelle_name && (
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white font-medium">{method.zelle_name}</span>
                    </div>
                  )}
                  {method.zelle_email && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white font-medium">{method.zelle_email}</span>
                    </div>
                  )}
                  {method.zelle_phone && (
                    <div className="flex items-center gap-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Phone:</span>
                      <span className="text-white font-medium">{method.zelle_phone}</span>
                    </div>
                  )}
                </>
              ) : (
                // Bank Details
                <>
                  {method.bank_name && (
                    <div className="flex items-center gap-3 text-sm">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Bank:</span>
                      <span className="text-white font-medium">{method.bank_name}</span>
                    </div>
                  )}
                  {method.account_holder_name && (
                    <div className="flex items-center gap-3 text-sm">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Account Holder:</span>
                      <span className="text-white font-medium">{method.account_holder_name}</span>
                    </div>
                  )}
                  {method.account_no && (
                    <div className="flex items-center gap-3 text-sm">
                      <Hash className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">Account No:</span>
                      <span className="text-white font-medium">{method.account_no}</span>
                    </div>
                  )}
                  {method.iban && (
                    <div className="flex items-center gap-3 text-sm">
                      <CreditCard className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-400">IBAN:</span>
                      <span className="text-white font-medium">{method.iban}</span>
                    </div>
                  )}
                  {method.branch_address && (
                    <div className="flex items-start gap-3 text-sm">
                      <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                      <span className="text-gray-400">Branch:</span>
                      <span className="text-white font-medium flex-1">{method.branch_address}</span>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer with timestamps */}
            <div className="mt-4 pt-4 border-t border-gray-800 flex items-center justify-between text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar className="w-3 h-3" />
                <span>Added: {formatDate(method.created_at)}</span>
              </div>
              {method.updated_at !== method.created_at && (
                <span>Updated: {formatDate(method.updated_at)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {paymentMethods.length === 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-12 text-center">
          <CreditCard className="w-16 h-16 text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Payment Methods Found</h3>
          <p className="text-gray-400">No organizations have added payment methods yet.</p>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
