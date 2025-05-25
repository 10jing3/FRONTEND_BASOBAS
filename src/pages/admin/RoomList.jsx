import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaBed,
  FaBath,
  FaRulerCombined,
  FaMapMarkerAlt,
} from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Carousel from "../../components/Carousel";
import { useSelector } from "react-redux";

export default function RoomList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user.currentUser);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    roomId: null,
    roomName: "",
  });

  // Fetch rooms based on user role
  const {
    data: roomsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms", user?._id, user?.role],
    queryFn: async () => {
      if (!user) return { rooms: [] };

      try {
        const endpoint =
          user.role === "admin"
            ? "/api/room/admin/rooms"
            : `/api/room/get-room-by-owner/${user._id}`;
        const { data } = await axios.get(endpoint);

        // Normalize the response to always return { rooms: [] } format
        if (Array.isArray(data)) {
          return { rooms: data };
        } else if (Array.isArray(data?.rooms)) {
          return { rooms: data.rooms };
        } else if (Array.isArray(data?.data)) {
          return { rooms: data.data };
        }
        return { rooms: [] };
      } catch (err) {
        console.error("Error fetching rooms:", err);
        return { rooms: [] };
      }
    },
    enabled: !!user,
  });

  // Extract rooms from normalized data
  const rooms = roomsData?.rooms || [];

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/room/rooms/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(["rooms"], (oldData) => ({
        rooms: (oldData?.rooms || []).filter((room) => room._id !== id),
      }));
      queryClient.invalidateQueries(["rooms"]);
      setDeleteModal({ isOpen: false, roomId: null, roomName: "" });
    },
    onError: (error) => {
      alert(
        "Failed to delete room: " +
          (error.response?.data?.message || error.message)
      );
    },
  });

  // Open Delete Modal
  const handleDelete = (id, name) => {
    setDeleteModal({ isOpen: true, roomId: id, roomName: name });
  };

  // Confirm Room Deletion
  const confirmDelete = () => {
    if (deleteModal.roomId) {
      deleteRoomMutation.mutate(deleteModal.roomId);
    }
  };

  // Navigate to edit room page
  const handleEdit = (roomId) => {
    navigate(`/edit-room/${roomId}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-4xl mx-auto my-8">
        <p className="text-center font-medium">
          Error loading rooms: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-2 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {user?.role === "admin" ? "All Rooms" : "My Listings"}
          </h1>
          <p className="text-gray-500 mt-1 text-base">
            Total Rooms: <span className="font-semibold">{rooms.length}</span>
          </p>
        </div>
        {user?.role !== "admin" && (
          <Link
            to="/create-room"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
          >
            + Add Room
          </Link>
        )}
      </div>

      {rooms.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-8 text-center shadow">
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No rooms available
          </h3>
          <p className="text-gray-500 mb-4">
            {user?.role === "admin"
              ? "There are currently no rooms in the system."
              : "You haven't listed any rooms yet."}
          </p>
          {user?.role !== "admin" && (
            <Link
              to="/create-room"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded transition"
            >
              Create Your First Listing
            </Link>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {rooms.map((room, idx) => (
            <li
              key={room._id}
              className="bg-white rounded-lg shadow flex flex-col md:flex-row md:items-center md:justify-between px-4 py-3 border border-gray-100 hover:border-green-200 transition"
            >
              <div className="flex items-center space-x-4 flex-1">
                <span className="text-green-600 font-bold text-lg w-6 text-center">
                  {idx + 1}.
                </span>
                <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-200 shadow-sm flex-shrink-0">
                  <Carousel images={room.roomImages} />
                </div>
                <div className="ml-2 flex-1 min-w-0">
                  <div className="font-bold text-gray-800 truncate">
                    {room.name}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mt-1 truncate">
                    <FaMapMarkerAlt className="mr-1 text-green-500" />
                    {/* Show only the first word of location */}
                    {room.location?.split(" ")[0] || ""}
                  </div>
                  <div className="flex items-center gap-3 text-xs mt-1 text-gray-400">
                    <span className="flex items-center">
                      <FaBed className="mr-1 text-green-400" />{" "}
                      {room.bedrooms || 1} Bed
                    </span>
                    <span className="flex items-center">
                      <FaBath className="mr-1 text-green-400" />{" "}
                      {room.bathrooms || 1} Bath
                    </span>
                    <span className="flex items-center">
                      <FaRulerCombined className="mr-1 text-green-400" />{" "}
                      {room.size || "N/A"} sq.ft
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end gap-2 mt-3 md:mt-0">
                <span className="text-green-700 font-semibold text-base">
                  Rs {room.price}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/room/${room._id}`)}
                    className="flex items-center bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded transition text-sm"
                    title="View"
                  >
                    <FaEye className="mr-1" /> View
                  </button>
                  <button
                    onClick={() => handleEdit(room._id)}
                    className="flex items-center bg-green-50 text-green-700 hover:bg-green-100 px-3 py-1.5 rounded transition text-sm"
                    title="Edit"
                  >
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id, room.name)}
                    className="flex items-center bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded transition text-sm"
                    title="Delete"
                  >
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold">"{deleteModal.roomName}"</span>?
              This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() =>
                  setDeleteModal({ isOpen: false, roomId: null, roomName: "" })
                }
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition flex items-center"
                disabled={deleteRoomMutation.isLoading}
              >
                {deleteRoomMutation.isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete Permanently"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
