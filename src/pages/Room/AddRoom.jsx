import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaUpload,
  FaMapMarkerAlt,
  FaHome,
  FaMoneyBillWave,
  FaRuler,
  FaBed,
  FaBath,
  FaParking,
  FaUtensils,
} from "react-icons/fa";
import { MdBalcony, MdKitchen } from "react-icons/md";
import { GiDirectionSigns } from "react-icons/gi";
import axios from "axios";

const LocationInput = ({ query, suggestions, onChange, onSelect }) => (
  <div className="mb-6">
    <div className="flex items-center mb-2">
      <FaMapMarkerAlt className="text-green-600 mr-2" />
      <label
        className="block text-lg font-semibold text-gray-800"
        htmlFor="location"
      >
        Location
      </label>
    </div>
    <div className="relative">
      <input
        type="text"
        id="location"
        value={query}
        onChange={onChange}
        placeholder="Enter location (e.g., Kathmandu, Nepal)"
        className="mt-1 block w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        aria-label="Location"
      />
      <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
    </div>
    {suggestions.length > 0 && (
      <ul className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
        {suggestions.map((location) => (
          <li
            key={location.place_id}
            onClick={() => onSelect(location)}
            className="cursor-pointer hover:bg-green-50 px-4 py-3 text-gray-700 border-b border-gray-100 last:border-b-0"
          >
            <p className="font-medium">{location.display_name.split(",")[0]}</p>
            <p className="text-sm text-gray-500">
              {location.display_name.split(",").slice(1).join(",")}
            </p>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AddRoom = () => {
  const user = useSelector((state) => state.user.currentUser);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user) return;
    if (!user.phone) {
      toast.error("Please update your phone number in your profile settings ");
      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    }
  }, [user, navigate]);

  if (!user) return null;
  if (!user.phone) return <ToastContainer />;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    size: "",
    category: "",
    bedrooms: "",
    bathrooms: "",
    kitchen: "",
    faced: "",
    parking: "",
    balcony: "",
    amenities: [],
    description: "",
    roomImages: [],
    vrImages: [],
    coordinates: { lat: null, lng: null },
    owner: user._id,
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [vrImagePreviews, setVrImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const amenitiesOptions = [
    "WiFi",
    "Parking",
    "Air Conditioning",
    "TV",
    "Heating",
    "Washing Machine",
    "Elevator",
    "Gym",
  ];

  const fetchLocations = async (searchText) => {
    if (searchText.length < 3) return; // Only search after 3 characters

    setIsLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${searchText}&countrycodes=np&limit=5`
      );
      setSuggestions(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchLocations(e.target.value);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location.display_name);
    setQuery(location.display_name);
    setSuggestions([]);
    setFormData({
      ...formData,
      location: location.display_name,
      coordinates: {
        lat: location.lat,
        lng: location.lon,
      },
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newRoomImages = [...formData.roomImages, ...files];
    setFormData({ ...formData, roomImages: newRoomImages });
    setImagePreviews(newRoomImages.map((file) => URL.createObjectURL(file)));
  };

  const handleVRFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newVRImages = [...formData.vrImages, ...files];
    setFormData({ ...formData, vrImages: newVRImages });
    setVrImagePreviews(newVRImages.map((file) => URL.createObjectURL(file)));
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevState) => {
      const updatedAmenities = checked
        ? [...prevState.amenities, value]
        : prevState.amenities.filter((amenity) => amenity !== value);
      return { ...prevState, amenities: updatedAmenities };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });
    console.log(formData);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "coordinates" || key === "amenities") {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key === "roomImages" || key === "vrImages") {
          formData[key].forEach((file) => data.append(key, file));
        } else {
          data.append(key, formData[key]);
        }
      });

      const response = await fetch("/api/room/upload", {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        setMessage({ text: "Room created successfully!", type: "success" });
        // Reset form
        setFormData({
          name: "",
          price: "",
          size: "",
          category: "",
          bedrooms: "",
          bathrooms: "",
          kitchen: "",
          faced: "",
          parking: "",
          balcony: "",
          amenities: [],
          description: "",
          roomImages: [],
          vrImages: [],
          coordinates: { lat: null, lng: null },
          owner: user._id,
        });
        setImagePreviews([]);
        setQuery("");
        setSelectedLocation("");
      } else {
        setMessage({
          text: result.message || "Error creating room",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage({
        text: "An error occurred while creating the room",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900">
            List Your Property
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Fill in the details to create your room listing
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-xl rounded-2xl overflow-hidden p-6 sm:p-8"
        >
          {/* Basic Information Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200 flex items-center">
              <FaHome className="text-green-600 mr-2" />
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Room Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                  placeholder="e.g., Cozy Apartment in Kathmandu"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="single room">Single Room</option>
                  <option value="two room">Two Room</option>
                  <option value="2 BHK">2 BHK</option>
                  <option value="4 BHK">4 BHK</option>
                  <option value="flat">Flat</option>
                  <option value="house">House</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaMoneyBillWave className="text-green-600 mr-2" />
                  Price (Rs)
                </label>
                <div className="relative mt-1 rounded-lg shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">Rs</span>
                  </div>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="block w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-green-500 focus:border-green-500"
                    required
                    placeholder="e.g., 25000"
                  />
                </div>
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaRuler className="text-green-600 mr-2" />
                  Size (sq ft)
                </label>
                <input
                  type="number"
                  name="size"
                  value={formData.size}
                  onChange={handleChange}
                  min="0"
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                  required
                  placeholder="e.g., 1200"
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              <FaMapMarkerAlt className="inline text-green-600 mr-2" />
              Location Details
            </h2>
            <LocationInput
              query={query}
              suggestions={suggestions}
              onChange={handleInputChange}
              onSelect={handleSelectLocation}
            />
          </div>

          {/* Property Details Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Property Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaBed className="text-green-600 mr-2" />
                  Bedrooms
                </label>
                <select
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaBath className="text-green-600 mr-2" />
                  Bathrooms
                </label>
                <select
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                </select>
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MdKitchen className="text-green-600 mr-2" />
                  Kitchen
                </label>
                <select
                  name="kitchen"
                  value={formData.kitchen}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select</option>
                  <option value="modular">Modular</option>
                  <option value="semi-modular">Semi-Modular</option>
                  <option value="standard">Standard</option>
                  <option value="none">None</option>
                </select>
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <GiDirectionSigns className="text-green-600 mr-2" />
                  Facing
                </label>
                <select
                  name="faced"
                  value={formData.faced}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select</option>
                  <option value="north">North</option>
                  <option value="south">South</option>
                  <option value="east">East</option>
                  <option value="west">West</option>
                </select>
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <FaParking className="text-green-600 mr-2" />
                  Parking
                </label>
                <select
                  name="parking"
                  value={formData.parking}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="covered">Covered</option>
                  <option value="open">Open</option>
                </select>
              </div>

              <div>
                <label className=" text-sm font-medium text-gray-700 mb-1 flex items-center">
                  <MdBalcony className="text-green-600 mr-2" />
                  Balcony
                </label>
                <select
                  name="balcony"
                  value={formData.balcony}
                  onChange={handleChange}
                  className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
            </div>
          </div>

          {/* Amenities Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Amenities
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {amenitiesOptions.map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    value={amenity}
                    checked={formData.amenities.includes(amenity)}
                    onChange={handleAmenityChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor={`amenity-${amenity}`}
                    className="ml-2 text-sm text-gray-700"
                  >
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Description
            </h2>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-green-500 focus:border-green-500"
              required
              placeholder="Describe your property in detail..."
            />
          </div>

          {/* Images Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
              Property Images
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Room Photos
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="roomImages"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                      >
                        <span>Upload files</span>
                        <input
                          id="roomImages"
                          name="roomImages"
                          type="file"
                          onChange={handleFileChange}
                          multiple
                          className="sr-only"
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload VR Tour Images (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                  <div className="space-y-1 text-center">
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="vrImages"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                      >
                        <span>Upload files</span>
                        <input
                          id="vrImages"
                          name="vrImages"
                          type="file"
                          onChange={handleVRFileChange}
                          multiple
                          className="sr-only"
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  </div>
                </div>
              </div>
            </div>

            {imagePreviews.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Images Preview
                </label>
                <div className="flex flex-wrap gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPreviews = [...imagePreviews];
                          newPreviews.splice(index, 1);
                          setImagePreviews(newPreviews);
                          const newImages = [...formData.roomImages];
                          newImages.splice(index, 1);
                          setFormData({ ...formData, roomImages: newImages });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {vrImagePreviews.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Vr Images Preview
                </label>
                <div className="flex flex-wrap gap-4">
                  {vrImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-32 h-32 object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newPreviews = [...vrImagePreviews];
                          newPreviews.splice(index, 1);
                          setVrImagePreviews(newPreviews);
                          const newImages = [...formData.vrImages];
                          newImages.splice(index, 1);
                          setFormData({ ...formData, vrImages: newImages });
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </>
              ) : (
                "List My Property"
              )}
            </button>
          </div>

          {message.text && (
            <div
              className={`mt-4 p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AddRoom;
