import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* Left Side: Hero Section */}
      <div className="w-2/3 bg-blue-500 text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-5xl font-bold mb-4">Welcome to Basobas</h1>
        <p className="text-lg mb-6">
          Find your perfect rental or list your room effortlessly.
        </p>
        <button
          onClick={handleSignUp}
          className="bg-white text-blue-500 px-6 py-3 rounded hover:bg-gray-200 font-semibold"
        >
          Get Started
        </button>
      </div>

      {/* Right Side: Sign Up and Login Options */}
      <div className="w-1/3 bg-white flex flex-col justify-center items-center p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Get Started</h2>
        <button
          onClick={handleSignUp}
          className="w-full bg-blue-500 text-white py-3 rounded mb-4 hover:bg-blue-600 font-semibold"
        >
          Sign Up
        </button>
        <button
          onClick={handleLogin}
          className="w-full bg-gray-100 text-blue-500 py-3 rounded hover:bg-gray-200 font-semibold"
        >
          Log In
        </button>
      </div>
    </div>
  );
};

export default LandingPage;
