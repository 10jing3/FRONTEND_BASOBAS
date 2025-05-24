import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Rotate3D } from "lucide-react";
import L from "leaflet";
import ReviewSection from "../../components/ReviewSection";
import {
  FaBed,
  FaBath,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaWifi,
  FaParking,
  FaTv,
  FaUtensils,
  FaSwimmingPool,
  FaDumbbell,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaTimes,
  FaStar, // Import FaStar
} from "react-icons/fa";
import {
  MdAcUnit,
  MdBalcony,
  MdPets,
  MdOutlineDescription,
  MdOutlineMiscellaneousServices,
} from "react-icons/md";
import { GiElevator } from "react-icons/gi";
import { IoIosArrowBack } from "react-icons/io";
import EsewaPayment from "../../components/EsewaPayment";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";

const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const SingleRoom = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [activeTab, setActiveTab] = useState("description");
  const [showToast, setShowToast] = useState(false);

  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(5); // optional if you want rating

  useEffect(() => {
    console.log("Fetching reviews for roomId:", roomId);
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`/api/room/getreviews/${roomId}`);
        console.log("Reviews fetched:", res.data.reviews);
        setReviews(res.data.reviews);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, [roomId]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.trim()) return;

    try {
      const res = await axios.post(`/api/room/createreview/${roomId}`, {
        userId: currentUser._id,
        comment: newReview,
        rating,
      });

      setReviews((prev) => [...prev, res.data.review]);
      setNewReview("");
      toast.success("Review posted!");
    } catch (err) {
      console.error("Error posting review:", err);
      if (err.response) {
        console.error("Server response:", err.response.data);
      }
      toast.error("Failed to post review.");
    }
  };

  useEffect(() => {
    const fetchRoomAndOwner = async () => {
      try {
        setLoading(true);
        const roomResponse = await axios.get(`/api/room/rooms/${roomId}`);
        setRoom(roomResponse.data);

        if (roomResponse.data.owner) {
          const ownerResponse = await axios.get(
            `/api/user/getbyid/${roomResponse.data.owner}`
          );
          setOwner(ownerResponse.data);
        }
      } catch (err) {
        setError("Failed to fetch room details. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRoomAndOwner();
  }, [roomId]);

  useEffect(() => {
    if (room?.roomImages?.length > 0) {
      setMainImage(room.roomImages[0]);
    }
  }, [room]);

  const handleBookNow = async () => {
    if (!currentUser) {
      toast.error("Log in first to Book Rooms");
      setTimeout(() => navigate("/sign-up"), 2000);
      return;
    }

    try {
      const res = await axios.post("/api/booking/request", {
        roomId: room._id,
        userId: currentUser._id,
      });

      toast.success(
        res.data?.message || "Booking request sent! Await owner's approval."
      );
    } catch (err) {
      console.error("Booking error:", err); // Helpful for debugging
      toast.error(
        err.response?.data?.message || "Failed to send booking request."
      );
    }
  };
  const handleCancel = () => {
    setShowToast(false);
  };
  const handleRoomTour = () => navigate(`/vr-room/${roomId}`);
  const handleThumbnailClick = (image) => setMainImage(image);
  const handleLogin = () => {
    toast.error("Log in first to Book Rooms");
    setTimeout(() => {
      navigate("/sign-up");
    }, 2000);
  };

  const renderAmenityIcon = (amenity) => {
    const icons = {
      wifi: <FaWifi className="text-green-600" />,
      parking: <FaParking className="text-green-600" />,
      tv: <FaTv className="text-green-600" />,
      kitchen: <FaUtensils className="text-green-600" />,
      ac: <MdAcUnit className="text-green-600" />,
      pool: <FaSwimmingPool className="text-green-600" />,
      gym: <FaDumbbell className="text-green-600" />,
      balcony: <MdBalcony className="text-green-600" />,
      pets: <MdPets className="text-green-600" />,
      elevator: <GiElevator className="text-green-600" />,
    };
    return (
      icons[amenity] || (
        <MdOutlineMiscellaneousServices className="text-green-600" />
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <Skeleton height={500} className="rounded-2xl" />
            <div className="flex mt-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton
                  key={i}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton height={40} width="80%" />
            <Skeleton height={24} width="60%" />
            <div className="flex gap-4 my-6">
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={100} />
              <Skeleton height={20} width={100} />
            </div>
            <Skeleton height={100} count={3} />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => window.location.reload()}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-lg shadow-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-500"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">
                Room Not Found
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>
                  The room you're looking for doesn't exist or may have been
                  removed.
                </p>
              </div>
              <div className="mt-4">
                <button
                  onClick={() => navigate("/")}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const {
    name,
    price,
    location,
    available,
    roomImages = [],
    vrImages = [],
    description,
    coordinates,
    bedrooms,
    category,
    bathrooms,
    size,
    faced,
    parking,
    kitchen,
    amenities = [],
  } = room;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <IoIosArrowBack className="mr-2" />
        Back to results
      </button>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="relative rounded-2xl overflow-hidden shadow-lg bg-gray-100">
            {mainImage ? (
              <div className="relative">
                <img
                  src={mainImage}
                  alt={name}
                  className="w-full h-[500px] object-cover transition-opacity duration-300"
                />
                <div className="absolute top-4 right-4">
                  {vrImages[0] ? (
                    <button
                      onClick={handleRoomTour}
                      className="inline-flex items-center justify-center p-2 bg-indigo-500 text-neutral-100 rounded-full transition-colors duration-200 hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-1 shadow-md hover:shadow-lg cursor-pointer"
                    >
                      <Rotate3D size={24} />
                      <span className="sr-only">Virtual Room Tour</span>
                    </button>
                  ) : (
                    <div className="inline-flex items-center justify-center p-2 bg-neutral-300 text-neutral-100 rounded-full shadow cursor-not-allowed">
                      <Rotate3D size={24} />
                      <span className="sr-only">
                        Virtual Room Tour Unavailable
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="w-full h-[500px] flex items-center justify-center text-gray-400">
                No Image Available
              </div>
            )}
            {roomImages.length > 1 && (
              <div className="absolute bottom-4 left-0 right-0 px-4">
                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {roomImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => handleThumbnailClick(image)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                        mainImage === image
                          ? "border-green-500 scale-105"
                          : "border-transparent opacity-80 hover:opacity-100 hover:border-gray-200"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Room Details */}
        <div>
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
              {category && (
                <span className="inline-block bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full mt-2 mb-1 uppercase tracking-wide">
                  {category}
                </span>
              )}
              <div className="flex items-center text-gray-600 mt-2">
                <FaMapMarkerAlt className="mr-2 text-green-600" />
                <span>{location.split(",")[0]}</span>
              </div>
              {/* --- Review Summary --- */}
              <div className="flex items-center gap-2 mt-2">
                <span className="flex items-center">
                  {reviews.length > 0 ? (
                    <>
                      {[
                        ...Array(
                          Math.round(
                            reviews.reduce(
                              (acc, r) => acc + (r.rating || 0),
                              0
                            ) / reviews.length || 0
                          )
                        ),
                      ].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400" />
                      ))}
                      <span className="ml-2 text-gray-700 font-semibold">
                        {(
                          reviews.reduce((acc, r) => acc + (r.rating || 0), 0) /
                          reviews.length
                        ).toFixed(1)}
                      </span>
                      <span className="ml-2 text-gray-500 text-sm">
                        ({reviews.length} review
                        {reviews.length !== 1 ? "s" : ""})
                      </span>
                    </>
                  ) : (
                    <>
                      <FaStar className="text-yellow-400" />
                      <span className="ml-2 text-gray-700 font-semibold">
                        0.0
                      </span>
                      <span className="ml-2 text-gray-500 text-sm">
                        (0 reviews)
                      </span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Room Specs */}
            <div className="grid grid-cols-3 gap-4 py-4 border-y border-gray-200 mb-6">
              <div className="flex flex-col items-center">
                <div className="flex items-center text-green-600 mb-1">
                  <FaBed className="mr-2" />
                  <span className="font-medium">{bedrooms}</span>
                </div>
                <span className="text-xs text-gray-500">BEDROOMS</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center text-green-600 mb-1">
                  <FaBath className="mr-2" />
                  <span className="font-medium">{bathrooms}</span>
                </div>
                <span className="text-xs text-gray-500">BATHROOMS</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center text-green-600 mb-1">
                  <FaRulerCombined className="mr-2" />
                  <span className="font-medium">{size}</span>
                </div>
                <span className="text-xs text-gray-500">SQ. FT.</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center text-green-600 mb-1">
                  <span className="font-medium">{kitchen}</span>
                </div>
                <span className="text-xs text-gray-500">KITCHEN</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center text-green-600 mb-1">
                  <span className="font-medium">{faced}</span>
                </div>
                <span className="text-xs text-gray-500">SIDE</span>
              </div>
              <div className="flex flex-col items-center">
                <div className="flex items-center text-green-600 mb-1">
                  <span className="font-medium">{parking}</span>
                </div>
                <span className="text-xs text-gray-500">PARKING</span>
              </div>
            </div>

            {/* Price and Availability */}
            <div className="flex justify-between items-center bg-green-50 p-4 rounded-lg mb-6">
              <div>
                <span className="text-2xl font-bold text-green-700">
                  Rs{price.toLocaleString()}
                </span>
                <span className="text-gray-500 ml-1">/month</span>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  available
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {available ? "Available Now" : "Not Available"}
              </span>
            </div>
            {/* Action Buttons */}
            <div className="space-y-4">
              {!currentUser ? (
                <div>
                  <button
                    onClick={handleLogin}
                    className="w-full py-3 px-6 bg-green-600 text-white text-lg font-medium rounded-xl transition-all hover:bg-green-700 shadow-md hover:shadow-lg"
                  >
                    Book Now
                  </button>
                  <ToastContainer />
                </div>
              ) : available ? (
                <button
                  onClick={handleBookNow}
                  className="w-full py-3 px-6 bg-green-600 text-white text-lg font-medium rounded-xl transition-all hover:bg-green-700 shadow-md hover:shadow-lg"
                >
                  Book Now
                </button>
              ) : (
                <button
                  disabled
                  className="w-full py-3 px-6 bg-gray-300 text-white text-lg font-medium rounded-xl cursor-not-allowed shadow"
                >
                  Currently Unavailable
                </button>
              )}
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex space-x-8">
                  <button
                    onClick={() => setActiveTab("description")}
                    className={`py-3 px-1 font-medium text-sm border-b-2 flex items-center ${
                      activeTab === "description"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MdOutlineDescription className="mr-2" />
                    Description
                  </button>
                  <button
                    onClick={() => setActiveTab("amenities")}
                    className={`py-3 px-1 font-medium text-sm border-b-2 flex items-center ${
                      activeTab === "amenities"
                        ? "border-green-500 text-green-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    <MdOutlineMiscellaneousServices className="mr-2" />
                    Amenities
                  </button>
                </nav>
              </div>

              {/* Tab Content */}
              <div className="min-h-[120px] mb-8">
                {activeTab === "description" && (
                  <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                )}
                {activeTab === "amenities" && (
                  <div className="grid grid-cols-2 gap-4">
                    {amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center bg-gray-50 p-3 rounded-lg"
                      >
                        <div className="text-green-600 mr-3">
                          {renderAmenityIcon(amenity)}
                        </div>
                        <span className="text-gray-700 capitalize font-medium">
                          {amenity}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Owner Profile */}
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Property Owner
            </h2>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={
                    owner?.profilePicture ||
                    "https://ui-avatars.com/api/?name=" +
                      encodeURIComponent(owner?.name || "Owner") +
                      "&background=random"
                  }
                  alt={owner?.username}
                  className="w-24 h-24 rounded-full object-cover border-2 border-green-100"
                />
              </div>
              <div className="flex-grow">
                {owner ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {owner.username}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex items-center">
                        <FaEnvelope className="mr-2 text-green-600" />
                        <span>{owner.email}</span>
                      </div>
                      {owner.phone && (
                        <div className="flex items-center">
                          <FaPhone className="mr-2 text-green-600" />
                          <span>{owner.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center">
                        <FaCalendarAlt className="mr-2 text-green-600" />
                        <span>
                          Member since:{" "}
                          {new Date(owner.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {owner.bio && (
                      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-700 italic">"{owner.bio}"</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-gray-500 italic">
                    Owner information not available
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        {coordinates && (
          <div className="bg-white p-6 rounded-2xl shadow-lg mt-8 w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              <FaMapMarkerAlt className="inline mr-2 text-green-600" />
              Location
            </h2>
            <div className="h-96 w-full rounded-xl overflow-hidden">
              <MapContainer
                center={[coordinates.lat, coordinates.lng]}
                zoom={15}
                className="h-full w-full"
                style={{ width: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <Marker
                  position={[coordinates.lat, coordinates.lng]}
                  icon={customIcon}
                >
                  <Popup className="font-medium">{name}</Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        )}

        {/* Review Section - always full width and below the map */}
        <div className="w-full">
          <ReviewSection
            reviews={reviews}
            newReview={newReview}
            setNewReview={setNewReview}
            rating={rating}
            setRating={setRating}
            handleReviewSubmit={handleReviewSubmit}
          />
        </div>
        {/* Payment Modal */}
        {showToast && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-md w-full relative">
              <button
                onClick={handleCancel}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <FaTimes className="text-xl" />
              </button>
              <div className="p-6">
                <EsewaPayment amount={price} roomId={roomId} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleRoom;
