import { useSelector } from 'react-redux';
import { Building2, Users, FileText, Settings, Activity } from 'lucide-react';
import type { RootState } from '../store';
import { sanitize } from '../utils/sanitize';

export default function DashboardAdmin() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-1">System oversight for {sanitize(user?.name || 'Admin')}.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Total Users', value: '1,247', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Municipalities', value: '12', icon: Building2, color: 'text-purple-600', bg: 'bg-purple-100' },
            { label: 'Applications', value: '3,892', icon: FileText, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'System Health', value: '98%', icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={stat.color} size={20} />
                </div>
              </div>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Settings className="text-gray-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">System Settings</h2>
            </div>
            <p className="text-sm text-gray-500">Configure municipality settings, service categories, and user permissions.</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <Users className="text-gray-600" size={20} />
              <h2 className="text-lg font-semibold text-gray-900">User Management</h2>
            </div>
            <p className="text-sm text-gray-500">Manage staff accounts, roles, and system access permissions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
