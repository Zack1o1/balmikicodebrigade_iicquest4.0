import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/authSlice';
import type { AppDispatch, RootState } from '../store';

type Role = 'customer' | 'staff' | 'admin';

const ROLE_INFO: Record<Role, { label: string;  desc: string; emailHint: string }> = {
  customer: { label: 'Customer', desc: 'Access municipal services and track applications', emailHint: 'you@email.com' },
  staff: { label: 'Staff', desc: 'Manage citizen applications and approvals', emailHint: 'you@palika.gov.np' },
  admin: { label: 'Admin', desc: 'Full system administration and oversight', emailHint: 'admin@palika.gov.np' },
};

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, token, loading, error } = useSelector((state: RootState) => state.auth);

  const [role, setRole] = useState<Role>('customer');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (token && user) {
      navigate(user.role === 'admin' ? '/admin' : user.role === 'staff' ? '/staff' : '/dashboard', { replace: true });
    }
  }, [token, user, navigate]);

  useEffect(() => {
    dispatch(clearError());
  }, [role, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#06183e] via-[#01255d] to-[#120a2f] px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-bold text-white">Smart Palika</h1>
          <p className="text-gray-400 mt-2">Sign in to your account</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex border border-gray-200 rounded-xl p-1 mb-6">
            {(Object.entries(ROLE_INFO) as [Role, typeof ROLE_INFO[Role]][]).map(([key, info]) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                  role === key ? 'bg-primary-red text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="mr-1"></span>
                {info.label}
              </button>
            ))}
          </div>

          <p className="text-xs text-gray-500 text-center mb-6">{ROLE_INFO[role].desc}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={ROLE_INFO[role].emailHint}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none transition-shadow"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-blue focus:border-primary-blue outline-none transition-shadow"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email || !password}
              className={`w-full py-2.5 rounded-lg font-semibold text-white transition-colors ${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-primary-red hover:bg-red-700'
              }`}
            >
              {loading ? 'Signing in...' : `Sign in as ${ROLE_INFO[role].label}`}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            Use your registered email. Different roles use different email domains.
          </p>
        </div>
      </div>
    </div>
  );
}
