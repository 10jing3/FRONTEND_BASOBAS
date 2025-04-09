import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import img1 from "../assets/chitwan.jpg";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import RoomCard from "../components/RoomCard";
import {
  FaSearch,
  FaStar,
  FaMapMarkerAlt,
  FaQuoteLeft,
  FaArrowRight,
} from "react-icons/fa";
import { MdOutlineAttachMoney } from "react-icons/md";

// Sample images (replace with your actual imports)
const heroImage = img1;
const profileImage1 = "https://randomuser.me/api/portraits/women/44.jpg";
const profileImage2 = "https://randomuser.me/api/portraits/men/32.jpg";
const profileImage3 = "https://randomuser.me/api/portraits/women/68.jpg";

const Home = () => {
  const [search, setSearch] = useState({ location: "", budget: "" });
  const [activeCity, setActiveCity] = useState("All");

  const {
    data: rooms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await axios.get("/api/room/rooms");
      return res.data;
    },
  });

  const cities = ["All", "Kathmandu", "Pokhara", "Chitwan", "Lumbini"];

  const testimonials = [
    {
      id: 1,
      name: "Sophia Williams",
      review:
        "Found my dream apartment within a week! The process was so smooth and the team was incredibly helpful.",
      rating: 5,
      image: profileImage1,
      location: "Kathmandu",
    },
    {
      id: 2,
      name: "James Rodriguez",
      review:
        "As an expat, I was worried about finding a good place, but this platform made it effortless. Highly recommend!",
      rating: 5,
      image: profileImage2,
      location: "Pokhara",
    },
    {
      id: 3,
      name: "Emma Johnson",
      review:
        "The virtual tours saved me so much time. I could shortlist properties without physically visiting each one.",
      rating: 4,
      image: profileImage3,
      location: "Chitwan",
    },
  ];

  const features = [
    {
      title: "Verified Listings",
      description: "All properties are personally verified by our team",
      icon: "✅",
    },
    {
      title: "Virtual Tours",
      description: "Explore properties from the comfort of your home",
      icon: "🖥️",
    },
    {
      title: "No Brokerage",
      description: "Direct owner contact with zero brokerage fees",
      icon: "💰",
    },
    {
      title: "24/7 Support",
      description: "Our team is always available to assist you",
      icon: "📞",
    },
  ];

  return (
    <div className="font-sans bg-gray-50">
      {/* Hero Section */}
      <section
        className="relative h-screen max-h-[800px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})`,
        }}
      >
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Find Your Perfect <span className="text-green-400">Home</span>
          </h1>
          <p className="text-xl text-white mb-10 max-w-2xl mx-auto">
            Discover thousands of rental properties across Nepal with our
            trusted platform
          </p>

          {/* Search Box */}
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaMapMarkerAlt className="text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Location (City, Area)"
                  value={search.location}
                  onChange={(e) =>
                    setSearch({ ...search, location: e.target.value })
                  }
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MdOutlineAttachMoney className="text-gray-400 text-xl" />
                </div>
                <input
                  type="number"
                  placeholder="Max Budget"
                  value={search.budget}
                  onChange={(e) =>
                    setSearch({ ...search, budget: e.target.value })
                  }
                  className="pl-10 w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <Link
                to="/room"
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
              >
                <FaSearch className="mr-2" />
                Search Properties
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Featured Properties
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our curated selection of premium rental properties across
              Nepal
            </p>
          </div>

          {/* City Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setActiveCity(city)}
                className={`px-5 py-2 rounded-full transition ${
                  activeCity === city
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Properties Grid */}
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-600">
                Error loading properties. Please try again later.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {rooms
                ?.filter(
                  (room) => activeCity === "All" || room.location === activeCity
                )
                .slice(0, 8)
                .map((room) => (
                  <RoomCard key={room._id} room={room} />
                ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link
              to="/room"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition"
            >
              View All Properties <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from people who found their perfect home through us
            </p>
          </div>

          <Swiper
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            modules={[Autoplay, Pagination, Navigation]}
            className="pb-12"
          >
            {testimonials.map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="bg-gray-50 p-6 rounded-xl h-full">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4"
                    />
                    <div>
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            className={
                              i < testimonial.rating ? "" : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <FaQuoteLeft className="text-gray-300 text-xl mb-3" />
                  <p className="text-gray-700 mb-4">{testimonial.review}</p>
                  <div className="flex items-center text-sm text-gray-500">
                    <FaMapMarkerAlt className="mr-1" />
                    {testimonial.location}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </div>
  );
};

export default Home;
