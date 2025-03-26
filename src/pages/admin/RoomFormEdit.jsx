import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

const RoomEditForm = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.currentUser);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    size: "",
    amenities: "", // changed from array to string
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
            amenities: result.amenities?.join(", ") || "", // Convert array to string
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("size", formData.size);
    data.append("description", formData.description);
    data.append("amenities", formData.amenities);
    data.append("location", formData.location);
    data.append("owner", formData.owner);
    data.append("coordinates", JSON.stringify(formData.coordinates));

    formData.roomImages.forEach((file) => {
      data.append("roomImages", file);
    });

    try {
      const response = await fetch(`/api/room/rooms/${roomId}`, {
        method: "PUT",
        body: data,
      });
      const result = await response.json();

      if (response.ok) {
        setMessage("Room updated successfully!");
        // Optionally, redirect to another page
        // navigate("/somewhere");
      } else {
        setMessage("Error: " + result.message);
      }
    } catch (error) {
      console.error("Error:", error);
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

          {/* LocationInput component would go here */}
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
            value={formData.amenities} // This is a string now
            onChange={handleChange}
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
          {isLoading ? "Updating..." : "Update Room"}
        </button>

        {message && (
          <div className="mt-4 text-center text-xl text-red-600">{message}</div>
        )}
      </form>
    </div>
  );
};

export default RoomEditForm;
