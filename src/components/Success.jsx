// Success.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FiCheckCircle } from "react-icons/fi";

const Success = () => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    const updateRoomStatus = async () => {
      try {
        const response = await fetch(
          `/api/room/update-status/${roomId}/${user._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ available: false }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update room status");
        }

        const data = await response.json();
        console.log("Room status updated:", data);
      } catch (error) {
        console.error("Error updating room status:", error);
      }
      // Delay navigation for user to see the success screen
      setTimeout(() => {
        navigate(`/room/${roomId}`);
      }, 3000);
    };
    updateRoomStatus();
  }, [roomId, user, navigate]);

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
        <div className="w-full flex flex-col items-center">
          <div className="text-green-700 text-sm mb-2">
            Redirecting to your room details...
          </div>
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
