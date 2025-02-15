import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaWifi, FaTv, FaCheck, FaTimes } from "react-icons/fa";
import axios from "axios";
import { useState } from "react";
import Carousel from "../../components/Carousel";

export default function RoomList() {
  const queryClient = useQueryClient();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  // Fetch rooms data using React Query
  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axios.get("/api/room/rooms");
      return res.data;
    },
  });

  // Mutation for deleting a room
  const deleteRoomMutation = useMutation({
    mutationFn: async (id) => {
      const res = await axios.delete(`/api/room/rooms/${id}`);
      return res.data;
    },
    onSuccess: () => {
      // Invalidate and refetch rooms after deletion
      queryClient.invalidateQueries(["rooms"]);
    },
  });

  // Handler for delete button click
  const handleDelete = (id) => {
    setRoomToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteRoomMutation.mutate(roomToDelete);
    setShowDeleteModal(false);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  if (isLoading) return <p>Loading rooms...</p>;
  if (error) return <p>Error loading rooms</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Available Rooms</h3>
      <ul className="space-y-4">
        {rooms.map((room) => (
          <li
            key={room._id}
            className="p-4 border rounded-lg flex flex-col space-y-2 shadow-md"
          >
            <div className="flex justify-between items-center">
              <h4 className="text-lg font-bold">{room.name}</h4>
              <button
                onClick={() => handleDelete(room._id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center space-x-2"
              >
                <FaTrash className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>

            {/* Carousel Component */}
            <Carousel images={room.roomImages} />

            <p className="text-gray-700">
              Price: <span className="font-semibold">${room.price}/night</span>
            </p>
            <p className="text-gray-700">
              Size: <span className="font-semibold">{room.size}</span>
            </p>
            <p className="text-gray-700 flex items-center">
              Amenities:{" "}
              {room.amenities.map((amenity, index) => (
                <span
                  key={index}
                  className="ml-2 px-2 py-1 bg-blue-200 text-blue-800 text-sm rounded"
                >
                  {amenity === "WiFi" ? (
                    <FaWifi className="inline-block mr-1" />
                  ) : null}
                  {amenity === "TV" ? (
                    <FaTv className="inline-block mr-1" />
                  ) : null}
                  {amenity}
                </span>
              ))}
            </p>
            <p className="text-gray-700 flex items-center">
              Availability:{" "}
              {room.available ? (
                <span className="text-green-600 flex items-center">
                  <FaCheck className="mr-1" /> Available
                </span>
              ) : (
                <span className="text-red-600 flex items-center">
                  <FaTimes className="mr-1" /> Booked
                </span>
              )}
            </p>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h4 className="text-lg font-semibold">
              Are you sure you want to delete this room?
            </h4>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={cancelDelete}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
