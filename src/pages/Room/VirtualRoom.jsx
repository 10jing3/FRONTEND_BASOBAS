import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Img from "../img/Room.jpg"; // Import the image

function VirtualRoom() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 0.1;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    containerRef.current.appendChild(renderer.domElement);
    renderer.setClearColor(0xffffff);

    // Sphere (for the 360 view)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1); // Invert the sphere

    // Texture
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(Img, (texture) => {
      const material = new THREE.MeshBasicMaterial({ map: texture });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);

      // Orbit Controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableZoom = false;
      controls.enablePan = false;
      controls.rotateSpeed = -0.25;

      // Animation Loop
      const animate = () => {
        controls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };

      animate();

      // Responsive handling
      const handleResize = () => {
        if (!containerRef.current) return;

        camera.aspect =
          containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      };

      window.addEventListener("resize", handleResize);

      // Cleanup function
      return () => {
        window.removeEventListener("resize", handleResize);
        controls.dispose();
        geometry.dispose();
        material.dispose();
        texture.dispose();
        renderer.dispose();
        scene.remove(sphere);
      };
    });
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 font-sans">
      <h1 className="text-3xl text-gray-800 mb-8 text-center">Virtual Room</h1>
      <div
        ref={containerRef}
        className="w-4/5 max-w-full h-[600px] shadow-lg rounded-lg overflow-hidden"
      ></div>
    </div>
  );
}

export default VirtualRoom;
