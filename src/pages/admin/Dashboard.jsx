import { useState, useEffect } from "react";
import SideNav from "./SideNav";
import RoomList from "./RoomList";
import Users from "../../components/Users";
import Profiles from "./Profiles";
import RoomForm from "./RoomForm";
import { useSelector } from "react-redux";
import RoomMate from "./RoomMate";
import Booked from "./Booked";

export default function Dashboard() {
  const user = useSelector((state) => state.user.currentUser);
  console.log("user", user._id);
  const [rooms, setRooms] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard"); // Track active section

  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(savedRooms);
  }, []);
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <RoomList rooms={rooms} />;
      case "rooms":
        return <RoomList rooms={rooms} />;
      case "profile":
        return <Profiles />;
      case "RoomMate":
        return <RoomMate />;
      case "Booked":
        return <Booked />;
      default:
        return <h2 className="text-xl font-bold"></h2>;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar with state update function */}
      <SideNav setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-5">
        <main className="mt-4 space-y-8">{renderSection()}</main>
      </div>
    </div>
  );
}
