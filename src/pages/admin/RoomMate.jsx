import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function MatchRoommates() {
  const { currentUser } = useSelector((state) => state.user);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">Roommate Matches</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading matches...</p>
      ) : matches.length === 0 ? (
        <p className="text-center text-gray-500">No matches found.</p>
      ) : (
        <div className="grid gap-4">
          {matches.map((user) => (
            <div key={user._id} className="border p-4 rounded-lg shadow">
              <div className="flex items-center gap-4">
                <img
                  src={user.image || "/default-avatar.png"}
                  alt={user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-lg font-semibold">{user.name}</h2>
                  <p>
                    Match Score:{" "}
                    <strong className="text-green-600">
                      {console.log("roommate", user)}
                      {user.matchScore}
                    </strong>
                  </p>
                  <p>Phone: {user.phone}</p>
                  <p>Gender: {user.gender}</p>
                  <p>Budget: ${user.budget}</p>
                  <p>
                    Hobbies:{" "}
                    {user.hobbies && user.hobbies.length > 0
                      ? user.hobbies.join(", ")
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
