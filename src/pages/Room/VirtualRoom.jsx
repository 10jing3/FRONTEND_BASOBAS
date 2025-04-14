import React, { useEffect, useState } from "react";
import RoomTour from "./RoomTour";
import { useParams } from "react-router-dom";
import axios from "axios";

function VirtualRoom() {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/api/room/rooms/${roomId}`);
        setRoom(response.data);
      } catch (err) {
        console.error("Error fetching room:", err);
        setError("Failed to fetch room details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading) return <div>Loading virtual tour...</div>;
  if (error) return <div>{error}</div>;
  if (!room || !room.vrImages || room.vrImages.length === 0)
    return <div>No virtual images available for this room.</div>;

  return (
    <div>
      <RoomTour imageUrls={room.vrImages} />
    </div>
  );
}

export default VirtualRoom;
