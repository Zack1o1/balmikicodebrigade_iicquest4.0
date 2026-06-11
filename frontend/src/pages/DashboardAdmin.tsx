import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Building2, Users, FileText, Activity, UserPlus, Trash2, Eye, Search, Filter, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import type { RootState } from '../store';
import { sanitize } from '../utils/sanitize';
import { getUsers, createUser, deleteUser } from '../api/userApi';
import { getAllApplications, approveApplication, rejectApplication } from '../api/applicationApi';
import { getAllActivities } from '../api/activityApi';
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

export default function DashboardAdmin() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [staffList, setStaffList] = useState<any[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
    assignedWard: ''
  });

  const [modal, setModal] = useState<{ open: boolean; title: string; message: string; onConfirm?: () => void; isConfirm?: boolean }>({ open: false, title: '', message: '' });
  const [viewApp, setViewApp] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStaff = async () => {
    try {
      const data = await getUsers('ward');
      setStaffList(data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    }
  };

  const fetchApps = async () => {
    try {
      const data = await getAllApplications();
      setApplications(data);
    } catch (err) {
      console.error("Error fetching applications:", err);
    }
  };

  const fetchActivities = async () => {
    try {
      const data = await getAllActivities();
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
    }
  };

  useEffect(() => {
    fetchStaff();
    fetchApps();
    fetchActivities();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createUser({
        ...form,
        assignedWard: form.assignedWard.toString(),
        role: 'ward'
      });

      setForm({ firstName: '', lastName: '', email: '', password: '', phoneNumber: '', assignedWard: '' });
      fetchStaff();
      setModal({ open: true, title: 'Staff Registration Successful', message: 'The staff account has been created successfully.', isConfirm: false });
    } catch (err: any) {
      setModal({ open: true, title: 'Error', message: err.response?.data?.message || err.message || 'Failed to create staff.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteStaff = (id: string) => {
    setModal({
      open: true,
      title: 'Confirm Delete',
      message: 'Are you sure you want to permanently delete this staff member?',
      isConfirm: true,
      onConfirm: async () => {
        try {
          await deleteUser(id);
          fetchStaff();
          setModal({ open: false, title: '', message: '' });
        } catch (err) {
          setModal({ open: true, title: 'Error', message: 'Failed to delete staff member.' });
        }
      }
    });
  };

  const handleApprove = async (id: string) => {
    setActionLoading(id);
    try {
      await approveApplication(id);
      fetchApps();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoading(id);
    try {
      await rejectApplication(id);
      fetchApps();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    const matchesSearch =
      app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && ['PENDING', 'DOCUMENT_REQUESTED', 'UNDER_REVIEW'].includes(app.status);
    return matchesSearch && app.status === statusFilter;
  });

  const totalUsers = staffList.length + 1;
  const totalApps = applications.length;

  return (
    <div className="min-h-screen bg-slate-50 flex w-full">
      <Modal open={modal.open} title={modal.title} message={modal.message} onClose={() => setModal({ open: false, title: '', message: '' })}>
        <div className="flex justify-end gap-3 mt-4">
          {modal.isConfirm ? (
            <>
              <button onClick={() => setModal({ open: false, title: '', message: '' })} className="px-4 py-2 rounded border text-gray-700">Cancel</button>
              <button onClick={modal.onConfirm} className="px-4 py-2 rounded bg-red-600 text-white">Delete</button>
            </>
          ) : (
            <button onClick={() => setModal({ open: false, title: '', message: '' })} className="px-4 py-2 rounded bg-primary-red text-white">Continue</button>
          )}
        </div>
      </Modal>

      <div className="flex-1 flex flex-col min-w-0">
        <div className="bg-white border-b border-slate-200 px-8 py-6 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 border-l-4 border-indigo-600 pl-3">Admin Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1 pl-4">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — System Oversight
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-indigo-600 rounded-full text-white flex items-center justify-center font-bold shadow-sm">
              {user?.firstName?.charAt(0) || 'A'}{user?.lastName?.charAt(0) || 'D'}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{sanitize(user?.firstName || 'Admin')} {sanitize(user?.lastName || '')}</p>
              <p className="text-xs text-slate-500">System Administrator</p>
            </div>
          </div>
        </div>

        <div className="p-8 overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-indigo-50 rounded-xl"><Users className="text-indigo-600" size={22} /></div>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Live</span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-900">{totalUsers}</div>
                <div className="text-sm text-slate-500 mt-1">Active Staff Accounts</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-purple-50 rounded-xl"><Building2 className="text-purple-600" size={22} /></div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-900">32</div>
                <div className="text-sm text-slate-500 mt-1">Wards Active</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-50 rounded-xl"><FileText className="text-blue-600" size={22} /></div>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-900">{totalApps}</div>
                <div className="text-sm text-slate-500 mt-1">Total Applications</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-emerald-50 rounded-xl"><Activity className="text-emerald-600" size={22} /></div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">Online</span>
              </div>
              <div className="mt-4">
                <div className="text-3xl font-bold text-slate-900">99.9%</div>
                <div className="text-sm text-slate-500 mt-1">System Health</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600"><UserPlus size={20} /></div>
              <h2 className="text-xl font-bold text-slate-800">Manage Staff Accounts</h2>
            </div>

            <form onSubmit={handleCreateStaff} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <input required type="text" placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} className="col-span-1 border border-slate-200 bg-white p-2.5 text-sm rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" />
              <input required type="text" placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} className="col-span-1 border border-slate-200 bg-white p-2.5 text-sm rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" />
              <input required type="email" placeholder="Email Address" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="col-span-1 lg:col-span-2 xl:col-span-1 border border-slate-200 bg-white p-2.5 text-sm rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" />
              <input required type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="col-span-1 border border-slate-200 bg-white p-2.5 text-sm rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" />
              <input required type="text" placeholder="Phone" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} className="col-span-1 border border-slate-200 bg-white p-2.5 text-sm rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" />
              <div className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-1 flex gap-2">
                <input required type="number" placeholder="Ward" value={form.assignedWard} onChange={e => setForm({ ...form, assignedWard: e.target.value })} className="w-1/3 border border-slate-200 bg-white p-2.5 text-sm rounded-lg outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400" />
                <button type="submit" disabled={loading} className="w-2/3 bg-indigo-600 text-white font-medium text-sm py-2.5 rounded-lg shadow-sm hover:bg-indigo-700 transition flex justify-center items-center gap-2">
                  {loading ? <Loader2 className="animate-spin" size={16} /> : 'Create Staff'}
                </button>
              </div>
            </form>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold tracking-wider">
                    <th className="pb-3 px-4 uppercase">Staff Member</th>
                    <th className="pb-3 px-4 uppercase">Email</th>
                    <th className="pb-3 px-4 uppercase">Assigned Ward</th>
                    <th className="pb-3 px-4 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {staffList.map(staff => (
                    <tr key={staff._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-800 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                          {staff.firstName?.charAt(0)}{staff.lastName?.charAt(0)}
                        </div>
                        {staff.firstName} {staff.lastName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{staff.email}</td>
                      <td className="py-3 px-4 text-slate-600">Ward {staff.assignedWard || '-'}</td>
                      <td className="py-3 px-4 text-right">
                        <button onClick={() => handleDeleteStaff(staff._id)} className="text-red-600 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition inline-flex items-center">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {staffList.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-slate-400">No staff accounts registered yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-xl font-bold text-slate-800">System Applications</h2>
              <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    placeholder="Search ID, Service, Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-slate-200 rounded-xl text-sm w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-400 bg-slate-50 hover:bg-white transition-colors"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-9 pr-8 py-2 border border-slate-200 rounded-xl text-sm bg-white text-slate-600 focus:outline-none appearance-none cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <option value="all">All Statuses</option>
                    <option value="pending">Active</option>
                    <option value="APPROVED">Approved</option>
                    <option value="REJECTED">Rejected</option>
                    <option value="DOCUMENT_REQUESTED">Document Requested</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold tracking-wider">
                    <th className="pb-3 px-4 uppercase">App. ID</th>
                    <th className="pb-3 px-4 uppercase">Service</th>
                    <th className="pb-3 px-4 uppercase">Applicant</th>
                    <th className="pb-3 px-4 uppercase">Ward</th>
                    <th className="pb-3 px-4 uppercase">Status</th>
                    <th className="pb-3 px-4 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {filteredApplications.slice(0, 15).map((app) => {
                    const statusColors: Record<string, string> = {
                      PENDING: 'text-yellow-700 bg-yellow-50 border-yellow-200',
                      APPROVED: 'text-green-700 bg-green-50 border-green-200',
                      REJECTED: 'text-red-700 bg-red-50 border-red-200',
                      DOCUMENT_REQUESTED: 'text-blue-700 bg-blue-50 border-blue-200',
                      UNDER_REVIEW: 'text-purple-700 bg-purple-50 border-purple-200',
                    };

                    return (
                      <tr key={app._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4 px-4 font-semibold text-indigo-600 whitespace-nowrap">{app.applicationId}</td>
                        <td className="py-4 px-4 text-slate-800">{app.service?.name}</td>
                        <td className="py-4 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {app.applicant?.firstName} {app.applicant?.lastName}
                        </td>
                        <td className="py-4 px-4 text-slate-600 whitespace-nowrap">Ward {app.assignedWard || '0'}</td>
                        <td className="py-4 px-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide border ${statusColors[app.status] || 'text-gray-700 bg-gray-50 border-gray-200'}`}>
                            {app.status?.replace(/_/g, ' ')}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleApprove(app._id)}
                              disabled={actionLoading === app._id}
                              className="inline-flex items-center gap-1 text-green-700 bg-green-50 px-2 py-1.5 rounded-lg hover:bg-green-100 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === app._id ? <Loader2 className="animate-spin" size={14} /> : <CheckCircle size={14} />}
                              {actionLoading === app._id ? 'Processing...' : 'Approve'}
                            </button>
                            <button
                              onClick={() => handleReject(app._id)}
                              disabled={actionLoading === app._id}
                              className="inline-flex items-center gap-1 text-red-700 bg-red-50 px-2 py-1.5 rounded-lg hover:bg-red-100 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {actionLoading === app._id ? <Loader2 className="animate-spin" size={14} /> : <XCircle size={14} />}
                              {actionLoading === app._id ? 'Processing...' : 'Reject'}
                            </button>
                            <button
                              onClick={() => setViewApp(app._id)}
                              className="inline-flex items-center gap-1.5 text-indigo-600 font-semibold bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                              <Eye size={16} /> View
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredApplications.length === 0 && (
                    <tr><td colSpan={6} className="py-12 text-center text-slate-400 font-medium">No application records found matching filters.</td></tr>
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
        role="admin"
        onApprove={async (id) => { setActionLoading(id); try { await approveApplication(id); fetchApps(); setViewApp(null); } finally { setActionLoading(null); } }}
        onReject={async (id) => { setActionLoading(id); try { await rejectApplication(id); fetchApps(); setViewApp(null); } finally { setActionLoading(null); } }}
        disabled={actionLoading !== null}
      />
    </div>
  );
}
