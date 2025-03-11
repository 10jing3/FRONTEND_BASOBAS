import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Import your initial image
import Img from "../img/Room.jpg";

function VirtualRoom() {
  const containerRef = useRef(null);
  const [currentTexture, setCurrentTexture] = useState(Img); // State for current texture

  // Image Hotspot Data (Example)
  const hotspots = [
    { position: { x: 0, y: 0, z: -500 }, image: "../img/alma2.jpg" }, // Straight ahead
    { position: { x: 300, y: 0, z: 400 }, image: "../img/alma1.jpg" }, // To the right
  ];

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
    const texture = textureLoader.load(currentTexture); // Load initial texture

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    // Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = -0.25;

    // Hotspot Creation
    hotspots.forEach((hotspot, index) => {
      const hotspotGeometry = new THREE.SphereGeometry(5, 32, 32);
      const hotspotMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.5,
      });
      const hotspotMesh = new THREE.Mesh(hotspotGeometry, hotspotMaterial);
      hotspotMesh.position.set(
        hotspot.position.x,
        hotspot.position.y,
        hotspot.position.z
      );
      hotspotMesh.name = `hotspot-${index}`;
      scene.add(hotspotMesh);
    });

    // Raycaster for Hotspot Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      // Calculate Mouse Position
      mouse.x = (event.clientX / containerRef.current.clientWidth) * 2 - 1;
      mouse.y = -(event.clientY / containerRef.current.clientHeight) * 2 + 1;

      // Update the Raycaster
      raycaster.setFromCamera(mouse, camera);

      // Intersect Objects
      const intersects = raycaster.intersectObjects(scene.children);

      intersects.forEach((intersect) => {
        if (intersect.object.name.startsWith("hotspot-")) {
          // Get index from name
          const index = parseInt(intersect.object.name.split("-")[1]);
          // Update current texture and trigger re-render
          setCurrentTexture(hotspots[index].image);
        }
      });
    };

    containerRef.current.addEventListener("click", handleClick);

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
      containerRef.current.removeEventListener("click", handleClick);
      controls.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      scene.dispose();
    };
  }, [currentTexture]); // Re-run effect when currentTexture changes

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gray-100 font-sans">
      <h1 className="text-3xl text-gray-800 mb-8 text-center">
        Virtual Room Tour
      </h1>
      <div
        ref={containerRef}
        className="w-4/5 max-w-4xl h-[600px] shadow-lg rounded-lg overflow-hidden"
      ></div>
    </div>
  );
}

export default VirtualRoom;
