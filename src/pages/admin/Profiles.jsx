import { useState } from "react";
import {
  FaCamera,
  FaEye,
  FaEyeSlash,
  FaEdit,
  FaSave,
  FaTimes,
  FaTrash,
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

  // Handle profile picture upload
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      handleFileUpload(file);
    }
  };

  // Upload file to Firebase
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

  // Handle input changes
  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  // Save profile changes
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

  // Delete account
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

  // Sign out
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
    <div className="text-black p-8 rounded-lg shadow-lg max-w-lg mx-auto mt-10">
      <h3 className="text-3xl font-semibold text-center">Profile</h3>

      {/* Profile Picture */}
      <div className="relative mx-auto w-32 h-32 mt-6">
        <img
          src={tempProfile.profilePicture || currentUser.profilePicture}
          alt="Profile"
          className="w-full h-full rounded-full border-4 border-gray-500 object-cover shadow-lg"
        />
        {editMode && (
          <label className="absolute bottom-2 right-2 bg-gray-700 text-white p-2 rounded-full cursor-pointer">
            <FaCamera className="w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </label>
        )}
      </div>

      {/* Upload Progress or Error */}
      <p className="text-sm text-center mt-2">
        {imageError ? (
          <span className="text-red-700">
            Error uploading image (file size must be less than 2 MB)
          </span>
        ) : imagePercent > 0 && imagePercent < 100 ? (
          <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
        ) : imagePercent === 100 ? (
          <span className="text-green-700">Image uploaded successfully</span>
        ) : (
          ""
        )}
      </p>

      {/* Profile Details */}
      <div className="mt-6 space-y-5">
        <div>
          <label className="block text-gray-400 font-medium">Username</label>
          {editMode ? (
            <input
              type="text"
              name="username"
              value={tempProfile.username}
              onChange={handleChange}
              className="border p-2 w-full rounded-md text-gray-900 focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="text-lg font-semibold">{currentUser.username}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-400 font-medium">Email</label>
          {editMode ? (
            <input
              type="email"
              name="email"
              value={tempProfile.email}
              onChange={handleChange}
              className="border p-2 w-full rounded-md text-gray-900 focus:ring-2 focus:ring-blue-400"
            />
          ) : (
            <p className="text-lg font-semibold">{currentUser.email}</p>
          )}
        </div>

        <div>
          <label className="block text-gray-400 font-medium">Password</label>
          <div className="relative">
            {editMode ? (
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={tempProfile.password}
                onChange={handleChange}
                className="border p-2 w-full rounded-md text-gray-900 focus:ring-2 focus:ring-blue-400"
              />
            ) : (
              <p className="text-lg font-semibold">********</p>
            )}
            {editMode && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-gray-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Edit/Save Buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        {editMode ? (
          <>
            <button
              onClick={saveProfile}
              className="bg-blue-500 text-white px-5 py-2 rounded-md hover:bg-blue-600 flex items-center space-x-2 transition"
            >
              <FaSave /> <span>{loading ? "Saving..." : "Save"}</span>
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-gray-500 text-white px-5 py-2 rounded-md hover:bg-gray-600 flex items-center space-x-2 transition"
            >
              <FaTimes /> <span>Cancel</span>
            </button>
          </>
        ) : (
          <button
            onClick={() => setEditMode(true)}
            className="bg-yellow-500 text-gray-900 px-5 py-2 rounded-md hover:bg-yellow-600 flex items-center space-x-2 transition"
          >
            <FaEdit /> <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* Delete Account Button */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={() => setShowDeleteModal(true)}
          className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2 transition"
        >
          <FaTrash /> <span>Delete Account</span>
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-xl font-semibold text-gray-900">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 mt-2">
              Are you sure you want to delete your account? This action cannot
              be undone.
            </p>

            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-400 text-black px-4 py-2 rounded-md hover:bg-gray-500"
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
    </div>
  );
}
