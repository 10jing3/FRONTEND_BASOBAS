import React, { useState } from "react";
import img from "../assets/chitwan.jpg";
import pkrimg from "../assets/pokhara.jpg";
import "swiper/swiper-bundle.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Link } from "react-router-dom";

const Home = () => {
  const [search, setSearch] = useState({ location: "", budget: "" });
  const [selectedCity, setSelectedCity] = useState(null);

  const cities = [
    {
      name: "Kathmandu",
      places: [
        {
          id: 1,
          title: "Spacious Apartment",
          price: "$500/month",
          location: "Kathmandu",
          rating: 4.5,
          image: img,
        },
        {
          id: 4,
          title: "Modern Studio Apartment",
          price: "$400/month",
          location: "Kathmandu",
          rating: 4.7,
          image: img, // Replace with actual image
        },
        {
          id: 5,
          title: "Shared Room in City Center",
          price: "$250/month",
          location: "Kathmandu",
          rating: 4.3,
          image: img, // Replace with actual image
        },
      ],
    },
    {
      name: "Pokhara",
      places: [
        {
          id: 2,
          title: "Cozy Room",
          price: "$300/month",
          location: "Pokhara",
          rating: 4.8,
          image: pkrimg,
        },
        {
          id: 6,
          title: "Lake View Apartment",
          price: "$700/month",
          location: "Pokhara",
          rating: 4.9,
          image: img, // Replace with actual image
        },
        {
          id: 7,
          title: "Affordable Single Room",
          price: "$200/month",
          location: "Pokhara",
          rating: 4.4,
          image: pkrimg, // Replace with actual image
        },
      ],
    },
    {
      name: "Lalitpur",
      places: [
        {
          id: 3,
          title: "Luxury Suite",
          price: "$800/month",
          location: "Lalitpur",
          rating: 4.2,
          image: img,
        },
        {
          id: 8,
          title: "Budget-Friendly Apartment",
          price: "$350/month",
          location: "Lalitpur",
          rating: 4.6,
          image: img, // Replace with actual image
        },
        {
          id: 9,
          title: "Elegant Condo",
          price: "$900/month",
          location: "Lalitpur",
          rating: 4.7,
          image: img, // Replace with actual image
        },
      ],
    },
    {
      name: "Bhaktapur",
      places: [
        {
          id: 10,
          title: "Traditional Heritage Apartment",
          price: "$600/month",
          location: "Bhaktapur",
          rating: 4.5,
          image: img, // Replace with actual image
        },
        {
          id: 11,
          title: "Family-Friendly House",
          price: "$700/month",
          location: "Bhaktapur",
          rating: 4.6,
          image: pkrimg, // Replace with actual image
        },
        {
          id: 12,
          title: "Single Room in Suburb",
          price: "$250/month",
          location: "Bhaktapur",
          rating: 4.2,
          image: pkrimg, // Replace with actual image
        },
      ],
    },
  ];

  const reviews = [
    {
      id: 1,
      name: "John Doe",
      review: "Rent with Confidence, Trust with Ease.",
      rating: "★★★★★",
      image: img, // Replace with actual image URL
    },
    {
      id: 2,
      name: "Jane Smith",
      review: "Excellent service and great options!",
      rating: "★★★★★",
      image: pkrimg, // Replace with actual image URL
    },
    {
      id: 3,
      name: "Alex Johnson",
      review: "Highly recommend for hassle-free rentals.",
      rating: "★★★★☆",
      image: img, // Replace with actual image URL
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
          <Link
            className="w-full md:w-auto px-8 py-4 bg-green-500 text-white rounded-xl font-semibold hover:bg-green-600 active:scale-95 focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
            to="/room"
          >
            Search
          </Link>
        </div>
      </section>

      <div>
        {/* Popular Cities Section */}
        <section className="p-6 bg-white">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Popular Cities
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {cities.map((city) => (
              <button
                key={city.name}
                onClick={() => setSelectedCity(city)}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                {city.name}
              </button>
            ))}
          </div>
        </section>

        {/* Display Selected City */}
        {selectedCity && (
          <section className="p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Places in {selectedCity.name}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {selectedCity.places.map((place) => (
                <div
                  key={place.id}
                  className="border rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transform transition-transform hover:scale-105"
                >
                  <img
                    src={place.image}
                    alt={place.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {place.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {place.location}
                    </p>
                    <p className="text-green-500 font-bold mt-2">
                      {place.price}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-yellow-500 text-sm font-medium">
                        ★ {place.rating}
                      </span>
                    </div>
                    <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      <section className="p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4 text-center">Popular Rooms</h2>
        <Swiper
          spaceBetween={16}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          loop={true} // Enables infinite scrolling
          navigation={true} // Enables navigation buttons
          pagination={{ clickable: true }} // Enables pagination
          className="mySwiper"
        >
          {cities
            .flatMap((city) => city.places)
            .map((place) => (
              <SwiperSlide key={place.id}>
                <div className="border rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transform transition-transform hover:scale-105 relative">
                  <img
                    src={place.image}
                    alt={place.title}
                    className="w-full h-56 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      {place.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                      {place.location}
                    </p>
                    <p className="text-green-500 font-bold mt-2">
                      {place.price}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-yellow-500 text-sm font-medium">
                        ★ {place.rating}
                      </span>
                    </div>
                    <button className="mt-3 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-300">
                      View Details
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </section>

      {/* Client Reviews Section */}
      <section className="p-6 bg-gray-100">
        <h2 className="text-2xl font-bold mb-4 text-center">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 shadow-md bg-white hover:shadow-lg transition-transform transform hover:scale-105"
            >
              <p className="italic text-gray-600 mb-4">“{review.review}”</p>
              <div className="flex items-center space-x-4">
                <img
                  src={review.image}
                  alt={review.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-gray-800">{review.name}</p>
                  <p className="text-yellow-500 text-sm">{review.rating}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
