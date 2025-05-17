// components/MatchCard.jsx
import { FaPhone, FaVenusMars, FaMoneyBillWave, FaStar } from "react-icons/fa";
import { MdOutlineSportsHandball } from "react-icons/md";

export default function MatchCard({ user, onViewProfile }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="relative">
        <img
          src={user.image || "/default-avatar.png"}
          alt={user.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center">
            <div className="bg-white/90 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">
              {user.matchScore}% Match
            </div>
          </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-start">
          <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
          <div className="flex items-center text-yellow-400">
            <FaStar className="mr-1" />
            <span className="text-gray-600 text-sm">4.8</span>
          </div>
        </div>
        <p className="text-gray-500 text-sm mb-4">
          {user.bio || "Looking for a compatible roommate"}
        </p>

        <div className="space-y-3">
          <div className="flex items-center text-gray-600">
            <FaVenusMars className="mr-3 text-gray-400" />
            <span>{user.gender || "Not specified"}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <FaMoneyBillWave className="mr-3 text-gray-400" />
            <span>${user.budget}/month</span>
          </div>
          {user.hobbies?.length > 0 && (
            <div className="flex items-start text-gray-600">
              <MdOutlineSportsHandball className="mr-3 mt-1 text-gray-400" />
              <div>
                <p className="font-medium text-sm">Hobbies:</p>
                <p className="text-sm">{user.hobbies.join(", ")}</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-between">
          <button className="text-blue-600 hover:text-blue-800 font-medium">
            <FaPhone className="inline mr-2" />
            Contact
          </button>
          <button
            onClick={() => onViewProfile(user)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
