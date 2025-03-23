import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useState, useRef } from "react";
import { OrbitControls, Sphere } from "@react-three/drei";
import { TextureLoader, CanvasTexture, LinearFilter, Vector3 } from "three";

function RoomTour({ imageUrls }) {
  const [panoramaTexture, setPanoramaTexture] = useState(null);
  const [cameraPosition, setCameraPosition] = useState(new Vector3(0, 0, 5));
  const canvasRef = useRef();

  useEffect(() => {
    if (!imageUrls || imageUrls.length === 0) {
      console.error("No images provided for RoomTour.");
      return;
    }

    let isMounted = true;
    let loadedTexture = null;

    const loadImage = async (url) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      });
    };

    const loadAndMergeImages = async () => {
      try {
        if (imageUrls.length === 1) {
          new TextureLoader().load(imageUrls[0], (texture) => {
            if (!isMounted) return;
            texture.minFilter = LinearFilter;
            texture.magFilter = LinearFilter;
            loadedTexture = texture;
            setPanoramaTexture(texture);
          });
        } else {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");
          const images = await Promise.all(imageUrls.map(loadImage));

          const imgWidth = images[0].width;
          const imgHeight = images[0].height;
          canvas.width = imgWidth * images.length;
          canvas.height = imgHeight;

          images.forEach((img, index) => {
            ctx.drawImage(img, index * imgWidth, 0, imgWidth, imgHeight);
          });

          const texture = new CanvasTexture(canvas);
          texture.minFilter = LinearFilter;
          texture.magFilter = LinearFilter;
          loadedTexture = texture;
          setPanoramaTexture(texture);
        }
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadAndMergeImages();

    return () => {
      isMounted = false;
      if (loadedTexture) {
        loadedTexture.dispose();
      }
    };
  }, [imageUrls]);

  const moveForward = () => {
    setCameraPosition(
      (prev) => new Vector3(prev.x, prev.y, Math.max(prev.z - 1, 1))
    );
  };

  return (
    <div className="relative w-full" style={{ height: "600px" }}>
      <button
        onClick={moveForward}
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 20px",
          background: "#fff",
          border: "1px solid #ccc",
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        Move Forward
      </button>
      <Canvas ref={canvasRef} style={{ height: "100%" }}>
        <Suspense fallback={null}>
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            autoRotate={false}
            minDistance={1}
            maxDistance={5}
            target={[0, 0, 0]}
            position={cameraPosition}
          />
          <Sphere args={[5, 60, 60]} scale={[-1, 1, 1]}>
            {panoramaTexture && (
              <meshBasicMaterial
                attach="material"
                map={panoramaTexture}
                side={2}
              />
            )}
          </Sphere>
        </Suspense>
      </Canvas>
    </div>
  );
}

export default RoomTour;
