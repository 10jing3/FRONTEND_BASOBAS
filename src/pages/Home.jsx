import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

// Sample hero image (replace with your actual import)
import heroImage from "../assets/chitwan.jpg";

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ location: "", budget: "" });
  const [activeCity, setActiveCity] = useState("All");

  // Fetch rooms based on active city filter
  const {
    data: rooms,
    isLoading,
    error,
    isRefetching,
  } = useQuery({
    queryKey: ["rooms", activeCity],
    queryFn: async () => {
      if (activeCity === "All") {
        const res = await axios.get("/api/room/rooms");
        return res.data;
      } else {
        const res = await axios.get(`/api/room/search?location=${activeCity}`);
        return res.data.rooms || [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const cities = ["All", "Kathmandu", "Pokhara", "Chitwan", "Lumbini"];

  const testimonials = [
    {
      id: 1,
      name: "Sophia Williams",
      review:
        "Found my dream apartment within a week! The process was so smooth and the team was incredibly helpful.",
      rating: 5,
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      location: "Kathmandu",
    },
    {
      id: 2,
      name: "James Rodriguez",
      review:
        "As an expat, I was worried about finding a good place, but this platform made it effortless. Highly recommend!",
      rating: 5,
      image: "https://randomuser.me/api/portraits/men/32.jpg",
      location: "Pokhara",
    },
    {
      id: 3,
      name: "Emma Johnson",
      review:
        "The virtual tours saved me so much time. I could shortlist properties without physically visiting each one.",
      rating: 4,
      image: "https://randomuser.me/api/portraits/women/68.jpg",
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

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (search.location) queryParams.append("location", search.location);
    if (search.budget) queryParams.append("price", search.budget);
    navigate(`/search?${queryParams.toString()}`);
  };

  const handleCityFilter = (city) => {
    setActiveCity(city);
  };

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
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 flex items-center justify-center"
                onClick={handleSearch}
              >
                <FaSearch className="mr-2" />
                Search Properties
              </button>
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
                onClick={() => handleCityFilter(city)}
                className={`px-5 py-2 rounded-full transition ${
                  activeCity === city
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {city}
              </button>
            ))}
          </div>

          {/* Properties Grid */}
          {isLoading || isRefetching ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-100 rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12 bg-red-50 rounded-lg">
              <p className="text-red-600">
                Error loading properties. Please try again later.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {rooms?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {rooms.map((room) => (
                    <RoomCard key={room._id} room={room} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">
                    No properties found in {activeCity}. Try another location.
                  </p>
                </div>
              )}
            </>
          )}

          <div className="text-center mt-10">
            <Link
              to="/search"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition shadow-md hover:shadow-lg"
            >
              View All Properties <FaArrowRight className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-gray-50">
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
                <div className="bg-white p-6 rounded-xl h-full shadow-md hover:shadow-lg transition-shadow">
                  <div className="flex items-center mb-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="w-12 h-12 rounded-full object-cover mr-4 border-2 border-green-100"
                    />
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {testimonial.name}
                      </h4>
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
                    <FaMapMarkerAlt className="mr-1 text-green-600" />
                    {testimonial.location}
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Why Choose Us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We make finding your perfect home simple and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
