import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaWhatsapp,
  FaTrashAlt,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import EsewaPayment from "../../components/EsewaPayment";

const UserBookedRooms = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEsewa, setShowEsewa] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser?._id) return;
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `/api/booking/my-requests?userId=${currentUser._id}`
        );
        setBookings(response.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch bookings");
        toast.error(err.response?.data?.message || "Failed to fetch bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [currentUser?._id]);

  const handleDelete = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?"))
      return;
    try {
      await axios.delete(`/api/booking/${bookingId}`);
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
      toast.success("Booking cancelled!");
    } catch (err) {
      toast.error("Failed to cancel booking.");
    }
  };

  const handleShowEsewa = (bookingId) => {
    setShowEsewa((prev) => ({ ...prev, [bookingId]: !prev[bookingId] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-green-700 tracking-tight">
            Your Bookings
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            {bookings.length} {bookings.length === 1 ? "booking" : "bookings"}
          </p>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-500">
              No bookings yet
            </h2>
            <p className="mt-2 text-gray-400">
              You haven't booked any rooms yet.
            </p>
          </div>
        ) : (
          <ol className="space-y-8">
            {bookings.map((booking, idx) => (
              <li
                key={booking._id}
                className="bg-white rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              >
                {/* Numbering */}
                <div className="flex items-center justify-center bg-green-100 w-16 md:w-20 text-2xl font-bold text-green-600">
                  {idx + 1}
                </div>
                {/* Room Image or Removed Message */}
                {!booking.room || !booking.room._id ? (
                  <div className="flex-1 flex flex-col justify-center items-center p-8">
                    <div className="text-red-500 text-lg font-semibold mb-2">
                      Room has been removed
                    </div>
                    <button
                      className="flex items-center justify-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg transition-all hover:bg-red-700"
                      onClick={() => handleDelete(booking._id)}
                    >
                      <FaTrashAlt className="mr-2" /> Remove Booking
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Room Image */}
                    <div className="h-48 w-full md:w-64 flex-shrink-0 relative">
                      <img
                        src={
                          booking.room?.roomImages?.[0] ||
                          "https://via.placeholder.com/400x300?text=No+Image"
                        }
                        alt={booking.room?.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/400x300?text=No+Image";
                        }}
                      />
                      <span
                        className={`absolute top-2 right-2 px-3 py-1 rounded text-xs font-bold shadow ${
                          booking.status === "pending"
                            ? "bg-yellow-400 text-white"
                            : booking.status === "accepted"
                            ? "bg-green-500 text-white"
                            : "bg-red-400 text-white"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </div>

                    {/* Room Details */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                          {booking.room?.name}
                        </h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <FaMapMarkerAlt className="mr-2 text-green-600" />
                          <span>
                            {booking.room?.location?.split(" ")[0] || ""}
                          </span>
                        </div>

                        {/* Owner Info */}
                        {booking.status === "accepted" && booking.owner && (
                          <div className="mb-2">
                            <span className="block text-sm text-gray-700">
                              <span className="font-semibold">Owner:</span>{" "}
                              {booking.owner?.name ||
                                booking.owner?.username ||
                                "N/A"}
                            </span>
                            <span className="block text-sm text-gray-700">
                              <span className="font-semibold">Phone:</span>{" "}
                              {booking.owner?.phone || "N/A"}
                            </span>
                          </div>
                        )}
                        {/* If not accepted, optionally show a message */}
                        {booking.status !== "accepted" && (
                          <div className="mb-2 text-sm text-gray-400">
                            Owner contact info will be available after your
                            booking is accepted.
                          </div>
                        )}

                        {/* Room Specs */}
                        <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-200 mb-4">
                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-green-600">
                              <FaBed className="mr-1" />
                              <span className="font-medium">
                                {booking.room?.bedrooms || "N/A"}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">Beds</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-green-600">
                              <FaBath className="mr-1" />
                              <span className="font-medium">
                                {booking.room?.bathrooms || "N/A"}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">Baths</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="flex items-center text-green-600">
                              <FaMoneyBillWave className="mr-1" />
                              <span className="font-medium">
                                Rs{" "}
                                {booking.room?.price?.toLocaleString() || "N/A"}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500">Price</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col md:flex-row gap-2 mt-4">
                        <button
                          className="flex items-center justify-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg transition-all hover:bg-green-700"
                          onClick={() => navigate(`/room/${booking.room?._id}`)}
                        >
                          View Details <IoIosArrowForward className="ml-1" />
                        </button>
                        <button
                          className="flex items-center justify-center px-4 py-2 bg-red-500 text-white text-sm font-medium rounded-lg transition-all hover:bg-red-700"
                          onClick={() => handleDelete(booking._id)}
                        >
                          <FaTrashAlt className="mr-2" /> Cancel Booking
                        </button>
                        {booking.status === "accepted" &&
                          booking.owner?.phone && (
                            <>
                              <a
                                href={`https://wa.me/977${booking.owner.phone}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center px-4 py-2 bg-green-500 text-white text-sm font-medium rounded-lg transition-all hover:bg-green-600"
                                title="Chat on WhatsApp"
                                style={{ minWidth: "140px" }}
                              >
                                <FaWhatsapp className="mr-2" /> WhatsApp
                              </a>
                              {/* eSewa Button Toggle */}
                              {!showEsewa[booking._id] ? (
                                <button
                                  className="flex items-center justify-center px-4 py-2 bg-[#60bb46] text-white text-sm font-medium rounded-lg transition-all hover:bg-[#4ca233]"
                                  style={{ minWidth: "140px" }}
                                  onClick={() => handleShowEsewa(booking._id)}
                                  type="button"
                                >
                                  Pay with eSewa
                                </button>
                              ) : (
                                // Overlay for centered EsewaPayment
                                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                                  <div className="bg-white rounded-xl shadow-lg p-8 relative flex flex-col items-center">
                                    <button
                                      className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl font-bold"
                                      onClick={() =>
                                        handleShowEsewa(booking._id)
                                      }
                                      aria-label="Close"
                                      type="button"
                                    >
                                      &times;
                                    </button>
                                    <EsewaPayment
                                      amount={booking.room?.price || 100}
                                      roomId={booking.room?._id}
                                    />
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                      </div>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
};

export default UserBookedRooms;
