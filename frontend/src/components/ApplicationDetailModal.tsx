import { useEffect, useState } from 'react';
import { X, FileText, Download, CheckCircle, XCircle, AlertCircle, Calendar, User, Hash, Clock } from 'lucide-react';
import { getApplication } from '../api/applicationApi';
import { STATUS_LABELS } from '../constants/applicationStatus';

interface ApplicationData {
  _id: string;
  applicationId: string;
  applicant?: { firstName: string; lastName: string; email: string; phoneNumber: string };
  service: string;
  status: string;
  createdAt: string;
  documents?: { name: string; fileUrl?: string; uploadedAt?: string }[];
  assignedWard?: number;
  remarks?: string;
  expectedCompletionDate?: string;
  timeline?: { status: string; note: string; timestamp: string }[];
}

interface Props {
  open: boolean;
  appId: string;
  onClose: () => void;
  role?: 'admin' | 'ward';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRequestDocs?: (id: string) => void;
}

export default function ApplicationDetailModal({ open, appId, onClose, role, onApprove, onReject, onRequestDocs }: Props) {
  const [application, setApplication] = useState<ApplicationData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && appId) {
      setLoading(true);
      getApplication(appId)
        .then(setApplication)
        .catch(() => setApplication(null))
        .finally(() => setLoading(false));
    }
  }, [open, appId]);

  if (!open) return null;

  const statusColors: Record<string, string> = {
    PENDING: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    APPROVED: 'bg-green-100 text-green-700 border-green-200',
    REJECTED: 'bg-red-100 text-red-700 border-red-200',
    DOCUMENT_REQUESTED: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
          <h3 className="text-lg font-bold text-gray-900">Application Details</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {loading ? (
          <div className="p-12 text-center text-gray-400">Loading application data...</div>
        ) : !application ? (
          <div className="p-12 text-center text-gray-400">Failed to load application details.</div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <Hash size={14} /> Application ID
                </div>
                <p className="font-semibold text-slate-900">{application.applicationId}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <User size={14} /> Applicant
                </div>
                <p className="font-semibold text-slate-900">
                  {application.applicant?.firstName} {application.applicant?.lastName}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <Calendar size={14} /> Submission Date
                </div>
                <p className="font-semibold text-slate-900">
                  {new Date(application.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <Clock size={14} /> Current Status
                </div>
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-1 border ${statusColors[application.status] || 'text-gray-700 bg-gray-50 border-gray-200'}`}>
                  {STATUS_LABELS[application.status as keyof typeof STATUS_LABELS] || application.status}
                </span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <FileText size={18} /> Uploaded Documents
              </h4>
              {application.documents && application.documents.length > 0 ? (
                <div className="space-y-2">
                  {application.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-50 rounded-lg px-4 py-3 border border-slate-100">
                      <div className="flex items-center gap-3">
                        <FileText size={16} className="text-slate-400" />
                        <div>
                          <p className="text-sm font-medium text-slate-800">{doc.name}</p>
                          {doc.uploadedAt && (
                            <p className="text-xs text-slate-400">{new Date(doc.uploadedAt).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                      {doc.fileUrl && (
                        <a href={doc.fileUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs bg-white border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                          <Download size={14} /> Download
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-400 bg-slate-50 rounded-lg p-4 text-center">No documents uploaded yet.</p>
              )}
            </div>

            {application.timeline && application.timeline.length > 0 && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Timeline</h4>
                <div className="space-y-2">
                  {application.timeline.map((event, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">
                          {STATUS_LABELS[event.status as keyof typeof STATUS_LABELS] || event.status}
                        </p>
                        <p className="text-xs text-slate-500">{event.note}</p>
                        <p className="text-xs text-slate-400">{new Date(event.timestamp).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {role && (role === 'admin' || role === 'ward') && application.status === 'PENDING' && (
              <div className="border-t border-gray-100 pt-4">
                <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
                <div className="flex flex-wrap gap-3">
                  {onApprove && (
                    <button onClick={() => onApprove(appId)}
                      className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors">
                      <CheckCircle size={16} /> Approve
                    </button>
                  )}
                  {onReject && (
                    <button onClick={() => onReject(appId)}
                      className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                      <XCircle size={16} /> Reject
                    </button>
                  )}
                  {onRequestDocs && (
                    <button onClick={() => onRequestDocs(appId)}
                      className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors">
                      <AlertCircle size={16} /> Request Documents
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
