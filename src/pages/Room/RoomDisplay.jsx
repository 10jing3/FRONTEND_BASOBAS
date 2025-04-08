import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  const [mainImage, setMainImage] = useState(null); // Track the main image

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

  useEffect(() => {
    if (room && room.roomImages && room.roomImages.length > 0) {
      setMainImage(room.roomImages[0]); // Set the first image as the initial main image
    }
  }, [room]);

  if (loading)
    return <p className="text-center text-gray-600 mt-8">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;
  if (!room)
    return <p className="text-center text-gray-600 mt-8">Room not found.</p>;

  const {
    name,
    price,
    location,
    available,
    roomImages = [],
    description,
    coordinates,
  } = room;

  const handleRoomTour = () => {
    navigate(`/vr-room`);
  };

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          {mainImage ? (
            <div className="relative rounded-2xl overflow-hidden shadow-lg">
              <img
                src={mainImage}
                alt={name}
                className="w-full object-cover"
                style={{ height: "80vh" }}
              />
              {roomImages.length > 1 && (
                <div className="absolute bottom-4 left-4 flex space-x-2">
                  {roomImages.slice(1, 4).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${name} - ${index + 1}`}
                      className="w-20 h-20 rounded-lg object-cover shadow-md cursor-pointer"
                      onClick={() => handleThumbnailClick(image)}
                    />
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="w-full aspect-video bg-gray-200 rounded-2xl flex items-center justify-center">
              <p className="text-gray-500">No Image Available</p>
            </div>
          )}
        </div>
        <div className="md:w-1/2">
          <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
            <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
            <h1>{location}</h1>
            <p className="text-gray-600">{description}</p>

            <div className="flex justify-between items-center">
              <p className="text-xl font-semibold text-gray-800">
                ${price} <span className="text-sm text-gray-500">/ night</span>
              </p>
              <p
                className={`text-lg font-semibold ${
                  available ? "text-green-600" : "text-red-600"
                }`}
              >
                {available ? "Available" : "Not Available"}
              </p>
            </div>

            <div className="flex flex-col space-y-4">
              <button className="w-full py-3 px-6 bg-green-600 text-white rounded-xl transition-all hover:bg-green-700">
                Book Now
              </button>
              <button
                onClick={handleRoomTour}
                className="w-full py-3 px-6 bg-blue-600 text-white rounded-xl transition-all hover:bg-blue-700"
              >
                Room Tour
              </button>
            </div>
          </div>
        </div>
      </div>

      {coordinates && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Room Location
          </h2>
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            className="w-full h-96 rounded-2xl shadow-lg"
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
