import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { FaPhone } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";

export default function MatchRoommates() {
  const { currentUser } = useSelector((state) => state.user);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [matchingEnabled, setMatchingEnabled] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch matchingEnabled from backend on mount
  useEffect(() => {
    const fetchMatchingEnabled = async () => {
      try {
        const res = await fetch(
          `/api/match/matching-enabled/${currentUser._id}`
        );
        const data = await res.json();
        setMatchingEnabled(data.matchingEnabled !== false); // default to true
      } catch (err) {
        setMatchingEnabled(true);
      }
    };
    if (currentUser?._id) fetchMatchingEnabled();
  }, [currentUser]);

  useEffect(() => {
    if (!matchingEnabled) return;
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
    if (currentUser?._id) fetchMatches();
  }, [currentUser, matchingEnabled]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex < matches.length - 1 ? prevIndex + 1 : 0
    );
  };

  // Toggle and save to backend
  const handleToggle = async () => {
    setSaving(true);
    try {
      const res = await fetch(
        `/api/match/matching-enabled/${currentUser._id}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ enabled: !matchingEnabled }),
        }
      );
      const data = await res.json();
      setMatchingEnabled(data.matchingEnabled);
    } catch (err) {
      // Optionally show error
    }
    setSaving(false);
  };

  const currentMatch = matches[currentIndex];

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center mb-4">
        Roommate Match
      </h1>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleToggle}
          disabled={saving}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            matchingEnabled
              ? "bg-red-500 text-white hover:bg-red-600"
              : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {saving
            ? "Saving..."
            : matchingEnabled
            ? "Turn Off Roommate Matching"
            : "Turn On Roommate Matching"}
        </button>
      </div>

      {!matchingEnabled ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            Roommate matching is turned off.
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            You can turn it back on anytime using the button above.
          </p>
        </div>
      ) : loading ? (
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
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-gray-800">
                {currentMatch?.name}
              </h2>
              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                Match Score: {currentMatch?.matchScore}%
              </span>
            </div>
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
                <strong>Budget:</strong>{" "}
                {currentMatch?.budget
                  ? `Rs ${currentMatch.budget}/month`
                  : "Not specified"}
              </p>
              <p>
                <strong>Cleanliness:</strong>{" "}
                {currentMatch?.cleanliness ?? "Not specified"}
              </p>
              <p>
                <strong>Smoker:</strong> {currentMatch?.isSmoker ? "Yes" : "No"}
              </p>
              <p>
                <strong>Pet Friendly:</strong>{" "}
                {currentMatch?.isPetFriendly ? "Yes" : "No"}
              </p>
              <p>
                <strong>Hobbies:</strong>{" "}
                {currentMatch?.hobbies?.join(", ") || "Not specified"}
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
