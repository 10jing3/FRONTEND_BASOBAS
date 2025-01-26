import React from "react";

const Map = () => {
  return (
    <div className="h-96 bg-gray-200 rounded-md">
      <iframe
        title="Map"
        src="https://www.google.com/maps/embed?pb=..."
        className="w-full h-full"
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default Map;
