import React, { useState } from "react";
import { useSelector } from "react-redux";

const AMENITIES = [
  "WiFi",
  "Air Conditioning",
  "Pool",
  "Gym",
  "Breakfast",
  "Parking",
  "Spa",
  "Jacuzzi",
  "Restaurant",
  "Bar",
  "Room Service",
  "Airport Shuttle",
  "Childcare",
  "Laundry",
  "Business Center",
  "Pet Friendly",
  "Beachfront",
];

const LocationInput = ({ query, suggestions, onChange, onSelect }) => (
  <div className="mb-6">
    <label
      className="block text-lg font-semibold text-gray-800"
      htmlFor="location"
    >
      Location
    </label>
    <input
      type="text"
      id="location"
      value={query}
      onChange={onChange}
      placeholder="Enter location"
      className="mt-2 block w-full px-4 py-3 border border-green-500 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
      aria-label="Location"
    />
    {suggestions.length > 0 && (
      <ul className="bg-white shadow-lg mt-2 rounded-md max-h-48 overflow-y-auto border border-green-300">
        {suggestions.map((location) => (
          <li
            key={location.place_id}
            onClick={() => onSelect(location)}
            className="cursor-pointer hover:bg-green-100 px-3 py-2 text-gray-700"
          >
            {location.display_name}
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AmenityCheckboxes = ({ amenities, onChange }) => (
  <div className="mb-6">
    <label className="block text-lg font-semibold text-gray-800">
      Amenities
    </label>
    <div className="flex flex-wrap gap-6 mt-2">
      {AMENITIES.map((amenity) => (
        <label key={amenity} className="inline-flex items-center text-gray-700">
          <input
            type="checkbox"
            value={amenity}
            checked={amenities.includes(amenity)}
            onChange={onChange}
            className="mr-2 border-green-400 rounded-lg focus:ring-green-500"
            aria-label={amenity}
          />
          {amenity}
        </label>
      ))}
    </div>
  </div>
);

const RoomForm = () => {
  const user = useSelector((state) => state.user.currentUser);
  console.log("user_id", user._id);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    size: "",
    amenities: [],
    description: "",
    roomImages: [],
    coordinates: { lat: null, lng: null },
    owner: user._id,
  });
  const [message, setMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  const fetchLocations = async (input) => {
    if (input.length < 3) return;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${input}`
    );
    const data = await response.json();
    setSuggestions(data);
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    fetchLocations(e.target.value);
  };

  const handleSelectLocation = (location) => {
    setSelectedLocation(location.display_name);
    setSuggestions([]);
    setQuery(location.display_name);

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

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("size", formData.size);
    data.append("description", formData.description);
    data.append("amenities", JSON.stringify(formData.amenities));
    data.append("location", selectedLocation);
    data.append("owner", formData.owner);
    data.append("coordinates", JSON.stringify(formData.coordinates));

    formData.roomImages.forEach((file) => {
      data.append("roomImages", file);
    });

    try {
      const response = await fetch("/api/room/upload", {
        method: "POST",
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        setMessage("Room created successfully!");
        setFormData({
          name: "",
          price: "",
          size: "",
          amenities: [],
          description: "",
          roomImages: [],
        });
        setImagePreviews([]);
        setQuery("");
        setSelectedLocation("");
      } else {
        setMessage("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while creating the room.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl w-full max-w-4xl"
      >
        <h1 className="text-3xl font-semibold text-center text-green-600 mb-8">
          Create a New Room
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <label
              className="block text-lg font-semibold text-gray-800"
              htmlFor="name"
            >
              Room Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-green-500 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <div className="col-span-1">
            <label
              className="block text-lg font-semibold text-gray-800"
              htmlFor="price"
            >
              Price (Rs)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="mt-2 block w-full px-4 py-3 border border-green-500 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <label
              className="block text-lg font-semibold text-gray-800"
              htmlFor="size"
            >
              Size (sq ft)
            </label>
            <input
              type="number"
              id="size"
              name="size"
              value={formData.size}
              onChange={handleChange}
              min="0"
              className="mt-2 block w-full px-4 py-3 border border-green-500 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            />
          </div>

          <LocationInput
            query={query}
            suggestions={suggestions}
            onChange={handleInputChange}
            onSelect={handleSelectLocation}
          />
        </div>

        <AmenityCheckboxes
          amenities={formData.amenities}
          onChange={handleAmenityChange}
        />

        <div className="mb-6">
          <label
            className="block text-lg font-semibold text-gray-800"
            htmlFor="description"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-2 block w-full px-4 py-3 border border-green-500 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            required
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-lg font-semibold text-gray-800"
            htmlFor="roomImages"
          >
            Room Images
          </label>
          <input
            type="file"
            id="roomImages"
            name="roomImages"
            onChange={handleFileChange}
            multiple
            className="mt-2 block w-full text-sm text-green-600 bg-green-50 border border-green-300 hover:bg-green-100 rounded-lg file:px-4 file:py-3 file:rounded-lg"
            required
          />
        </div>

        {imagePreviews.length > 0 && (
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-800">
              Selected Images
            </label>
            <div className="flex gap-4 mt-2">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Room image preview ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Room"}
        </button>

        {message && (
          <p className="mt-6 text-center text-lg font-semibold text-green-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default RoomForm;
