import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import RoomCard from "../../components/RoomCard";
import { FiSearch, FiRefreshCcw } from "react-icons/fi";
import { FaRegSadTear } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";

const Search = () => {
  const { search } = useLocation();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    location: "",
    budget: "",
    bedrooms: "",
    category: "",
  });

  useEffect(() => {
    const params = new URLSearchParams(search);
    setSearchQuery(
      Array.from(params.entries())
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")
    );

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

  const applyFilters = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (filters.location) queryParams.append("location", filters.location);

    // Budget: send minBudget and maxBudget for ±5000 range
    if (filters.budget) {
      const budget = parseInt(filters.budget, 10);
      if (!isNaN(budget)) {
        queryParams.append("minBudget", Math.max(0, budget - 5000));
        queryParams.append("maxBudget", budget + 5000);
      }
    }

    if (filters.bedrooms) queryParams.append("bedrooms", filters.bedrooms);
    if (filters.category) queryParams.append("category", filters.category);

    navigate(`/search?${queryParams.toString()}`);
  };

  const clearFilters = () => {
    setFilters({
      location: "",
      budget: "",
      bedrooms: "",
      category: "",
    });
    navigate("/search");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <IoIosArrowBack className="mr-2" />
          Back to results
        </button>
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Search Results
        </h1>

        <div className="flex items-center text-gray-500 text-base">
          <FiSearch className="mr-2 text-xl" />
          <span>{searchQuery || "All available rooms"}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-12 bg-white rounded-2xl shadow-lg p-8">
        <form
          className="grid grid-cols-1 md:grid-cols-5 gap-6 items-end"
          onSubmit={applyFilters}
        >
          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={filters.location}
              onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition"
              placeholder="City, Area"
              autoComplete="off"
            />
          </div>
          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Max Budget
            </label>
            <input
              type="number"
              name="budget"
              min={0}
              value={filters.budget}
              onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition"
              placeholder="e.g. 20000"
            />
          </div>
          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Bedrooms
            </label>
            <input
              type="number"
              name="bedrooms"
              min={1}
              value={filters.bedrooms}
              onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition"
              placeholder="e.g. 2"
            />
          </div>
          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full border border-gray-200 rounded-lg p-3 focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 bg-white transition"
            >
              <option value="">Any</option>
              <option value="house">House</option>
              <option value="twoo room">Two Room</option>
              <option value="single room">Single Room</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4 BHK</option>
              <option value="flat">Flat</option>
            </select>
          </div>
          {/* Buttons */}
          <div className="flex gap-2">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg shadow transition flex items-center justify-center"
            >
              <FiSearch className="mr-2" /> Search
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg shadow transition flex items-center justify-center"
            >
              <FiRefreshCcw className="mr-2" /> Reset
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FaRegSadTear className="text-gray-400 text-4xl" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-700 mb-2">
            No rooms found
          </h3>
          <p className="text-gray-500 max-w-md mx-auto mb-6">
            Try adjusting your search filters or browse our featured listings.
          </p>
          <button
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-semibold flex items-center mx-auto"
            onClick={clearFilters}
          >
            <FiRefreshCcw className="mr-2" /> Reset Filters
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{rooms.length}</span>{" "}
              result{rooms.length > 1 ? "s" : ""}
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
