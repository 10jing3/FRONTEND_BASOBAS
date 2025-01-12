import React, { useState } from "react";
import img from "../assets/chitwan.jpg";
import pkrimg from "../assets/pokhara.jpg";
import Footer from "./Footer";

const Home = () => {
  const [search, setSearch] = useState({ location: "", budget: "" });

  const hostels = [
    {
      id: 1,
      title: "Spacious Apartment",
      price: "$500/month",
      location: "Kathmandu",
      rating: 4.5,
      featured: true,
      image: img,
    },
    {
      id: 2,
      title: "Cozy Room",
      price: "$300/month",
      location: "Pokhara",
      rating: 4.8,
      featured: false,
      image: pkrimg,
    },
    {
      id: 3,
      title: "Luxury Suite",
      price: "$800/month",
      location: "Lalitpur",
      rating: 4.2,
      featured: true,
      image: img,
    },
  ];

  const reviews = [
    {
      id: 1,
      name: "John Doe",
      review: "“Rent with Confidence, Trust with Ease.”",
      rating: "★★★★★",
      image: img,
    },
    {
      id: 2,
      name: "Jane Smith",
      review: "“Excellent service and great options!”",
      rating: "★★★★★",
      image: pkrimg,
    },
    {
      id: 3,
      name: "Alex Johnson",
      review: "“Highly recommend for hassle-free rentals.”",
      rating: "★★★★☆",
      image: img,
    },
  ];

  return (
    <div className="font-sans">
      {/* Header Section */}
      <header
        className="relative h-[700px] bg-cover bg-center"
        style={{ backgroundImage: `url(${img})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
          <h1 className="text-white text-4xl md:text-5xl font-bold">
            Let’s find you a <span className="text-green-500">home!</span>
          </h1>
        </div>
      </header>

      {/* Search Section */}
      <section className="p-8 bg-gray-100">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
          <input
            type="text"
            placeholder="Enter Location (e.g., Kathmandu)"
            value={search.location}
            onChange={(e) => setSearch({ ...search, location: e.target.value })}
            className="flex-1 p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow placeholder-gray-500 text-gray-700"
          />
          <input
            type="number"
            placeholder="Max Budget (e.g., 500)"
            value={search.budget}
            onChange={(e) => setSearch({ ...search, budget: e.target.value })}
            className="flex-1 p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow placeholder-gray-500 text-gray-700"
          />
          <button className="w-full md:w-auto px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all">
            Search
          </button>
        </div>
      </section>

      {/* Popular Hostels Section */}
      <section className="p-6">
        <h2 className="text-2xl font-bold mb-4 text-center">Popular Rooms</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <div
              key={hostel.id}
              className="border rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transform transition-transform hover:scale-105 relative"
            >
              {hostel.featured && (
                <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                  Featured
                </div>
              )}
              <img
                src={hostel.image}
                alt={hostel.title}
                className="w-full h-70 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800">
                  {hostel.title}
                </h3>
                <p className="text-sm text-gray-500 mt-2">{hostel.location}</p>
                <p className="text-green-500 font-bold mt-2">{hostel.price}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className="text-yellow-500 text-sm font-medium">
                    ★ {hostel.rating}
                  </span>
                  <p className="text-gray-500 text-sm">(100+ Reviews)</p>
                </div>
                <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Client Reviews Section */}
      <section className="p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-center">Client Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg"
            >
              <p className="text-sm text-gray-600">{review.review}</p>
              <div className="mt-4 flex items-center space-x-2">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold">{review.name}</p>
                  <div className="text-yellow-400 text-sm">{review.rating}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
