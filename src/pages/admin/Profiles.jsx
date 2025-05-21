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
  FaUser,
  FaEnvelope,
  FaPhone,
  FaClock,
  FaPaw,
  FaSmoking,
  FaMoneyBillWave,
  FaBroom,
  FaVenusMars,
  FaHiking,
  FaLock,
  FaExclamationTriangle,
} from "react-icons/fa";
import { RiLoader4Line } from "react-icons/ri";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
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
      setTimeout(() => setUpdateSuccess(false), 3000);
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
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800">Your Profile</h1>
        <p className="text-gray-600 mt-2">
          {editMode
            ? "Edit your profile details"
            : "View and manage your profile"}
        </p>
      </div>

      {/* Profile Picture Section */}
      <div className="flex flex-col items-center mb-10">
        <div className="relative group">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 border-4 border-white shadow-lg overflow-hidden">
            <img
              src={
                tempProfile.profilePicture ||
                currentUser.profilePicture ||
                "/default-profile.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          {editMode && (
            <label className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-3 rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition-colors">
              <FaCamera className="text-lg" />
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePicChange}
              />
            </label>
          )}
        </div>
        {imageError ? (
          <p className="mt-3 text-sm text-red-600 flex items-center">
            <FaExclamationTriangle className="mr-1" />
            Error uploading image (max 2MB)
          </p>
        ) : imagePercent > 0 && imagePercent < 100 ? (
          <div className="mt-3 w-48">
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm text-blue-600">Uploading...</span>
              <span className="text-xs text-blue-600">{imagePercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${imagePercent}%` }}
              ></div>
            </div>
          </div>
        ) : imagePercent === 100 ? (
          <p className="mt-3 text-sm text-green-600 flex items-center">
            <IoMdCheckmarkCircleOutline className="mr-1" />
            Image uploaded successfully!
          </p>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Personal Info Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Personal Information
            </h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit className="text-lg" />
              </button>
            )}
          </div>

          <div className="space-y-5">
            {[
              { field: "username", icon: <FaUser className="text-gray-500" /> },
              {
                field: "email",
                icon: <FaEnvelope className="text-gray-500" />,
              },
              { field: "phone", icon: <FaPhone className="text-gray-500" /> },
            ].map(({ field, icon }) => (
              <div key={field} className="space-y-1">
                <label className="text-sm font-medium text-gray-700 capitalize">
                  {field}
                </label>
                <div className="flex items-center">
                  <span className="mr-3">{icon}</span>
                  {editMode ? (
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={tempProfile[field] || ""}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {currentUser[field] || "Not provided"}
                    </p>
                  )}
                </div>
              </div>
            ))}

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="flex items-center relative">
                <span className="mr-3">
                  <FaLock className="text-gray-500" />
                </span>
                {editMode ? (
                  <>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={tempProfile.password || ""}
                      onChange={handleChange}
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </>
                ) : (
                  <p className="text-gray-800">••••••••</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Roommate Preferences Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              Roommate Preferences
            </h2>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit className="text-lg" />
              </button>
            )}
          </div>

          <div className="space-y-5">
            {[
              {
                name: "gender",
                icon: <FaVenusMars className="text-gray-500" />,
              },
              {
                name: "budget",
                icon: <FaMoneyBillWave className="text-gray-500" />,
              },
              {
                name: "cleanliness",
                icon: <FaBroom className="text-gray-500" />,
              },
              {
                name: "wakeUpTime",
                icon: <FaClock className="text-gray-500" />,
              },
              {
                name: "sleepTime",
                icon: <FaClock className="text-gray-500" />,
              },
              {
                name: "preferredRoommateGender",
                icon: <FaVenusMars className="text-gray-500" />,
              },
            ].map(({ name, icon }) => (
              <div key={name} className="space-y-1">
                <label className="text-sm font-medium text-gray-700">
                  {name
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                </label>
                <div className="flex items-center">
                  <span className="mr-3">{icon}</span>
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
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {currentUser[name] || "Not specified"}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Checkbox Fields */}
            {[
              {
                name: "isSmoker",
                icon: <FaSmoking className="text-gray-500" />,
              },
              {
                name: "isPetFriendly",
                icon: <FaPaw className="text-gray-500" />,
              },
            ].map(({ name, icon }) => (
              <div key={name} className="space-y-1">
                <div className="flex items-center">
                  <span className="mr-3">{icon}</span>
                  <label className="text-sm font-medium text-gray-700 mr-3">
                    {name
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </label>
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
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  ) : (
                    <p className="text-gray-800">
                      {currentUser[name] ? "Yes" : "No"}
                    </p>
                  )}
                </div>
              </div>
            ))}

            {/* Hobbies */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700 flex items-center">
                <FaHiking className="text-gray-500 mr-3" />
                Hobbies
              </label>
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Separate hobbies with commas"
                />
              ) : (
                <p className="text-gray-800 ml-8">
                  {Array.isArray(currentUser.hobbies)
                    ? currentUser.hobbies.join(", ")
                    : currentUser.hobbies || "Not specified"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap justify-center gap-4 mt-10">
        {editMode ? (
          <>
            <button
              onClick={saveProfile}
              disabled={loading}
              className={`flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg shadow-md hover:from-blue-700 hover:to-blue-600 transition-all ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <>
                  <RiLoader4Line className="animate-spin mr-2" />
                  Saving...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Save Changes
                </>
              )}
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="flex items-center px-6 py-3 bg-gray-200 text-gray-800 rounded-lg shadow-md hover:bg-gray-300 transition-all"
            >
              <FaTimes className="mr-2" />
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-400 text-gray-800 rounded-lg shadow-md hover:from-yellow-600 hover:to-yellow-500 transition-all"
          >
            <FaEdit className="mr-2" />
            Edit Profile
          </button>
        )}

        <button
          onClick={() => setShowDeleteModal(true)}
          className="flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-lg shadow-md hover:from-red-700 hover:to-red-600 transition-all"
        >
          <FaTrash className="mr-2" />
          Delete Account
        </button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
          <p className="text-red-700 font-medium">
            Error: {error.message || "Failed to update profile"}
          </p>
        </div>
      )}
      {updateSuccess && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
          <p className="text-green-700 font-medium">
            Profile updated successfully!
          </p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-start">
              <div className="bg-red-100 p-3 rounded-full mr-4">
                <FaExclamationTriangle className="text-red-600 text-xl" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  Delete Account?
                </h3>
                <p className="text-gray-600">
                  This will permanently delete your account and all associated
                  data. This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={deleteAccount}
                className="px-5 py-2.5 text-white bg-red-600 hover:bg-red-700 rounded-lg font-medium transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
