import SideNav from "../pages/admin/SideNav";
import Header from "../components/Header";
import { FaSave } from "react-icons/fa";

export default function Profile() {
  return (
    <div className="flex">
      <SideNav />
      <div className="ml-64 flex-1 p-8">
        <Header />
        <main className="mt-16">
          <h2 className="text-2xl font-semibold mb-8">Edit Profile</h2>
          <form className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center space-x-2"
              >
                <FaSave className="h-4 w-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
}
