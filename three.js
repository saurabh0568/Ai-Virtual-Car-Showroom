import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160/build/three.module.js';
    import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160/examples/jsm/loaders/GLTFLoader.js';

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111); // Dark background for better contrast

    // Camera Setup
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 1.5, 5); // Position slightly above the car

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2); 
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
    directionalLight.position.set(3, 5, 2);
    scene.add(directionalLight);

    // Load 3D Car Model
    const loader = new GLTFLoader();
    let carModel;

    loader.load(
        'static/suv_model.glb', // Change this to your car model file path
        function (gltf) {
            carModel = gltf.scene;
            carModel.scale.set(1, 1, 1);
            carModel.position.set(0, -0.5, 0);
            scene.add(carModel);
        },
        function (xhr) {
            console.log(`Loading: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% completed`);
        },
        function (error) {
            console.error('Error loading model', error);
        }
    );

    // Animation Loop (Auto-Rotation)
    function animate() {
        requestAnimationFrame(animate);
        if (carModel) carModel.rotation.y += 0.005; // Slow rotation
        renderer.render(scene, camera);
    }
    animate();

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
