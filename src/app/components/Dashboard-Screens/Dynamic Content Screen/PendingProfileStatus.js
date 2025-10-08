'use client';
import { useState, useEffect } from 'react';

export default function PendingProfileStatus({ onContactSupport }) {
  const [submittedDate, setSubmittedDate] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('businessSubmissionId');
    if (id) setSubmittedDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black text-white">
      <div className="w-full max-w-lg bg-gray-800 rounded-xl shadow-lg p-6 space-y-6 text-center">
        
        {/* Header */}
        <div>
          <div className="w-16 h-16 mx-auto mb-3 flex items-center justify-center rounded-full bg-yellow-500/20 border border-yellow-500/40">
            <svg className="w-8 h-8 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold mb-1">Profile Under Review</h1>
          <p className="text-gray-300">Your organization profile is being reviewed.</p>
        </div>

        {/* Status */}
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 text-left">
          <p className="text-yellow-300 font-semibold">Status: Pending Approval</p>
          {submittedDate && (
            <p className="text-sm text-yellow-200/80 mt-1">
              Submitted on: {submittedDate}
            </p>
          )}
        </div>

        {/* Info */}
        <div className="text-gray-300 text-sm leading-relaxed space-y-3">
          <p>Our verification team is reviewing your information to ensure accuracy.</p>
          <ol className="text-left list-decimal list-inside space-y-1">
            <li>We’ll verify your details and documents.</li>
            <li>After approval, you’ll unlock all organization features.</li>
          </ol>
        </div>

        {/* Time Estimate */}
        <div className="bg-gray-700/50 rounded-lg p-3 text-sm">
          <p><span className="font-semibold">Typical review time:</span> 1–3 business days</p>
          <p className="text-gray-400 mt-1">You’ll be notified immediately after approval.</p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onContactSupport}
            className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded-lg font-semibold"
          >
            Contact Support
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 bg-gray-700 hover:bg-gray-600 py-2 rounded-lg font-semibold"
          >
            Refresh Status
          </button>
        </div>

        {/* Footer */}
        <p className="text-gray-400 text-xs pt-2 border-t border-gray-700">
          Need help? Our support team replies within 24 hours.
        </p>
      </div>
    </div>
  );
}
