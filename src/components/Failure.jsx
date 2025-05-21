// filepath: c:\Users\Tenjing\OneDrive\Desktop\BASOBAS\frontend\src\components\Failure.jsx
import { FiXCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const Failure = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-100 via-pink-100 to-purple-100 px-4">
      <div className="bg-white rounded-3xl shadow-2xl p-10 flex flex-col items-center border border-red-100 max-w-md w-full">
        <FiXCircle className="text-red-500 text-6xl mb-4 animate-bounce" />
        <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
          Payment Failed
        </h1>
        <p className="text-lg text-gray-700 mb-2 text-center">
          Unfortunately, your payment could not be processed.
        </p>
        <p className="text-base text-gray-500 mb-6 text-center">
          Please check your payment details or try again later.
        </p>
        <div className="w-full flex flex-col items-center">
          <button
            onClick={() => navigate(-1)}
            className="mt-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold shadow transition"
          >
            Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="mt-3 px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold shadow transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Failure;
