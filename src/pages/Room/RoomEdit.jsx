import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function RoomEdit() {
  const { roomId } = useParams(); // Get the room ID from the URL
  const [room, setRoom] = useState({
    name: "",
    price: "",
    location: "",
    amenities: [],
    available: true,
    description: "",
    roomCategory: "",
    contactNumber: "",
    roomImages: [],
  });
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state to show until data is fetched
  const navigate = useNavigate(); // For navigation after update

  useEffect(() => {
    if (roomId) {
      setLoading(true); // Set loading to true when fetching data
      axios
        .get(`/api/room/rooms/${roomId}`) // This should match your backend route
        .then((response) => {
          setRoom(response.data);
          setImagePreviews(response.data.roomImages); // Set initial image previews
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch((error) => {
          console.error("Error fetching room data:", error);
          setLoading(false);
        });
    }
  }, [roomId]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setRoom((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (name === "amenities") {
      const amenitiesArray = value.split(",").map((item) => item.trim());
      setRoom((prev) => ({
        ...prev,
        amenities: amenitiesArray,
      }));
    } else {
      setRoom((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const imageURLs = files.map((file) => URL.createObjectURL(file));
    setRoom((prev) => ({
      ...prev,
      roomImages: files,
    }));
    setImagePreviews(imageURLs);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", room.name);
    formData.append("price", room.price);
    formData.append("location", room.location);
    formData.append("amenities", room.amenities);
    formData.append("available", room.available);
    formData.append("description", room.description);
    formData.append("roomCategory", room.roomCategory);
    formData.append("contactNumber", room.contactNumber);
    room.roomImages.forEach((image) => {
      formData.append("roomImages", image);
    });

    axios
      .put(`/api/room/rooms/${roomId}`, formData)
      .then((response) => {
        console.log("Room updated successfully", response.data);
        // Navigate to room details after update
      })
      .catch((error) => {
        console.error("Error updating room:", error);
      });
  };

  if (loading) {
    return <div>Loading...</div>; // Show loading state while fetching data
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-3xl mx-auto my-10">
      <h3 className="text-3xl font-semibold text-center mb-6">Edit Room</h3>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Room Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-lg font-medium text-gray-700"
            >
              Room Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={room.name}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-lg font-medium text-gray-700"
            >
              Price ($)
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={room.price}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-lg font-medium text-gray-700"
            >
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={room.location}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Room Category */}
          <div>
            <label
              htmlFor="roomCategory"
              className="block text-lg font-medium text-gray-700"
            >
              Room Category
            </label>
            <input
              type="text"
              id="roomCategory"
              name="roomCategory"
              value={room.roomCategory}
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {/* Amenities */}
          <div>
            <label
              htmlFor="amenities"
              className="block text-lg font-medium text-gray-700"
            >
              Amenities
            </label>
            <input
              type="text"
              name="amenities"
              value={room.amenities.join(", ")} // Displaying comma-separated amenities
              onChange={handleChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter amenities (e.g. WiFi, TV, Air Conditioning)"
            />
          </div>

          {/* Availability */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Availability
            </label>
            <label className="inline-flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                name="available"
                checked={room.available}
                onChange={handleChange}
                className="form-checkbox h-5 w-5 text-indigo-500"
              />
              <span>Available</span>
            </label>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-lg font-medium text-gray-700">
              Room Images
            </label>
            <input
              type="file"
              name="roomImages"
              multiple
              onChange={handleImageChange}
              className="w-full p-4 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              className="px-6 py-2 bg-gray-400 text-white rounded-lg"
              onClick={() => navigate(`/rooms/${roomId}`)} // Navigate back if cancelled
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg"
            >
              Update Room
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
