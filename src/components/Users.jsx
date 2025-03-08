import { useState } from "react";
import { FaTrash, FaUser } from "react-icons/fa";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export default function Users() {
  const queryClient = useQueryClient();
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("/api/user/getall");
      return res.data;
    },
  });

  const deleteUser = async (id) => {
    console.log(id);
    try {
      const response = await axios.delete(`/api/user/delete/${id}`);
      if (response.status === 200) {
        // Invalidate the query to refetch the data
        queryClient.invalidateQueries(["users"]);
      }
    } catch (err) {
      console.error("Error deleting user:", err);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">Loading users...</div>;
  }

  if (error) {
    return (
      <div className="text-center p-4 text-red-600">Error loading users</div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Users</h3>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 border rounded-lg flex justify-between items-center shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-600 h-6 w-6" />
              <div>
                <p className="font-semibold text-gray-900">{user.name}</p>
                <p className="text-gray-600 text-sm">{user.email}</p>
                <span
                  className={`px-2 py-1 text-sm rounded ${
                    user.role === "Admin"
                      ? "bg-red-200 text-red-800"
                      : "bg-green-200 text-green-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            </div>
            <button
              onClick={() => deleteUser(user._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 flex items-center space-x-2"
            >
              <FaTrash className="h-4 w-4" />
              <span>Delete</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
