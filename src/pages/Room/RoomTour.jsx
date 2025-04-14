import { Canvas } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { OrbitControls, Sphere } from "@react-three/drei";
import { TextureLoader, LinearFilter, sRGBEncoding } from "three";
import { useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiChevronUp,
  FiChevronDown,
  FiX,
} from "react-icons/fi";

function RoomTour({ imageUrls }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [textures, setTextures] = useState([]);
  const [loading, setLoading] = useState(true);
  const controlsRef = useRef();
  const [isMoving, setIsMoving] = useState(false);
  const [hoveredArrow, setHoveredArrow] = useState(null);
  const navigate = useNavigate();

  // Preload all textures
  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) return;

    setLoading(true);
    const textureLoader = new TextureLoader();
    const loadPromises = imageUrls.map(
      (url) =>
        new Promise((resolve) => {
          textureLoader.load(
            url,
            (texture) => {
              texture.minFilter = LinearFilter;
              texture.magFilter = LinearFilter;
              texture.encoding = sRGBEncoding;
              resolve(texture);
            },
            undefined,
            () => resolve(null)
          );
        })
    );

    Promise.all(loadPromises).then((loadedTextures) => {
      setTextures(loadedTextures.filter((t) => t !== null));
      setLoading(false);
    });
  }, [imageUrls]);

  const navigateView = (direction) => {
    if (isMoving) return;

    setIsMoving(true);
    let newIndex = currentImageIndex;

    switch (direction) {
      case "forward":
        newIndex = 0;
        break;
      case "right":
        newIndex = 1;
        break;
      case "back":
        newIndex = 2;
        break;
      case "left":
        newIndex = 3;
        break;
      case "up":
        newIndex = 4;
        break;
      case "down":
        newIndex = 5;
        break;
      default:
        break;
    }

    if (newIndex >= textures.length) {
      setIsMoving(false);
      return;
    }

    setCurrentImageIndex(newIndex);
    if (controlsRef.current) controlsRef.current.reset();
    setTimeout(() => setIsMoving(false), 300);
  };

  if (loading) {
    return (
      <div className="w-full h-[700px] flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
          <p className="text-white/80 text-lg">Loading panoramic view...</p>
        </div>
      </div>
    );
  }

  if (textures.length === 0) {
    return (
      <div className="w-full h-[700px] flex items-center justify-center bg-gray-900 text-white/80 text-lg">
        No panoramic images available
      </div>
    );
  }

  const availableDirections = {
    left: currentImageIndex !== 3 && textures.length > 3,
    right: currentImageIndex !== 1 && textures.length > 1,
    forward: currentImageIndex !== 0 && textures.length > 0,
    back: currentImageIndex !== 2 && textures.length > 2,
  };

  return (
    <div className="relative w-full h-[700px] bg-gray-900 overflow-hidden">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 0.1], fov: 75 }}>
        <Suspense fallback={null}>
          <OrbitControls
            ref={controlsRef}
            enableZoom={true}
            enablePan={false}
            minDistance={0.1}
            maxDistance={2}
            autoRotate={false}
            rotateSpeed={-0.25}
          />
          <Sphere args={[500, 60, 40]} scale={[-1, 1, 1]}>
            <meshBasicMaterial
              attach="material"
              map={textures[currentImageIndex]}
              side={2}
            />
          </Sphere>
        </Suspense>
      </Canvas>

      {/* Close Button (Top Right) */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm transition-all duration-200 text-white hover:text-white/90"
        aria-label="Close and go back"
      >
        <FiX className="w-6 h-6" />
      </button>

      {/* Navigation Arrows */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left Arrow */}
        {availableDirections.left && (
          <div
            className="absolute left-0 top-1/2 h-1/3 w-1/6 transform -translate-y-1/2 pointer-events-auto"
            onMouseEnter={() => setHoveredArrow("left")}
            onMouseLeave={() => setHoveredArrow(null)}
            onClick={() => navigateView("left")}
          >
            <div
              className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 flex items-center justify-center w-14 h-14 rounded-full ${
                hoveredArrow === "left"
                  ? "bg-black/60 opacity-100 scale-110"
                  : "bg-black/40 opacity-80"
              }`}
            >
              <FiChevronLeft className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </div>
        )}

        {/* Right Arrow */}
        {availableDirections.right && (
          <div
            className="absolute right-0 top-1/2 h-1/3 w-1/6 transform -translate-y-1/2 pointer-events-auto"
            onMouseEnter={() => setHoveredArrow("right")}
            onMouseLeave={() => setHoveredArrow(null)}
            onClick={() => navigateView("right")}
          >
            <div
              className={`absolute right-4 top-1/2 transform -translate-y-1/2 transition-all duration-200 flex items-center justify-center w-14 h-14 rounded-full ${
                hoveredArrow === "right"
                  ? "bg-black/60 opacity-100 scale-110"
                  : "bg-black/40 opacity-80"
              }`}
            >
              <FiChevronRight className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </div>
        )}

        {/* Forward Arrow */}
        {availableDirections.forward && (
          <div
            className="absolute top-0 left-1/2 w-1/3 h-1/6 transform -translate-x-1/2 pointer-events-auto"
            onMouseEnter={() => setHoveredArrow("forward")}
            onMouseLeave={() => setHoveredArrow(null)}
            onClick={() => navigateView("forward")}
          >
            <div
              className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-200 flex items-center justify-center w-14 h-14 rounded-full ${
                hoveredArrow === "forward"
                  ? "bg-black/60 opacity-100 scale-110"
                  : "bg-black/40 opacity-80"
              }`}
            >
              <FiChevronUp className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </div>
        )}

        {/* Back Arrow */}
        {availableDirections.back && (
          <div
            className="absolute bottom-0 left-1/2 w-1/3 h-1/6 transform -translate-x-1/2 pointer-events-auto"
            onMouseEnter={() => setHoveredArrow("back")}
            onMouseLeave={() => setHoveredArrow(null)}
            onClick={() => navigateView("back")}
          >
            <div
              className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 transition-all duration-200 flex items-center justify-center w-14 h-14 rounded-full ${
                hoveredArrow === "back"
                  ? "bg-black/60 opacity-100 scale-110"
                  : "bg-black/40 opacity-80"
              }`}
            >
              <FiChevronDown className="w-8 h-8 text-white drop-shadow-lg" />
            </div>
          </div>
        )}
      </div>

      {/* Position Indicator */}
      <div className="absolute bottom-6 left-6 z-10 bg-black/50 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium flex items-center">
        <span className="text-blue-300 font-semibold">
          {currentImageIndex + 1}
        </span>
        <span className="mx-1.5 text-gray-300">/</span>
        <span>{textures.length}</span>
      </div>

      {/* Loading Indicator */}
      {isMoving && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="bg-black/70 text-white px-5 py-3 rounded-full text-sm flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
            <span>Loading view...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default RoomTour;
