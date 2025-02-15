import { useState, useRef, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

export default function AddRoomForm({ onAddRoom }) {
  // Form field states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [amenities, setAmenities] = useState([]);
  const [available, setAvailable] = useState(true);
  const [description, setDescription] = useState("");

  // File and upload states
  const [selectedFile, setSelectedFile] = useState(null); // Holds the File object before upload
  const [uploadedImageURL, setUploadedImageURL] = useState(""); // URL returned from Firebase Storage
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(false);

  // Reference to hidden file input for image upload
  const fileRef = useRef(null);

  // When a file is selected, upload it automatically
  useEffect(() => {
    if (selectedFile && selectedFile instanceof File) {
      uploadFile(selectedFile);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  // Handle check/uncheck of amenities
  const handleAmenitiesChange = (e) => {
    const { value, checked } = e.target;
    setAmenities((prevAmenities) =>
      checked
        ? [...prevAmenities, value]
        : prevAmenities.filter((a) => a !== value)
    );
  };

  // Upload file to Firebase Storage
  const uploadFile = async (file) => {
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${file.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progressPercent =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(Math.round(progressPercent));
      },
      (error) => {
        console.error("Error during file upload:", error);
        setUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadedImageURL(downloadURL);
        });
      }
    );
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the room data payload
    const newRoom = {
      name,
      price,
      size,
      amenities,
      available,
      roomImage: uploadedImageURL, // Use the URL returned by Firebase Storage
      description,
    };

    try {
      const res = await fetch("/api/room/rooms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRoom),
      });

      if (!res.ok) {
        console.error("Failed to post room data.");
        return;
      }

      const data = await res.json();
      // Optionally, pass the new room data to the parent component
      onAddRoom(data);

      // Reset the form fields
      setName("");
      setPrice("");
      setSize("");
      setAmenities([]);
      setAvailable(true);
      setDescription("");
      setSelectedFile(null);
      setUploadedImageURL("");
      setUploadProgress(0);
      setUploadError(false);
    } catch (error) {
      console.error("Error posting room data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
      <h3 className="text-xl font-semibold mb-4">Add New Room</h3>
      <div className="space-y-4">
        {/* Room Name */}
        <input
          type="text"
          placeholder="Room Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Price */}
        <input
          type="text"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Size */}
        <input
          type="text"
          placeholder="Size (e.g., 20m²)"
          value={size}
          onChange={(e) => setSize(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />

        {/* Amenities */}
        <div>
          <p className="font-semibold">Amenities</p>
          {["WiFi", "TV", "AC", "Mini Bar", "Balcony", "Hot Tub"].map(
            (amenity) => (
              <label key={amenity} className="mr-4">
                <input
                  type="checkbox"
                  value={amenity}
                  checked={amenities.includes(amenity)}
                  onChange={handleAmenitiesChange}
                  className="mr-1"
                />
                {amenity}
              </label>
            )
          )}
        </div>

        {/* Availability */}
        <div>
          <label>
            Availability:
            <select
              value={available}
              onChange={(e) => setAvailable(e.target.value === "true")}
              className="ml-2"
            >
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </label>
        </div>

        {/* Image Upload */}
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => {
            if (e.target.files[0]) {
              setSelectedFile(e.target.files[0]);
            }
          }}
        />
        <div onClick={() => fileRef.current.click()} className="cursor-pointer">
          {selectedFile ? (
            // Show local preview if file is not yet uploaded, otherwise use the uploaded URL
            typeof selectedFile === "object" ? (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Room preview"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            ) : (
              <img
                src={selectedFile}
                alt="Room"
                className="w-32 h-32 object-cover rounded-full mx-auto"
              />
            )
          ) : (
            <div className="w-32 h-32 border-dashed border-2 rounded-full mx-auto flex justify-center items-center">
              <span>Upload Image</span>
            </div>
          )}
        </div>
        <p className="text-sm text-center">
          {uploadError ? (
            <span className="text-red-700">
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : uploadProgress > 0 && uploadProgress < 100 ? (
            <span className="text-slate-700">{`Uploading: ${uploadProgress}%`}</span>
          ) : uploadProgress === 100 ? (
            <span className="text-green-700">Image uploaded successfully</span>
          ) : (
            ""
          )}
        </p>

        {/* Description */}
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border rounded"
          rows="4"
        ></textarea>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center space-x-2"
        >
          <FaPlus className="h-4 w-4" />
          <span>Add Room</span>
        </button>
      </div>
    </form>
  );
}
