import { useState } from "react";
import {
  FaTrash,
  FaUser,
  FaSearch,
  FaSpinner,
  FaExclamationTriangle,
} from "react-icons/fa";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function Users() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(null);

  const {
    data: users = [],
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await axios.get("/api/user/getall");
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });

  const filteredUsers = users
    .filter((user) => user.role !== "admin") // Exclude admins
    .filter((user) =>
      `${user.username} ${user.name} ${user.email} ${user.role}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

  const deleteUser = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    setIsDeleting(id);
    try {
      await axios.delete(`/api/user/delete/${id}`);
      toast.success("User deleted successfully");
      queryClient.invalidateQueries(["users"]);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting user");
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-blue-500 mx-auto mb-3" />
          <p className="text-gray-600">Loading user data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md shadow-sm">
        <div className="flex items-start">
          <FaExclamationTriangle className="flex-shrink-0 h-5 w-5 text-red-500 mt-0.5" />
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Error loading users
            </h3>
            <div className="mt-2 text-sm text-red-700">
              {error.message || "Please try again later"}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="mb-4 sm:mb-0">
            <h1 className="text-xl font-semibold text-gray-900">
              User Management
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              {users.length} {users.length === 1 ? "user" : "users"} total
            </p>
          </div>
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                User Profile
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Contact
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Status
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-8 text-center">
                  <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    {searchTerm ? "No users found" : "No users available"}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {searchTerm
                      ? "Try a different search term"
                      : "Add a new user to get started"}
                  </p>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {user.profilePicture ? (
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={user.profilePicture}
                            alt={user.name}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <FaUser className="h-5 w-5 text-blue-600" />
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {user.username}
                        </div>
                        <div className="text-xs text-gray-400">
                          Joined {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500">
                      {user.phone || "No phone number"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "Admin"
                          ? "bg-purple-100 text-purple-800"
                          : user.role === "Moderator"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => deleteUser(user._id)}
                      disabled={isDeleting === user._id}
                      className="text-red-600 hover:text-red-900 disabled:text-red-300 disabled:cursor-not-allowed"
                      title="Delete user"
                    >
                      {isDeleting === user._id ? (
                        <FaSpinner className="animate-spin h-4 w-4" />
                      ) : (
                        <FaTrash className="h-4 w-4" />
                      )}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isFetching && (
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex justify-center">
            <FaSpinner className="animate-spin text-blue-500" />
          </div>
        </div>
      )}
    </div>
  );
}
