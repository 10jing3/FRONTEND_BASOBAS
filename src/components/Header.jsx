import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaSearch } from "react-icons/fa";

const Header = ({ currentUser }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your search logic here
    console.log("Searching for:", searchTerm);
  };

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
            <span className="text-slate-500">Sahand</span>
            <span className="text-slate-700">Estate</span>
          </h1>
        </Link>

        {/* Search Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-slate-100 p-3 rounded-lg flex items-center"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-24 sm:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit" className="text-slate-600">
            <FaSearch />
          </button>
        </form>

        {/* Navigation Links */}
        <ul className="flex gap-4 items-center">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-7 w-7 object-cover"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-700 hover:underline">Sign in</li>
            )}
          </Link>
        </ul>
      </div>
    </header>
  );
};

export default Header;
