import React, { useState } from "react";
import img from "../assets/chitwan.jpg";
import pkrimg from "../assets/pokhara.jpg";
import Map from "../components/Map";

const RoomDetail = () => {
  const [moveInDate, setMoveInDate] = useState("");
  const [moveOutDate, setMoveOutDate] = useState("");
  const [guests, setGuests] = useState(1);

  const room = {
    title: "Rhoncus suspendisse",
    location: "London, Notting Hill",
    price: "£3990 / Month",
    description: `A trendy global city, London has long been considered a cutting-edge metropolis and hub for culture, business, and adventure. This apartment offers a unique mix of elegance and comfort in the heart of the city.`,
    details: {
      bedrooms: 2,
      bathrooms: 2,
      size: "500 sq ft",
      floor: "3rd floor",
      extras: ["City view", "Elevator"],
    },
    averageRent: "£3700",
    images: [
      img, // Replace with actual URLs
      img,
      pkrimg,
      pkrimg,
    ],
    map: "https://via.placeholder.com/600x400", // Replace with actual map embed or library
    virtualTour: "https://www.youtube.com/watch?v=UFu3turh2GI", // Replace with actual virtual tour video link
  };

  const totalCost = () => {
    const bookingCost = parseFloat(room.price.split(" ")[0].replace("£", ""));
    return bookingCost + 120; // Example fixed VAT cost
  };

  return (
    <div className="container mx-auto px-4 py-6 font-sans">
      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <img
          src={room.images[0]}
          alt={room.title}
          className="col-span-2 w-full h-96 object-cover rounded-lg"
        />
        <div className="grid grid-cols-2 gap-2">
          {room.images.slice(1).map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`${room.title} ${index + 1}`}
              className="w-full h-44 object-cover rounded-lg"
            />
          ))}
        </div>
      </div>

      {/* Room Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Section */}
        <div className="col-span-2 space-y-6">
          <h1 className="text-3xl font-bold">{room.title}</h1>
          <p className="text-gray-600">{room.location}</p>
          <p className="text-gray-500">
            {room.details.bedrooms} bedrooms • {room.details.bathrooms}{" "}
            bathrooms • {room.details.size} • {room.details.floor}
          </p>
          <p className="text-gray-500">
            Extras: {room.details.extras.join(", ")}
          </p>

          <h2 className="text-xl font-semibold">Description</h2>
          <p className="text-gray-700">{room.description}</p>
        </div>

        {/* Booking Section */}
        <div className="p-6 bg-gray-100 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">{room.price}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Move in
              </label>
              <input
                type="date"
                value={moveInDate}
                onChange={(e) => setMoveInDate(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Move out
              </label>
              <input
                type="date"
                value={moveOutDate}
                onChange={(e) => setMoveOutDate(e.target.value)}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Guests
              </label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                min="1"
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring focus:ring-green-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-gray-700">
              Average monthly rent:{" "}
              <span className="font-semibold">{room.averageRent}</span>
            </p>
            <p className="text-gray-700">
              Total cost:{" "}
              <span className="font-semibold">
                £{totalCost().toFixed(2)} (incl. VAT)
              </span>
            </p>
          </div>

          <button className="mt-4 w-full px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300">
            Continue booking
          </button>
        </div>
      </div>

      {/* Virtual Room Tour Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Virtual Room Tour</h2>
        <div className="w-full h-80 aspect-w-16 aspect-h-9 bg-black rounded-lg overflow-hidden">
          <iframe
            src="https://www.youtube.com/embed/UFu3turh2GI" // Correct embed URL
            title="Virtual Room Tour"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-none"
          ></iframe>
        </div>
      </section>

      {/* Location Section */}
      <section className="mt-12">
        <h2 className="text-2xl font-bold mb-4">Location</h2>
        <div className="w-full h-96 bg-gray-200 rounded-lg overflow-hidden">
          <Map />
        </div>
      </section>
    </div>
  );
};

export default RoomDetail;
