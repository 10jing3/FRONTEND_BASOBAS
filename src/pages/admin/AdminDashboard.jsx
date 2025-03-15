import React from "react";
import { Home, Users, FileText, CreditCard } from "lucide-react";

function AdminDashboard() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg min-h-screen p-6 flex flex-col">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Panel</h1>
        <nav>
          <ul>
            <li className="mb-4">
              <a
                href="/admin/users"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <Users className="w-5 h-5 mr-2" /> Users
              </a>
            </li>
            <li className="mb-4">
              <a
                href="/admin/listings"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <FileText className="w-5 h-5 mr-2" /> Listings
              </a>
            </li>
            <li className="mb-4">
              <a
                href="/admin/payments"
                className="flex items-center p-3 text-gray-700 hover:bg-gray-200 rounded-lg transition"
              >
                <CreditCard className="w-5 h-5 mr-2" /> Payments
              </a>
            </li>
          </ul>
        </nav>
      </aside>
    </div>
  );
}

export default AdminDashboard;
