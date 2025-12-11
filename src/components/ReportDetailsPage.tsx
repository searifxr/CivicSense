import { ArrowLeft, MapPin, Clock, Briefcase, CheckCircle, AlertCircle, Clock3 } from 'lucide-react';
import type { Report } from '../App';

interface ReportDetailsPageProps {
  report: Report | null;
  isWorker: boolean;
  onBack: () => void;
  onLogout: () => void;
  onUpdateStatus?: (reportId: string, status: 'new' | 'in-progress' | 'completed') => void;
}

const statusColors: { [key: string]: { bg: string; text: string; icon: JSX.Element } } = {
  'new': {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    icon: <AlertCircle className="w-5 h-5" />
  },
  'in-progress': {
    bg: 'bg-yellow-50',
    text: 'text-yellow-700',
    icon: <Clock3 className="w-5 h-5" />
  },
  'completed': {
    bg: 'bg-green-50',
    text: 'text-green-700',
    icon: <CheckCircle className="w-5 h-5" />
  }
};

const categoryColors: { [key: string]: string } = {
  Vandalism: 'bg-red-500',
  Litter: 'bg-yellow-500',
  Graffiti: 'bg-purple-500',
  'Infrastructure Issue': 'bg-blue-500',
  Overgrowth: 'bg-green-500',
  Other: 'bg-gray-500',
};

function getTimeAgo(date: Date): string {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function ReportDetailsPage({ report, isWorker, onBack, onLogout, onUpdateStatus }: ReportDetailsPageProps) {
  if (!report) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Report not found</p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const statusColor = statusColors[report.status];
  const categoryColor = categoryColors[report.category] || 'bg-gray-500';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{report.id}</h1>
              <p className="text-sm text-gray-500">{report.category}</p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image and Status */}
          <div className="lg:col-span-2">
            {/* Image */}
            {report.photo && (
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
                <img
                  src={report.photo}
                  alt={report.category}
                  className="w-full h-96 object-cover"
                />
              </div>
            )}

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Description</h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {report.description}
              </p>
            </div>

            {/* Location Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Location Details</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <MapPin className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-lg font-semibold text-gray-800">{report.location}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500">Coordinates</div>
                  <div className="text-lg font-semibold text-gray-800">
                    {report.coordinates.lat.toFixed(4)}, {report.coordinates.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Status Card */}
            <div className={`${statusColor.bg} rounded-2xl shadow-lg p-6 mb-6`}>
              <div className="flex items-center gap-3 mb-4">
                {statusColor.icon}
                <span className={`text-lg font-bold ${statusColor.text}`}>
                  {report.status.charAt(0).toUpperCase() + report.status.slice(1).replace('-', ' ')}
                </span>
              </div>
              <p className={`text-sm ${statusColor.text}`}>
                {report.status === 'new' && 'Newly reported, awaiting response'}
                {report.status === 'in-progress' && 'Currently being worked on'}
                {report.status === 'completed' && 'Issue has been resolved'}
              </p>

              {/* Status Update Buttons - Only for Workers */}
              {isWorker && onUpdateStatus && report.status !== 'completed' && (
                <div className="mt-4 space-y-2">
                  {report.status === 'new' && (
                    <button
                      onClick={() => onUpdateStatus(report.id, 'in-progress')}
                      className="w-full px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors font-medium"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {report.status === 'in-progress' && (
                    <button
                      onClick={() => onUpdateStatus(report.id, 'completed')}
                      className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              )}

              {/* View-only Badge for Citizens */}
              {!isWorker && (
                <div className="mt-4 p-3 bg-blue-100 rounded-lg">
                  <p className="text-sm text-blue-700 text-center">
                    👁️ You are viewing this report. Only city workers can update status.
                  </p>
                </div>
              )}
            </div>

            {/* Category Badge */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <p className="text-sm text-gray-500 mb-2">Category</p>
              <span className={`${categoryColor} text-white px-4 py-2 rounded-full font-semibold inline-block`}>
                {report.category}
              </span>
            </div>

            {/* Suggested Department */}
            {report.suggestedDepartment && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <div className="flex items-start gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500">AI Suggested Department</p>
                    <p className="text-lg font-semibold text-gray-800">{report.suggestedDepartment}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Timestamp */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-6 h-6 text-gray-600 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-500">Reported</p>
                  <p className="text-lg font-semibold text-gray-800">{getTimeAgo(report.timestamp)}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {report.timestamp.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
