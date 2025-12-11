import React from 'react';
import { CheckCircle, FileText, LogOut } from 'lucide-react';

interface CitizenConfirmationProps {
  reportId: string;
  onNewReport: () => void;
  onLogout: () => void;
}

export function CitizenConfirmation({ reportId, onNewReport, onLogout }: CitizenConfirmationProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
          {/* Success Icon */}
          <div className="mb-6">
            <CheckCircle className="w-24 h-24 text-green-600 mx-auto" />
          </div>

          {/* Message */}
          <h1 className="text-3xl mb-2 text-green-800">Thank You!</h1>
          <p className="text-gray-600 mb-8">
            Your report has been submitted successfully.
          </p>

          {/* Tracking ID */}
          <div className="bg-green-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <FileText className="w-5 h-5 text-green-600" />
              <span className="text-sm text-green-700">Tracking ID</span>
            </div>
            <div className="text-2xl text-green-800">{reportId}</div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              onClick={onNewReport}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl transition-colors"
            >
              Submit Another Report
            </button>
            <button
              onClick={onLogout}
              className="w-full bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl border border-gray-300 transition-colors flex items-center justify-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </button>
          </div>

          {/* Info */}
          <p className="text-sm text-gray-500 mt-6">
            You will receive updates about your report via email
          </p>
        </div>
      </div>
    </div>
  );
}
