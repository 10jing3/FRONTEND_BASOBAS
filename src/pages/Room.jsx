import Map from "../components/Map";
import RoomCard from "../components/RoomCard";
import SearchBar from "../components/SearchBar";
import React, { useState } from "react";
import img from "../assets/chitwan.jpg";

const Room = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const rooms = [
    {
      title: "Laxmi Balaji Hostel/PG",
      price: "4001.70",
      location: "West London",
      image: img,
    },
    {
      title: "Cozy Apartment",
      price: "3500.50",
      location: "East London",
      image: img,
    },
    {
      title: "Modern Studio Apartment",
      price: "5000.00",
      location: "North London",
      image: img,
    },
    {
      title: "Luxury Suite",
      price: "8000.00",
      location: "Central London",
      image: img,
    },
    {
      title: "Budget Room",
      price: "2000.00",
      location: "South London",
      image: img,
    },
    {
      title: "Shared Room in Downtown",
      price: "3000.00",
      location: "Downtown",
      image: img,
    },
  ];

  const filteredRooms = rooms.filter(
    (room) =>
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (priceFilter === "" || parseFloat(room.price) <= parseFloat(priceFilter))
  );

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <SearchBar
          placeholder="Search by title..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="p-2 border rounded-lg w-full md:w-auto focus:outline-none focus:ring focus:ring-green-500"
        />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Room List */}
        <div className="col-span-2">
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <RoomCard
                key={index}
                title={room.title}
                price={room.price}
                location={room.location}
                image={room.image}
              />
            ))
          ) : (
            <p className="text-center text-gray-500">No rooms found.</p>
          )}
        </div>

        {/* Map */}
        <div>
          <Map />
        </div>
      </div>
    </div>
  );
};

export default Room;
