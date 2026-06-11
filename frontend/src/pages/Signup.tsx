import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../store/authSlice";
import type { AppDispatch, RootState } from "../store";
import { MoveLeft, Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

export default function Signup() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { user, token, loading: _loading, error: serverError } = useSelector(
    (state: RootState) => state.auth
  );

  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Though API uses name,email,pass,role - adding phone as part of real form
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required";
    else if (firstName.trim().length < 2) newErrors.firstName = "First name must be at least 2 characters";

    if (!lastName.trim()) newErrors.lastName = "Last name is required";
    
    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Please enter a valid email address";

    if (!phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required";
    else if (!/^\d{10}$/.test(phoneNumber.trim())) newErrors.phoneNumber = "Phone number must be 10 digits";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    await dispatch(
      registerUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        role: "citizen",
      })
    );
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Header and Back Link */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Link 
          to="/login" 
          className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-primary-blue transition-colors mb-6"
        >
          <MoveLeft size={16} className="mr-2" />
          Back to Login
        </Link>
        <div className="flex justify-center">
           <img src="/src/assets/logo.png" alt="Smart Palika" className="h-16 w-auto" />
        </div>
        <h2 className="mt-4 text-center text-3xl font-extrabold text-primary-blue tracking-tight">
          Create an Account
        </h2>
        <p className="mt-2 text-center text-sm text-primary-blue opacity-70">
          Join Smart Palika to access municipal services digitally
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 sm:gap-x-4">
              {/* First Name */}
              <div>
                <label className="block text-sm font-medium text-primary-blue">First Name <span className="text-red-500">*</span></label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg outline-none transition-all ${
                      errors.firstName ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 border-2' : 'border border-gray-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue'
                    }`}
                    placeholder="Enter first name"
                    value={firstName}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                      if (errors.firstName) setErrors({...errors, firstName: ''});
                    }}
                  />
                </div>
                {errors.firstName && <p className="mt-1.5 text-sm text-red-600">{errors.firstName}</p>}
              </div>

              {/* Last Name */}
              <div>
                <label className="block text-sm font-medium text-primary-blue">Last Name <span className="text-red-500">*</span></label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg outline-none transition-all ${
                      errors.lastName ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 border-2' : 'border border-gray-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue'
                    }`}
                    placeholder="Enter last name"
                    value={lastName}
                    onChange={(e) => {
                      setLastName(e.target.value);
                      if (errors.lastName) setErrors({...errors, lastName: ''});
                    }}
                  />
                </div>
                {errors.lastName && <p className="mt-1.5 text-sm text-red-600">{errors.lastName}</p>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-primary-blue">Email Address <span className="text-red-500">*</span></label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg outline-none transition-all ${
                    errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 border-2' : 'border border-gray-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue'
                  }`}
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({...errors, email: ''});
                  }}
                />
              </div>
              {errors.email && <p className="mt-1.5 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-primary-blue">Phone Number <span className="text-red-500">*</span></label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  className={`block w-full pl-10 pr-3 py-2.5 sm:text-sm rounded-lg outline-none transition-all ${
                    errors.phoneNumber ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 border-2' : 'border border-gray-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue'
                  }`}
                  placeholder="98XXXXXXXX"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                    if (errors.phoneNumber) setErrors({...errors, phoneNumber: ''});
                  }}
                />
              </div>
              {errors.phoneNumber && <p className="mt-1.5 text-sm text-red-600">{errors.phoneNumber}</p>}
            </div>
                  
            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-primary-blue">Password <span className="text-red-500">*</span></label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  className={`block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg outline-none transition-all ${
                    errors.password ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 border-2' : 'border border-gray-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue'
                  }`}
                  placeholder="Create a password (min. 6 characters)"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: ''});
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {errors.password && <p className="mt-1.5 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-primary-blue">Confirm Password <span className="text-red-500">*</span></label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  className={`block w-full pl-10 pr-10 py-2.5 sm:text-sm rounded-lg outline-none transition-all ${
                    errors.confirmPassword ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500 border-2' : 'border border-gray-300 focus:ring-2 focus:ring-primary-blue focus:border-primary-blue'
                  }`}
                  placeholder="Confirm your password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: ''});
                  }}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              {errors.confirmPassword && <p className="mt-1.5 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{serverError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || _loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-red hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading || _loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
            
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">
                    Already have an account?
                  </span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <Link to="/login" className="font-medium text-primary-blue hover:text-blue-800">
                  Log in to your account
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}