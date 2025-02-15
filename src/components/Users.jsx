import { useState } from "react";
import { FaTrash, FaUser } from "react-icons/fa";

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
    { id: 3, name: "Mike Johnson", email: "mike@example.com", role: "User" },
  ]);

  const deleteUser = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Users</h3>
      <ul className="space-y-4">
        {users.map((user) => (
          <li
            key={user.id}
            className="p-4 border rounded-lg flex justify-between items-center shadow-md"
          >
            <div className="flex items-center space-x-3">
              <FaUser className="text-gray-600" />
              <div>
                <p className="font-semibold">{user.name}</p>
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
              onClick={() => deleteUser(user.id)}
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
