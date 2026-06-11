import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FileText, Clock, CheckCircle, TrendingUp, Search, Filter, Eye, XCircle, AlertCircle } from 'lucide-react';
import type { RootState } from '../store';
import { sanitize } from '../utils/sanitize';
import { getAllApplications, approveApplication, rejectApplication, requestMissingDocuments } from '../api/applicationApi';
import { getServiceName } from '../utils/serviceLookup';
import { STATUS_LABELS, STATUS_COLORS } from '../constants/applicationStatus';
import ApplicationDetailModal from '../components/ApplicationDetailModal';

function Modal({ open, title, message, onClose, children }: { open: boolean; title: string; message?: string; onClose: () => void; children?: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
        {message && <p className="text-sm text-gray-600 mb-4">{message}</p>}
        {children}
      </div>
    </div>
  );
}

export default function DashboardStaff() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [viewApp, setViewApp] = useState<string | null>(null);
  const [docsModal, setDocsModal] = useState<{ open: boolean; appId: string }>({ open: false, appId: '' });
  const [docInput, setDocInput] = useState('');
  const [docList, setDocList] = useState<string[]>([]);
  const [submittingDocs, setSubmittingDocs] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const data = await getAllApplications();
        setApplications(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchApps();
  }, []);

  const pendingCount = applications.filter(a => ['PENDING', 'DOCUMENT_REQUESTED'].includes(a.status)).length;
  const approvedCount = applications.filter(a => a.status === 'APPROVED').length;
  const totalCount = applications.length;

  const handleApprove = async (id: string) => {
    try {
      await approveApplication(id);
      const data = await getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleReject = async (id: string) => {
    try {
      await rejectApplication(id);
      const data = await getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    }
  };

  const openDocsModal = (id: string) => {
    setDocList([]);
    setDocInput('');
    setDocsModal({ open: true, appId: id });
  };

  const addDoc = () => {
    if (docInput.trim() && !docList.includes(docInput.trim())) {
      setDocList([...docList, docInput.trim()]);
      setDocInput('');
    }
  };

  const removeDoc = (idx: number) => {
    setDocList(docList.filter((_, i) => i !== idx));
  };

  const submitDocRequest = async () => {
    if (docList.length === 0) return;
    setSubmittingDocs(true);
    try {
      await requestMissingDocuments(docsModal.appId, docList);
      setDocsModal({ open: false, appId: '' });
      const data = await getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingDocs(false);
    }
  };

  const getStatusStyle = (status: string) => {
    return STATUS_COLORS[status as keyof typeof STATUS_COLORS] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.service && getServiceName(app.service)?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      app.applicant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && ['PENDING', 'DOCUMENT_REQUESTED'].includes(app.status);
    if (statusFilter === 'approved') return matchesSearch && app.status === 'APPROVED';
    return matchesSearch && app.status === statusFilter;
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Modal open={docsModal.open} title="Request Missing Documents" onClose={() => setDocsModal({ open: false, appId: '' })}>
        <div className="mb-4">
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={docInput}
              onChange={(e) => setDocInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addDoc(); }}
              placeholder="Enter document name..."
              className="flex-1 border border-gray-200 rounded-lg p-2 text-sm focus:outline-none focus:border-primary-blue"
            />
            <button onClick={addDoc} className="px-3 py-2 bg-primary-blue text-white rounded-lg text-sm">Add</button>
          </div>
          {docList.length > 0 && (
            <ul className="space-y-1">
              {docList.map((doc, idx) => (
                <li key={idx} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg text-sm">
                  <span>{doc}</span>
                  <button onClick={() => removeDoc(idx)} className="text-red-600 text-xs">Remove</button>
                </li>
              ))}
            </ul>
          )}
          {docList.length === 0 && <p className="text-xs text-gray-400">Add at least one document to request.</p>}
        </div>
        <div className="flex justify-end gap-3">
          <button onClick={() => setDocsModal({ open: false, appId: '' })} className="px-4 py-2 rounded border text-gray-700 text-sm">Cancel</button>
          <button onClick={submitDocRequest} disabled={docList.length === 0 || submittingDocs} className="px-4 py-2 rounded bg-primary-blue text-white text-sm disabled:opacity-50">
            {submittingDocs ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      </Modal>

      <div className="flex-1">
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary-blue pl-3">Ward Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary-blue rounded-full text-white flex items-center justify-center font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{sanitize(user?.firstName || 'Staff')} {sanitize(user?.lastName || '')}</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-50 rounded-lg"><FileText className="text-blue-600" size={20} /></div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+12%</span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">{totalCount}</div>
                <div className="text-sm text-gray-500 mt-1">Applications Today</div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-yellow-50 rounded-lg"><Clock className="text-yellow-600" size={20} /></div>
                <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">-5%</span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">{pendingCount}</div>
                <div className="text-sm text-gray-500 mt-1">Pending</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-green-50 rounded-lg"><CheckCircle className="text-green-600" size={20} /></div>
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded">+8%</span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">{approvedCount}</div>
                <div className="text-sm text-gray-500 mt-1">Approved</div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-red-50 rounded-lg"><TrendingUp className="text-red-500" size={20} /></div>
                <span className="text-sm font-semibold text-red-600 bg-red-50 px-2 py-1 rounded">-0.3d</span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-gray-900">1.8d</div>
                <div className="text-sm text-gray-500 mt-1">Avg. Processing</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-800">Applications</h2>
                <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search applications..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-64 focus:outline-none focus:border-primary-blue bg-gray-50" 
                    />
                  </div>
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="pl-9 pr-8 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-600 focus:outline-none appearance-none cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="DOCUMENT_REQUESTED">Document Requested</option>
                    </select>
                  </div>
                </div>
             </div>
             
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="border-b border-gray-100 text-gray-500 text-xs font-semibold tracking-wider">
                     <th className="pb-3 px-4 uppercase">App. ID</th>
                     <th className="pb-3 px-4 uppercase">Service</th>
                     <th className="pb-3 px-4 uppercase">Applicant</th>
                     <th className="pb-3 px-4 uppercase">Ward</th>
                     <th className="pb-3 px-4 uppercase">Date</th>
                     <th className="pb-3 px-4 uppercase">Status</th>
                     <th className="pb-3 px-4 uppercase text-right">Action</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm">
                   {filteredApplications.map((app) => (
                     <tr key={app._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                       <td className="py-4 px-4 font-semibold text-primary-blue">{app.applicationId}</td>
                       <td className="py-4 px-4 text-gray-800">{getServiceName(app.service)}</td>
                       <td className="py-4 px-4">
                         <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs shrink-0">
                             {app.applicant?.firstName?.charAt(0)}{app.applicant?.lastName?.charAt(0)}
                           </div>
                           <span className="font-medium text-gray-700 whitespace-nowrap">
                             {sanitize(app.applicant?.firstName || '')} {sanitize(app.applicant?.lastName || '')}
                           </span>
                         </div>
                       </td>
                       <td className="py-4 px-4 text-gray-600 whitespace-nowrap">Ward {app.assignedWard || '0'}</td>
                       <td className="py-4 px-4 text-gray-600 whitespace-nowrap">
                         {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                       </td>
                       <td className="py-4 px-4 whitespace-nowrap">
                         <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(app.status)}`}>
                           {STATUS_LABELS[app.status as keyof typeof STATUS_LABELS] || app.status}
                         </span>
                       </td>
                       <td className="py-4 px-4 text-right">
                         <div className="flex items-center justify-end gap-2">
                           {app.status === 'PENDING' && (
                             <>
                               <button onClick={() => handleApprove(app._id)} className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1.5 rounded-lg hover:bg-green-100 text-xs font-semibold">
                                 <CheckCircle size={14} /> Approve
                               </button>
                               <button onClick={() => handleReject(app._id)} className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1.5 rounded-lg hover:bg-red-100 text-xs font-semibold">
                                 <XCircle size={14} /> Reject
                               </button>
                               <button onClick={() => openDocsModal(app._id)} className="inline-flex items-center gap-1 text-blue-700 bg-blue-50 px-2 py-1.5 rounded-lg hover:bg-blue-100 text-xs font-semibold">
                                 <AlertCircle size={14} /> Request Docs
                               </button>
                             </>
                           )}
                            <button 
                              onClick={() => setViewApp(app._id)}
                              className="inline-flex items-center gap-1 text-primary-blue font-semibold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                            >
                              <Eye size={16} /> View
                            </button>
                         </div>
                       </td>
                     </tr>
                   ))}
                   {filteredApplications.length === 0 && (
                     <tr>
                       <td colSpan={7} className="py-12 text-center text-gray-400 font-medium">
                         No application records found matching current criteria.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </div>
        </div>
      </div>

      <ApplicationDetailModal
        open={!!viewApp}
        appId={viewApp || ''}
        onClose={() => setViewApp(null)}
        role="ward"
        onApprove={async (id) => { await approveApplication(id); setViewApp(null); }}
        onReject={async (id) => { await rejectApplication(id); setViewApp(null); }}
        onRequestDocs={() => setViewApp(null)}
      />
    </div>
  );
}
