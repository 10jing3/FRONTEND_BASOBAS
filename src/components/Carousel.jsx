import { useState } from "react";

export default function Carousel({ images }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const totalSlides = images.length;

  // Handle previous slide
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
  };

  // Handle next slide
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
  };

  return (
    <div className="carousel w-full relative overflow-hidden">
      <div
        className="carousel-inner flex transition-transform duration-500"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="carousel-item relative w-full flex-shrink-0"
          >
            <img
              src={image}
              alt={`Slide ${index + 1}`}
              className="w-full h-64 object-cover rounded-md"
            />
          </div>
        ))}
      </div>

      {/* Carousel navigation buttons */}
      <div className="absolute left-5 right-5 top-1/2 transform -translate-y-1/2 flex justify-between">
        <button onClick={prevSlide} className="btn btn-circle">
          ❮
        </button>
        <button onClick={nextSlide} className="btn btn-circle">
          ❯
        </button>
      </div>
    </div>
  );
}
