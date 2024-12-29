import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-blue-600 shadow-lg">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-white text-2xl font-bold">
          RoomRental
        </Link>
        <nav className="flex items-center space-x-6">
          <Link
            to="/signin"
            className="text-white px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="text-white px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-blue-600 transition"
          >
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
