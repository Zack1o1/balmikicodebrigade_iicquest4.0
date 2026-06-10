import { useSelector } from 'react-redux';
import { FileText, Users, CheckCircle, Clock } from 'lucide-react';
import type { RootState } from '../store';
import { sanitize } from '../utils/sanitize';

export default function DashboardStaff() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Staff Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Welcome, {sanitize(user?.name || 'Staff')}. Manage citizen applications.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[
            { label: 'Pending', value: '12', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
            { label: 'Approved', value: '45', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
            { label: 'Total Applications', value: '67', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-100' },
            { label: 'Citizens Served', value: '89', icon: Users, color: 'text-purple-600', bg: 'bg-purple-100' },
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

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Applications</h2>
          <p className="text-sm text-gray-500">Citizen applications requiring your review will appear here.</p>
        </div>
      </div>
    </div>
  );
}
