import { FaHome, FaUsers, FaBuilding, FaCog, FaDoorOpen } from "react-icons/fa";
import { MdFamilyRestroom, MdDashboard, MdBookOnline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { signOut } from "../../redux/user/userSlice";

export default function SideNav({ setActiveSection }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isUserDashboard = location.pathname.includes("/dashboard");
  const isAdminDashboard = location.pathname.includes("/admin/dashboard");

  // Active section based on current path or state
  const isActive = (section) => {
    return location.pathname.includes(section.toLowerCase());
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
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
              onClick={() => setActiveSection("rooms")}
              className={`flex items-center justify-between w-full text-left p-3 rounded-lg transition-colors ${
                isActive("rooms")
                  ? "bg-green-600 text-white"
                  : "text-gray-300 hover:bg-green-700 hover:text-white"
              }`}
            >
              <div className="flex items-center space-x-3">
                <FaDoorOpen className="h-5 w-5" />
                <span>Rooms</span>
              </div>
              {isActive("rooms") && (
                <span className="h-2 w-2 rounded-full bg-white"></span>
              )}
            </button>
          </li>

          {/* Admin-only Items */}
          {isAdminDashboard && (
            <li>
              <button
                onClick={() => setActiveSection("users")}
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
                  onClick={() => setActiveSection("RoomMate")}
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
                  onClick={() => setActiveSection("Booked")}
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
            </>
          )}

          {!isAdminDashboard && (
            <li>
              <button
                onClick={() => setActiveSection("profile")}
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
        </ul>
      </nav>

      {/* Footer/User Section */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 p-3 text-gray-300 hover:bg-green-700 hover:text-white rounded-lg transition-colors"
        >
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
