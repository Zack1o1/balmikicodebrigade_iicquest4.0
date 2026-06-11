import { Search, FileText, Clock, CheckCircle2, AlertCircle, AlertTriangle, Eye } from "lucide-react";
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

  // const isStepActive = (currentStatus: string, stepStatuses: string[]) => {
  //   return stepStatuses.includes(currentStatus);
  // };

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
                  Application ID: <span className="font-mono font-bold text-primary-blue">{application.applicationId}</span>
                </p>
                <p className="text-gray-500 mt-1">
                  Service: <span className="font-medium text-gray-700">{getServiceName(application.service)}</span>
                </p>
                <p className="text-gray-500 mt-1">
                  Application Type: <span className="font-medium text-gray-700">{getServiceName(application.service)}</span>
                </p>
                <p className="text-gray-500 mt-1">
                  Submission Date: <span className="font-medium text-gray-700">{new Date(application.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </p>
                <p className="text-gray-500 mt-1">
                  Estimated Response Time: <span className="font-medium text-gray-700">{getServiceTime(application.service)}</span>
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Status</p>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getStatusColor(application.status)}`}>
                  {STATUS_LABELS[application.status as keyof typeof STATUS_LABELS] || application.status}
                </span>
              </div>
            </div>

            {/* Timeline */}
            {application.timeline && application.timeline.length > 0 && (
              <div className="mb-10">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">Status History</h3>
                <div className="relative">
                  {application.timeline.map((event: any, idx: number) => (
                    <div key={idx} className="flex gap-4 items-start pb-6 relative">
                      {/* Timeline line */}
                      {idx < application.timeline.length - 1 && (
                        <div className="absolute left-[9px] top-5 bottom-0 w-0.5 bg-blue-200" />
                      )}
                      {/* Timeline dot */}
                      <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                        idx === application.timeline.length - 1 ? 'bg-blue-500' : 'bg-blue-200'
                      }`}>
                        <CheckCircle2 className="text-white" size={12} />
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

            {/* Status Cards */}
            <div className="grid md:grid-cols-5 gap-4">
              <div className={`rounded-2xl p-5 border ${['PENDING', 'APPROVED', 'REJECTED', 'DOCUMENT_REQUESTED', 'UNDER_REVIEW'].includes(application.status) ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <FileText className="text-blue-600 mb-3" size={28} />
                <h3 className="font-semibold text-gray-800 text-sm">Submitted</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>

              <div className={`rounded-2xl p-5 border ${['PENDING', 'UNDER_REVIEW'].includes(application.status) ? 'bg-yellow-50 border-yellow-100' : application.status === 'DOCUMENT_REQUESTED' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <Clock className={`mb-3 ${application.status === 'DOCUMENT_REQUESTED' ? 'text-blue-500' : 'text-yellow-500'}`} size={28} />
                <h3 className="font-semibold text-gray-800 text-sm">
                  {application.status === 'DOCUMENT_REQUESTED' ? 'Docs Requested' : application.status === 'UNDER_REVIEW' ? 'Under Review' : 'Pending Review'}
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  {application.status === 'DOCUMENT_REQUESTED' ? 'Additional documents needed' : application.status === 'UNDER_REVIEW' ? 'Being reviewed' : 'Waiting for review'}
                </p>
              </div>

              <div className={`rounded-2xl p-5 border ${application.status === 'APPROVED' ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <CheckCircle2 className="text-green-600 mb-3" size={28} />
                <h3 className="font-semibold text-gray-800 text-sm">Approved</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {application.status === 'APPROVED' ? 'Application approved' : 'Awaiting approval'}
                </p>
              </div>

              <div className={`rounded-2xl p-5 border ${application.status === 'REJECTED' ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <AlertTriangle className="text-red-600 mb-3" size={28} />
                <h3 className="font-semibold text-gray-800 text-sm">Rejected</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {application.status === 'REJECTED' ? 'Application rejected' : 'Not rejected'}
                </p>
              </div>

              <div className={`rounded-2xl p-5 border ${application.status === 'DOCUMENT_REQUESTED' ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <Eye className="text-blue-500 mb-3" size={28} />
                <h3 className="font-semibold text-gray-800 text-sm">Documents</h3>
                <p className="text-xs text-gray-500 mt-1">
                  {application.requestedDocuments ? `${application.requestedDocuments.filter((d: any) => d.status === 'UPLOADED').length}/${application.requestedDocuments.length} uploaded` : 'No docs requested'}
                </p>
              </div>
            </div>

            {/* Requested Documents Status */}
            {application.requestedDocuments && application.requestedDocuments.length > 0 && (
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <h4 className="text-sm font-semibold text-blue-800 mb-2">Requested Documents Status</h4>
                <div className="space-y-2">
                  {application.requestedDocuments.map((doc: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span className="text-blue-700">{doc.name}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                        doc.status === 'UPLOADED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {doc.status === 'UPLOADED' ? '✓ Uploaded' : 'Pending'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
