import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store";
import logo from "../assets/logo.png";

export default function Login() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, token, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (token && user) {
      // PERSISTING TOKEN: Ensures the axios wrapper can grab it on dashboard refresh
      localStorage.setItem("token", token);

      switch (user.role) {
        case "admin":
          navigate("/admin", { replace: true });
          break;
        case "ward":
          navigate("/staff", { replace: true });
          break;
        default:
          navigate("/dashboard", { replace: true });
      }
    }
  }, [token, user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">
            Smart Palika
          </h1>
          <p className="text-slate-500 mt-2 text-sm">
            AI-Powered Citizen Service Platform
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-8">
          <img src={logo} alt="Smart Palika Logo" className="w-24 h-16 mx-auto mb-6 object-contain" />
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-6">
            Sign In
          </h2>
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="email"
                required
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                className="w-full mt-2 px-4 py-3 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-sm font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8102E] hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition shadow-sm flex items-center justify-center"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-slate-400 leading-relaxed">
            Access municipal services, track submissions, and oversee structural city administration settings tasks.
          </div>
        </div>
      </div>
    </div>
  );
}