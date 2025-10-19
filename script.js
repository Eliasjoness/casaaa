// Configuración básica
const container = document.getElementById('container');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfd1e5);

// Cámara
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 3, 8);

// Renderizador
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
container.appendChild(renderer.domElement);

// Luz
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 1.2);
hemiLight.position.set(0, 200, 0);
scene.add(hemiLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
dirLight.position.set(5, 10, 7.5);
scene.add(dirLight);

// Control con mouse
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1, 0);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Cargar modelo GLB
const loader = new THREE.GLTFLoader();
loader.load(
  'casa.glb',
  function (gltf) {
    const model = gltf.scene;
    scene.add(model);
  },
  undefined,
  function (error) {
    console.error('Error al cargar el modelo:', error);
  }
);

// Movimiento básico con teclas
const move = { forward: 0, backward: 0, left: 0, right: 0 };
document.addEventListener('keydown', (e) => {
  if (e.key === 'w') move.forward = 1;
  if (e.key === 's') move.backward = 1;
  if (e.key === 'a') move.left = 1;
  if (e.key === 'd') move.right = 1;
});
document.addEventListener('keyup', (e) => {
  if (e.key === 'w') move.forward = 0;
  if (e.key === 's') move.backward = 0;
  if (e.key === 'a') move.left = 0;
  if (e.key === 'd') move.right = 0;
});

// Animación
function animate() {
  requestAnimationFrame(animate);

  const speed = 0.05;
  if (move.forward) camera.position.z -= Math.cos(camera.rotation.y) * speed;
  if (move.backward) camera.position.z += Math.cos(camera.rotation.y) * speed;
  if (move.left) camera.position.x -= Math.cos(camera.rotation.y + Math.PI / 2) * speed;
  if (move.right) camera.position.x += Math.cos(camera.rotation.y + Math.PI / 2) * speed;

  controls.update();
  renderer.render(scene, camera);
}

animate();

// Ajustar tamaño al cambiar ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
