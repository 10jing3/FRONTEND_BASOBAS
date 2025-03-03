import { FaHome, FaUsers, FaBuilding, FaCog } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SideNav({ setActiveSection }) {
  return (
    <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-green-600 p-6">
      <Link to="/" className="text-2xl font-bold mb-8">
        Room Rental
      </Link>
      <nav className=" mt-5">
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="  flex items-center space-x-2 hover:text-gray-400 w-full
            text-left"
            >
              <FaHome className="h-6 w-6" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("rooms")}
              className="flex items-center space-x-2 hover:text-gray-400 w-full text-left"
            >
              <FaBuilding className="h-6 w-6" />
              <span>Rooms</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveSection("users")}
              className="flex items-center space-x-2 hover:text-gray-400 w-full text-left"
            >
              <FaUsers className="h-6 w-6" />
              <span>Users</span>
            </button>
          </li>
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
