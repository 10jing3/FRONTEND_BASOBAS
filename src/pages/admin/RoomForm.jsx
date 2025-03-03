import React, { useState } from "react";

const RoomForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    roomCategory: "",
    location: "",
    contactNumber: "",
    amenities: "",
    description: "",
    roomImages: [],
  });
  const [message, setMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

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
    setFormData({
      ...formData,
      roomImages: newRoomImages,
    });

    // Generate image previews
    const previews = newRoomImages.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("roomCategory", formData.roomCategory);
    data.append("location", formData.location);
    data.append("contactNumber", formData.contactNumber);
    data.append("description", formData.description);

    // Convert amenities string to an array
    const amenitiesArray = formData.amenities
      .split(",")
      .map((amenity) => amenity.trim());
    data.append("amenities", JSON.stringify(amenitiesArray));

    // Append each file to FormData
    for (let i = 0; i < formData.roomImages.length; i++) {
      data.append("roomImages", formData.roomImages[i]);
    }

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
          roomCategory: "",
          location: "",
          contactNumber: "",
          amenities: "",
          description: "",
          roomImages: [],
        });
        setImagePreviews([]);
      } else {
        setMessage("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while creating the room.");
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create a New Room
        </h1>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Room Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Room Category */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Room Category
          </label>
          <select
            name="roomCategory"
            value={formData.roomCategory}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          >
            <option value="">Select Room Category</option>
            <option value="one-room">One Room</option>
            <option value="two-room">Two Room</option>
            <option value="1BHK">1BHK</option>
          </select>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Contact Number */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Contact Number
          </label>
          <input
            type="tel"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Amenities - Editable Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Amenities (comma-separated)
          </label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            placeholder="e.g. WiFi, Parking, AC"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Room Images
          </label>
          <input
            type="file"
            name="roomImages"
            onChange={handleFileChange}
            multiple
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            required
          />
        </div>

        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Selected Images
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  className="w-20 h-20 object-cover rounded-md"
                />
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
        >
          Create Room
        </button>

        {/* Status Message */}
        {message && (
          <div className="mt-4 text-center text-sm text-red-500">{message}</div>
        )}
      </form>
    </div>
  );
};

export default RoomForm;
