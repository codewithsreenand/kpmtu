/**
 * KPMTU 3D Hero Object
 * Features a futuristic 3D DNA Helix to represent Paramedical Technicians
 */

function initHero3D() {
    const container = document.getElementById('hero-3d-container');
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xff0000, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const blueLight = new THREE.PointLight(0x002d62, 1);
    blueLight.position.set(-5, -5, 5);
    scene.add(blueLight);

    // Create DNA Helix
    const helixGroup = new THREE.Group();
    scene.add(helixGroup);

    const strandCount = 40;
    const radius = 2;
    const height = 10;
    const twist = Math.PI * 4;

    const ballGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const redMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xd90429, 
        emissive: 0xd90429, 
        emissiveIntensity: 0.5,
        shininess: 100 
    });
    const blueMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x002d62, 
        emissive: 0x002d62, 
        emissiveIntensity: 0.5,
        shininess: 100 
    });
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.2 });

    for (let i = 0; i < strandCount; i++) {
        const ratio = i / strandCount;
        const angle = ratio * twist;
        const y = (ratio - 0.5) * height;

        // Strand 1
        const x1 = Math.cos(angle) * radius;
        const z1 = Math.sin(angle) * radius;
        const ball1 = new THREE.Mesh(ballGeometry, redMaterial);
        ball1.position.set(x1, y, z1);
        helixGroup.add(ball1);

        // Strand 2
        const x2 = Math.cos(angle + Math.PI) * radius;
        const z2 = Math.sin(angle + Math.PI) * radius;
        const ball2 = new THREE.Mesh(ballGeometry, blueMaterial);
        ball2.position.set(x2, y, z2);
        helixGroup.add(ball2);

        // Connector Line
        const points = [];
        points.push(new THREE.Vector3(x1, y, z1));
        points.push(new THREE.Vector3(x2, y, z2));
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
        const line = new THREE.Line(lineGeometry, lineMaterial);
        helixGroup.add(line);
    }

    camera.position.z = 8;

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    window.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
        mouseY = (event.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
    });

    // Animation
    function animate() {
        requestAnimationFrame(animate);
        
        targetRotationY = mouseX * 0.5;
        targetRotationX = mouseY * 0.3;

        helixGroup.rotation.y += 0.005 + (targetRotationY - helixGroup.rotation.y) * 0.05;
        helixGroup.rotation.x += (targetRotationX - helixGroup.rotation.x) * 0.05;
        
        // Add a floating motion
        helixGroup.position.y = Math.sin(Date.now() * 0.001) * 0.2;

        renderer.render(scene, camera);
    }

    animate();

    // Resize Handling
    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
}

// Ensure Three.js is loaded before init
window.addEventListener('DOMContentLoaded', () => {
    if (typeof THREE !== 'undefined') {
        initHero3D();
    } else {
        console.error("Three.js not loaded");
    }
});
