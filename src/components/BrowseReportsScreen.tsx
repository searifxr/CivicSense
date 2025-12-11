import React, { useState } from 'react';
import { ArrowLeft, LogOut, Filter, AlertCircle, Clock3, CheckCircle } from 'lucide-react';
import type { Report } from '../App';

interface BrowseReportsScreenProps {
  reports: Report[];
  isWorker: boolean;
  onSelectReport: (reportId: string) => void;
  onBack: () => void;
  onLogout: () => void;
}

const categoryColors: { [key: string]: string } = {
  Vandalism: 'bg-red-500',
  Litter: 'bg-yellow-500',
  Graffiti: 'bg-purple-500',
  'Infrastructure Issue': 'bg-blue-500',
  Overgrowth: 'bg-green-500',
  Other: 'bg-gray-500',
};

const statusConfig = {
  'new': { icon: AlertCircle, label: 'Just Reported', color: 'bg-blue-100 text-blue-700' },
  'in-progress': { icon: Clock3, label: 'In Progress', color: 'bg-yellow-100 text-yellow-700' },
  'completed': { icon: CheckCircle, label: 'Completed', color: 'bg-green-100 text-green-700' }
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

export function BrowseReportsScreen({ reports, isWorker, onSelectReport, onBack, onLogout }: BrowseReportsScreenProps) {
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'in-progress' | 'completed'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredReports = reports.filter(report => {
    const statusMatch = statusFilter === 'all' || report.status === statusFilter;
    const categoryMatch = categoryFilter === 'all' || report.category === categoryFilter;
    return statusMatch && categoryMatch;
  });

  const categories = Array.from(new Set(reports.map(r => r.category)));
  
  const statusCounts = {
    new: reports.filter(r => r.status === 'new').length,
    'in-progress': reports.filter(r => r.status === 'in-progress').length,
    'completed': reports.filter(r => r.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-gray-700" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Browse Reports</h1>
              <p className="text-sm text-gray-500">Showing {filteredReports.length} report(s)</p>
              {!isWorker && <p className="text-xs text-blue-600 mt-1">👁️ You can view reports but only city workers can update status</p>}
            </div>
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </h2>

          {/* Status Filter */}
          <div className="mb-6">
            <p className="text-sm font-semibold text-gray-700 mb-3">Status</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  statusFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({reports.length})
              </button>
              <button
                onClick={() => setStatusFilter('new')}
                className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  statusFilter === 'new'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <AlertCircle className="w-4 h-4" />
                New ({statusCounts.new})
              </button>
              <button
                onClick={() => setStatusFilter('in-progress')}
                className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  statusFilter === 'in-progress'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Clock3 className="w-4 h-4" />
                In Progress ({statusCounts['in-progress']})
              </button>
              <button
                onClick={() => setStatusFilter('completed')}
                className={`px-4 py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                  statusFilter === 'completed'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                Completed ({statusCounts.completed})
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Category</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('all')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  categoryFilter === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Categories
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setCategoryFilter(category)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    categoryFilter === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Reports Grid */}
        {filteredReports.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map(report => {
              const StatusIcon = statusConfig[report.status as keyof typeof statusConfig].icon;
              const statusLabel = statusConfig[report.status as keyof typeof statusConfig].label;
              const statusColor = statusConfig[report.status as keyof typeof statusConfig].color;
              const categoryColor = categoryColors[report.category] || 'bg-gray-500';

              return (
                <div
                  key={report.id}
                  onClick={() => isWorker && onSelectReport(report.id)}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all text-left ${
                    isWorker ? 'hover:shadow-xl transform hover:scale-105 cursor-pointer' : 'cursor-not-allowed'
                  }`}
                >
                  {/* Image */}
                  {report.photo && (
                    <div className="h-48 overflow-hidden bg-gray-200">
                      <img
                        src={report.photo}
                        alt={report.category}
                        className="w-full h-full object-cover hover:scale-110 transition-transform"
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    {/* Status Badge */}
                    <div className={`${statusColor} px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-flex items-center gap-2`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusLabel}
                    </div>

                    {/* Category Badge */}
                    <span className={`${categoryColor} text-white px-3 py-1 rounded-full text-sm font-semibold inline-block mb-3 ml-2`}>
                      {report.category}
                    </span>

                    {/* Title and Description */}
                    <h3 className="font-bold text-gray-800 text-lg mb-2">{report.id}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {report.description}
                    </p>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <span>📍</span>
                      <span className="truncate">{report.location}</span>
                    </div>

                    {/* Time Ago */}
                    <div className="flex items-center gap-2 text-gray-400 text-xs">
                      <span>⏱️</span>
                      <span>{getTimeAgo(report.timestamp)}</span>
                    </div>

                    {/* Worker-only indicator */}
                    {!isWorker && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-600 text-center">👁️ View Only</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">No reports found with the selected filters</p>
            <button
              onClick={() => {
                setStatusFilter('all');
                setCategoryFilter('all');
              }}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
