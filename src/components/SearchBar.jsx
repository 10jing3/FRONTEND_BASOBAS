import React from "react";

const SearchBar = () => {
  return (
    <div className="flex items-center justify-between bg-white p-4 shadow-md rounded-md">
      <input
        type="text"
        placeholder="Select a city"
        className="w-full md:w-1/4 border border-gray-300 rounded-md px-4 py-2 mr-4"
      />
      <input
        type="date"
        placeholder="Move-in"
        className="border border-gray-300 rounded-md px-4 py-2 mr-4"
      />
      <input
        type="date"
        placeholder="Move-out"
        className="border border-gray-300 rounded-md px-4 py-2 mr-4"
      />
      <select className="border border-gray-300 rounded-md px-4 py-2 mr-4">
        <option>1 Guest</option>
        <option>2 Guests</option>
      </select>
      <button className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
