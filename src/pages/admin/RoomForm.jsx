import React, { useState } from "react";

const RoomForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    size: "",
    amenities: [],
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

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;

    setFormData((prevState) => {
      const updatedAmenities = checked
        ? [...prevState.amenities, value] // Add amenity if checked
        : prevState.amenities.filter((amenity) => amenity !== value); // Remove amenity if unchecked

      return { ...prevState, amenities: updatedAmenities };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("size", formData.size);
    data.append("description", formData.description);

    // Append amenities array as a stringified array
    data.append("amenities", JSON.stringify(formData.amenities));

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
        console.log("Room:", result.room);
        setFormData({
          name: "",
          price: "",
          size: "",
          amenities: [],
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

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Size (sq ft)
          </label>
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            required
          />
        </div>

        {/* Amenities - checkboxes */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Amenities
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {[
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
            ].map((amenity) => (
              <label key={amenity} className="inline-flex items-center">
                <input
                  type="checkbox"
                  value={amenity}
                  checked={formData.amenities.includes(amenity)}
                  onChange={handleAmenityChange}
                  className="mr-2"
                />
                {amenity}
              </label>
            ))}
          </div>
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

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
        >
          Create Room
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-green-600">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default RoomForm;
