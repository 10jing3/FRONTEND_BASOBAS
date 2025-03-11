// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// function AdminDashboard() {
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   useEffect(() => {
//     const checkAdminStatus = async () => {
//       const token = localStorage.getItem("adminToken");

//       if (!token) {
//         setIsAdmin(false);
//         setLoading(false);
//         navigate("/admin/login");
//         return;
//       }

//       try {
//         const response = await fetch("/api/admin/auth", {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         });

//         if (response.ok) {
//           setIsAdmin(true);
//         } else {
//           setIsAdmin(false);
//           localStorage.removeItem("adminToken");
//           navigate("/admin/login");
//         }
//       } catch (error) {
//         console.error("Authentication error:", error);
//         setIsAdmin(false);
//         localStorage.removeItem("adminToken");
//         navigate("/admin/login");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkAdminStatus();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.removeItem("adminToken");
//     navigate("/admin/login");
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         Loading...
//       </div>
//     );
//   }

//   if (!isAdmin) {
//     return null;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <header className="bg-blue-600 text-white p-4">
//         <div className="container mx-auto flex items-center justify-between">
//           <h1 className="text-2xl font-bold">Admin Dashboard</h1>
//           <button
//             onClick={handleLogout}
//             className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
//           >
//             Logout
//           </button>
//         </div>
//       </header>

//       <main className="container mx-auto py-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           <div className="bg-white shadow-md rounded-md p-4">
//             <h2 className="text-lg font-semibold mb-2">Users</h2>
//             <p>Manage user accounts and roles.</p>
//             <a href="/admin/users" className="text-blue-500 hover:underline">
//               View Users
//             </a>
//           </div>

//           <div className="bg-white shadow-md rounded-md p-4">
//             <h2 className="text-lg font-semibold mb-2">Listings</h2>
//             <p>Approve or reject property listings.</p>
//             <a href="/admin/listings" className="text-blue-500 hover:underline">
//               View Listings
//             </a>
//           </div>

//           <div className="bg-white shadow-md rounded-md p-4">
//             <h2 className="text-lg font-semibold mb-2">Payments</h2>
//             <p>View and manage payment transactions.</p>
//             <a href="/admin/payments" className="text-blue-500 hover:underline">
//               View Payments
//             </a>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// export default AdminDashboard;

import React from "react";

function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
      </header>

      <main className="container mx-auto py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Users</h2>
            <p>Manage user accounts and roles.</p>
            <a href="/admin/users" className="text-blue-500 hover:underline">
              View Users
            </a>
          </div>

          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Listings</h2>
            <p>Approve or reject property listings.</p>
            <a href="/admin/listings" className="text-blue-500 hover:underline">
              View Listings
            </a>
          </div>

          <div className="bg-white shadow-md rounded-md p-4">
            <h2 className="text-lg font-semibold mb-2">Payments</h2>
            <p>View and manage payment transactions.</p>
            <a href="/admin/payments" className="text-blue-500 hover:underline">
              View Payments
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;
