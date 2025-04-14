// Success.jsx
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useParams } from "react-router-dom";

const Success = ({ params }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const user = useSelector((state) => state.user.currentUser);
  console.log(user._id);

  console.log("Room ID:", roomId);

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
      navigate(`/room/${roomId}`);
    };
    updateRoomStatus();
  }, [roomId]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="text-lg">Your booking has been confirmed.</p>
      <p className="text-lg">Room ID: {roomId}</p>
    </div>
  );
};

export default Success;
