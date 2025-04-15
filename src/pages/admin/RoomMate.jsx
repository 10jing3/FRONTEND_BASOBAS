import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  FaPhone,
  FaVenusMars,
  FaMoneyBillWave,
  FaHeart,
  FaStar,
} from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import { IoMdClose } from "react-icons/io";
import { MdOutlineSportsHandball } from "react-icons/md";

export default function MatchRoommates() {
  const { currentUser } = useSelector((state) => state.user);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await fetch(`/api/match/matchmates/${currentUser._id}`);
        const data = await res.json();
        setMatches(data);
      } catch (err) {
        console.error("Error fetching matches:", err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser?._id) {
      fetchMatches();
    }
  }, [currentUser]);

  const handleViewDetails = (user) => {
    setSelectedMatch(user);
  };

  const handleCloseDetails = () => {
    setSelectedMatch(null);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Roommate Matches</h1>
        <div className="flex items-center text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full">
          <FaHeart className="mr-2" />
          {matches.length} Potential Matches
        </div>
      </div>

      {loading ? (
        <div>loading...</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <GiSandsOfTime className="mx-auto text-5xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No matches found yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find any roommate matches based on your preferences. Try
            updating your profile or check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matches.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
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
                  <h2 className="text-xl font-bold text-gray-800">
                    {user.name}
                  </h2>
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
                    onClick={() => handleViewDetails(user)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Match Detail Modal */}
      {selectedMatch && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedMatch.image || "/default-avatar.png"}
                alt={selectedMatch.name}
                className="w-full h-64 object-cover rounded-t-xl"
              />
              <button
                onClick={handleCloseDetails}
                className="absolute top-4 right-4 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md transition-colors"
              >
                <IoMdClose size={20} />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <h2 className="text-2xl font-bold text-white">
                  {selectedMatch.name}
                </h2>
                <div className="flex items-center mt-2">
                  <div className="bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                    {selectedMatch.matchScore}% Match
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Basic Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <span className="text-gray-500 w-28">Gender:</span>
                      <span>{selectedMatch.gender || "Not specified"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-28">Age:</span>
                      <span>{selectedMatch.age || "Not specified"}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-28">Budget:</span>
                      <span>${selectedMatch.budget}/month</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-500 w-28">Phone:</span>
                      <span>{selectedMatch.phone || "Not shared"}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    Preferences
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <span className="text-gray-500 w-28">Hobbies:</span>
                      <span>
                        {selectedMatch.hobbies?.join(", ") || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 w-28">Lifestyle:</span>
                      <span>{selectedMatch.lifestyle || "Not specified"}</span>
                    </div>
                    <div className="flex items-start">
                      <span className="text-gray-500 w-28">Occupation:</span>
                      <span>{selectedMatch.occupation || "Not specified"}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  About
                </h3>
                <p className="text-gray-600">
                  {selectedMatch.bio ||
                    "No additional information provided by this user."}
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleCloseDetails}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                  <FaPhone className="mr-2" />
                  Contact Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
