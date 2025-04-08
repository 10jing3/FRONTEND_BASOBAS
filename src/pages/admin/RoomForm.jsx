import React, { useState } from "react";
import { useSelector } from "react-redux";

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
    vrImages: [],
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
  const handleVRFileChange = (e) => {
    const files = Array.from(e.target.files);
    const newVRImages = [...formData.vrImages, ...files];
    setFormData({ ...formData, vrImages: newVRImages });
    setImagePreviews(newVRImages.map((file) => URL.createObjectURL(file)));
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
    formData.vrImages.forEach((file) => {
      data.append("vrImages", file);
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
          vrImages: [],
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
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border border-green-500 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
              required
            >
              <option value="select option">Select Option</option>
              <option value="single room">Single Room</option>
              <option value="two room">Two Room</option>
              <option value="2 BHK">2 BHK</option>
              <option value="4 BHK">4 BHK</option>
              <option value="flat">Flat</option>
              <option value="house">House</option>
            </select>
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

        <div className="mb-6">
          <label
            className="block text-lg font-semibold text-gray-800"
            htmlFor="amenities"
          >
            Amenities (comma separated)
          </label>
          <textarea
            id="amenities"
            name="amenities"
            value={formData.amenities} // Convert array to string
            onChange={(e) =>
              setFormData({
                ...formData,
                amenities: e.target.value.split(", "),
              })
            } // Convert string to array
            className="mt-2 block w-full px-4 py-3 border border-green-500 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            placeholder="E.g., WiFi, Parking, Air Conditioning"
            required
          />
        </div>

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
        <div className="mb-6">
          <label
            className="block text-lg font-semibold text-gray-800"
            htmlFor="roomImages"
          >
            VRRoom Images
          </label>
          <input
            type="file"
            id="vrImages"
            name="vrImages"
            onChange={handleVRFileChange}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date Of Build */}
          <div>
            <label
              htmlFor="dateOfBuild"
              className="block text-sm font-medium text-gray-700"
            >
              Date Of Build
            </label>
            <select
              id="dateOfBuild"
              name="dateOfBuild"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Option</option>
              {/* Add your date options here (e.g., years) */}
              <option value="2023">2023</option>
              <option value="2022">2022</option>
              <option value="2021">2021</option>
              {/* ... more years ... */}
            </select>
          </div>

          {/* Bed Room eg. 1,2,3 */}
          <div>
            <label
              htmlFor="bedrooms"
              className="block text-sm font-medium text-gray-700"
            >
              Bed Room eg. 1,2,3
            </label>
            <input
              type="number"
              id="bedrooms"
              name="bedrooms"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Kitchen */}
          <div>
            <label
              htmlFor="kitchen"
              className="block text-sm font-medium text-gray-700"
            >
              Kitchen
            </label>
            <select
              id="kitchen"
              name="kitchen"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Kitchen</option>
              {/* Add your kitchen options here */}
              <option value="modular">Modular</option>
              <option value="semi-modular">Semi-Modular</option>
              <option value="standard">Standard</option>
              <option value="none">None</option>
            </select>
          </div>

          {/* Bath Room eg. 1,2,3 .. */}
          <div>
            <label
              htmlFor="bathrooms"
              className="block text-sm font-medium text-gray-700"
            >
              Bath Room eg. 1,2,3 ..
            </label>
            <input
              type="number"
              id="bathrooms"
              name="bathrooms"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          {/* Furnishing */}
          <div>
            <label
              htmlFor="furnishing"
              className="block text-sm font-medium text-gray-700"
            >
              Furnishing
            </label>
            <select
              id="furnishing"
              name="furnishing"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Option</option>
              {/* Add your furnishing options here */}
              <option value="furnished">Furnished</option>
              <option value="semi-furnished">Semi-Furnished</option>
              <option value="unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Faced */}
          <div>
            <label
              htmlFor="faced"
              className="block text-sm font-medium text-gray-700"
            >
              Faced
            </label>
            <select
              id="faced"
              name="faced"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Option</option>
              {/* Add your facing options here */}
              <option value="north">North</option>
              <option value="south">South</option>
              <option value="east">East</option>
              <option value="west">West</option>
            </select>
          </div>

          {/* Parking */}
          <div>
            <label
              htmlFor="parking"
              className="block text-sm font-medium text-gray-700"
            >
              Parking
            </label>
            <select
              id="parking"
              name="parking"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">--Select Option--</option>
              {/* Add your parking options here */}
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="covered">Covered</option>
              <option value="open">Open</option>
            </select>
          </div>

          {/* Balcony */}
          <div>
            <label
              htmlFor="balcony"
              className="block text-sm font-medium text-gray-700"
            >
              Balcony
            </label>
            <select
              id="balcony"
              name="balcony"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Option</option>
              {/* Add your balcony options here */}
              <option value="yes">Yes</option>
              <option value="no">No</option>
              <option value="1">1</option>
              <option value="2">2</option>
            </select>
          </div>

          {/* Rental Floor */}
          <div>
            <label
              htmlFor="rentalFloor"
              className="block text-sm font-medium text-gray-700"
            >
              Rental Floor
            </label>
            <select
              id="rentalFloor"
              name="rentalFloor"
              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select Option</option>
              {/* Add your floor options here */}
              <option value="ground">Ground</option>
              <option value="1">1</option>
              <option value="2">2</option>
              {/* ... more floors ... */}
            </select>
          </div>
        </div>

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
