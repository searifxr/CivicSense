import React, { useState } from "react";
import {
  Bell,
  CheckCircle,
  BarChart3,
  MapPin,
  Clock,
  Briefcase,
  LogOut,
} from "lucide-react";
import type { Report, Screen, Department } from "../../App";

interface WorkerDashboardProps {
  reports: Report[];
  workerDepartment: Department | null;
  onUpdateStatus: (
    reportId: string,
    status: "new" | "in-progress" | "completed",
  ) => void;
  onNavigate: (screen: Screen) => void;
  onSelectReport?: (reportId: string) => void;
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

export function WorkerDashboard({
  reports,
  workerDepartment,
  onUpdateStatus,
  onNavigate,
  onSelectReport,
  onLogout,
}: WorkerDashboardProps) {
  const [timeFilter, setTimeFilter] = useState<
    "24h" | "7d" | "all"
  >("24h");
  const [categoryFilter, setCategoryFilter] =
    useState<string>("all");
  const [showAllDepartments, setShowAllDepartments] =
    useState(false);

  const filteredReports = reports.filter((report) => {
    const now = Date.now();
    const reportTime = report.timestamp.getTime();

    let timeMatch = true;
    if (timeFilter === "24h") {
      timeMatch = now - reportTime < 24 * 60 * 60 * 1000;
    } else if (timeFilter === "7d") {
      timeMatch = now - reportTime < 7 * 24 * 60 * 60 * 1000;
    }

    const categoryMatch =
      categoryFilter === "all" ||
      report.category === categoryFilter;

    // Filter by worker's department unless they choose to see all
    const departmentMatch =
      showAllDepartments ||
      !workerDepartment ||
      report.suggestedDepartment === workerDepartment;

    return timeMatch && categoryMatch && departmentMatch;
  });

  const getTimeAgo = (timestamp: Date) => {
    const now = Date.now();
    const diff = now - timestamp.getTime();
    const hours = Math.floor(diff / (60 * 60 * 1000));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return "Just now";
  };

  const handleNotifyTeam = (reportId: string) => {
    onUpdateStatus(reportId, "in-progress");
  };

  const handleMarkResolved = (reportId: string) => {
    onUpdateStatus(reportId, "completed");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl text-blue-800">
                City Worker Dashboard
              </h1>
              <div className="flex items-center gap-2">
                <p className="text-gray-600">
                  CivicSense Management Portal
                </p>
                {workerDepartment && (
                  <span className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm">
                    {workerDepartment}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onNavigate("worker-progress")}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              >
                Progress View
              </button>
              <button
                onClick={() => onNavigate("worker-analytics")}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center gap-2"
              >
                <BarChart3 className="w-4 h-4" />
                Analytics
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Hotspot Map */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl mb-4 text-blue-800">
            Hotspot Map
          </h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button
              onClick={() => setTimeFilter("24h")}
              className={`px-4 py-2 rounded-lg ${
                timeFilter === "24h"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              24 Hours
            </button>
            <button
              onClick={() => setTimeFilter("7d")}
              className={`px-4 py-2 rounded-lg ${
                timeFilter === "7d"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              7 Days
            </button>
            <button
              onClick={() => setTimeFilter("all")}
              className={`px-4 py-2 rounded-lg ${
                timeFilter === "all"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Time
            </button>
            <div className="ml-auto">
              <select
                value={categoryFilter}
                onChange={(e) =>
                  setCategoryFilter(e.target.value)
                }
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Categories</option>
                <option value="Vandalism">Vandalism</option>
                <option value="Litter">Litter</option>
                <option value="Graffiti">Graffiti</option>
                <option value="Infrastructure Issue">
                  Infrastructure Issue
                </option>
                <option value="Overgrowth">Overgrowth</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-blue-600 mx-auto mb-2" />
              <p className="text-blue-800">
                Interactive Heatmap
              </p>
              <p className="text-sm text-blue-600">
                {filteredReports.length} reports in selected
                area
              </p>
            </div>
          </div>
        </div>

        {/* Reports List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-blue-800">
              Recent Reports
            </h2>
            {workerDepartment && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAllDepartments}
                  onChange={(e) =>
                    setShowAllDepartments(e.target.checked)
                  }
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  Show all departments
                </span>
              </label>
            )}
          </div>
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => onSelectReport?.(report.id)}
                className="bg-white rounded-2xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="flex gap-4">
                  {/* Thumbnail */}
                  {report.photo && (
                    <div className="flex-shrink-0">
                      <img
                        src={report.photo}
                        alt="Report"
                        className="w-32 h-32 object-cover rounded-xl"
                      />
                    </div>
                  )}

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3 h-3 ${categoryColors[report.category]} rounded-full`}
                        />
                        <span className="text-gray-900">
                          {report.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        {getTimeAgo(report.timestamp)}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      {report.location}
                    </div>

                    <p className="text-gray-700 mb-3">
                      {report.description}
                    </p>

                    <div className="flex items-center gap-2 text-sm mb-4">
                      <Briefcase className="w-4 h-4 text-blue-600" />
                      <span className="text-blue-700">
                        AI Suggested:{" "}
                        {report.suggestedDepartment}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      {report.status === "new" && (
                        <>
                          <button
                            onClick={() =>
                              handleNotifyTeam(report.id)
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                          >
                            <Bell className="w-4 h-4" />
                            Notify Team
                          </button>
                          <button
                            onClick={() =>
                              handleMarkResolved(report.id)
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Resolved
                          </button>
                        </>
                      )}
                      {report.status === "in-progress" && (
                        <>
                          <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg">
                            In Progress
                          </span>
                          <button
                            onClick={() =>
                              handleMarkResolved(report.id)
                            }
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Mark Resolved
                          </button>
                        </>
                      )}
                      {report.status === "completed" && (
                        <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg">
                          Completed
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredReports.length === 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
                <p className="text-gray-500">
                  No reports found for the selected filters
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}