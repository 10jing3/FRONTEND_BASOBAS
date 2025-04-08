import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaEdit } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "../../components/Carousel";
import { useSelector } from "react-redux";

export default function RoomList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const user = useSelector((state) => state.user.currentUser);

  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    roomId: null,
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
      setDeleteModal({ isOpen: false, roomId: null });
    },
    onError: (error) => {
      alert(
        "Failed to delete room: " + (error.response?.data || error.message)
      );
    },
  });

  // Open Delete Modal
  const handleDelete = (id) => {
    setDeleteModal({ isOpen: true, roomId: id });
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
    return <p className="text-center text-gray-500">Loading rooms...</p>;
  if (error)
    return (
      <p className="text-center text-red-500">No Rooms Found For this User.</p>
    );

  return (
    <div className="bg-white p-4 rounded-lg shadow-md max-w-4xl mx-auto">
      <h3 className="text-2xl font-bold mb-6 text-center text-gray-700">
        Available Rooms
      </h3>

      {rooms.length === 0 ? (
        <p className="text-center text-gray-500">No rooms available</p>
      ) : (
        <ul className="space-y-6">
          {rooms.map((room) => (
            <li
              key={room._id}
              className="p-6 border rounded-lg shadow-lg bg-gray-50"
            >
              <Carousel images={room.roomImages} />
              <h4 className="text-xl font-semibold mt-4 text-gray-800">
                {room.name}
              </h4>
              <p className="text-lg text-green-600 font-bold">
                Rs {room.price}
              </p>
              <p className="text-gray-600">{room.location}</p>
              <p className="text-gray-500 text-sm">{room.amenities}</p>

              <div className="flex space-x-4 mt-4">
                <button
                  onClick={() => handleEdit(room._id)}
                  className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                >
                  <FaEdit className="mr-2" /> Edit
                </button>
                <button
                  onClick={() => handleDelete(room._id)}
                  className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  <FaTrash className="mr-2" /> Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete this room?
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <button
                onClick={() => setDeleteModal({ isOpen: false, roomId: null })}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
