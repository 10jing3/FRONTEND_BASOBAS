import {
  FaHome,
  FaUsers,
  FaBuilding,
  FaCog,
  FaDoorOpen,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdFamilyRestroom, MdDashboard, MdBookOnline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "../../redux/user/userSlice";
import { useState, useEffect } from "react";

export default function SideNav({ setActiveSection }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isUserDashboard = location.pathname.includes("/dashboard");
  const isAdminDashboard = location.pathname.includes("/admin/dashboard");

  // Set default to "rooms" so My Rooms is active at first
  const [clickedSection, setClickedSection] = useState("rooms");

  // Sync active section with URL on mount or path change
  useEffect(() => {
    if (location.pathname.toLowerCase().includes("booking request"))
      setClickedSection("booking request");
    else if (location.pathname.toLowerCase().includes("users"))
      setClickedSection("users");
    else if (location.pathname.toLowerCase().includes("room-approval"))
      setClickedSection("room-approval");
    else if (location.pathname.toLowerCase().includes("roommate"))
      setClickedSection("RoomMate");
    else if (location.pathname.toLowerCase().includes("booked rooms"))
      setClickedSection("Booked Rooms");
    else if (location.pathname.toLowerCase().includes("booked"))
      setClickedSection("Booked");
    else if (location.pathname.toLowerCase().includes("profile"))
      setClickedSection("profile");
    else setClickedSection("rooms");
  }, [location.pathname]);

  // Helper to check if a section is active (clicked or matches path)
  const isActive = (section) => {
    return clickedSection === section;
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
      navigate("/sign-in");
    } catch (error) {
      console.log(error);
    }
  };

  // Helper for button click
  const handleSectionClick = (section) => {
    setClickedSection(section);
    setActiveSection(section);
  };

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white p-6 flex flex-col">
      {/* Logo/Header Section */}
      {!isAdminDashboard && (
        <div
          className={`flex items-center space-x-3 mb-10 p-3 rounded-lg cursor-pointer transition-colors ${
            isUserDashboard ? "hover:bg-gray-700" : ""
          }`}
          onClick={() => isUserDashboard && navigate("/")}
        >
          <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
            BasoBas
          </h1>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => handleSectionClick("rooms")}
              className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                isActive("rooms")
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-green-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FaDoorOpen className="h-5 w-5" />
                <span>My Rooms</span>
              </div>
              {isActive("rooms") && (
                <span className="h-2 w-2 rounded-full bg-white"></span>
              )}
            </button>
          </li>

          <li>
            <button
              onClick={() => handleSectionClick("booking request")}
              className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                isActive("booking request")
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-green-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FaDoorOpen className="h-5 w-5" />
                <span>Booking Request</span>
              </div>
              {isActive("booking request") && (
                <span className="h-2 w-2 rounded-full bg-white"></span>
              )}
            </button>
          </li>

          {/* Admin-only Items */}
          {isAdminDashboard && (
            <li>
              <button
                onClick={() => handleSectionClick("users")}
                className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                  isActive("users")
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-green-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaUsers className="h-5 w-5" />
                  <span>Users</span>
                </div>
                {isActive("users") && (
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                )}
              </button>
            </li>
          )}

          {/* User-only Items */}
          {!isAdminDashboard && (
            <>
              <li>
                <button
                  onClick={() => handleSectionClick("RoomMate")}
                  className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                    isActive("RoomMate")
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-green-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MdFamilyRestroom className="h-5 w-5" />
                    <span>Find Roommate</span>
                  </div>
                  {isActive("RoomMate") && (
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick("Booked")}
                  className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                    isActive("Booked")
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-green-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MdBookOnline className="h-5 w-5" />
                    <span>My Bookings</span>
                  </div>
                  {isActive("Booked") && (
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                  )}
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleSectionClick("Booked Rooms")}
                  className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                    isActive("Booked Rooms")
                      ? "bg-green-600 text-white"
                      : "text-gray-300 hover:bg-green-700 hover:text-white"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MdFamilyRestroom className="h-5 w-5" />
                    <span>Booked Rooms</span>
                  </div>
                  {isActive("Booked Rooms") && (
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                  )}
                </button>
              </li>
            </>
          )}

          {!isAdminDashboard && (
            <li>
              <button
                onClick={() => handleSectionClick("profile")}
                className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                  isActive("profile")
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-green-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaCog className="h-5 w-5" />
                  <span>Profile Settings</span>
                </div>
                {isActive("profile") && (
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                )}
              </button>
            </li>
          )}

          {/* Admin-only Items */}
          {isAdminDashboard && (
            <li>
              <button
                onClick={() => handleSectionClick("room-approval")}
                className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                  isActive("room-approval")
                    ? "bg-green-600 text-white"
                    : "text-gray-300 hover:bg-green-700 hover:text-white"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <FaBuilding className="h-5 w-5" />
                  <span>Room Approval</span>
                </div>
                {isActive("room-approval") && (
                  <span className="h-2 w-2 rounded-full bg-white"></span>
                )}
              </button>
            </li>
          )}
        </ul>
      </nav>

      {/* Footer/User Section */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-green-700 hover:text-white rounded-lg transition-colors"
        >
          <FaSignOutAlt className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
