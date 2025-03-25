import React from "react";
import { useEffect, useRef } from "react";
import * as PANOLENS from "panolens";

function RoomTour({ imageUrl }) {
  const viewerRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current && !viewerRef.current) {
      const viewer = new PANOLENS.Viewer({ container: containerRef.current });
      const panorama = new PANOLENS.ImagePanorama(imageUrl);
      viewer.add(panorama);

      viewerRef.current = viewer; // Store the viewer instance to avoid duplicates
    }
  }, [imageUrl]);

  return <div ref={containerRef} style={{ width: "100%", height: "500px" }} />;
}

export default RoomTour;
