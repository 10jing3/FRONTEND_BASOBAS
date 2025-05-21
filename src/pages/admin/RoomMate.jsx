import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaPhone } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";

export default function MatchRoommates() {
  const { currentUser } = useSelector((state) => state.user);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < matches.length - 1 ? prevIndex + 1 : 0
    );
  };

  const currentMatch = matches[currentIndex];

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
        Roommate Match
      </h1>

      {loading ? (
        <div>Loading...</div>
      ) : matches.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <GiSandsOfTime className="mx-auto text-5xl text-gray-400 mb-4" />
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No matches found yet
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            We couldn't find any roommate matches based on your preferences.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <img
            src={currentMatch?.image || "/default-avatar.png"}
            alt={currentMatch?.name}
            className="w-full h-64 object-cover"
          />

          <div className="p-5">
            <h2 className="text-2xl font-bold text-gray-800">
              {currentMatch?.name}
            </h2>
            <p className="text-gray-500 mb-2">{currentMatch?.bio}</p>

            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>Gender:</strong>{" "}
                {currentMatch?.gender || "Not specified"}
              </p>
              <p>
                <strong>Age:</strong> {currentMatch?.age || "Not specified"}
              </p>
              <p>
                <strong>Budget:</strong> ${currentMatch?.budget}/month
              </p>
              <p>
                <strong>Occupation:</strong>{" "}
                {currentMatch?.occupation || "Not specified"}
              </p>
              <p>
                <strong>Hobbies:</strong>{" "}
                {currentMatch?.hobbies?.join(", ") || "Not specified"}
              </p>
              <p>
                <strong>Lifestyle:</strong>{" "}
                {currentMatch?.lifestyle || "Not specified"}
              </p>
            </div>

            <div className="mt-5 flex justify-between">
              <a
                href={`https://wa.me/977${currentMatch?.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
              >
                <FaPhone className="mr-2" />
                Contact on WhatsApp
              </a>
              <button
                onClick={handleNext}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
