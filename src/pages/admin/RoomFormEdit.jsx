import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

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

const RoomEditForm = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    size: "",
    amenities: [],
    description: "",
    roomImages: [],
    coordinates: { lat: null, lng: null },
    owner: user?._id,
  });

  const [message, setMessage] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch room details when component mounts
  useEffect(() => {
    const getRoom = async () => {
      try {
        const response = await fetch(`/api/room/rooms/${roomId}`);
        const result = await response.json();

        if (response.ok) {
          setFormData({
            name: result.name,
            price: result.price,
            size: result.size,
            amenities: result.amenities || [],
            description: result.description,
            roomImages: result.roomImages || [],
            coordinates: result.coordinates || { lat: null, lng: null },
            owner: result.owner,
          });

          setImagePreviews(result.roomImages.map((image) => image.url));
        } else {
          setMessage("Error: " + result.message);
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        setMessage("An error occurred while fetching the room.");
      }
    };

    if (roomId) getRoom();
  }, [roomId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      roomImages: [...prev.roomImages, ...files],
    }));

    setImagePreviews([
      ...imagePreviews,
      ...files.map((file) => URL.createObjectURL(file)),
    ]);
  };

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      amenities: checked
        ? [...prev.amenities, value]
        : prev.amenities.filter((amenity) => amenity !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      name: formData.name,
      price: formData.price,
      size: formData.size,
      description: formData.description,
      amenities: formData.amenities,
      roomImages: formData.roomImages, // Ensure images are sent correctly
      available: formData.available,
      coordinates: formData.coordinates,
    };

    console.log("Sending update request with data:", data); // Log request data

    try {
      const response = await fetch(`/api/room/rooms/${roomId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Update Response:", result); // Log response

      if (response.ok) {
        setMessage("Room updated successfully!");
        setTimeout(() => navigate("/dashboard"), 1500);
      } else {
        setMessage("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error updating room:", error);
      setMessage("An error occurred while updating the room.");
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
          Edit Room
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-800">
              Room Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-3 border rounded-lg focus:ring-2"
              required
            />
          </div>

          <div className="col-span-1">
            <label className="block text-lg font-semibold text-gray-800">
              Price (Rs)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min="0"
              className="mt-2 block w-full px-4 py-3 border rounded-lg focus:ring-2"
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800">
            Size (sq ft)
          </label>
          <input
            type="number"
            name="size"
            value={formData.size}
            onChange={handleChange}
            min="0"
            className="mt-2 block w-full px-4 py-3 border rounded-lg focus:ring-2"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800">
            Amenities
          </label>
          <div className="flex flex-wrap gap-4 mt-2">
            {AMENITIES.map((amenity) => (
              <label
                key={amenity}
                className="inline-flex items-center text-gray-700"
              >
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

        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-800">
            Room Images
          </label>
          <input
            type="file"
            name="roomImages"
            onChange={handleFileChange}
            multiple
            className="mt-2 block w-full text-sm text-green-600 bg-green-50 border rounded-lg file:px-4 file:py-3"
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
                  alt={`Room ${index + 1}`}
                  className="w-24 h-24 object-cover rounded-lg"
                />
              ))}
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-3 px-6 rounded-lg hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? "Updating..." : "Update Room"}
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

export default RoomEditForm;
