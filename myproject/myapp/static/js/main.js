import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { OrbitControls } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd); // Set background color to light gray
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let object;
let controls;

const loader = new GLTFLoader();

loader.load(
    '/static/0/mesh.glb',
    function (gltf) {
        // Add the loaded object to the scene
        object = gltf.scene; // Set the object variable to the loaded GLTF object
        scene.add(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error(error);
    }
);

const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight*0.7);
document.getElementById("container3D").appendChild(renderer.domElement);

camera.position.z = 30;

// Directional light
const topLight = new THREE.DirectionalLight(0xffffff, 1);
topLight.position.set(500, 800, 500);
topLight.castShadow = true;
scene.add(topLight);

// Ambient light
const ambientLight = new THREE.AmbientLight(0x333333, 5);
scene.add(ambientLight);

// Point lights to illuminate the scene
const pointLight1 = new THREE.PointLight(0xffffff, 0.5);
pointLight1.position.set(0, 0, 50);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
pointLight2.position.set(0, 0, -50);
scene.add(pointLight2);

const pointLight3 = new THREE.PointLight(0xffffff, 0.5);
pointLight3.position.set(50, 0, 0);
scene.add(pointLight3);

const pointLight4 = new THREE.PointLight(0xffffff, 0.5);
pointLight4.position.set(-50, 0, 0);
scene.add(pointLight4);

controls = new OrbitControls(camera, renderer.domElement);

let shouldInteract = false;

const interactButton = document.getElementById("interactButton");
interactButton.addEventListener("click", function () {
    shouldInteract = !shouldInteract;
    if (!shouldInteract) {
        resetModelPosition();
    }
});

function resetModelPosition() {
    object.rotation.set(0, 0, 0);
}

function animate() {
    requestAnimationFrame(animate);

    if (shouldInteract) {
        const containerRect = document.getElementById("container3D").getBoundingClientRect();
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        const isMouseInsideContainer = mouseX >= containerRect.left && mouseX <= containerRect.right &&
                                       mouseY >= containerRect.top && mouseY <= containerRect.bottom;

        if (isMouseInsideContainer) {
            const mouseXInContainer = mouseX - containerRect.left;
            const mouseYInContainer = mouseY - containerRect.top;

            object.rotation.y = -3 + (mouseXInContainer / containerWidth) * 3;
            object.rotation.x = -1.2 + (mouseYInContainer / containerHeight) * 2.5;
        }
    }

    controls.update();
    renderer.render(scene, camera);
}

window.addEventListener("resize", function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

const container = document.getElementById("container3D");
container.addEventListener('mousemove', (e) => {
    mouseX = e.clientX - container.getBoundingClientRect().left;
    mouseY = e.clientY - container.getBoundingClientRect().top;
});

animate();

// Panning Button Functionality
const panButton = document.getElementById("panButton");
let isPanning = false;

panButton.addEventListener("click", function () {
    isPanning = !isPanning;
    if (isPanning) {
        enablePanning();
    } else {
        disablePanning();
    }
});

function enablePanning() {
    controls.enableRotate = false;
    controls.enablePan = true;
}

function disablePanning() {
    controls.enableRotate = true;
    controls.enablePan = false;
}


let isFullScreen = false;

const fullscreenButton = document.getElementById("fullscreenButton");
const exitFullscreenButton = document.getElementById("exitFullscreenButton");
const backButton = document.getElementById("backButton");

fullscreenButton.addEventListener("click", toggleFullScreen);
exitFullscreenButton.addEventListener("click", exitFullScreen);

function toggleFullScreen() {
    const container = document.querySelector(".container");

    if (!document.fullscreenElement) {
        if (container.requestFullscreen) {
            container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
            container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
            container.msRequestFullscreen();
        }
        isFullScreen = true;
        exitFullscreenButton.style.display = "inline-block";
        fullscreenButton.style.display = "none";
        backButton.style.display = "inline-block";
    }
}

function exitFullScreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
    isFullScreen = false;
    exitFullscreenButton.style.display = "none";
    fullscreenButton.style.display = "inline-block";
    backButton.style.display = "none";
}
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isFullScreen) {
        exitFullScreen();
    }
});
