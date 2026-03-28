import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../features/userSlice";
import { useNavigate, Link } from "react-router-dom";
import Toast from "../components/Toast";
import axios from "axios";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [toastType, setToastType] = useState("error");
  const [validationErrors, setValidationErrors] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (error) {
      setToastType("error");
    }
  }, [error]);

  useEffect(() => {
    if (success) {
      setToastType("success");
    }
  }, [success]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationErrors({});

    // Validation
    const errors = {};
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.password.trim()) {
      errors.password = "Password is required";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/v1/users/login", formData, { withCredentials: true });
      if (res.status === 200 && res.data?.data) {
        dispatch(login(res.data.data));
        setSuccess("Login successful");
        setTimeout(() => navigate("/dashboard"), 1000); // Delay to show toast
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-black via-indigo-950 to-pink-900 flex items-center justify-center">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Login</h2>
        <Toast message={error || success} type={toastType} onClose={() => { setError(""); setSuccess(""); }} />
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70"
            />
            {validationErrors.email && <p className="text-red-300 text-sm mt-1">{validationErrors.email}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-white/20 border border-white/30 rounded-md text-white placeholder-white/70"
            />
            {validationErrors.password && <p className="text-red-300 text-sm mt-1">{validationErrors.password}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-white">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-300 border border-white/30 rounded-md text-gray-900"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/signup" className="text-white hover:text-indigo-300">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;