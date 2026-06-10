import { Search, FileText, Clock, CheckCircle2 } from "lucide-react";
import { useState } from "react";

export default function TrackApplication() {
  const [applicationId, setApplicationId] = useState("");

  const handleSearch = () => {
    console.log("Searching:", applicationId);
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
                  className="w-full outline-none text-gray-700"
                />
              </div>

              <button
                onClick={handleSearch}
                className="bg-primary-blue hover:bg-white hover:text-primary-blue hover:border hover:border-primary-blue text-white px-8 py-3 rounded-xl font-medium transition"
              >
                Track
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Example Result */}
      <section className="max-w-4xl mx-auto px-6 py-14">
        <div className="bg-white rounded-3xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-8">
            Application Details
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Submitted */}
            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100">
              <FileText className="text-blue-600 mb-4" size={36} />
              <h3 className="font-semibold text-gray-800">Submitted</h3>
              <p className="text-sm text-gray-500 mt-2">
                03 June 2026
              </p>
            </div>

            {/* Processing */}
            <div className="bg-yellow-50 rounded-2xl p-6 border border-yellow-100">
              <Clock className="text-yellow-500 mb-4" size={36} />
              <h3 className="font-semibold text-gray-800">Under Review</h3>
              <p className="text-sm text-gray-500 mt-2">
                Currently being processed
              </p>
            </div>

            {/* Approved */}
            <div className="bg-green-50 rounded-2xl p-6 border border-green-100">
              <CheckCircle2 className="text-green-600 mb-4" size={36} />
              <h3 className="font-semibold text-gray-800">Approved</h3>
              <p className="text-sm text-gray-500 mt-2">
                Certificate ready for collection
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}