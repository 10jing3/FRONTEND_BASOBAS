import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaPlus } from "react-icons/fa";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  // Safely get user initials for fallback avatar
  const getUserInitials = (name) => {
    if (!name) return "UU"; // Default initials
    try {
      const parts = name.split(" ");
      return parts
        .map((part) => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();
    } catch (error) {
      return "UU";
    }
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        {/* Logo */}
        <Link to="/" aria-label="Home" className="flex items-center">
          <h1 className="text-2xl font-bold text-green-500 hover:text-green-400 transition-colors">
            BasoBas
          </h1>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to="/"
                className="hover:text-green-400 transition-colors px-3 py-2 rounded-md text-sm font-medium"
                aria-current="page"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-green-400 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/news"
                className="hover:text-green-400 transition-colors px-3 py-2 rounded-md text-sm font-medium"
              >
                News
              </Link>
            </li>

            {/* Add Room Button - Only shown when user is logged in */}
            {currentUser && (
              <li>
                <Link
                  to="/create-room"
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  <FaPlus className="text-xs" />
                  Add Room
                </Link>
              </li>
            )}

            {/* Profile/Sign In */}
            <li>
              <Link
                to={currentUser ? "/dashboard" : "/sign-in"}
                className="flex items-center gap-2 hover:text-green-400 transition-colors"
              >
                {currentUser ? (
                  <>
                    <img
                      src={
                        currentUser.profilePicture ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          getUserInitials(
                            currentUser.name || currentUser.username || "User"
                          )
                        )}&background=random`
                      }
                      alt={
                        currentUser.username
                          ? `${currentUser.username}'s profile`
                          : "User profile"
                      }
                      className="h-8 w-8 rounded-full object-cover border-2 border-green-500"
                      onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=UU&background=random`;
                      }}
                    />
                    <span className="hidden md:inline text-sm font-medium">
                      {currentUser.username?.split(" ")[0] || "User"}
                    </span>
                  </>
                ) : (
                  <span className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 transition-colors">
                    Sign In
                  </span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
