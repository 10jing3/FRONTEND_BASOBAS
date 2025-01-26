import React from "react";

const RoomCard = ({ title, price, location, image }) => {
  return (
    <div className="flex bg-white shadow-md rounded-md overflow-hidden mb-4">
      <img src={image} alt={title} className="w-1/3 object-cover" />
      <div className="p-4 w-2/3">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-gray-500">{location}</p>
        <p className="text-green-500 font-semibold text-lg">£{price}</p>
        <button className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">
          Booking
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
