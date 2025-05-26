import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheckCircle, FiMapPin } from "react-icons/fi";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa";

const Success = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const user = useSelector((state) => state.user.currentUser);
  const [room, setRoom] = useState(null);

  // 1. Mark booking as paid after payment success
  useEffect(() => {
    const markBookingPaid = async () => {
      try {
        await fetch("/api/booking/mark-paid", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ roomId, userId: user?._id }),
        });
      } catch (err) {
        // Optionally show error or toast
        // console.error("Failed to update booking payment status:", err);
      }
    };
    if (roomId && user?._id) markBookingPaid();
  }, [roomId, user]);

  // 2. Update room status (your existing code)
  useEffect(() => {
    const updateRoomStatus = async () => {
      try {
        await fetch(`/api/room/update-status/${roomId}/${user._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ available: false }),
        });
      } catch (error) {
        console.error("Error updating room status:", error);
      }
    };
    if (roomId && user?._id) updateRoomStatus();
  }, [roomId, user]);

  // 3. Fetch room info (your existing code)
  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await fetch(`/api/room/rooms/${roomId}`);
        const data = await res.json();
        setRoom(data);
      } catch (err) {
        setRoom(null);
      }
    };
    if (roomId) fetchRoom();
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-green-100 max-w-md w-full">
        <FiCheckCircle className="text-green-500 text-6xl mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-700 mb-2 text-center">
          Your booking has been confirmed.
        </p>
        <p className="text-base text-gray-500 mb-6 text-center">
          Room ID: <span className="font-semibold text-gray-800">{roomId}</span>
        </p>
        {room ? (
          <div className="w-full bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex flex-col items-center mb-2">
              {room.roomImages && room.roomImages[0] && (
                <img
                  src={room.roomImages[0]}
                  alt={room.name}
                  className="w-32 h-24 object-cover rounded-lg shadow mb-2"
                />
              )}
              <h2 className="text-xl font-bold text-green-700 mb-1">
                {room.name}
              </h2>
              <div className="flex items-center text-gray-600 text-sm mb-1">
                <FiMapPin className="mr-1" />
                {room.location}
              </div>
            </div>
            <div className="flex justify-center gap-4 text-gray-700 text-sm">
              <span className="flex items-center">
                <FaBed className="mr-1" /> {room.bedrooms} Bed
              </span>
              <span className="flex items-center">
                <FaBath className="mr-1" /> {room.bathrooms} Bath
              </span>
              {room.size && (
                <span className="flex items-center">
                  <FaRulerCombined className="mr-1" /> {room.size} sq.ft.
                </span>
              )}
            </div>
            <div className="flex justify-center mt-2">
              <span className="text-green-700 font-bold text-lg">
                Rs {room.price}
              </span>
              <span className="text-gray-500 ml-1">/month</span>
            </div>
          </div>
        ) : (
          <div className="text-gray-400 text-center mb-6">
            Loading room information...
          </div>
        )}
        <div className="w-full flex flex-col items-center">
          <button
            onClick={() => navigate(`/room/${roomId}`)}
            className="mt-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold shadow transition"
          >
            Go to Room Details Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Success;
