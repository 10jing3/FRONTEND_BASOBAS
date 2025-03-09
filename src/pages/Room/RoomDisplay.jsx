import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const SingleRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/api/room/rooms/${roomId}`);
        setRoom(response.data);
      } catch (err) {
        setError("Failed to fetch room details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading)
    return <p className="text-center text-gray-600 mt-8">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;
  if (!room)
    return <p className="text-center text-gray-600 mt-8">Room not found.</p>;

  const {
    name,
    price,
    available,
    roomImages = [],
    description,
    coordinates,
  } = room;

  const handleRoomTour = () => {
    navigate(`/vr-room`);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <div className="relative w-full h-96 rounded-xl overflow-hidden">
          {roomImages.length > 0 ? (
            <>
              <img
                src={roomImages[currentImageIndex]}
                alt={`Room Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? roomImages.length - 1 : prev - 1
                  )
                }
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaArrowLeft size={24} />
              </button>
              <button
                onClick={() =>
                  setCurrentImageIndex((prev) =>
                    prev === roomImages.length - 1 ? 0 : prev + 1
                  )
                }
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
              >
                <FaArrowRight size={24} />
              </button>
            </>
          ) : (
            <p className="text-center text-gray-500">No images available</p>
          )}
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">{name}</h1>
        <p className="text-lg text-gray-600">{description}</p>

        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold text-gray-800">
            ${price} <span className="text-base text-gray-500">/ night</span>
          </p>
          <p
            className={`text-lg font-semibold ${
              available ? "text-green-600" : "text-red-600"
            }`}
          >
            {available ? "Available" : "Not Available"}
          </p>
        </div>

        <button className="w-full py-3 px-6 bg-green-600 text-white text-lg font-medium rounded-xl transition-all hover:bg-green-700">
          Book Now
        </button>

        {/* Room Tour Button */}
        <button
          onClick={handleRoomTour}
          className="w-full py-3 px-6 bg-blue-600 text-white text-lg font-medium rounded-xl transition-all hover:bg-blue-700"
        >
          Room Tour
        </button>
      </div>

      {coordinates && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Room Location
          </h2>
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            className="w-full h-96 mt-4 rounded-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[coordinates.lat, coordinates.lng]}
              icon={customIcon}
            >
              <Popup>{name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}
    </div>
  );
};

export default SingleRoom;
