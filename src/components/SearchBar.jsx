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
    className={`bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto ${className}`}
  >
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaMapMarkerAlt className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Location (City, Area)"
          value={search.location}
          onChange={(e) => setSearch({ ...search, location: e.target.value })}
          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MdOutlineAttachMoney className="text-gray-400 text-xl" />
        </div>
        <input
          type="number"
          placeholder="Max Budget"
          value={search.budget}
          onChange={(e) => setSearch({ ...search, budget: e.target.value })}
          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span className="text-gray-400 font-bold">BR</span>
        </div>
        <input
          type="number"
          placeholder="Bedrooms"
          min={1}
          value={search.bedrooms || ""}
          onChange={(e) => setSearch({ ...search, bedroom: e.target.value })}
          className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>
      <button
        className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
        onClick={onSearch}
        disabled={isLoading}
      >
        <FaSearch className="mr-2" />
        {isLoading ? "Searching..." : "Search Properties"}
      </button>
    </div>
  </div>
);

export default SearchBar;
