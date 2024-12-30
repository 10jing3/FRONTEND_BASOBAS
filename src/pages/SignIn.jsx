import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithGoogle } from "../firebase";
import axios from "axios";

const SignIn = () => {
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission for name/password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signin",
        formData
      );
      setMessage(response.data.message);
      navigate("/"); // Redirect to the Home page
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
          "Invalid credentials. Please try again."
      );
    }
  };

  // Handle Google sign-in
  const handleGoogleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      console.log("Signed in user:", user);
      navigate("/"); // Redirect to the Home page
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Sign In
        </h2>
        {message && (
          <p
            className={`text-center mb-4 ${
              message.includes("success") ? "text-green-500" : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 text-center text-gray-500">OR</div>

        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition duration-300"
        >
          Sign In with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;
