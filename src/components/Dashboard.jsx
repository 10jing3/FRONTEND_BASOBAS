import React from "react";
import { Link } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card: Properties */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Properties</h2>
            <p className="text-gray-600 mb-4">
              Manage your listed properties. Add, edit, or remove properties as
              needed.
            </p>
            <Link
              to="/properties"
              className="text-blue-600 font-semibold hover:underline"
            >
              Go to Properties
            </Link>
          </div>

          {/* Card: Bookings */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Bookings</h2>
            <p className="text-gray-600 mb-4">
              View and manage all tenant bookings. Approve or reject booking
              requests.
            </p>
            <Link
              to="/bookings"
              className="text-blue-600 font-semibold hover:underline"
            >
              Manage Bookings
            </Link>
          </div>

          {/* Card: Profile */}
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Profile</h2>
            <p className="text-gray-600 mb-4">
              Update your account information, including email, password, and
              contact details.
            </p>
            <Link
              to="/profile"
              className="text-blue-600 font-semibold hover:underline"
            >
              Update Profile
            </Link>
          </div>
        </div>

        {/* Additional Section: Analytics */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Analytics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card: Revenue */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">Monthly Revenue</h3>
              <p className="text-gray-600">$12,345</p>
            </div>

            {/* Card: New Bookings */}
            <div className="bg-white shadow-lg rounded-lg p-6">
              <h3 className="text-xl font-bold mb-2">New Bookings</h3>
              <p className="text-gray-600">25 this month</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>
            &copy; {new Date().getFullYear()} RoomRental. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
