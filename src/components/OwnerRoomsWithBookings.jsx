import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const OwnerRoomsWithBookings = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Remove a single booking by booking ID
  const handleRemoveBooking = async (roomId, bookingId) => {
    if (!window.confirm("Are you sure you want to remove this booking?"))
      return;
    try {
      await axios.patch(`/api/room/remove-booking/${bookingId}`);
      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? {
                ...room,
                bookings: room.bookings.filter((b) => b._id !== bookingId),
              }
            : room
        )
      );
    } catch (err) {
      alert("Failed to remove booking.");
    }
  };

  // Mark booking as paid and set room available to false
  const handleMarkPaid = async (roomId, bookingId) => {
    try {
      await axios.patch(`/api/booking/mark-paid/${bookingId}`, { roomId });
      setRooms((prev) =>
        prev.map((room) =>
          room._id === roomId
            ? {
                ...room,
                available: false,
                bookings: room.bookings.map((b) =>
                  b._id === bookingId ? { ...b, paymentStatus: "paid" } : b
                ),
              }
            : room
        )
      );
    } catch (err) {
      alert("Failed to mark as paid.");
    }
  };

  useEffect(() => {
    if (!currentUser?._id) return;
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/booking/owned/accepted/${currentUser._id}`
        );
        setRooms(
          (response.data.data || []).filter((room) => !!room && !!room._id)
        );
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch your rooms");
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [currentUser?._id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-500 border-b-4 border-gray-200"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
          role="alert"
        >
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Your Rooms & Bookings
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            See who has booked your rooms.
          </p>
        </div>
        {rooms.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-500">
              You haven't listed any rooms yet.
            </h2>
            <p className="mt-2 text-gray-400">
              Once you add a room, it will appear here along with its booking
              details.
            </p>
            <a
              href="/create-room"
              className="inline-block mt-6 bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              + Add Your First Room
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {rooms
              .filter((room) => !!room && !!room._id)
              .map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:space-x-6">
                    <img
                      src={
                        room.roomImages?.[0] ||
                        "https://via.placeholder.com/200x150?text=No+Image"
                      }
                      alt={room.name}
                      className="w-full md:w-48 h-32 object-cover rounded mb-4 md:mb-0"
                    />
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-gray-900 mb-1">
                        {room.name}
                      </h2>
                      <div className="text-gray-600 mb-2">{room.category}</div>
                      <div className="text-gray-500 mb-2">{room.location}</div>
                      <div className="mb-2">
                        <span className="font-semibold">Price:</span> Rs{" "}
                        {room.price?.toLocaleString() || "N/A"}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Size:</span>{" "}
                        {room.size || "N/A"} sq.ft.
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Available:</span>{" "}
                        {room.available === false ? (
                          <span className="text-red-600 font-semibold">No</span>
                        ) : (
                          <span className="text-green-600 font-semibold">
                            Yes
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-semibold mb-2 text-green-700">
                      Booked By (Accepted):
                    </h3>
                    {room.bookings && room.bookings.length > 0 ? (
                      room.bookings.map((booking) => (
                        <div
                          key={booking._id}
                          className="flex items-center bg-green-50 rounded px-3 py-2 mb-2"
                        >
                          <img
                            src={
                              booking.user.profilePicture ||
                              "https://ui-avatars.com/api/?name=" +
                                encodeURIComponent(
                                  booking.user.name ||
                                    booking.user.username ||
                                    "User"
                                )
                            }
                            alt={
                              booking.user.name ||
                              booking.user.username ||
                              "User"
                            }
                            className="w-10 h-10 rounded-full mr-3 border"
                          />
                          <div>
                            <div className="font-medium text-gray-900">
                              {booking.user.name ||
                                booking.user.username ||
                                booking.user.email ||
                                "N/A"}
                            </div>
                            <div className="text-gray-600 text-sm">
                              {booking.user.email}
                            </div>
                            <div className="text-gray-600 text-sm">
                              {booking.user.phone}
                            </div>
                            {/* Payment Status */}
                            <div className="mt-1 text-sm">
                              <span className="font-semibold">
                                Payment Status:
                              </span>{" "}
                              <span
                                className={
                                  booking.paymentStatus === "paid"
                                    ? "text-green-600 font-bold"
                                    : booking.paymentStatus === "cancelled"
                                    ? "text-red-600 font-bold"
                                    : "text-yellow-600 font-semibold"
                                }
                              >
                                {booking.paymentStatus
                                  ? booking.paymentStatus
                                      .charAt(0)
                                      .toUpperCase() +
                                    booking.paymentStatus.slice(1)
                                  : "N/A"}
                              </span>
                            </div>
                            {/* Paid button */}
                            {booking.paymentStatus !== "paid" && (
                              <button
                                onClick={() =>
                                  handleMarkPaid(room._id, booking._id)
                                }
                                className="mt-2 mr-2 px-3 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700 transition"
                              >
                                Mark as Paid
                              </button>
                            )}
                            {/* Remove button for this booking */}
                            <button
                              onClick={() =>
                                handleRemoveBooking(room._id, booking._id)
                              }
                              className="mt-2 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-400">
                        No one has booked this room yet.
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerRoomsWithBookings;
