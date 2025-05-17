import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { useSelector } from "react-redux";

const ReviewSection = ({
  reviews,
  newReview,
  setNewReview,
  rating,
  setRating,
  handleReviewSubmit,
}) => {
  const [hoveredRating, setHoveredRating] = useState(null);

  const { currentUser } = useSelector((state) => state.user);
  console.log("currentUser", currentUser);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md">
      <h3 className="text-xl font-semibold text-gray-900 text-center mb-4">
        Reviews
      </h3>

      {/* Review Submission Form */}
      {currentUser ? (
        <form onSubmit={handleReviewSubmit} className="mb-6">
          <textarea
            value={newReview}
            onChange={(e) => setNewReview(e.target.value)}
            placeholder="Write your review here..."
            rows={4}
            className="w-full p-3 mb-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-200 text-sm"
          />

          <div className="mb-3">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Rate this room:
            </label>
            <div className="flex items-center">
              {[...Array(5)].map((_, index) => {
                const starValue = index + 1;
                return (
                  <FaStar
                    key={starValue}
                    className={`cursor-pointer transition-colors duration-200 ${
                      starValue <= (rating || hoveredRating)
                        ? "text-green-500"
                        : "text-gray-300"
                    }`}
                    size={24}
                    onMouseEnter={() => setHoveredRating(starValue)}
                    onMouseLeave={() => setHoveredRating(null)}
                    onClick={() => setRating(starValue)}
                  />
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded-md font-semibold text-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-200 focus:ring-offset-1 shadow-sm transition-colors duration-150"
          >
            Submit Review
          </button>
        </form>
      ) : (
        <p className="text-center text-gray-500 text-sm italic mb-6">
          Please log in to write a review.
        </p>
      )}

      {/* Review List */}
      <div className="mt-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic text-center">No reviews yet.</p>
        ) : (
          reviews.map((review, idx) => {
            return (
              <div
                key={idx}
                className="mb-4 p-4 border border-gray-200 rounded-md"
              >
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  {review.username || "Anonymous"}
                  <br />
                  <span className="ml-2 font-normal text-gray-600">
                    {[...Array(review.rating)].map((_, index) => (
                      <FaStar
                        key={index}
                        className="inline-block text-green-500"
                        size={16}
                      />
                    ))}
                  </span>
                </p>
                <p className="text-gray-700 text-sm">{review.comment}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
