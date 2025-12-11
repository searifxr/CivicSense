import React from "react";
import {
  ArrowLeft,
  Clock,
  MapPin,
  CheckCircle,
  LogOut,
} from "lucide-react";
import type { Report, Department } from "../../App";

interface WorkerProgressViewProps {
  reports: Report[];
  workerDepartment: Department | null;
  onUpdateStatus: (
    reportId: string,
    status: "new" | "in-progress" | "completed",
  ) => void;
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

export function WorkerProgressView({
  reports,
  workerDepartment,
  onUpdateStatus,
  onBack,
  onLogout,
}: WorkerProgressViewProps) {
  const [activeTab, setActiveTab] = React.useState<
    "new" | "in-progress" | "completed"
  >("new");

  const filteredReports = reports.filter((report) => {
    if (activeTab === "new") return report.status === "new";
    if (activeTab === "in-progress")
      return report.status === "in-progress";
    return report.status === "completed";
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

  const ReportCard = ({ report }: { report: Report }) => (
    <div className="bg-white rounded-xl shadow p-4 hover:shadow-lg transition-shadow">
      {report.photo && (
        <img
          src={report.photo}
          alt="Report"
          className="w-full h-32 object-cover rounded-lg mb-3"
        />
      )}
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-2 h-2 ${categoryColors[report.category]} rounded-full`}
        />
        <span className="text-sm text-gray-900">
          {report.category}
        </span>
      </div>
      <p className="text-sm text-gray-700 mb-2 line-clamp-2">
        {report.description}
      </p>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <MapPin className="w-3 h-3" />
        <span className="truncate">{report.location}</span>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <Clock className="w-3 h-3" />
        {getTimeAgo(report.timestamp)}
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        {report.status === "new" && (
          <button
            onClick={() =>
              onUpdateStatus(report.id, "in-progress")
            }
            className="w-full text-sm py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Start Working
          </button>
        )}
        {report.status === "in-progress" && (
          <button
            onClick={() =>
              onUpdateStatus(report.id, "completed")
            }
            className="w-full text-sm py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-1"
          >
            <CheckCircle className="w-4 h-4" />
            Complete
          </button>
        )}
        {report.status === "completed" && (
          <div className="text-sm text-center py-2 bg-green-100 text-green-700 rounded-lg">
            Resolved
          </div>
        )}
      </div>
    </div>
  );

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
            Progress View
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
        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white rounded-xl p-2 shadow">
          <button
            onClick={() => setActiveTab("new")}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              activeTab === "new"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            New Reports
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeTab === "new"
                  ? "bg-white text-blue-600"
                  : "bg-gray-200"
              }`}
            >
              {reports.filter((r) => r.status === "new").length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("in-progress")}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              activeTab === "in-progress"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            In Progress
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeTab === "in-progress"
                  ? "bg-white text-blue-600"
                  : "bg-gray-200"
              }`}
            >
              {
                reports.filter(
                  (r) => r.status === "in-progress",
                ).length
              }
            </span>
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`flex-1 py-3 rounded-lg transition-colors ${
              activeTab === "completed"
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            Completed
            <span
              className={`ml-2 px-2 py-1 rounded-full text-xs ${
                activeTab === "completed"
                  ? "bg-white text-blue-600"
                  : "bg-gray-200"
              }`}
            >
              {
                reports.filter((r) => r.status === "completed")
                  .length
              }
            </span>
          </button>
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Column */}
          <div className="bg-white rounded-2xl shadow-lg p-4">
            <h3 className="mb-4 text-blue-800 flex items-center gap-2">
              {activeTab === "new" && "New Reports"}
              {activeTab === "in-progress" && "In Progress"}
              {activeTab === "completed" && "Completed"}
              <span className="ml-auto text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {filteredReports.length}
              </span>
            </h3>
            <div className="space-y-3">
              {filteredReports.map((report) => (
                <ReportCard key={report.id} report={report} />
              ))}
              {filteredReports.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  No reports in this status
                </div>
              )}
            </div>
          </div>

          {/* Placeholder columns to show kanban structure */}
          {activeTab === "new" && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-4 opacity-50">
                <h3 className="mb-4 text-gray-600">
                  In Progress
                </h3>
                <div className="text-center py-12 text-gray-400">
                  Move items here
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 opacity-50">
                <h3 className="mb-4 text-gray-600">
                  Completed
                </h3>
                <div className="text-center py-12 text-gray-400">
                  Completed items
                </div>
              </div>
            </>
          )}
          {activeTab === "in-progress" && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-4 opacity-50">
                <h3 className="mb-4 text-gray-600">
                  New Reports
                </h3>
                <div className="text-center py-12 text-gray-400">
                  New items
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 opacity-50">
                <h3 className="mb-4 text-gray-600">
                  Completed
                </h3>
                <div className="text-center py-12 text-gray-400">
                  Completed items
                </div>
              </div>
            </>
          )}
          {activeTab === "completed" && (
            <>
              <div className="bg-white rounded-2xl shadow-lg p-4 opacity-50">
                <h3 className="mb-4 text-gray-600">
                  New Reports
                </h3>
                <div className="text-center py-12 text-gray-400">
                  New items
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-lg p-4 opacity-50">
                <h3 className="mb-4 text-gray-600">
                  In Progress
                </h3>
                <div className="text-center py-12 text-gray-400">
                  Active items
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}