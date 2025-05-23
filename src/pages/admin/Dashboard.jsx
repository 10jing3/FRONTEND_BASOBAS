import { useState, useEffect } from "react";
import SideNav from "./SideNav";
import RoomList from "./RoomList";
import Users from "../../components/Users";
import Profiles from "./Profiles";
import RoomForm from "./RoomForm";
import { useSelector } from "react-redux";
import RoomMate from "./RoomMate";
import Booked from "./Booked";
import { toast } from "react-toastify";

export default function Dashboard() {
  const user = useSelector((state) => state.user.currentUser);
  const [rooms, setRooms] = useState([]);
  const [activeSection, setActiveSection] = useState("dashboard"); // Track active section

  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(savedRooms);
  }, []);
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);

  // Check for roommate preference and phone before showing RoomMate
  useEffect(() => {
    if (activeSection === "RoomMate") {
      if (
        !user?.preferredRoommateGender ||
        !user?.budget ||
        !user?.age ||
        !user?.cleanliness ||
        typeof user.isSmoker !== "boolean" ||
        typeof user.isPetFriendly !== "boolean" ||
        !user?.phone
      ) {
        toast.error(
          "Please complete your roommate preferences and phone number in your profile before matching.",
          { position: "top-center", autoClose: 4000 }
        );
        setActiveSection("profile");
      }
    }
  }, [activeSection, user]);

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
      <div className="ml-64 flex-1 p-2">
        <main className=" space-y-8">{renderSection()}</main>
      </div>
    </div>
  );
}
