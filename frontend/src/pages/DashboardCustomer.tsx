import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FileText, Search, Clock, ArrowRight } from 'lucide-react';
import type { RootState } from '../store';
import { sanitize } from '../utils/sanitize';

export default function DashboardCustomer() {
  const { user } = useSelector((state: RootState) => state.auth);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-heading font-bold text-gray-900">
            Welcome, {sanitize(user?.name || 'User')}
          </h1>
          <p className="text-gray-600 mt-1">Access municipal services and track your applications.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/services" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
              <FileText className="text-primary-blue" size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Browse Services</h3>
            <p className="text-sm text-gray-500">View all municipal services and apply online.</p>
          </Link>

          <Link to="/services" className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
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
            <h3 className="font-semibold text-gray-900 mb-1">Recent Activity</h3>
            <p className="text-sm text-gray-500">Your recent applications and updates will appear here.</p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/services" className="inline-flex items-center gap-2 bg-primary-red text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-red-700 transition-colors">
              Apply for a Service <ArrowRight size={16} />
            </Link>
            <Link to="/services" className="inline-flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-colors">
              Track Application <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
