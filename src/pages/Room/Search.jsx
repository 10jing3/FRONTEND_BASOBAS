import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RoomCard from "../../components/RoomCard";
import { FiSearch, FiRefreshCcw } from "react-icons/fi";
import { FaRegSadTear } from "react-icons/fa";

const Search = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    priceRange: "",
    bedroom: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    setSearchQuery(params.toString().replace(/&/g, ", "));

    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/room/search${search}`);
        const data = await res.json();
        setRooms(data.rooms || []);
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [search]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    const queryParams = new URLSearchParams(filters).toString();
    navigate(`/search?${queryParams}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Search Results
        </h1>
        <div className="flex items-center text-gray-600">
          <FiSearch className="mr-2 text-xl" />
          <span className="text-sm md:text-base">
            {searchQuery || "All available rooms"}
          </span>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-medium text-gray-800 mb-4">Filters</h2>
        <form className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Range
            </label>
            <input
              type="text"
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        </form>
        <button
          onClick={applyFilters}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          Apply Filters
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaRegSadTear className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-2xl font-medium text-gray-700 mb-4">
            No rooms found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Try adjusting your search filters or browse our featured listings.
          </p>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            onClick={() => window.location.reload()}
          >
            <FiRefreshCcw className="mr-2" /> Refresh
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing <span className="font-medium">{rooms.length}</span>{" "}
              results
            </p>
            {/* Sorting dropdown could be added here */}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
