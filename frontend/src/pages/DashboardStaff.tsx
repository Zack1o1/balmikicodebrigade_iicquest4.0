import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FileText, Clock, CheckCircle, TrendingUp, Search, Filter, Eye } from 'lucide-react';
import type { RootState } from '../store';
import { sanitize } from '../utils/sanitize';
import { getAllApplications } from '../api/applicationApi';
import { useNavigate } from 'react-router-dom';

export default function DashboardStaff() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [applications, setApplications] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

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

  const pendingCount = applications.filter(a => ['submitted', 'received', 'under_review'].includes(a.status)).length;
  const approvedCount = applications.filter(a => ['approved', 'ready_for_collection'].includes(a.status)).length;
  const totalCount = applications.length;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'approved':
      case 'ready_for_collection':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'rejected':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'under_review':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'submitted':
      case 'received':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusDisplay = (status: string) => {
    return status.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  // Filter and search application records safely
  const filteredApplications = applications.filter((app) => {
    const matchesSearch = 
      app.applicationId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.service?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.applicant?.lastName?.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    if (statusFilter === 'pending') return matchesSearch && ['submitted', 'received', 'under_review'].includes(app.status);
    if (statusFilter === 'approved') return matchesSearch && ['approved', 'ready_for_collection'].includes(app.status);
    return matchesSearch && app.status === statusFilter;
  });

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1">
        {/* Header Block */}
        <div className="bg-white border-b border-gray-200 px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 border-l-4 border-primary-blue pl-3">Ward Dashboard</h1>
            {/* <p className="text-sm text-gray-500 mt-1 pl-4">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} — Ward {user?.assignedWard || '0'}
            </p> */}
          </div>
          <div className="flex items-center gap-4">
            <div className="h-10 w-10 bg-primary-blue rounded-full text-white flex items-center justify-center font-bold">
              {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">{sanitize(user?.firstName || 'Staff')} {sanitize(user?.lastName || '')}</p>
              {/* <p className="text-xs text-gray-500">Ward {user?.assignedWard || '0'} • Municipality</p> */}
            </div>
          </div>
        </div>

        {/* Metric Cards Grid Container */}
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

          {/* Main Table Interface Grid Content */}
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
                      <option value="pending">All Pending</option>
                      <option value="submitted">Submitted</option>
                      <option value="under_review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
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
                       <td className="py-4 px-4 text-gray-800">{app.service?.name}</td>
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
                           {getStatusDisplay(app.status)}
                         </span>
                       </td>
                       <td className="py-4 px-4 text-right">
                         <button 
                           onClick={() => navigate(`/applications/${app._id}`)}
                           className="inline-flex items-center gap-1 text-primary-blue font-semibold bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
                         >
                           <Eye size={16} /> View
                         </button>
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
    </div>
  );
}