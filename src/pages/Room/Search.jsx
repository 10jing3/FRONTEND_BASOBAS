import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import RoomCard from "../../components/RoomCard";

const Search = () => {
  const { search } = useLocation();
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    console.log("Search query:", search); // Log the search query for debugging
    const fetchRooms = async () => {
      try {
        const res = await fetch(`/api/room/search${search}`);
        const data = await res.json();
        setRooms(data.rooms);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };

    fetchRooms();
  }, [search]);

  return (
    <div>
      <h1>Search Results</h1>
      {rooms.length === 0 && <p>No rooms found</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {rooms.map((room) => (
          <RoomCard key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default Search;
