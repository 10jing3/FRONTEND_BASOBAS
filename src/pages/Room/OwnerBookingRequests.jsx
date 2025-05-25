import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const OwnerBookingRequests = () => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const ownerId = currentUser?._id;
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!ownerId) return;
    axios
      .get(`/api/booking/owner-requests?ownerId=${ownerId}`)
      .then((res) => setRequests(res.data));
  }, [ownerId]);

  const handleAccept = async (id) => {
    try {
      await axios.post(`/api/booking/accept/${id}`, { ownerId });
      toast.success("Booking accepted!");
      setRequests(requests.filter((r) => r._id !== id));
    } catch (err) {
      toast.error("Failed to accept booking.");
    }
  };

  const handleDecline = async (id) => {
    try {
      await axios.post(`/api/booking/decline/${id}`, { ownerId });
      toast.info("Booking declined.");
      setRequests(requests.filter((r) => r._id !== id));
    } catch (err) {
      toast.error("Failed to decline booking.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Pending Booking Requests
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Review and manage booking requests for your rooms.
          </p>
        </div>
        {requests.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium text-gray-500">
              No pending requests.
            </h2>
          </div>
        ) : (
          <div className="space-y-8">
            {requests.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-xl shadow-md p-6 border border-gray-100"
              >
                <div className="flex flex-col md:flex-row md:items-start md:space-x-6">
                  {/* Room Images */}
                  <div className="flex flex-col gap-2 mb-4 md:mb-0">
                    {req.room?.roomImages && req.room.roomImages.length > 0 ? (
                      req.room.roomImages
                        .slice(0, 3)
                        .map((img, idx) => (
                          <img
                            key={idx}
                            src={img}
                            alt={`Room ${idx + 1}`}
                            className="w-32 h-24 object-cover rounded border"
                          />
                        ))
                    ) : (
                      <img
                        src="https://via.placeholder.com/128x96?text=No+Image"
                        alt="No Room"
                        className="w-32 h-24 object-cover rounded border"
                      />
                    )}
                  </div>
                  {/* Room & User Info */}
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                      {req.room?.name || "Room"}
                    </h2>
                    <div className="text-gray-600 mb-2">
                      {req.room?.location}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Price:</span>{" "}
                      {req.room?.price ? `Rs. ${req.room.price}` : "N/A"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Category:</span>{" "}
                      {req.room?.category}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Size:</span>{" "}
                      {req.room?.size || "N/A"} sq.ft.
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Bedrooms:</span>{" "}
                      {req.room?.bedrooms}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Bathrooms:</span>{" "}
                      {req.room?.bathrooms}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Kitchen:</span>{" "}
                      {req.room?.kitchen}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Faced:</span>{" "}
                      {req.room?.faced}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Parking:</span>{" "}
                      {req.room?.parking}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Balcony:</span>{" "}
                      {req.room?.balcony}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Amenities:</span>{" "}
                      {req.room?.amenities?.length > 0
                        ? req.room.amenities.join(", ")
                        : "N/A"}
                    </div>
                    <div className="mb-2">
                      <span className="font-semibold">Description:</span>{" "}
                      {req.room?.description}
                    </div>

                    {/* User Info */}
                    <div className="flex items-center mt-4 bg-green-50 rounded px-3 py-2">
                      <img
                        src={
                          req.user?.profilePicture ||
                          "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(
                              req.user?.name ||
                                req.user?.username ||
                                req.user?.email ||
                                "User"
                            )
                        }
                        alt={req.user?.name || req.user?.username || "User"}
                        className="w-10 h-10 rounded-full mr-3 border"
                      />
                      <div>
                        <div className="font-medium text-gray-900">
                          {req.user?.name ||
                            req.user?.username ||
                            req.user?.email ||
                            "N/A"}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {req.user?.email}
                        </div>
                        <div className="text-gray-600 text-sm">
                          {req.user?.phone}
                        </div>
                        <div className="text-gray-600 text-sm">
                          Age: {req.user?.age || "N/A"}
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Actions */}
                  <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:ml-6">
                    <button
                      onClick={() => handleAccept(req._id)}
                      className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => handleDecline(req._id)}
                      className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition"
                    >
                      Decline
                    </button>
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

export default OwnerBookingRequests;
