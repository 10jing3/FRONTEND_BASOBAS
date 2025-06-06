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
import OwnerRoomsWithBookings from "../../components/OwnerRoomsWithBookings";
import { useLocation } from "react-router-dom";
import OwnerBookingRequests from "../Room/OwnerBookingRequests";

export default function Dashboard() {
  const location = useLocation();
  const user = useSelector((state) => state.user.currentUser);
  const [rooms, setRooms] = useState([]);
  const [activeSection, setActiveSection] = useState(
    location.state?.section || "dashboard"
  ); // Default to "dashboard" if no section is provided

  useEffect(() => {
    const savedRooms = JSON.parse(localStorage.getItem("rooms")) || [];
    setRooms(savedRooms);
  }, []);
  useEffect(() => {
    localStorage.setItem("rooms", JSON.stringify(rooms));
  }, [rooms]);
  useEffect(() => {
    if (location.state?.section) {
      setActiveSection(location.state.section);
    }
    // eslint-disable-next-line
  }, [location.state]);

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
      case "booking request":
        return <OwnerBookingRequests />;
      case "Booked Rooms":
        return <OwnerRoomsWithBookings />;
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
