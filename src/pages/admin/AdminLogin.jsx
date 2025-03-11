import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function AdminSignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error, userData } = useSelector((state) => state.user); // Get user role correctly

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill in all fields.");
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

      if (!res.ok || data.success === false) {
        throw new Error(data.message || "Sign-in failed.");
      }

      dispatch(signInSuccess(data));

      // Check if the user is an admin
      if (data.role === "admin") {
        navigate("/admin/dashboard"); // Redirect to the admin dashboard
      } else {
        dispatch(signInFailure({ message: "You do not have admin access." }));
        navigate("/"); // Redirect to home if not an admin
      }
    } catch (error) {
      dispatch(
        signInFailure({
          message: error.message || "Network error. Please try again.",
        })
      );
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Admin Sign In</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
      </form>

      {error && (
        <p className="text-red-700 mt-5">
          {error.message || "Unable to sign in. Please try again."}
        </p>
      )}
    </div>
  );
}
