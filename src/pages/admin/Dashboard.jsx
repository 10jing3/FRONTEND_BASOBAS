import { useState, useEffect } from "react";
import SideNav from "./SideNav";

import RoomList from "./RoomList";

import Users from "../../components/Users";
import Profiles from "./Profiles";
import RoomForm from "./RoomForm";

export default function Dashboard() {
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
        return (
          <>
            <RoomForm />
            <RoomList rooms={rooms} />
          </>
        );
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
    <div className="flex">
      {/* Sidebar with state update function */}
      <SideNav setActiveSection={setActiveSection} />

      {/* Main Content */}
      <div className="ml-64 flex-1 p-8">
        <main className="mt-16 space-y-8">{renderSection()}</main>
      </div>
    </div>
  );
}
