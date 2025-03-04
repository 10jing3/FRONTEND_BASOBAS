import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

// Fix default marker issue in Leaflet
const customIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const SingleRoom = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const response = await axios.get(`/api/room/rooms/${roomId}`);
        setRoom(response.data);
      } catch (err) {
        setError("Failed to fetch room details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  if (loading)
    return <p className="text-center text-gray-600 mt-8">Loading...</p>;
  if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;
  if (!room)
    return <p className="text-center text-gray-600 mt-8">Room not found.</p>;

  const {
    name,
    price,
    size,
    amenities,
    available,
    roomImages,
    description,
    location,
    coordinates,
  } = room;

  return (
    <div className="container mx-auto p-8">
      {/* Room Images Carousel */}
      <div className="mb-8">
        <div className="relative w-full h-96 rounded-xl overflow-hidden">
          <img
            src={roomImages[currentImageIndex]}
            alt={`Room Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === 0 ? roomImages.length - 1 : prev - 1
              )
            }
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <FaArrowLeft size={24} />
          </button>
          <button
            onClick={() =>
              setCurrentImageIndex((prev) =>
                prev === roomImages.length - 1 ? 0 : prev + 1
              )
            }
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
          >
            <FaArrowRight size={24} />
          </button>
        </div>
        <div className="flex gap-2 mt-4 overflow-x-auto">
          {roomImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Room Thumbnail ${index + 1}`}
              className={`w-24 h-16 object-cover rounded-lg cursor-pointer ${
                index === currentImageIndex ? "border-2 border-green-600" : ""
              }`}
              onClick={() => setCurrentImageIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Room Details */}
      <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-gray-800">{name}</h1>
        <p className="text-lg text-gray-600">{description}</p>

        {/* Location */}
        {location && (
          <p className="text-lg text-gray-600">
            <span className="font-semibold">Location:</span> {location}
          </p>
        )}

        <div className="flex justify-between items-center">
          <p className="text-2xl font-semibold text-gray-800">
            ${price} <span className="text-base text-gray-500">/ night</span>
          </p>
          <p
            className={`text-lg font-semibold ${
              available ? "text-green-600" : "text-red-600"
            }`}
          >
            {available ? "Available" : "Not Available"}
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-lg text-gray-600">
            <span className="font-semibold">Size:</span> {size} sq ft
          </p>
          <div>
            <p className="text-lg font-semibold text-gray-600">Amenities:</p>
            <ul className="flex flex-wrap gap-2 mt-2">
              {amenities.map((amenity, index) => (
                <li
                  key={index}
                  className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
                >
                  {amenity.replace(/[\[\]"]/g, "")}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button className="w-full py-3 px-6 bg-green-600 text-white text-lg font-medium rounded-xl transition-all hover:bg-green-700">
          Book Now
        </button>
      </div>

      {/* Leaflet Map */}
      {coordinates && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-800">
            Room Location
          </h2>
          <MapContainer
            center={[coordinates.lat, coordinates.lng]}
            zoom={15}
            className="w-full h-96 mt-4 rounded-lg"
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker
              position={[coordinates.lat, coordinates.lng]}
              icon={customIcon}
            >
              <Popup>{name}</Popup>
            </Marker>
          </MapContainer>
        </div>
      )}

      {/* Image Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <button
            onClick={() => setModalOpen(false)}
            className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
          >
            <FaTimes size={24} />
          </button>
          <img
            src={roomImages[currentImageIndex]}
            alt={`Room Image ${currentImageIndex + 1}`}
            className="max-w-full max-h-full"
          />
        </div>
      )}
    </div>
  );
};

export default SingleRoom;

// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import { FaArrowLeft, FaArrowRight, FaTimes } from "react-icons/fa";

// const SingleRoom = () => {
//   const { roomId } = useParams();
//   const [room, setRoom] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);

//   useEffect(() => {
//     const fetchRoom = async () => {
//       try {
//         const response = await axios.get(`/api/room/rooms/${roomId}`); // Update the URL here to match the route in the backend
//         setRoom(response.data); // Assuming backend returns the room data in the `data` field
//       } catch (err) {
//         setError("Failed to fetch room details. Please try again later.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRoom();
//   }, [roomId]);

//   const openModal = (index) => {
//     setCurrentImageIndex(index);
//     setModalOpen(true);
//   };

//   const closeModal = () => {
//     setModalOpen(false);
//   };

//   const showNextImage = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === room.roomImages.length - 1 ? 0 : prevIndex + 1
//     );
//   };

//   const showPrevImage = () => {
//     setCurrentImageIndex((prevIndex) =>
//       prevIndex === 0 ? room.roomImages.length - 1 : prevIndex - 1
//     );
//   };

//   if (loading)
//     return <p className="text-center text-gray-600 mt-8">Loading...</p>;
//   if (error) return <p className="text-center text-red-600 mt-8">{error}</p>;
//   if (!room)
//     return <p className="text-center text-gray-600 mt-8">Room not found.</p>;

//   const { name, price, size, amenities, available, roomImages, description } =
//     room;

//   return (
//     <div className="container mx-auto p-8">
//       {/* Room Images Carousel */}
//       <div className="mb-8">
//         <div className="relative w-full h-96 rounded-xl overflow-hidden">
//           <img
//             src={roomImages[currentImageIndex]}
//             alt={`Room Image ${currentImageIndex + 1}`}
//             className="w-full h-full object-cover"
//           />
//           <button
//             onClick={showPrevImage}
//             className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
//             aria-label="Previous Image"
//           >
//             <FaArrowLeft size={24} />
//           </button>
//           <button
//             onClick={showNextImage}
//             className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 transition-all"
//             aria-label="Next Image"
//           >
//             <FaArrowRight size={24} />
//           </button>
//         </div>
//         <div className="flex gap-2 mt-4 overflow-x-auto">
//           {roomImages.map((image, index) => (
//             <img
//               key={index}
//               src={image}
//               alt={`Room Thumbnail ${index + 1}`}
//               className={`w-24 h-16 object-cover rounded-lg cursor-pointer ${
//                 index === currentImageIndex ? "border-2 border-green-600" : ""
//               }`}
//               onClick={() => setCurrentImageIndex(index)}
//             />
//           ))}
//         </div>
//       </div>

//       {/* Room Details */}
//       <div className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
//         <h1 className="text-4xl font-bold text-gray-800">{name}</h1>
//         <p className="text-lg text-gray-600">{description}</p>

//         <div className="flex justify-between items-center">
//           <p className="text-2xl font-semibold text-gray-800">
//             ${price} <span className="text-base text-gray-500">/ night</span>
//           </p>
//           <p
//             className={`text-lg font-semibold ${
//               available ? "text-green-600" : "text-red-600"
//             }`}
//           >
//             {available ? "Available" : "Not Available"}
//           </p>
//         </div>

//         <div className="space-y-4">
//           <p className="text-lg text-gray-600">
//             <span className="font-semibold">Size:</span> {size} sq ft
//           </p>
//           <div>
//             <p className="text-lg font-semibold text-gray-600">Amenities:</p>
//             <ul className="flex flex-wrap gap-2 mt-2">
//               {amenities.map((amenity, index) => (
//                 <li
//                   key={index}
//                   className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-700"
//                 >
//                   {amenity}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>

//         <button className="w-full py-3 px-6 bg-green-600 text-white text-lg font-medium rounded-xl transition-all hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
//           Book Now
//         </button>
//       </div>

//       {/* Image Modal */}
//       {modalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
//           <button
//             onClick={closeModal}
//             className="absolute top-4 right-4 text-white bg-black bg-opacity-50 p-2 rounded-full hover:bg-opacity-70"
//             aria-label="Close Modal"
//           >
//             <FaTimes size={24} />
//           </button>
//           <img
//             src={roomImages[currentImageIndex]}
//             alt={`Room Image ${currentImageIndex + 1}`}
//             className="max-w-full max-h-full"
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default SingleRoom;
