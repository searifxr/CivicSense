import React from "react";
import {
  ArrowLeft,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  MapPin,
  LogOut,
} from "lucide-react";
import type { Report, Department } from "../../App";

interface WorkerAnalyticsProps {
  reports: Report[];
  workerDepartment: Department | null;
  onBack: () => void;
  onLogout: () => void;
}

const categoryColors: { [key: string]: string } = {
  Vandalism: "bg-red-500",
  Litter: "bg-yellow-500",
  Graffiti: "bg-purple-500",
  "Infrastructure Issue": "bg-blue-500",
  Overgrowth: "bg-green-500",
  Other: "bg-gray-500",
};

export function WorkerAnalytics({
  reports,
  workerDepartment,
  onBack,
  onLogout,
}: WorkerAnalyticsProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const newReportsToday = reports.filter((r) => {
    const reportDate = new Date(r.timestamp);
    reportDate.setHours(0, 0, 0, 0);
    return (
      reportDate.getTime() === today.getTime() &&
      r.status === "new"
    );
  }).length;

  const inProgressCount = reports.filter(
    (r) => r.status === "in-progress",
  ).length;
  const completedCount = reports.filter(
    (r) => r.status === "completed",
  ).length;

  // Calculate category statistics
  const categoryCounts = reports.reduce(
    (acc, report) => {
      acc[report.category] = (acc[report.category] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number },
  );

  const sortedCategories = Object.entries(categoryCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCount = Math.max(...Object.values(categoryCounts));

  // Calculate neighborhood statistics
  const neighborhoodCounts = reports.reduce(
    (acc, report) => {
      const neighborhood = report.location
        .split(" ")
        .slice(-2)
        .join(" ");
      acc[neighborhood] = (acc[neighborhood] || 0) + 1;
      return acc;
    },
    {} as { [key: string]: number },
  );

  const topNeighborhoods = Object.entries(neighborhoodCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-2xl text-blue-800">
            Analytics Dashboard
          </h1>
          <button
            onClick={onLogout}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <LogOut className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-blue-100 rounded-xl">
                <AlertCircle className="w-6 h-6 text-blue-600" />
              </div>
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl text-blue-800 mb-1">
              {newReportsToday}
            </div>
            <div className="text-sm text-gray-600">
              New Reports Today
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
            <div className="text-3xl text-yellow-800 mb-1">
              {inProgressCount}
            </div>
            <div className="text-sm text-gray-600">
              In Progress
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="text-3xl text-green-800 mb-1">
              {completedCount}
            </div>
            <div className="text-sm text-gray-600">
              Resolved
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="p-3 bg-purple-100 rounded-xl">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="text-3xl text-purple-800 mb-1">
              {reports.length}
            </div>
            <div className="text-sm text-gray-600">
              Total Reports
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Most Common Categories */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl mb-4 text-blue-800">
              Most Common Categories
            </h2>
            <div className="space-y-3">
              {sortedCategories.map(([category, count]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-3 h-3 ${categoryColors[category]} rounded-full`}
                      />
                      <span className="text-sm text-gray-700">
                        {category}
                      </span>
                    </div>
                    <span className="text-sm text-gray-900">
                      {count}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`${categoryColors[category]} h-2 rounded-full transition-all`}
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Neighborhood Heatmap */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl text-blue-800">
                Top Neighborhoods
              </h2>
            </div>
            <div className="space-y-3">
              {topNeighborhoods.map(
                ([neighborhood, count], index) => (
                  <div
                    key={neighborhood}
                    className="flex items-center gap-3"
                  >
                    <div
                      className={`flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                            ? "bg-gray-100 text-gray-700"
                            : index === 2
                              ? "bg-orange-100 text-orange-700"
                              : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-gray-900">
                          {neighborhood}
                        </span>
                        <span className="text-sm text-gray-600">
                          {count} reports
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-blue-600 h-1.5 rounded-full transition-all"
                          style={{
                            width: `${(count / topNeighborhoods[0][1]) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Response Time */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl mb-4 text-blue-800">
              Average Response Time
            </h2>
            <div className="text-center py-8">
              <div className="text-5xl text-blue-800 mb-2">
                4.2
              </div>
              <div className="text-gray-600 mb-4">hours</div>
              <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm">
                  15% faster than last week
                </span>
              </div>
            </div>
          </div>

          {/* Resolution Rate */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl mb-4 text-blue-800">
              Resolution Rate
            </h2>
            <div className="text-center py-8">
              <div className="relative inline-flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="80"
                    cy="80"
                    r="70"
                    stroke="#2563eb"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(completedCount / reports.length) * 439.6} 439.6`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl text-blue-800">
                      {Math.round(
                        (completedCount / reports.length) * 100,
                      )}
                      %
                    </div>
                    <div className="text-sm text-gray-600">
                      Resolved
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}