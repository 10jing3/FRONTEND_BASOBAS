import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);

  return (
    <header className="bg-gray-800 text-white ">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-4">
        {/* Logo */}
        <Link to="/" aria-label="Home">
          <h1 className="text-2xl font-bold text-green-600">BasoBas</h1>
        </Link>

        {/* Navigation */}
        <nav>
          <ul className="flex items-center gap-6 text-white">
            <li>
              <Link
                to="/"
                className="hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:text-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
              >
                {currentUser ? (
                  <img
                    src={
                      currentUser.profilePicture ||
                      "https://via.placeholder.com/40"
                    }
                    alt={`${currentUser.name}'s profile`}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span>Sign In</span>
                )}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
