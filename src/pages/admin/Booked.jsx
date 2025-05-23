import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaWhatsapp,
} from "react-icons/fa";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

const UserBookedRooms = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [bookedRooms, setBookedRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser?._id) return;
    const fetchBookedRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/room/getbooked/${currentUser._id}`
        );
        setBookedRooms(response.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch booked rooms");
        toast.error(
          err.response?.data?.message || "Failed to fetch booked rooms"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookedRooms();
  }, [currentUser?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4"
          role="alert"
        >
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Your Booked Rooms
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {bookedRooms.length} {bookedRooms.length === 1 ? "room" : "rooms"}{" "}
            booked
          </p>
        </div>

        {bookedRooms.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-500">
              No rooms booked yet
            </h2>
            <p className="mt-2 text-gray-400">
              You haven't booked any rooms yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookedRooms.map((room) => (
              <div
                key={room._id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {/* Room Image */}
                <div className="h-48 relative">
                  <img
                    src={
                      room.roomImages?.[0] ||
                      "https://via.placeholder.com/400x300?text=No+Image"
                    }
                    alt={room.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                </div>

                {/* Room Details */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {room.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-2">
                    <FaMapMarkerAlt className="mr-2 text-green-600" />
                    <span>{room.location?.split(",")[0]}</span>
                  </div>

                  {/* Owner Info */}
                  <div className="mb-2">
                    <span className="block text-sm text-gray-700">
                      <span className="font-semibold">Owner:</span>{" "}
                      {room.owner?.name || room.owner?.username || "N/A"}
                    </span>
                    <span className="block text-sm text-gray-700">
                      <span className="font-semibold">Phone:</span>{" "}
                      {room.owner?.phone || "N/A"}
                      {room.owner?.phone && (
                        <a
                          href={`https://wa.me/977${room.owner.phone}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 inline-flex items-center px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition"
                          title="Chat on WhatsApp"
                        >
                          <FaWhatsapp className="mr-1" /> WhatsApp
                        </a>
                      )}
                    </span>
                  </div>

                  {/* Room Specs */}
                  <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-200 mb-4">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-green-600">
                        <FaBed className="mr-1" />
                        <span className="font-medium">
                          {room.bedrooms || "N/A"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Beds</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-green-600">
                        <FaBath className="mr-1" />
                        <span className="font-medium">
                          {room.bathrooms || "N/A"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Baths</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="flex items-center text-green-600">
                        <FaMoneyBillWave className="mr-1" />
                        <span className="font-medium">
                          Rs {room.price?.toLocaleString() || "N/A"}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">Price</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserBookedRooms;
