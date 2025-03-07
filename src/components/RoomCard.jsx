import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const { name, price, location, roomImages } = room;

  return (
    <div className="border rounded-lg shadow-md bg-white overflow-hidden transform transition-transform hover:scale-105 p-2">
      {/* Room Image Carousel */}
      <div className="w-full overflow-hidden rounded-t-lg">
        <Carousel images={roomImages} />
      </div>

      {/* Room Details */}
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-semibold text-gray-800">{name}</h3>
        <p className="text-xs text-gray-600">{location}</p>
        <p className="text-sm font-semibold text-green-600">${price} / night</p>

        <button
          className="mt-1 w-auto p-2  bg-green-600 text-white text-xs font-medium rounded-md transition-all hover:bg-green-700"
          onClick={() => navigate(`/room/${room._id}`)}
        >
          View Details
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
