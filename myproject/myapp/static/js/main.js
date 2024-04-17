import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

// Create the scene and camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd); // Set background color to light gray
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.aspect = window.innerWidth / (window.innerHeight * 0.8); // Decrease the height of the scene
camera.updateProjectionMatrix();

// Create the renderer and attach it to the DOM
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container3D").appendChild(renderer.domElement);

// Set the initial camera position
camera.position.z = 5;

// Load and add lighting
const mainLight = new THREE.DirectionalLight(0xffffff, 2); // Increased intensity
mainLight.position.set(0, 1, 1); // Set position of main light source
scene.add(mainLight);

const secondaryLight = new THREE.DirectionalLight(0xffffff, 1); // Increased intensity
secondaryLight.position.set(0, -1, -1); // Set position of secondary light source
scene.add(secondaryLight);

const additionalLight = new THREE.DirectionalLight(0xffffff, 1); // New light
additionalLight.position.set(1, 0, 0); // Set position of additional light source
scene.add(additionalLight);

// Add ambient light to illuminate all objects equally
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);

// Initialize GLTFLoader
const loader = new GLTFLoader();

// Load the GLB file
loader.load(
    '/static/0/mesh.glb',
    function (gltf) {
        // Add the loaded object to the scene
        scene.add(gltf.scene);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error(error);
    }
);

// Initialize OrbitControls for camera interaction
const controls = new OrbitControls(camera, renderer.domElement);

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update(); // Update controls
    renderer.render(scene, camera);
}

// Window resize event listener
window.addEventListener("resize", function() {
    camera.aspect = window.innerWidth / (window.innerHeight * 0.8); // Decrease the height of the scene
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the animation loop
animate();