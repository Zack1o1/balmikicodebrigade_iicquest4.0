import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store";

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

const handleSubmit = () => {
    //To do: Validate inputs
   
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#06183e] via-[#01255d] to-[#120a2f] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white">
            Smart Palika
          </h1>

          <p className="text-gray-300 mt-2">
            AI-Powered Citizen Service Platform
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">

          <h2 className="text-2xl font-bold text-gray-900 text-center">
            Sign In
          </h2>

          <p className="text-gray-500 text-center mt-2 mb-8">
            Citizen • Ward Staff • Municipality Admin
          </p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>

              <input
                type="email"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-700 outline-none"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <input
                type="password"
                className="w-full mt-2 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-700 outline-none"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 border border-red-200 p-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C8102E] hover:bg-red-700 text-white py-3 rounded-xl font-semibold transition"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Access services, track applications and manage municipality operations.
          </div>
        </div>
      </div>
    </div>
  );
}