// ✨ Full Profiles.jsx with Roommate Preferences card always visible
// And editMode toggles inputs vs plain text for both cards

import { useState } from "react";
import {
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
  FaSignOutAlt,
} from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from "../../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

export default function Profiles() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tempProfile, setTempProfile] = useState({ ...currentUser });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setTempProfile({ ...tempProfile, profilePicture: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setTempProfile({ ...tempProfile, [name]: newValue });
  };

  const saveProfile = async () => {
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tempProfile),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
      setEditMode(false);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const deleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch("/api/auth/signout");
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  if (!currentUser) {
    return (
      <div className="text-center mt-10 text-lg font-semibold text-red-600">
        Account deleted. Please sign up again.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Your Profile</h1>

      <div className="flex flex-col items-center mb-8">
        <div className="relative w-32 h-32">
          <img
            src={tempProfile.profilePicture || currentUser.profilePicture}
            alt="Profile"
            className="w-full h-full rounded-full border-4 border-gray-400 object-cover shadow-md"
          />
          {editMode && (
            <label className="absolute bottom-2 right-2 bg-gray-700 text-white p-2 rounded-full cursor-pointer">
              <FaCamera />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
          )}
        </div>
        <p className="text-sm mt-2">
          {imageError ? (
            <span className="text-red-700">Error uploading image</span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className="text-gray-600">Uploading: {imagePercent} %</span>
          ) : imagePercent === 100 ? (
            <span className="text-green-700">Image uploaded!</span>
          ) : (
            ""
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Info Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-5 h-fit">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Personal Info
          </h2>

          {["username", "email", "phone"].map((field) => (
            <div key={field}>
              <label className="text-gray-600 capitalize">{field}</label>
              {editMode ? (
                <input
                  type={field === "email" ? "email" : "text"}
                  name={field}
                  value={tempProfile[field]}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                />
              ) : (
                <p className="font-medium">{currentUser[field]}</p>
              )}
            </div>
          ))}

          <div>
            <label className="text-gray-600">Password</label>
            <div className="relative">
              {editMode ? (
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={tempProfile.password || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                />
              ) : (
                <p className="font-medium">********</p>
              )}
              {editMode && (
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-2 right-3 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Roommate Preferences Card */}
        <div className="bg-white shadow-lg rounded-xl p-6 space-y-5">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Roommate Preferences
          </h2>

          {[
            { name: "gender", label: "Gender" },
            { name: "budget", label: "Budget" },
            { name: "cleanliness", label: "Cleanliness" },
            { name: "wakeUpTime", label: "Wake Up Time" },
            { name: "sleepTime", label: "Sleep Time" },
            {
              name: "preferredRoommateGender",
              label: "Preferred Roommate Gender",
            },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="text-gray-600">{label}</label>
              {editMode ? (
                <input
                  type={
                    name.includes("Time")
                      ? "time"
                      : name === "budget" || name === "cleanliness"
                      ? "number"
                      : "text"
                  }
                  name={name}
                  value={tempProfile[name] || ""}
                  onChange={handleChange}
                  className="w-full border p-2 rounded-md"
                />
              ) : (
                <p className="font-medium">{currentUser[name] || "Not set"}</p>
              )}
            </div>
          ))}

          {/* Checkbox Fields */}
          {[
            { name: "isSmoker", label: "Smoker" },
            { name: "isPetFriendly", label: "Pet Friendly" },
          ].map(({ name, label }) => (
            <div key={name}>
              <label className="text-gray-600">{label}</label>
              {editMode ? (
                <input
                  type="checkbox"
                  name={name}
                  checked={tempProfile[name] || false}
                  onChange={(e) =>
                    setTempProfile({
                      ...tempProfile,
                      [name]: e.target.checked,
                    })
                  }
                  className="ml-2"
                />
              ) : (
                <p className="font-medium">
                  {currentUser[name] ? "Yes" : "No"}
                </p>
              )}
            </div>
          ))}

          {/* Hobbies */}
          <div>
            <label className="text-gray-600">Hobbies</label>
            {editMode ? (
              <input
                type="text"
                name="hobbies"
                value={
                  Array.isArray(tempProfile.hobbies)
                    ? tempProfile.hobbies.join(", ")
                    : tempProfile.hobbies || ""
                }
                onChange={(e) =>
                  setTempProfile({
                    ...tempProfile,
                    hobbies: e.target.value.split(",").map((h) => h.trim()),
                  })
                }
                className="w-full border p-2 rounded-md"
              />
            ) : (
              <p className="font-medium">
                {Array.isArray(currentUser.hobbies)
                  ? currentUser.hobbies.join(", ")
                  : currentUser.hobbies || "Not set"}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {editMode ? (
          <>
            <button
              onClick={saveProfile}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <FaSave /> {loading ? "Saving..." : "Save"}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 flex items-center gap-2"
            >
              <FaTimes /> Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-yellow-500 text-black px-6 py-2 rounded-lg hover:bg-yellow-600 flex items-center gap-2"
          >
            <FaEdit /> Edit Profile
          </button>
        )}

        <button
          onClick={handleSignOut}
          className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-900 flex items-center gap-2"
        >
          <FaSignOutAlt /> Sign Out
        </button>

        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
        >
          <FaTrash /> Delete Account
        </button>
      </div>

      {error && (
        <p className="text-red-700 mt-5 text-center">
          {error.message || "An error occurred"}
        </p>
      )}
      {updateSuccess && (
        <p className="text-green-700 mt-5 text-center">
          Profile updated successfully!
        </p>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-900">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete your account? This action is
              irreversible.
            </p>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-300 text-black px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
