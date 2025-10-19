let camera, scene, renderer, controls, model;
let moveForward = false, moveBackward = false, moveLeft = false, moveRight = false;
let velocity = new THREE.Vector3();

init();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // Luz
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(10, 10, 10);
  scene.add(light);

  const ambient = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambient);

  // Piso
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(500, 500),
    new THREE.MeshStandardMaterial({ color: 0x777777 })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // Cargar modelo GLB
  const loader = new THREE.GLTFLoader();
  loader.load('casa.glb', function (gltf) {
    model = gltf.scene;
    scene.add(model);
  });

  // Controles de movimiento (tipo juego)
  controls = new THREE.PointerLockControls(camera, document.body);

  const startButton = document.getElementById('startButton');
  startButton.addEventListener('click', function () {
    controls.lock();
    startButton.style.display = 'none';
  });

  controls.addEventListener('unlock', function () {
    startButton.style.display = 'block';
  });

  camera.position.set(0, 2, 5);

  // Movimiento con teclado
  const onKeyDown = function (event) {
    switch (event.code) {
      case 'KeyW': moveForward = true; break;
      case 'KeyS': moveBackward = true; break;
      case 'KeyA': moveLeft = true; break;
      case 'KeyD': moveRight = true; break;
    }
  };

  const onKeyUp = function (event) {
    switch (event.code) {
      case 'KeyW': moveForward = false; break;
      case 'KeyS': moveBackward = false; break;
      case 'KeyA': moveLeft = false; break;
      case 'KeyD': moveRight = false; break;
    }
  };

  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);

  window.addEventListener('resize', onWindowResize);

  animate();
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);

  if (controls.isLocked === true) {
    const delta = 0.1;
    velocity.x -= velocity.x * 10.0 * delta;
    velocity.z -= velocity.z * 10.0 * delta;

    if (moveForward) velocity.z -= 0.2 * delta;
    if (moveBackward) velocity.z += 0.2 * delta;
    if (moveLeft) velocity.x -= 0.2 * delta;
    if (moveRight) velocity.x += 0.2 * delta;

    controls.moveRight(-velocity.x);
    controls.moveForward(-velocity.z);
  }

  renderer.render(scene, camera);
}
