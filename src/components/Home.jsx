import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";

// Mock Data with Dummy Images
const mockOfferListings = [
  {
    _id: "1",
    imageUrls: ["https://via.placeholder.com/800x400"],
    title: "Special Offer 1",
  },
  {
    _id: "2",
    imageUrls: ["https://via.placeholder.com/800x400"],
    title: "Special Offer 2",
  },
  {
    _id: "3",
    imageUrls: ["https://via.placeholder.com/800x400"],
    title: "Special Offer 3",
  },
  {
    _id: "4",
    imageUrls: ["https://via.placeholder.com/800x400"],
    title: "Special Offer 4",
  },
];

const mockRentListings = [
  {
    _id: "5",
    title: "Rental Property 1",
    imageUrls: ["https://via.placeholder.com/800x400"],
  },
  {
    _id: "6",
    title: "Rental Property 2",
    imageUrls: ["https://via.placeholder.com/800x400"],
  },
  {
    _id: "7",
    title: "Rental Property 3",
    imageUrls: ["https://via.placeholder.com/800x400"],
  },
  {
    _id: "8",
    title: "Rental Property 4",
    imageUrls: ["https://via.placeholder.com/800x400"],
  },
];

const mockSaleListings = [
  {
    _id: "9",
    title: "For Sale 1",
    imageUrls: ["https://via.placeholder.com/800x400"],
  },
  {
    _id: "10",
    title: "For Sale 2",
    imageUrls: ["https://via.placeholder.com/800x400"],
  },
  {
    _id: "11",
    title: "For Sale 3",
    imageUrls: ["https://via.placeholder.com/800x400"],
  },
  {
    _id: "12",
    title: "For Sale 4",
    imageUrls: ["https://via.placeholder.com/800x400"],
  },
];

// Mock ListingItem Component
const ListingItem = ({ listing }) => (
  <div className="border rounded-lg p-3 w-full sm:w-1/4">
    <img
      src={listing.imageUrls[0]}
      alt={listing.title}
      className="rounded-lg w-full"
    />
    <h3 className="text-slate-600 mt-2 text-lg font-medium">{listing.title}</h3>
  </div>
);

export default function Home() {
  const [offerListings] = useState(mockOfferListings);
  const [rentListings] = useState(mockRentListings);
  const [saleListings] = useState(mockSaleListings);

  return (
    <div>
      {/* Hero Section */}
      <div className="flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto">
        <h1 className="text-slate-700 font-bold text-3xl lg:text-6xl">
          Find your next <span className="text-slate-500">perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Sahand Estate is the best place to find your next perfect place to
          live.
          <br />
          We have a wide range of properties for you to choose from.
        </div>
        <Link
          to="/search"
          className="text-xs sm:text-sm text-blue-800 font-bold hover:underline"
        >
          Let's get started...
        </Link>
      </div>

      {/* Swiper Carousel */}
      <Swiper navigation>
        {offerListings.map((listing) => (
          <SwiperSlide key={listing._id}>
            <div
              style={{
                background: `url(${listing.imageUrls[0]}) center no-repeat`,
                backgroundSize: "cover",
              }}
              className="h-[500px]"
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Listings Section */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {/* Offer Listings */}
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent offers
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline"
              to="/search?offer=true"
            >
              Show more offers
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {offerListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>

        {/* Rent Listings */}
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent places for rent
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline"
              to="/search?type=rent"
            >
              Show more places for rent
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {rentListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>

        {/* Sale Listings */}
        <div>
          <div className="my-3">
            <h2 className="text-2xl font-semibold text-slate-600">
              Recent places for sale
            </h2>
            <Link
              className="text-sm text-blue-800 hover:underline"
              to="/search?type=sale"
            >
              Show more places for sale
            </Link>
          </div>
          <div className="flex flex-wrap gap-4">
            {saleListings.map((listing) => (
              <ListingItem listing={listing} key={listing._id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
