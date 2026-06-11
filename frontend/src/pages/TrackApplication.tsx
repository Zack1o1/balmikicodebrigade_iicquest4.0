import { Search, FileText, Clock, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { trackApplicationById } from "../api/applicationApi";
import { getServiceName, getServiceTime } from "../utils/serviceLookup";
import { STATUS_LABELS, STATUS_COLORS } from "../constants/applicationStatus";

export default function TrackApplication() {
  const [applicationId, setApplicationId] = useState("");
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!applicationId.trim()) return;
    setLoading(true);
    setError("");
    setApplication(null);
    try {
      const data = await trackApplicationById(applicationId);
      setApplication(data);
    } catch (err: any) {
      console.error(err);
      setError(err?.response?.data?.message || "Failed to find application with this ID");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || "bg-gray-100 text-gray-700";
  };

  const isStepActive = (currentStatus: string, stepStatuses: string[]) => {
    return stepStatuses.includes(currentStatus);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <section className="bg-gradient-to-br from-[#06183e] via-[#01255d] to-[#120a2f] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Track Your Application
          </h1>
          <p className="mt-4 text-lg text-blue-100">
            Enter your application number to check its current status.
          </p>
          <div className="mt-10 max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-3 flex flex-col sm:flex-row gap-3">
              <div className="flex items-center flex-1 px-4">
                <Search className="text-gray-400 mr-3" size={22} />
                <input
                  type="text"
                  placeholder="Enter Application ID (e.g. APP-2026-001)"
                  value={applicationId}
                  onChange={(e) => setApplicationId(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                  className="w-full outline-none text-gray-700"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="bg-primary-blue hover:bg-white hover:text-primary-blue hover:border hover:border-primary-blue text-white px-8 py-3 rounded-xl font-medium transition disabled:opacity-50"
              >
                {loading ? "Searching..." : "Track"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {error && (
        <section className="max-w-4xl mx-auto px-6 py-6">
          <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center border border-red-200">
            <AlertCircle className="mr-3" />
            {error}
          </div>
        </section>
      )}

      {application && (
        <section className="max-w-4xl mx-auto px-6 py-14">
          <div className="bg-white rounded-3xl shadow-lg p-8">
            <div className="flex justify-between items-center mb-8 pb-4 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Application Details
                </h2>
                <p className="text-gray-500 mt-1">
                  Service: <span className="font-medium text-gray-700">{getServiceName(application.service)}</span>
                </p>
                <p className="text-gray-500 mt-1">
                  Estimated Time: <span className="font-medium text-gray-700">{getServiceTime(application.service)}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getStatusColor(application.status)}`}>
                  {STATUS_LABELS[application.status as keyof typeof STATUS_LABELS] || application.status}
                </span>
              </div>
            </div>

            {application.timeline && application.timeline.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Status History</h3>
                <div className="space-y-4">
                  {application.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start">
                      <div className="mt-1 flex-shrink-0">
                        <CheckCircle2 className="text-blue-500" size={20} />
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 flex-1 border border-gray-100">
                        <p className="font-semibold text-gray-800">{STATUS_LABELS[event.status as keyof typeof STATUS_LABELS] || event.status}</p>
                        <p className="text-sm text-gray-600 mt-1">{event.note || "Status updated"}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-4 gap-6">
              <div className={`rounded-2xl p-6 border ${isStepActive(application.status, ['PENDING', 'APPROVED', 'REJECTED', 'DOCUMENT_REQUESTED']) ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <FileText className="text-blue-600 mb-4" size={36} />
                <h3 className="font-semibold text-gray-800">Submitted</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className={`rounded-2xl p-6 border ${application.status === 'PENDING' || application.status === 'DOCUMENT_REQUESTED' ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <Clock className="text-yellow-500 mb-4" size={36} />
                <h3 className="font-semibold text-gray-800">
                  {application.status === 'DOCUMENT_REQUESTED' ? 'Docs Requested' : 'Pending Review'}
                </h3>
                <p className="text-sm text-gray-500 mt-2">
                  {application.status === 'DOCUMENT_REQUESTED' ? 'Additional documents needed' : 'Waiting for review'}
                </p>
              </div>

              <div className={`rounded-2xl p-6 border ${application.status === 'APPROVED' ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <CheckCircle2 className="text-green-600 mb-4" size={36} />
                <h3 className="font-semibold text-gray-800">Approved</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {application.status === 'APPROVED' ? 'Application approved' : 'Awaiting approval'}
                </p>
              </div>

              <div className={`rounded-2xl p-6 border ${application.status === 'REJECTED' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <AlertTriangle className="text-red-600 mb-4" size={36} />
                <h3 className="font-semibold text-gray-800">Rejected</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {application.status === 'REJECTED' ? 'Application rejected' : 'Not rejected'}
                </p>
              </div>
            </div>

            {application.expectedCompletionDate && (
              <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100">
                <p className="text-sm text-green-800">
                  <strong>Expected Completion:</strong>{" "}
                  {new Date(application.expectedCompletionDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
