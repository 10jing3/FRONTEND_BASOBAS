import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import SwiperCore from "swiper";
import "swiper/css/bundle";
import homeImage from "../assets/house.jpg";
import kathmanduImg from "../assets/kathmandu.jpg";
import chitwanImg from "../assets/chitwan.jpg";
import pokharaImg from "../assets/pokhara.jpg";

SwiperCore.use([Navigation]);

export default function LandingPage() {
  // Dummy Data
  const dummyListings = [
    {
      id: 1,
      title: "Modern Apartment in Kathmandu",
      price: "$400/month",
      image: kathmanduImg,
    },
    {
      id: 2,
      title: "Cozy Studio in Chitwan",
      price: "$300/month",
      image: chitwanImg,
    },
    {
      id: 3,
      title: "Spacious Flat in Bhaktapur",
      price: "$500/month",
      image: homeImage,
    },
    {
      id: 4,
      title: "Luxury Condo in Pokhara",
      price: "$700/month",
      image: pokharaImg,
    },
  ];

  return (
    <div>
      {/* Above Images Section */}
      <div className="bg-gray-100 py-10">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <img
              src={kathmanduImg}
              alt="Kathmandu"
              className="rounded-lg w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white font-bold text-lg">Kathmandu</h3>
            </div>
          </div>
          <div className="relative">
            <img
              src={chitwanImg}
              alt="Chitwan"
              className="rounded-lg w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white font-bold text-lg">Chitwan</h3>
            </div>
          </div>
          <div className="relative">
            <img
              src={pokharaImg}
              alt="Pokhara"
              className="rounded-lg w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white font-bold text-lg">Pokhara</h3>
            </div>
          </div>
          <div className="relative">
            <img
              src={homeImage}
              alt="Bhaktapur"
              className="rounded-lg w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <h3 className="text-white font-bold text-lg">Bhaktapur</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <div
        className="flex flex-col gap-6 p-10 sm:p-28 px-3 max-w-6xl mx-auto text-center"
        style={{
          backgroundImage: `url(${homeImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="text-white font-bold text-3xl lg:text-6xl bg-black bg-opacity-50 p-4 rounded">
          Find your next <span className="text-blue-300">perfect</span> place
        </h1>
        <p className="text-gray-200 text-sm sm:text-base bg-black bg-opacity-50 p-4 rounded">
          Discover a wide range of properties tailored for you. Whether you're
          looking for a cozy apartment or a luxurious home, we have it all.
        </p>
        <Link
          to="/search"
          className="text-sm sm:text-base text-blue-300 font-bold hover:underline bg-black bg-opacity-50 p-2 rounded inline-block"
        >
          Start exploring now...
        </Link>
      </div>

      {/* Swiper Slider */}
      <Swiper navigation className="my-10">
        {dummyListings.map((listing) => (
          <SwiperSlide key={listing.id}>
            <div
              style={{
                background: `url(${listing.image}) center no-repeat`,
                backgroundSize: "cover",
              }}
              className="h-[500px] flex items-end justify-center text-white bg-black bg-opacity-30"
            >
              <div className="p-4 bg-black bg-opacity-50 w-full text-center">
                <h3 className="text-xl font-bold">{listing.title}</h3>
                <p className="text-lg">{listing.price}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        <div>
          <h2 className="text-2xl font-semibold text-slate-600 mb-3">
            Recent Listings
          </h2>
          <div className="flex flex-wrap gap-4">
            {dummyListings.map((listing) => (
              <div
                key={listing.id}
                className="bg-white shadow-lg rounded-lg p-4 max-w-xs"
              >
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-40 rounded-lg object-cover"
                />
                <h3 className="text-lg font-semibold mt-3">{listing.title}</h3>
                <p className="text-gray-500">{listing.price}</p>
                <Link
                  to={`/details/${listing.id}`}
                  className="text-blue-600 text-sm hover:underline mt-2 block"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
