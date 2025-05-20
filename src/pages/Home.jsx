import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import SearchBar from "../components/SearchBar";

import PropertyGrid from "../components/PropertyGrid";
import Testimonials from "../components/Testimonials";
import { FaArrowRight } from "react-icons/fa";

import heroImage from "../assets/chitwan.jpg";

const Home = ({}) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState({
    location: "",
    budget: "",
    bedrooms: "",
    category: "",
  });
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

    if (search.budget) {
      const budget = parseInt(search.budget, 10);
      queryParams.append("minBudget", Math.max(0, budget - 5000));
      queryParams.append("maxBudget", budget + 5000);
    }

    if (search.bedrooms) queryParams.append("bedrooms", search.bedrooms);
    if (search.category) queryParams.append("category", search.category);

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
          <SearchBar
            search={search}
            setSearch={setSearch}
            onSearch={handleSearch}
          />
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
          <PropertyGrid
            rooms={rooms}
            isLoading={isLoading}
            isRefetching={isRefetching}
            error={error}
            activeCity={activeCity}
            onRetry={() => window.location.reload()}
          />

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
      <Testimonials testimonials={testimonials} />

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
