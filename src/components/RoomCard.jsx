import React from "react";
import Carousel from "./Carousel";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  const { name, price, size, amenities, available, roomImages, description } =
    room;

  return (
    <div className="border rounded-2xl shadow-xl overflow-hidden bg-white transform transition-transform hover:scale-105 relative">
      {/* Room Images */}
      <div className="w-full h-72 overflow-hidden rounded-t-2xl">
        <Carousel images={room.roomImages} />
      </div>

      {/* Room Details */}
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-semibold text-gray-800">{name}</h3>
        <p className="text-md text-gray-600">{description}</p>

        <div className="flex justify-between items-center mt-2">
          <p className="text-lg text-gray-800 font-semibold">
            ${price} <span className="text-sm text-gray-500">/ night</span>
          </p>
          <p
            className={`text-sm font-semibold ${
              available ? "text-green-600" : "text-red-600"
            }`}
          >
            {available ? "Available" : "Not Available"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <p className="text-sm text-gray-500">
            <span className="font-semibold">Size:</span> {size} sq ft
          </p>
          <div className="flex flex-wrap gap-3">
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Amenities:</span>
            </p>
            <ul className="flex flex-wrap gap-2 text-sm text-gray-500">
              {amenities.map((amenity, index) => (
                <li
                  key={index}
                  className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700"
                >
                  {amenity}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          className="mt-4 w-full py-3 px-6 bg-green-600 text-white text-lg font-medium rounded-xl transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          onClick={() => navigate(`/room/${room._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
