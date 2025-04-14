import React from "react";
import { useNavigate } from "react-router-dom";
import Carousel from "./Carousel";
import {
  FaMapMarkerAlt,
  FaRupeeSign,
  FaBed,
  FaBath,
  FaRulerCombined,
} from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();
  const { name, price, location, roomImages, bedrooms, bathrooms } = room;

  return (
    <div className="border rounded-xl shadow-md bg-white overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Room Image Carousel */}
      <div className="w-full h-48 overflow-hidden">
        <Carousel images={roomImages} />
      </div>

      {/* Room Details */}
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-bold text-gray-800 truncate">{name}</h3>
          <div className="flex items-center text-gray-600 text-sm mt-1">
            <FaMapMarkerAlt className="mr-1 text-gray-400" />
            {location ? location.split(",")[0] : location}
          </div>
        </div>

        <div className="flex justify-between text-sm text-gray-700">
          <div className="flex items-center space-x-2">
            <span className="flex items-center">
              <FaBed className="mr-1 text-gray-500" /> {bedrooms}
            </span>
            <span className="flex items-center">
              <FaBath className="mr-1 text-gray-500" /> {bathrooms}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center">
            <FaRupeeSign className="text-green-600" />
            <span className="text-lg font-bold text-green-600 ml-1">
              {price}
            </span>
            <span className="text-gray-500 text-sm ml-1"></span>
          </div>

          <button
            className="flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg transition-all hover:bg-green-700"
            onClick={() => navigate(`/room/${room._id}`)}
          >
            View Details <IoIosArrowForward className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
