import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
import toast from "react-hot-toast";

export default function SignIn() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [email, setEmail] = useState(""); // For forgot password modal
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { loading: authLoading, error } = useSelector((state) => state.user);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      dispatch(signInFailure({ message: "Please fill in all fields." }));
      return;
    }

    try {
      dispatch(signInStart());

      const res = await fetch(`/api/auth/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(
          signInFailure({ message: data.message || "Invalid credentials." })
        );
        setFormData((prev) => ({ ...prev, password: "" }));
        return;
      }

      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure({ message: "Network error. Please try again." }));
    }
  };

  const handleShowForgotPassword = () => {
    setShowModal(true);
    setMessage("");
    setEmail("");
  };
  const handleCloseForgotPassword = () => setShowModal(false);

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setMessage("Please enter your email.");
      toast.error("Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage("A password reset link has been sent to your email.");
        toast.success("Link sent!");
      } else {
        setMessage(result.message || "Failed to send reset link.");
      }
    } catch (error) {
      setMessage("Error sending reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          value={formData.email}
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          value={formData.password}
          onChange={handleChange}
        />
        <button
          disabled={authLoading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {authLoading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>

      <div className="flex flex-col sm:flex-row justify-between items-center mt-5 gap-3">
        <p>
          Don’t have an account?{" "}
          <Link to="/sign-up" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
        <span
          onClick={handleShowForgotPassword}
          className="text-blue-600 hover:underline cursor-pointer"
        >
          Forgot Password?
        </span>
      </div>

      {error && <p className="text-red-700 mt-5">{error.message}</p>}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 relative">
            {/* Close Button */}
            <button
              onClick={handleCloseForgotPassword}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>

            {/* Title */}
            <h2 className="text-xl font-semibold mb-4 text-center">
              Reset Your Password
            </h2>

            {/* Form */}
            <form onSubmit={handleForgotPasswordSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="forgotPasswordEmail"
                  className="block text-sm font-medium mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {message && (
                <div
                  className={`mb-4 px-4 py-2 rounded-md text-sm font-medium ${
                    message.toLowerCase().includes("error") ||
                    message.toLowerCase().includes("fail")
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-60"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
