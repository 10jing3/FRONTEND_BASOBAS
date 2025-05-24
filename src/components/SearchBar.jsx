import React from "react";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

const SearchBar = ({
  search,
  setSearch,
  onSearch,
  isLoading = false,
  className = "",
}) => (
  <div
    className={`bg-white rounded-2xl shadow-xl p-6 max-w-4xl mx-auto ${className}`}
  >
    <form
      className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
      onSubmit={(e) => {
        e.preventDefault();
        onSearch();
      }}
    >
      {/* Location */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaMapMarkerAlt className="text-green-500 text-lg" />
        </div>
        <input
          type="text"
          placeholder="Location (City, Area)"
          value={search.location}
          onChange={(e) => setSearch({ ...search, location: e.target.value })}
          className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition"
          autoComplete="off"
        />
      </div>
      {/* Budget */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-green-500 font-bold">RS</span>
        </div>
        <input
          type="number"
          placeholder="budget (e.g. 20000)"
          min={0}
          value={search.budget}
          onChange={(e) => setSearch({ ...search, budget: e.target.value })}
          className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition"
        />
      </div>
      {/* Bedrooms */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-green-500 font-bold">BR</span>
        </div>
        <input
          type="number"
          placeholder="Bedrooms"
          min={1}
          value={search.bedrooms || ""}
          onChange={(e) => setSearch({ ...search, bedrooms: e.target.value })}
          className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-800 placeholder-gray-400 transition"
        />
      </div>

      {/* Category (styled like other inputs) */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {/* You can use an icon here for consistency, e.g., a tag or home icon */}
          <FaSearch className="text-green-500 text-lg" />
        </div>
        <select
          value={search.category || ""}
          onChange={(e) => setSearch({ ...search, category: e.target.value })}
          className="pl-10 w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-400 bg-white transition"
        >
          <option value="">Category</option>
          <option value="house">House</option>
          <option value="two Room">Two Room</option>
          <option value="single Room">Single Room</option>
          <option value="2 BHK">2 BHK</option>
          <option value="3 BHK">3 BHK</option>
          <option value="4 BHK">4 BHK</option>
          <option value="flat">Flat</option>
          {/* Add more categories as needed */}
        </select>
      </div>
      {/* Search Button */}
      <button
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300 flex items-center justify-center"
        disabled={isLoading}
      >
        <FaSearch className="mr-2" />
        {isLoading ? "Searching..." : "Search"}
      </button>
    </form>
  </div>
);

export default SearchBar;
