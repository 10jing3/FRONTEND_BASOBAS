import { useState, useEffect } from "react";
import SideNav from "./SideNav";
import RoomList from "./RoomList";
import Users from "../../components/Users";
import Profiles from "./Profiles";
import { useSelector } from "react-redux";

function AdminDashboard() {
  const user = useSelector((state) => state.user.currentUser);
  console.log("user", user._id);
  const [rooms, setRooms] = useState([]);
  const [activeSection, setActiveSection] = useState("rooms"); // Default to "rooms" instead of "dashboard"

  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(savedRooms);
  }, []);

  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  const renderSection = () => {
    switch (activeSection) {
      case "rooms":
        return <RoomList rooms={rooms} />;
      case "users":
        return <Users />;
      case "profile":
        return <Profiles />;
      default:
        return (
          <h2 className="text-xl font-bold">Welcome to the Admin Panel</h2>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Users</h2>
            <p>Manage user accounts and roles.</p>
            <a href="/admin/users" className="text-blue-500 hover:underline">
              View Users
            </a>
          </div>

          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Listings</h2>
            <p>Approve or reject property listings.</p>
            <a href="/admin/listings" className="text-blue-500 hover:underline">
              View Listings
            </a>
          </div>

          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Payments</h2>
            <p>View and manage payment transactions.</p>
            <a href="/admin/payments" className="text-blue-500 hover:underline">
              View Payments
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
