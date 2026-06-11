import { Search, FileText, Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { trackApplicationById } from "../api/applicationApi";

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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case "submitted": return "Submitted";
      case "received": return "Received";
      case "under_review": return "Under Review";
      case "approved": return "Approved";
      case "rejected": return "Rejected";
      case "ready_for_collection": return "Ready for Collection";
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r  bg-[#021330] bg-gradient-to-br from-[#06183e] via-[#01255d] to-[#120a2f] py-20">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white">
            Track Your Application
          </h1>

          <p className="mt-4 text-lg text-blue-100">
            Enter your application number to check its current status.
          </p>

          {/* Search Box */}
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
                <p className="text-gray-500 mt-1">Service: <span className="font-medium text-gray-700">{application.service?.name || 'Loading...'}</span></p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Current Status</p>
                <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800 mt-1 capitalize">
                  {getStatusDisplay(application.status)}
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
                        <p className="font-semibold text-gray-800 capitalize">{getStatusDisplay(event.status)}</p>
                        <p className="text-sm text-gray-600 mt-1">{event.note || "Status updated"}</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-6">
              {/* Submitted */}
              <div className={`rounded-2xl p-6 border ${['submitted', 'received', 'under_review', 'approved', 'ready_for_collection'].includes(application.status) ? 'bg-blue-50 border-blue-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <FileText className="text-blue-600 mb-4" size={36} />
                <h3 className="font-semibold text-gray-800">Submitted</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {new Date(application.createdAt).toLocaleDateString()}
                </p>
              </div>

              {/* Processing */}
              <div className={`rounded-2xl p-6 border ${['under_review', 'approved', 'ready_for_collection'].includes(application.status) ? 'bg-yellow-50 border-yellow-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <Clock className="text-yellow-500 mb-4" size={36} />
                <h3 className="font-semibold text-gray-800">Under Review</h3>
                <p className="text-sm text-gray-500 mt-2">
                  Being processed
                </p>
              </div>

              {/* Approved */}
              <div className={`rounded-2xl p-6 border ${['approved', 'ready_for_collection'].includes(application.status) ? 'bg-green-50 border-green-100' : 'bg-gray-50 border-gray-100 opacity-60'}`}>
                <CheckCircle2 className="text-green-600 mb-4" size={36} />
                <h3 className="font-semibold text-gray-800">Approved</h3>
                <p className="text-sm text-gray-500 mt-2">
                  {application.status === 'ready_for_collection' ? 'Ready for collection' : 'Approved successfully'}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}