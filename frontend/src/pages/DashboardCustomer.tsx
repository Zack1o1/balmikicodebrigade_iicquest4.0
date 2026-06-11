import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FileText, Search, Clock, ArrowRight, Bell, Upload, Eye, CheckCircle, AlertCircle, X } from 'lucide-react';
import type { RootState } from '../store';
import { sanitize } from '../utils/sanitize';
import { getMyApplications, uploadRequestedDocument } from '../api/applicationApi';
import { uploadFile } from '../api/uploadApi';
import { getMyActivities } from '../api/activityApi';
import { getNotifications, markAsRead } from '../api/notificationApi';
import { getServiceName } from '../utils/serviceLookup';
import { STATUS_LABELS, STATUS_COLORS } from '../constants/applicationStatus';

interface Activity {
  _id: string;
  activityType: string;
  description: string;
  createdAt: string;
  application?: { applicationId: string; status: string };
}

interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

interface Application {
  _id: string;
  applicationId: string;
  service: string;
  status: string;
  createdAt: string;
  requestedDocuments?: {
    name: string;
    remarks?: string;
    requestedAt: string;
    status: string;
    fileUrl?: string;
  }[];
}

export default function DashboardCustomer() {
  const { user } = useSelector((state: RootState) => state.auth);

  const [applications, setApplications] = useState<Application[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const [uploadModal, setUploadModal] = useState<{ open: boolean; appId: string; docName: string }>({ open: false, appId: '', docName: '' });
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [apps, acts, notifs] = await Promise.all([
          getMyApplications(),
          getMyActivities(),
          getNotifications(),
        ]);
        setApplications(apps || []);
        setActivities(acts || []);
        setNotifications(notifs || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // const pendingDocRequests = applications.filter(
  //   app => app.requestedDocuments?.some(doc => doc.status === 'PENDING')
  // );

  const allPendingDocRequests = applications.flatMap(app =>
    (app.requestedDocuments || [])
      .filter(doc => doc.status === 'PENDING')
      .map(doc => ({ ...doc, applicationId: app.applicationId, appId: app._id }))
  );

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
      setNotifications(prev =>
        prev.map(n => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadDoc = async () => {
    if (!selectedFile) return;
    setUploading(true);
    try {
      const uploadResult = await uploadFile(selectedFile);
      const fileUrl = uploadResult.fileUrl || uploadResult.url || uploadResult.path || '';
      await uploadRequestedDocument(uploadModal.appId, uploadModal.docName, fileUrl);
      setSelectedFile(null);
      const apps = await getMyApplications();
      setApplications(apps || []);
      setUploadModal({ open: false, appId: '', docName: '' });
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'APPLICATION_SUBMITTED': return <FileText className="text-blue-500" size={18} />;
      case 'DOCUMENTS_UPLOADED': return <Upload className="text-purple-500" size={18} />;
      case 'REQUESTED_DOCUMENTS_UPLOADED': return <Upload className="text-green-500" size={18} />;
      case 'PAYMENT_COMPLETED': return <CheckCircle className="text-green-500" size={18} />;
      case 'APPLICATION_APPROVED': return <CheckCircle className="text-green-600" size={18} />;
      case 'APPLICATION_REJECTED': return <AlertCircle className="text-red-500" size={18} />;
      case 'STAFF_REQUESTED_DOCUMENTS': return <AlertCircle className="text-yellow-500" size={18} />;
      default: return <Clock className="text-gray-400" size={18} />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'danger': return 'bg-red-50 border-red-200';
      default: return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Upload Modal */}
      {uploadModal.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => { setUploadModal({ open: false, appId: '', docName: '' }); setSelectedFile(null); }}>
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Upload Document</h3>
            <p className="text-sm text-gray-600 mb-4">
              Uploading: <strong>{sanitize(uploadModal.docName)}</strong> for application {uploadModal.appId}
            </p>
            <p className="text-xs text-gray-500 mb-4">Allowed files: PNG, JPG, JPEG</p>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              className="w-full border border-gray-200 rounded-lg p-2 mb-4"
              onChange={(e) => { if (e.target.files?.[0]) setSelectedFile(e.target.files[0]); }}
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => { setUploadModal({ open: false, appId: '', docName: '' }); setSelectedFile(null); }}
                className="px-4 py-2 rounded border text-gray-700 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadDoc}
                disabled={uploading || !selectedFile}
                className="px-4 py-2 rounded bg-primary-blue text-white text-sm disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-heading font-bold text-gray-900">
                Welcome, {sanitize(user?.firstName || '')} {sanitize(user?.lastName || 'User')}
              </h1>
              <p className="text-gray-600 mt-1">Access municipal services and track your applications.</p>
            </div>
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell size={24} className="text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 max-h-96 overflow-y-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">Notifications</h3>
                    <button onClick={() => setShowNotifications(false)} className="p-1 hover:bg-gray-100 rounded">
                      <X size={16} />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-gray-400 text-sm">No notifications yet.</div>
                  ) : (
                    <div className="divide-y divide-gray-50">
                      {notifications.map((notif) => (
                        <div
                          key={notif._id}
                          className={`p-4 border-l-4 ${getNotificationColor(notif.type)} ${!notif.isRead ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                          onClick={() => handleMarkAsRead(notif._id)}
                        >
                          <h4 className="text-sm font-semibold text-gray-900">{notif.title}</h4>
                          <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {new Date(notif.createdAt).toLocaleDateString('en-US', {
                              month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link to="/services" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-primary-blue" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Browse Services</h3>
            <p className="text-sm text-gray-500">View all municipal services and apply online.</p>
          </Link>

          <Link to="/track-application" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Search className="text-green-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Track Application</h3>
            <p className="text-sm text-gray-500">Check the status of your submitted applications.</p>
          </Link>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="text-purple-600" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">
              {applications.length > 0 ? `${applications.length} Applications` : 'Recent Activity'}
            </h3>
            <p className="text-sm text-gray-500">
              {applications.filter(a => a.status === 'PENDING' || a.status === 'DOCUMENT_REQUESTED').length} pending
            </p>
          </div>
        </div>

        {/* Pending Document Requests */}
        {allPendingDocRequests.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-yellow-200 p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="text-yellow-600" size={20} />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Pending Document Requests ({allPendingDocRequests.length})
              </h2>
            </div>
            <div className="space-y-4">
              {allPendingDocRequests.map((doc, idx) => (
                <div key={idx} className="flex items-center justify-between bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      Application: <span className="text-primary-blue">{doc.applicationId}</span>
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Document: <strong>{doc.name}</strong>
                    </p>
                    {doc.remarks && (
                      <p className="text-xs text-gray-500 mt-1">Staff Remarks: {sanitize(doc.remarks)}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      Requested: {new Date(doc.requestedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadModal({ open: true, appId: doc.appId, docName: doc.name })}
                    className="inline-flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-yellow-700 transition-colors"
                  >
                    <Upload size={16} /> Upload
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Activity Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
          {loading ? (
            <div className="text-center py-6 text-gray-400">Loading activities...</div>
          ) : activities.length === 0 ? (
            <div className="text-center py-6">
              <Clock className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400">No recent activities yet.</p>
              <p className="text-xs text-gray-300 mt-1">Activities will appear here when you submit an application.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.slice(0, 10).map((activity) => (
                <div key={activity._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="mt-1">{getActivityIcon(activity.activityType)}</div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-800">{activity.description}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(activity.createdAt).toLocaleDateString('en-US', {
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* My Applications */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Applications</h2>
          {applications.length === 0 ? (
            <div className="text-center py-6">
              <FileText className="mx-auto text-gray-300 mb-2" size={32} />
              <p className="text-gray-400">No applications submitted yet.</p>
              <Link to="/services" className="inline-block mt-3 text-primary-blue text-sm font-medium hover:underline">
                Apply for a Service
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 text-gray-500 text-xs font-semibold tracking-wider">
                    <th className="pb-3 px-2 uppercase">App. ID</th>
                    <th className="pb-3 px-2 uppercase">Service</th>
                    <th className="pb-3 px-2 uppercase">Date</th>
                    <th className="pb-3 px-2 uppercase">Status</th>
                    <th className="pb-3 px-2 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {applications.map((app) => (
                    <tr key={app._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                      <td className="py-3 px-2 font-semibold text-primary-blue">{app.applicationId}</td>
                      <td className="py-3 px-2 text-gray-800">{getServiceName(app.service)}</td>
                      <td className="py-3 px-2 text-gray-600 whitespace-nowrap">
                        {new Date(app.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[app.status as keyof typeof STATUS_COLORS] || 'bg-gray-100 text-gray-700'}`}>
                          {STATUS_LABELS[app.status as keyof typeof STATUS_LABELS] || app.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link
                          to="/track-application"
                          className="inline-flex items-center gap-1 text-primary-blue bg-blue-50 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-100 transition-colors"
                        >
                          <Eye size={14} /> Track
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/services" className="inline-flex items-center gap-2 bg-primary-red text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors">
              Apply for a Service <ArrowRight size={16} />
            </Link>
            <Link to="/track-application" className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
              Track Application <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
