import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FaTrash,
  FaEdit,
  FaEye,
  FaStar,
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
    data: rooms = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms", user?._id, user?.role],
    queryFn: async () => {
      if (!user) return [];
      const endpoint =
        user.role === "admin"
          ? "/api/room/rooms"
          : `/api/room/get-room-by-owner/${user._id}`;
      const { data } = await axios.get(endpoint);
      return data;
    },
    enabled: !!user,
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`/api/room/rooms/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
    },
    onSuccess: (_, id) => {
      queryClient.setQueryData(
        ["rooms"],
        (oldData) => oldData?.filter((room) => room._id !== id) || []
      );
      queryClient.invalidateQueries(["rooms"]);
      setDeleteModal({ isOpen: false, roomId: null, roomName: "" });
    },
    onError: (error) => {
      alert(
        "Failed to delete room: " + (error.response?.data || error.message)
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

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded max-w-4xl mx-auto my-8">
        <p className="text-center font-medium">No Rooms Found For this User</p>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {user?.role === "admin" ? "All Rooms" : "My Listings"}
        </h1>
        {user?.role !== "admin" && (
          <Link
            to="/add-room"
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition flex items-center"
          >
            + Add New Room
          </Link>
        )}
      </div>

      {rooms.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No rooms available
          </h3>
          <p className="text-gray-500 mb-4">
            {user?.role === "admin"
              ? "There are currently no rooms in the system."
              : "You haven't listed any rooms yet."}
          </p>
          {user?.role !== "admin" && (
            <Link
              to="/add-room"
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
            >
              Create Your First Listing
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div
              key={room._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition"
            >
              <div className="h-48 overflow-hidden">
                <Carousel images={room.roomImages} />
              </div>

              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-gray-800 truncate">
                    {room.name}
                  </h3>
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-2.5 py-0.5 rounded">
                    Rs {room.price}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 mb-3">
                  <FaMapMarkerAlt className="mr-1 text-green-600" />
                  <span className="truncate">{room.location}</span>
                </div>

                <div className="flex space-x-4 text-gray-700 mb-4">
                  <div className="flex items-center">
                    <FaBed className="mr-1 text-green-600" />
                    <span>{room.bedrooms || 1}</span>
                  </div>
                  <div className="flex items-center">
                    <FaBath className="mr-1 text-green-600" />
                    <span>{room.bathrooms || 1}</span>
                  </div>
                  <div className="flex items-center">
                    <FaRulerCombined className="mr-1 text-green-600" />
                    <span>{room.area || "N/A"} sq.ft</span>
                  </div>
                </div>

                <div className="flex justify-between space-x-3">
                  <button
                    onClick={() => navigate(`/room/${room._id}`)}
                    className="flex-1 flex items-center justify-center bg-blue-100 text-blue-700 hover:bg-blue-200 py-2 px-4 rounded-lg transition"
                  >
                    <FaEye className="mr-2" />
                    View
                  </button>
                  <button
                    onClick={() => handleEdit(room._id)}
                    className="flex-1 flex items-center justify-center bg-green-100 text-green-700 hover:bg-green-200 py-2 px-4 rounded-lg transition"
                  >
                    <FaEdit className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id, room.name)}
                    className="flex-1 flex items-center justify-center bg-red-100 text-red-700 hover:bg-red-200 py-2 px-4 rounded-lg transition"
                  >
                    <FaTrash className="mr-2" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-2">
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
