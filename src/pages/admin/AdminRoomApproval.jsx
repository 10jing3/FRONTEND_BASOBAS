import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Rotate3D,
  BedDouble,
  Bath,
  Ruler,
  ParkingCircle,
  Users,
  Building2,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  Mail,
  Phone,
  User2,
} from "lucide-react";

const AdminRoomApproval = () => {
  const queryClient = useQueryClient();
  const [expandedRoomId, setExpandedRoomId] = useState(null);
  const [owners, setOwners] = useState({});
  const [previewImg, setPreviewImg] = useState(null);
  const navigate = useNavigate();

  // Fetch pending rooms
  const { data, isLoading, error } = useQuery({
    queryKey: ["pendingRooms"],
    queryFn: async () => {
      const { data } = await axios.get("/api/room/pending");
      return Array.isArray(data) ? data : data?.rooms || [];
    },
  });

  // Fetch owner details for all rooms
  useEffect(() => {
    const fetchOwners = async () => {
      if (!data || !Array.isArray(data)) return;
      const uniqueOwnerIds = [
        ...new Set(
          data.map((room) =>
            room.owner && room.owner._id ? room.owner._id : room.owner
          )
        ),
      ];
      const ownerDetails = {};
      await Promise.all(
        uniqueOwnerIds.map(async (ownerId) => {
          if (!ownerId) return;
          try {
            // Adjust this endpoint to your actual user API
            const res = await axios.get(`/api/user/getbyid/${ownerId}`);
            ownerDetails[ownerId] = res.data;
          } catch {
            ownerDetails[ownerId] = null;
          }
        })
      );
      setOwners(ownerDetails);
    };
    fetchOwners();
  }, [data]);

  // Approve mutation
  const approveMutation = useMutation({
    mutationFn: async (id) => {
      await axios.patch(`/api/room/approve/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingRooms"]);
    },
  });

  // Reject mutation
  const rejectMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/room/reject/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["pendingRooms"]);
    },
  });

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  if (error)
    return (
      <div className="p-8 text-center text-red-600 font-semibold">
        Error loading rooms.
      </div>
    );

  const rooms = Array.isArray(data) ? data : [];

  // Handler for virtual room tour
  const handleRoomTour = (roomId) => {
    navigate(`/vr-room/${roomId}`);
  };

  // Helper to get owner info
  const getOwnerInfo = (owner) => {
    // If room.owner is a populated object
    if (owner && typeof owner === "object") return owner;
    // Else, look up from fetched owners
    return owners[owner] || {};
  };

  return (
    <div className="max-w-6xl mx-auto py-3 px-4">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-green-700 tracking-tight flex items-center justify-center gap-3">
        <Building2 className="w-10 h-10 text-green-600" />
        Pending Room Approvals
      </h1>
      {rooms.length === 0 ? (
        <div className="text-center text-gray-400 text-lg font-medium">
          No pending rooms at the moment.
        </div>
      ) : (
        <div className="space-y-8">
          {rooms.map((room, idx) => {
            const ownerInfo = getOwnerInfo(room.owner);
            return (
              <div
                key={room._id}
                className="bg-white shadow-lg rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:space-x-8 border border-gray-100 hover:shadow-2xl transition"
              >
                {/* Numbering */}
                <div className="flex flex-col items-center mr-6">
                  <span className="text-2xl font-bold text-green-600">
                    {idx + 1}.
                  </span>
                </div>
                <div className="flex-shrink-0 w-full md:w-56">
                  <img
                    src={
                      room.roomImages?.[0] ||
                      "https://via.placeholder.com/300x200?text=No+Image"
                    }
                    alt={room.name}
                    className="w-full h-40 object-cover rounded-xl border cursor-pointer transition-transform hover:scale-105"
                    onClick={() => setPreviewImg(room.roomImages?.[0])}
                  />
                </div>
                <div className="flex-1 mt-4 md:mt-0">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                      <Eye className="w-6 h-6 text-green-500" />
                      {room.name}
                    </h2>
                    <span className="inline-block mt-2 md:mt-0 bg-green-100 text-green-700 text-lg font-semibold px-4 py-1 rounded-full">
                      Rs {room.price}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-gray-600 text-sm">
                    <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Building2 className="w-4 h-4" /> {room.category}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <MapPin className="w-4 h-4" /> {room.location}
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Ruler className="w-4 h-4" /> {room.size} sq.ft
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <BedDouble className="w-4 h-4" /> {room.bedrooms} Bed
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <Bath className="w-4 h-4" /> {room.bathrooms} Bath
                    </span>
                    <span className="bg-gray-100 px-3 py-1 rounded-full flex items-center gap-1">
                      <ParkingCircle className="w-4 h-4" /> {room.parking}
                    </span>
                  </div>
                  <div className="mt-3 text-gray-700">{room.description}</div>
                  <div className="mt-2 text-xs text-gray-400 flex flex-col gap-1">
                    <span className="flex items-center gap-1">
                      <User2 className="w-4 h-4" />
                      Username:{" "}
                      <span className="font-medium text-gray-700">
                        {ownerInfo.username || ownerInfo.name || "N/A"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Mail className="w-4 h-4" />
                      Email:{" "}
                      <span className="font-medium text-gray-700">
                        {ownerInfo.email || "N/A"}
                      </span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-4 h-4" />
                      Phone:{" "}
                      <span className="font-medium text-gray-700">
                        {ownerInfo.phone || "N/A"}
                      </span>
                    </span>
                  </div>
                  <button
                    className="text-blue-600 underline mt-2 text-sm font-medium flex items-center gap-1"
                    onClick={() =>
                      setExpandedRoomId(
                        expandedRoomId === room._id ? null : room._id
                      )
                    }
                  >
                    <Eye className="w-4 h-4" />
                    {expandedRoomId === room._id
                      ? "Hide Details"
                      : "View Details"}
                  </button>
                  {expandedRoomId === room._id && (
                    <div className="mt-4 bg-gray-50 rounded-xl p-5 text-sm border">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                        <div>
                          <strong>Faced:</strong> {room.faced}
                        </div>
                        <div>
                          <strong>Parking:</strong> {room.parking}
                        </div>
                        <div>
                          <strong>Balcony:</strong> {room.balcony}
                        </div>
                        <div>
                          <strong>Amenities:</strong>{" "}
                          {room.amenities && room.amenities.length > 0
                            ? room.amenities.join(", ")
                            : "None"}
                        </div>
                        <div>
                          <strong>Coordinates:</strong>{" "}
                          {room.coordinates
                            ? `Lat: ${room.coordinates.lat}, Lng: ${room.coordinates.lng}`
                            : "N/A"}
                        </div>
                        <div>
                          <strong>Status:</strong> {room.status}
                        </div>
                        <div>
                          <strong>Created At:</strong>{" "}
                          {room.createdAt
                            ? new Date(room.createdAt).toLocaleString()
                            : "N/A"}
                        </div>
                      </div>
                      <div className="mt-4">
                        <strong>Images:</strong>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {room.roomImages && room.roomImages.length > 0
                            ? room.roomImages.map((img, idx) => (
                                <img
                                  key={idx}
                                  src={img}
                                  alt={`Room ${idx + 1}`}
                                  className="w-28 h-20 object-cover rounded border cursor-pointer transition-transform hover:scale-110"
                                  onClick={() => setPreviewImg(img)}
                                />
                              ))
                            : "No Images"}
                        </div>
                      </div>
                      <div className="mt-4">
                        <strong>Virtual Room Tour:</strong>
                        {room.vrImages && room.vrImages[0] ? (
                          <button
                            onClick={() => handleRoomTour(room._id)}
                            className="inline-flex items-center justify-center p-2 bg-indigo-500 text-white rounded-full transition-colors duration-200 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 shadow-md hover:shadow-lg cursor-pointer ml-2"
                          >
                            <Rotate3D size={24} />
                            <span className="ml-2">Watch Tour</span>
                          </button>
                        ) : (
                          <span className="inline-flex items-center ml-2 text-gray-400">
                            <Rotate3D size={24} className="mr-1" />
                            Virtual Room Tour Unavailable
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => approveMutation.mutate(room._id)}
                      disabled={approveMutation.isLoading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      {approveMutation.isLoading ? "Approving..." : "Approve"}
                    </button>
                    <button
                      onClick={() => rejectMutation.mutate(room._id)}
                      disabled={rejectMutation.isLoading}
                      className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <XCircle className="w-5 h-5" />
                      {rejectMutation.isLoading ? "Deleting..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImg && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70"
          onClick={() => setPreviewImg(null)}
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={previewImg}
              alt="Preview"
              className="max-w-[90vw] max-h-[80vh] rounded-lg shadow-2xl border-4 border-white"
            />
            <button
              className="absolute top-2 right-2 bg-white bg-opacity-80 rounded-full p-2 hover:bg-opacity-100 transition"
              onClick={() => setPreviewImg(null)}
            >
              <XCircle className="w-7 h-7 text-red-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoomApproval;
