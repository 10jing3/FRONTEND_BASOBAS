import { useState, useEffect } from "react";
import SideNav from "./SideNav";
import RoomList from "./RoomList";
import Users from "../../components/Users";
import Profiles from "./Profiles";
import { useSelector } from "react-redux";
import { list } from "firebase/storage";

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

  const selection_list = ["rooms", "user", "profile"];

  const renderSection = () => {
    switch (activeSection) {
      case "rooms":
        return <RoomList rooms={rooms} />;
      case "users":
        return <Users />;
      default:
        return (
          <h2 className="text-xl font-bold">Welcome to the Admin Panel</h2>
        );
    }
  };

  return (
    <div className="flex">
      {/* Sidebar without "dashboard" */}
      <SideNav setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <main className="mt-16 space-y-8">{renderSection()}</main>
      </div>
    </div>
  );
}

export default AdminDashboard;
