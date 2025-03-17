import { FaHome, FaUsers, FaBuilding, FaCog } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom"; // Import useNavigate for navigation

export default function SideNav({ setActiveSection }) {
  const location = useLocation(); // Get the current path
  const navigate = useNavigate(); // Hook to navigate

  const isUserDashboard = location.pathname.includes("/dashboard");
  const isAdminDashboard = location.pathname.includes("/admin/dashboard");

  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-green-600 p-6">
      {/* Clicking "BasoBas" navigates to "/" only if in User Dashboard */}
      <h1
        className="text-2xl font-bold mb-8 cursor-pointer"
        onClick={() => {
          if (isUserDashboard && !isAdminDashboard) {
            navigate("/"); // Navigate to home only if in the user dashboard
          }
        }}
      >
        BasoBas
      </h1>

      <nav>
        <ul className="space-y-4">
          {/* Hide "Add Room" if on Admin Dashboard */}
          {!isAdminDashboard && (
            <li>
              <button
                onClick={() => setActiveSection("dashboard")}
                className="flex items-center space-x-2 hover:text-gray-400 w-full text-left"
              >
                <FaHome className="h-6 w-6" />
                <span>Add Room</span>
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => setActiveSection("rooms")}
              className="flex items-center space-x-2 hover:text-gray-400 w-full text-left"
            >
              <FaBuilding className="h-6 w-6" />
              <span>Rooms</span>
            </button>
          </li>
          {/* Show "Users" only on Admin Dashboard */}
          {isAdminDashboard && (
            <li>
              <button
                onClick={() => setActiveSection("users")}
                className="flex items-center space-x-2 hover:text-gray-400 w-full text-left"
              >
                <FaUsers className="h-6 w-6" />
                <span>Users</span>
              </button>
            </li>
          )}
          <li>
            <button
              onClick={() => setActiveSection("profile")}
              className="flex items-center space-x-2 hover:text-gray-400 w-full text-left"
            >
              <FaCog className="h-6 w-6" />
              <span>Profile</span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
