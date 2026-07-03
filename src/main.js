import './style.css';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const app = document.querySelector('#app');
app.innerHTML = `
  <canvas id="gameCanvas"></canvas>

  <div id="mainMenu" class="overlay menu-bg active">
    <div class="menu-card">
      <div class="logo-kicker">Conservation FPS Simulation</div>
      <h1>SAVANNA OPS:<br/>WILD RESCUE</h1>
      <div class="subtitle">
        Game edukasi konservasi fauna dan simulasi penyelamatan satwa liar 3D. Anda menjadi ranger operasi lapangan yang memakai dart non-mematikan, menolong satwa terluka, dan menghentikan aktivitas pemburu liar di kawasan savana.
      </div>
      <div class="menu-grid">
        <div class="stat-box"><strong>3 Kamera</strong><span>FPS, third person, dan kamera atas</span></div>
        <div class="stat-box"><strong>70m</strong><span>Pemburu liar mengejar saat masuk radius</span></div>
        <div class="stat-box"><strong>Rescue Order</strong><span>Panah dan daftar satwa memandu misi</span></div>
      </div>
      <div class="menu-actions">
        <button id="startBtn" class="primary">START GAME</button>
        <button id="settingsBtn">PENGATURAN</button>
        <button id="creditsBtn">KREDIT GAME</button>
        <button id="howBtn">CARA MAIN</button>
      </div>
    </div>
  </div>

  <div id="hud">
    <div class="crosshair"></div>
    <div id="scopeOverlay" class="scope-overlay"><div class="scope-ring"></div><div class="scope-vline"></div><div class="scope-hline"></div></div>
    <div id="missionArrow" class="mission-arrow">▲<span id="arrowDistance">0 m</span></div>
    <div id="successBanner" class="success-banner"><strong id="successTitle">RESCUE SUCCESS</strong><span id="successText">Satwa berhasil diselamatkan.</span></div>
    <div id="cameraBadge" class="camera-badge">CAM FPS</div>
    <div id="musicBadge" class="music-badge">MUSIC EXPLORE</div>
    <div class="hud-top">
      <div class="hud-panel objective">
        <strong id="missionTitle">Misi Operasi</strong>
        <span id="missionText">Selamatkan satwa dan amankan area dari pemburu liar.</span>
        <div id="animalList" class="animal-list"></div>
        <div class="book-hint">Tekan <kbd>B</kbd> untuk membuka Buku Petunjuk Operasi.</div>
      </div>
      <div>
        <canvas id="minimap" width="170" height="170"></canvas>
        <div id="fpsCounter" class="fps-counter">FPS 0</div>
      </div>
      <div class="hud-panel bars">
        <div>
          <div class="bar-label"><span>Health</span><span id="healthText">100%</span></div>
          <div class="bar"><div id="healthFill"></div></div>
        </div>
        <div>
          <div class="bar-label"><span>Stamina</span><span id="staminaText">100%</span></div>
          <div class="bar"><div id="staminaFill"></div></div>
        </div>
        <div>
          <div class="bar-label"><span>Tranquilizer Pressure</span><span id="tranqText">Ready</span></div>
          <div class="bar"><div id="tranqFill"></div></div>
        </div>
      </div>
    </div>
    <div id="toastStack"></div>
    <div class="hud-bottom">
      <div id="interactBox" class="hud-panel interact">Tekan <kbd>E</kbd> untuk interaksi.</div>
      <div class="hud-panel weapon">
        <div class="ammo"><span id="ammoText">12</span></div>
        <div class="sub">Dart non-mematikan · <kbd>R</kbd> Reload</div>
      </div>
    </div>
  </div>

  <div id="settingsModal" class="overlay modal-bg">
    <div class="panel-card">
      <h2>Pengaturan</h2>
      <p>Pengaturan disimpan di browser. Mode kualitas memengaruhi jarak render, jumlah rumput, dan pixel ratio.</p>
      <div class="settings-grid">
        <div class="setting">
          <label for="sensitivityRange">Mouse Sensitivity</label>
          <input id="sensitivityRange" type="range" min="0.25" max="2.5" value="0.9" step="0.05" />
          <small id="sensitivityValue">0.90</small>
        </div>
        <div class="setting">
          <label for="fovRange">Field of View</label>
          <input id="fovRange" type="range" min="60" max="95" value="75" step="1" />
          <small id="fovValue">75°</small>
        </div>
        <div class="setting">
          <label for="volumeRange">Volume</label>
          <input id="volumeRange" type="range" min="0" max="1" value="0.25" step="0.01" />
          <small id="volumeValue">25%</small>
        </div>
        <div class="setting">
          <label for="dynamicMusicSelect">Dynamic Music</label>
          <select id="dynamicMusicSelect">
            <option value="on" selected>On - otomatis berubah sesuai situasi</option>
            <option value="off">Off - musik petualangan stabil</option>
          </select>
          <small>Musik berubah dari explore, tension, combat, low health, dan extraction.</small>
        </div>
        <div class="setting">
          <label for="graphicsSelect">Graphics Quality</label>
          <select id="graphicsSelect">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high" selected>High</option>
          </select>
          <small>Low cocok untuk laptop ringan. High memberi rumput dan bayangan lebih padat.</small>
        </div>
      </div>
      <div class="menu-actions">
        <button id="applySettings" class="primary">SIMPAN</button>
        <button data-close="settingsModal">KEMBALI</button>
      </div>
    </div>
  </div>

  <div id="creditsModal" class="overlay modal-bg">
    <div class="panel-card">
      <h2>Kredit Game</h2>
      <p><strong>Savanna Ops: Wild Rescue</strong> dibuat sebagai template game edukasi konservasi fauna berbasis Three.js.</p>
      <ul>
        <li>Engine: Three.js via NPM dan Vite.</li>
        <li>Asset 3D: procedural fallback models dibuat dari mesh dasar Three.js. Folder GLB lokal disiapkan di <code>public/assets/models</code>.</li>
        <li>Audio: efek suara sintetis WebAudio, musik dinamis adaptif, tanpa file eksternal.</li>
        <li>Konsep edukasi: konservasi satwa, konflik manusia-satwa, anti-perburuan liar, rescue non-mematikan.</li>
      </ul>
      <div class="menu-actions">
        <button data-close="creditsModal" class="primary">KEMBALI</button>
      </div>
    </div>
  </div>

  <div id="howModal" class="overlay modal-bg">
    <div class="panel-card">
      <h2>Cara Main</h2>
      <p>Tujuan utama: selamatkan 5 satwa terluka, netralkan 8 pemburu liar dengan dart non-mematikan, lalu kembali ke helipad untuk ekstraksi.</p>
      <div class="help-grid">
        <div class="key-row"><span>Gerak</span><kbd>W A S D</kbd></div>
        <div class="key-row"><span>Lari</span><kbd>Shift</kbd></div>
        <div class="key-row"><span>Bidik sniper/scope</span><kbd>Mouse Right</kbd></div>
        <div class="key-row"><span>Tembak dart jarak jauh</span><kbd>Mouse Left</kbd></div>
        <div class="key-row"><span>Reload</span><kbd>R</kbd></div>
        <div class="key-row"><span>Rescue / interaksi</span><kbd>E</kbd></div>
        <div class="key-row"><span>Ganti kamera</span><kbd>V</kbd></div>
        <div class="key-row"><span>FPS / Third / Atas</span><kbd>1 / 2 / 3</kbd></div>
        <div class="key-row"><span>Buku petunjuk</span><kbd>B</kbd></div>
        <div class="key-row"><span>Pause</span><kbd>Esc</kbd></div>
      </div>
      <div class="menu-actions" style="margin-top:18px">
        <button data-close="howModal" class="primary">KEMBALI</button>
      </div>
    </div>
  </div>

  <div id="fieldGuideModal" class="overlay modal-bg">
    <div class="panel-card field-guide-card">
      <div class="book-kicker">RANGER FIELD GUIDE · KONSERVASI FAUNA</div>
      <h2>Buku Petunjuk Operasi</h2>
      <p><strong>Kronologi:</strong> jaringan pemburu liar memasang beberapa kandang di koridor migrasi savana. Tim udara melihat satwa stres, terluka ringan, dan terpisah dari kelompoknya. Operator ditugaskan masuk ke zona, menetralkan pemburu dengan dart non-mematikan, membuka kandang sesuai prioritas, lalu mengevakuasi satwa secara bertahap.</p>
      <div class="briefing-box">
        <strong>Misi awal</strong>
        <span id="briefingStory">Ikuti tanda panah objective. Prioritas pertama adalah Gajah Savana karena ukuran tubuhnya besar dan risiko stres di ruang sempit paling tinggi.</span>
      </div>
      <h3>Daftar Hewan dan Cerita Masing-Masing</h3>
      <div id="guideAnimalList" class="guide-animal-list"></div>
      <p class="guide-note">Aturan rescue: hewan hanya bisa dibebaskan setelah pemburu di sekitar kandang dinetralkan. Setelah rescue berhasil, kandang akan hilang dari area dan health operator pulih ke 100%.</p>
      <div class="menu-actions">
        <button id="guideStartBtn" class="primary">LANJUTKAN OPERASI</button>
        <button id="guideCloseBtn">TUTUP BUKU</button>
      </div>
    </div>
  </div>

  <div id="pauseModal" class="overlay modal-bg">
    <div class="panel-card">
      <h2>Game Paused</h2>
      <p>Klik lanjutkan untuk mengunci mouse kembali ke area game.</p>
      <div class="menu-actions">
        <button id="resumeBtn" class="primary">LANJUTKAN</button>
        <button id="restartBtn">RESTART MISI</button>
        <button id="quitBtn" class="danger">KELUAR KE MENU</button>
      </div>
    </div>
  </div>

  <div id="endModal" class="overlay modal-bg">
    <div class="panel-card">
      <h2 id="endTitle">Mission Complete</h2>
      <p id="endText">Area savana berhasil diamankan.</p>
      <div class="menu-actions">
        <button id="playAgainBtn" class="primary">MAIN LAGI</button>
        <button id="endMenuBtn">MENU UTAMA</button>
      </div>
    </div>
  </div>
`;

const $ = (id) => document.getElementById(id);

const canvas = $('gameCanvas');
const mainMenu = $('mainMenu');
const hud = $('hud');
const settingsModal = $('settingsModal');
const creditsModal = $('creditsModal');
const howModal = $('howModal');
const fieldGuideModal = $('fieldGuideModal');
const pauseModal = $('pauseModal');
const endModal = $('endModal');
const minimap = $('minimap');
const minimapCtx = minimap.getContext('2d');

const settings = loadSettings();
const loader = new GLTFLoader();

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xb8d1da);
scene.fog = new THREE.FogExp2(0xd6c58c, 0.0037);

const camera = new THREE.PerspectiveCamera(settings.fov, window.innerWidth / window.innerHeight, 0.08, 680);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;

const clock = new THREE.Clock();
const raycaster = new THREE.Raycaster();
const center = new THREE.Vector2(0, 0);

const world = {
  root: new THREE.Group(),
  obstacles: [],
  enemies: [],
  animals: [],
  darts: [],
  particles: [],
  interactables: [],
  base: null,
  extraction: null,
  grass: null,
  weapon: null,
  playerAvatar: null,
  ambience: null,
  ambienceNodes: [],
  musicTimer: 0,
  musicStep: 0,
  musicMode: 'explore',
};
scene.add(world.root);

const player = {
  position: new THREE.Vector3(0, 1.75, 16),
  velocity: new THREE.Vector3(),
  yaw: 0,
  pitch: 0,
  health: 100,
  stamina: 100,
  ammo: 12,
  reserve: 48,
  maxAmmo: 12,
  reloadTime: 0,
  fireCooldown: 0,
  rescued: 0,
  neutralized: 0,
  missionWon: false,
  damageCooldown: 0,
  recoil: 0,
};

const game = {
  state: 'menu',
  pointerLocked: false,
  started: false,
  elapsed: 0,
  frames: 0,
  fpsTime: 0,
  lastFps: 0,
  nearTarget: null,
  missionStage: 0,
  cameraMode: 'fps',
  audioStarted: false,
  birdTimer: 0,
  guideReturnState: 'playing',
  successTimer: 0,
  combatTimer: 0,
};

const CAMERA_MODES = ['fps', 'third', 'top'];
const UP = new THREE.Vector3(0, 1, 0);
const enemyAlertRadius = 70;
const rescueGuardRadius = 52;
const sniperMaxRange = 430;
const scopedAssistRadius = 1.28;
const hipFireAssistRadius = 0.42;

const input = {
  keys: new Set(),
  mouseDown: false,
  aiming: false,
};

const materials = createMaterials();
const educationFacts = [
  'Satwa terluka perlu ditangani minim stres. Pendekatan terlalu cepat dapat memperparah kondisi fisiologisnya.',
  'Konservasi efektif tidak hanya melindungi satwa, tetapi juga mengurangi konflik dengan masyarakat sekitar habitat.',
  'Patroli anti-perburuan liar memakai bukti lapangan, pemetaan rute, kamera jebak, dan respons cepat.',
  'Habitat savana membutuhkan koridor migrasi agar zebra, gajah, dan antelop tidak terisolasi.',
  'Dart dalam game ini bersifat non-mematikan. Operasi nyata harus mengikuti protokol dokter hewan dan hukum setempat.',
];

const animalMissionBriefs = [
  {
    type: 'elephant',
    name: 'Gajah Savana',
    url: '/assets/models/Gajah_Savana.glb',
    targetHeight: 4,
    groundOffset: 0.55,
    pos: new THREE.Vector3(-92, 0, -86),
    fact: educationFacts[3],
    order: 1,
    story: 'Gajah muda ini terjebak di kandang baja dekat sumber air. Jejak kawanan masih terlihat di sekitar lumpur, artinya ia tertinggal dari kelompok migrasinya. Prioritas pertama karena stres dan dehidrasi dapat meningkat cepat pada satwa besar.',
    objective: 'Bersihkan pemburu di sekitar sumber air, buka kandang gajah, lalu biarkan jalur evakuasi terbuka.'
  },
  {
    type: 'zebra',
    name: 'Zebra Timur',
    url: '/assets/models/Zebra_Timur.glb',
    targetHeight: 2.2,
    pos: new THREE.Vector3(92, 0, -72),
    fact: educationFacts[1],
    order: 2,
    story: 'Zebra ini dipakai sebagai umpan untuk menarik kawanan lain ke jalur pemburu. Pola garisnya menjadi identitas visual penting agar tim dapat membedakan individu yang sudah dievakuasi.',
    objective: 'Netralisir penjaga kamp timur, dekati kandang dari sisi semak, lalu bebaskan zebra setelah area aman.'
  },
  {
    type: 'gazelle',
    name: 'Gazelle Muda',
    url: '/assets/models/Gazelle_Muda.glb',
    targetHeight: 1.7,
    pos: new THREE.Vector3(118, 0, 78),
    fact: educationFacts[0],
    order: 3,
    story: 'Gazelle muda terpisah dari induknya saat lari dari tembakan. Karena ukuran tubuhnya kecil, ia mudah panik dan perlu dibebaskan dengan pendekatan cepat tetapi tidak kasar.',
    objective: 'Lawan pemburu di jalur selatan, hindari mengejutkan satwa, lalu lakukan rescue dari depan kandang.'
  },
  {
    type: 'zebra',
    name: 'Zebra Barat',
    url: '/assets/models/Zebra_Barat.glb',
    targetHeight: 2.2,
    pos: new THREE.Vector3(-130, 0, 104),
    fact: educationFacts[2],
    order: 4,
    story: 'Zebra barat ditemukan di dekat bekas rute patroli ilegal. Kandangnya menjadi bukti bahwa pemburu memindahkan operasi ke sisi barat savana.',
    objective: 'Ikuti panah ke kamp barat, amankan perimeter, lalu bebaskan zebra untuk memutus pola jebakan pemburu.'
  },
  {
    type: 'gazelle',
    name: 'Gazelle Utara',
    url: '/assets/models/Gazelle_Utara.glb',
    targetHeight: 1.75,
    pos: new THREE.Vector3(22, 0, -142),
    fact: educationFacts[4],
    order: 5,
    story: 'Gazelle terakhir berada paling jauh di utara dan dijaga setelah pemburu sadar operasi rescue sedang berjalan. Ini tahap akhir sebelum seluruh area dinyatakan aman.',
    objective: 'Gunakan sniper dart dari jarak aman, bersihkan penjaga terakhir, buka kandang, lalu kembali ke helipad.'
  },
];

initUI();
initRenderer();
initLights();
createWorld();
updateSettingsUI();
animate();

function loadSettings() {
  const defaults = { sensitivity: 0.9, fov: 75, volume: 0.25, graphics: 'high', dynamicMusic: 'on' };
  try {
    return { ...defaults, ...JSON.parse(localStorage.getItem('savannaOpsSettings') || '{}') };
  } catch {
    return defaults;
  }
}

function saveSettings() {
  localStorage.setItem('savannaOpsSettings', JSON.stringify(settings));
}

function initUI() {
  $('startBtn').addEventListener('click', () => startGame(true));
  $('settingsBtn').addEventListener('click', () => showModal(settingsModal));
  $('creditsBtn').addEventListener('click', () => showModal(creditsModal));
  $('howBtn').addEventListener('click', () => showModal(howModal));
  $('guideStartBtn').addEventListener('click', continueFromGuide);
  $('guideCloseBtn').addEventListener('click', continueFromGuide);
  $('resumeBtn').addEventListener('click', resumeGame);
  $('restartBtn').addEventListener('click', () => startGame(true));
  $('quitBtn').addEventListener('click', quitToMenu);
  $('playAgainBtn').addEventListener('click', () => startGame(true));
  $('endMenuBtn').addEventListener('click', quitToMenu);

  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => hideModal($(button.dataset.close)));
  });

  $('applySettings').addEventListener('click', () => {
    settings.sensitivity = Number($('sensitivityRange').value);
    settings.fov = Number($('fovRange').value);
    settings.volume = Number($('volumeRange').value);
    settings.graphics = $('graphicsSelect').value;
    settings.dynamicMusic = $('dynamicMusicSelect').value;
    saveSettings();
    applySettings();
    updateSettingsUI();
    hideModal(settingsModal);
    toast('Pengaturan disimpan', 'Kualitas grafik berubah penuh setelah restart misi.');
  });

  ['sensitivityRange', 'fovRange', 'volumeRange'].forEach((id) => {
    $(id).addEventListener('input', updateSettingsPreview);
  });

  window.addEventListener('resize', initRenderer);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('keyup', onKeyUp);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mousedown', onMouseDown);
  document.addEventListener('mouseup', onMouseUp);
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('pointerlockchange', onPointerLockChange);
}

function initRenderer() {
  const ratioByQuality = { low: 1, medium: Math.min(window.devicePixelRatio, 1.5), high: Math.min(window.devicePixelRatio, 2) };
  renderer.setPixelRatio(ratioByQuality[settings.graphics] || 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

function initLights() {
  const hemi = new THREE.HemisphereLight(0xdcecff, 0x6b4c2a, 1.7);
  scene.add(hemi);

  const sun = new THREE.DirectionalLight(0xffe1a6, 2.65);
  sun.position.set(-84, 130, 42);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -150;
  sun.shadow.camera.right = 150;
  sun.shadow.camera.top = 150;
  sun.shadow.camera.bottom = -150;
  sun.shadow.camera.near = 10;
  sun.shadow.camera.far = 260;
  scene.add(sun);

  const fill = new THREE.DirectionalLight(0x8fc6ff, 0.45);
  fill.position.set(80, 60, -100);
  scene.add(fill);
}

function createMaterials() {
  return {
    ground: new THREE.MeshStandardMaterial({ color: 0xae9b55, roughness: 1, metalness: 0 }),
    dryGround: new THREE.MeshStandardMaterial({ color: 0x8e7b3d, roughness: 1 }),
    grass: new THREE.MeshStandardMaterial({ color: 0x7a8f3d, roughness: 0.95 }),
    darkGrass: new THREE.MeshStandardMaterial({ color: 0x4f6c32, roughness: 0.95 }),
    bark: new THREE.MeshStandardMaterial({ color: 0x654427, roughness: 0.9 }),
    leaves: new THREE.MeshStandardMaterial({ color: 0x5d7a36, roughness: 0.9 }),
    rock: new THREE.MeshStandardMaterial({ color: 0x6c6654, roughness: 1 }),
    metal: new THREE.MeshStandardMaterial({ color: 0x383b36, roughness: 0.55, metalness: 0.35 }),
    blackMetal: new THREE.MeshStandardMaterial({ color: 0x111311, roughness: 0.28, metalness: 0.72 }),
    rubber: new THREE.MeshStandardMaterial({ color: 0x080908, roughness: 0.7, metalness: 0.15 }),
    glass: new THREE.MeshStandardMaterial({ color: 0x4d7f91, roughness: 0.12, metalness: 0.04, transparent: true, opacity: 0.72 }),
    cage: new THREE.MeshStandardMaterial({ color: 0x343733, roughness: 0.45, metalness: 0.55 }),
    cageLock: new THREE.MeshStandardMaterial({ color: 0xc23d32, roughness: 0.45, metalness: 0.35 }),
    cloth: new THREE.MeshStandardMaterial({ color: 0x38452f, roughness: 0.9 }),
    poacherCloth: new THREE.MeshStandardMaterial({ color: 0x2d3327, roughness: 0.92 }),
    tacticalVest: new THREE.MeshStandardMaterial({ color: 0x151815, roughness: 0.72, metalness: 0.08 }),
    tacticalPouch: new THREE.MeshStandardMaterial({ color: 0x3b3a2d, roughness: 0.88 }),
    tacticalMask: new THREE.MeshStandardMaterial({ color: 0x050607, roughness: 0.76 }),
    tacticalBoot: new THREE.MeshStandardMaterial({ color: 0x090a08, roughness: 0.82, metalness: 0.05 }),
    camoPatch: new THREE.MeshStandardMaterial({ color: 0x5d6047, roughness: 0.92 }),
    skin: new THREE.MeshStandardMaterial({ color: 0x8d6244, roughness: 0.8 }),
    tranquilized: new THREE.MeshStandardMaterial({ color: 0x2f5961, roughness: 0.9 }),
    dart: new THREE.MeshStandardMaterial({ color: 0x83d6e5, emissive: 0x1b5f6c, emissiveIntensity: 0.6 }),
    marker: new THREE.MeshStandardMaterial({ color: 0xe2bc57, emissive: 0x8f5a11, emissiveIntensity: 1.2 }),
    animal: new THREE.MeshStandardMaterial({ color: 0x9c7f5a, roughness: 0.85 }),
    animalDark: new THREE.MeshStandardMaterial({ color: 0x2b2720, roughness: 0.85 }),
    white: new THREE.MeshStandardMaterial({ color: 0xded8c6, roughness: 0.85 }),
    red: new THREE.MeshStandardMaterial({ color: 0x9f3835, roughness: 0.75 }),
    water: new THREE.MeshStandardMaterial({ color: 0x4c91a5, roughness: 0.25, metalness: 0.05, transparent: true, opacity: 0.82 }),
  };
}

function createWorld() {
  clearWorld();
  createTerrain();
  createRoadsAndBase();
  createVegetation();
  createRocksAndProps();
  createAnimals();
  createEnemies();
  createPlayerVisuals();
  createSkyDetails();
  player.position.set(0, 1.75, 16);
  player.yaw = Math.PI;
  player.pitch = 0;
  updateCamera();
}

function clearWorld() {
  world.root.clear();
  if (world.weapon) {
    camera.remove(world.weapon);
    world.weapon = null;
  }
  world.playerAvatar = null;
  world.obstacles.length = 0;
  world.enemies.length = 0;
  world.animals.length = 0;
  world.darts.length = 0;
  world.particles.length = 0;
  world.interactables.length = 0;
  world.base = null;
  world.extraction = null;
}

function createTerrain() {
  const geometry = new THREE.PlaneGeometry(560, 560, 96, 96);
  geometry.rotateX(-Math.PI / 2);
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const z = pos.getZ(i);
    pos.setY(i, terrainHeight(x, z));
  }
  geometry.computeVertexNormals();
  const terrain = new THREE.Mesh(geometry, materials.ground);
  terrain.receiveShadow = true;
  world.root.add(terrain);

  const waterGeom = new THREE.PlaneGeometry(66, 28, 1, 1);
  waterGeom.rotateX(-Math.PI / 2);
  const water = new THREE.Mesh(waterGeom, materials.water);
  water.position.set(-88, 0.06, -72);
  water.receiveShadow = true;
  world.root.add(water);

  const mud = new THREE.Mesh(new THREE.CircleGeometry(39, 48), materials.dryGround);
  mud.rotation.x = -Math.PI / 2;
  mud.position.set(-88, 0.07, -72);
  mud.scale.set(1.3, 0.58, 1);
  mud.receiveShadow = true;
  world.root.add(mud);
}

function terrainHeight(x, z) {
  return Math.sin(x * 0.026) * 0.58 + Math.cos(z * 0.021) * 0.42 + Math.sin((x + z) * 0.012) * 0.28;
}

function createRoadsAndBase() {
  const helipadGroup = new THREE.Group();
  helipadGroup.position.set(0, terrainHeight(0, 0) + 0.08, 0);
  const pad = new THREE.Mesh(new THREE.CylinderGeometry(11, 11, 0.18, 48), materials.metal);
  pad.receiveShadow = true;
  pad.castShadow = true;
  helipadGroup.add(pad);
  const h1 = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.2, 12), materials.white);
  const h2 = new THREE.Mesh(new THREE.BoxGeometry(7, 0.22, 1.3), materials.white);
  h1.position.y = 0.14; h2.position.y = 0.15;
  helipadGroup.add(h1, h2);
  world.root.add(helipadGroup);
  world.base = helipadGroup;
  world.interactables.push({ type: 'base', group: helipadGroup, radius: 13 });

  loadGLB('/assets/models/helicopter.glb', (model) => {
    model.position.set(-16, terrainHeight(-16, 9) + 0.5, 9);
    model.scale.setScalar(2.2);
    model.rotation.y = -0.4;
    model.traverse(enableShadow);
    world.root.add(model);
  }, () => {
    const heli = createProceduralHelicopter();
    heli.position.set(-16, terrainHeight(-16, 9) + 1.1, 9);
    heli.rotation.y = -0.4;
    world.root.add(heli);
  });

  const baseTent = createTent(0x4b5138);
  baseTent.position.set(20, terrainHeight(20, 12) + 0.05, 12);
  baseTent.rotation.y = -0.3;
  world.root.add(baseTent);
  world.obstacles.push({ position: baseTent.position.clone(), radius: 6 });

  for (let i = 0; i < 7; i++) {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.5, 2), new THREE.MeshStandardMaterial({ color: 0x735031, roughness: 0.8 }));
    crate.position.set(11 + i * 2.4, terrainHeight(11 + i * 2.4, -8) + 0.78, -8 + rand(-2, 2));
    crate.rotation.y = rand(-0.6, 0.6);
    crate.castShadow = true;
    crate.receiveShadow = true;
    world.root.add(crate);
    world.obstacles.push({ position: crate.position.clone(), radius: 1.7 });
  }

  createDirtPath(new THREE.Vector3(0, 0.12, 0), new THREE.Vector3(105, 0.12, -60), 6);
  createDirtPath(new THREE.Vector3(0, 0.12, 0), new THREE.Vector3(-90, 0.12, -75), 5);
  createDirtPath(new THREE.Vector3(0, 0.12, 0), new THREE.Vector3(80, 0.12, 88), 5);
}

function createDirtPath(a, b, width) {
  const direction = new THREE.Vector3().subVectors(b, a);
  const length = direction.length();
  const geometry = new THREE.PlaneGeometry(width, length, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: 0x74603a, roughness: 1, transparent: true, opacity: 0.58 });
  const road = new THREE.Mesh(geometry, material);
  road.rotation.x = -Math.PI / 2;
  road.rotation.z = Math.atan2(direction.x, direction.z);
  road.position.copy(a).add(b).multiplyScalar(0.5);
  road.position.y = terrainHeight(road.position.x, road.position.z) + 0.11;
  road.receiveShadow = true;
  world.root.add(road);
}

function createVegetation() {
  const treeCount = qualityCount(46, 76, 112);
  for (let i = 0; i < treeCount; i++) {
    const pos = randomWorldPosition(35, 245);
    if (pos.length() < 26) continue;
    const tree = Math.random() > 0.18 ? createAcaciaTree() : createBaobabTree();
    tree.position.set(pos.x, terrainHeight(pos.x, pos.z), pos.z);
    tree.scale.setScalar(rand(0.75, 1.65));
    tree.rotation.y = rand(0, Math.PI * 2);
    world.root.add(tree);
    world.obstacles.push({ position: tree.position.clone(), radius: tree.userData.radius * tree.scale.x });
  }

  const grassCount = qualityCount(600, 1300, 2400);
  const grassGeom = new THREE.ConeGeometry(0.08, 1.1, 4);
  const grass = new THREE.InstancedMesh(grassGeom, materials.grass, grassCount);
  grass.castShadow = false;
  grass.receiveShadow = true;
  const matrix = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const s = new THREE.Vector3();
  const p = new THREE.Vector3();
  for (let i = 0; i < grassCount; i++) {
    const x = rand(-250, 250);
    const z = rand(-250, 250);
    p.set(x, terrainHeight(x, z) + 0.45, z);
    q.setFromEuler(new THREE.Euler(rand(-0.15, 0.15), rand(0, Math.PI * 2), rand(-0.15, 0.15)));
    const scale = rand(0.5, 1.55);
    s.set(scale, scale, scale);
    matrix.compose(p, q, s);
    grass.setMatrixAt(i, matrix);
  }
  world.root.add(grass);
  world.grass = grass;
}

function createRocksAndProps() {
  for (let i = 0; i < 78; i++) {
    const pos = randomWorldPosition(12, 250);
    const rock = new THREE.Mesh(new THREE.DodecahedronGeometry(rand(0.8, 2.8), 0), materials.rock);
    rock.position.set(pos.x, terrainHeight(pos.x, pos.z) + rand(0.3, 0.7), pos.z);
    rock.scale.set(rand(1, 2.2), rand(0.55, 1.15), rand(0.8, 1.7));
    rock.rotation.set(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI));
    rock.castShadow = true;
    rock.receiveShadow = true;
    world.root.add(rock);
    world.obstacles.push({ position: rock.position.clone(), radius: Math.max(rock.scale.x, rock.scale.z) * 1.2 });
  }

  const camps = [new THREE.Vector3(102, 0, -58), new THREE.Vector3(-112, 0, 92), new THREE.Vector3(128, 0, 118)];
  camps.forEach((pos, idx) => {
    const camp = createPoacherCamp(idx);
    camp.position.set(pos.x, terrainHeight(pos.x, pos.z), pos.z);
    world.root.add(camp);
    world.obstacles.push({ position: camp.position.clone(), radius: 8 });
  });
}

function createPoacherCamp(index) {
  const camp = new THREE.Group();
  const tent = createTent(0x6b432b);
  tent.position.set(0, 0, 0);
  tent.rotation.y = rand(0, Math.PI);
  camp.add(tent);

  const fire = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(2, 0.13, 8, 24), materials.rock);
  ring.rotation.x = Math.PI / 2;
  ring.position.set(6, 0.25, 3);
  const ember = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.2, 8), new THREE.MeshStandardMaterial({ color: 0xdd7b32, emissive: 0xb13a0a, emissiveIntensity: 1.5 }));
  ember.position.set(6, 0.75, 3);
  fire.add(ring, ember);
  camp.add(fire);

  for (let i = 0; i < 4; i++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(2, 1.2, 1.4), new THREE.MeshStandardMaterial({ color: 0x513620, roughness: 0.85 }));
    box.position.set(rand(-7, 8), 0.65, rand(-7, 8));
    box.rotation.y = rand(0, Math.PI);
    box.castShadow = true;
    box.receiveShadow = true;
    camp.add(box);
  }

  camp.traverse(enableShadow);
  return camp;
}

function createAnimals() {
  animalMissionBriefs.forEach((data) => {
    const y = terrainHeight(data.pos.x, data.pos.z);
    const addFallbackAnimal = () => {
      const fallback = data.type === 'elephant' ? createElephant() : data.type === 'zebra' ? createZebra() : createGazelle();
      fallback.position.set(data.pos.x, y + (data.groundOffset ?? 0), data.pos.z);
      fallback.rotation.y = rand(0, Math.PI * 2);
      addAnimalEntity(data, fallback);
    };

    loadGLB(data.url, (loadedModel) => {
      const model = prepareAnimalGLB(loadedModel, data.targetHeight);
      if (!model) {
        addFallbackAnimal();
        return;
      }

      model.position.set(data.pos.x, y + (data.groundOffset ?? 0), data.pos.z);
      model.rotation.y = rand(0, Math.PI * 2);
      addAnimalEntity(data, model);
    }, addFallbackAnimal);
  });
}

function prepareAnimalGLB(loadedModel, targetHeight) {
  const wrapper = new THREE.Group();
  const content = new THREE.Group();
  content.add(loadedModel);
  wrapper.add(content);

  loadedModel.traverse(enableShadow);
  loadedModel.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(loadedModel);
  const size = bounds.getSize(new THREE.Vector3());
  if (!Number.isFinite(size.y) || size.y <= 0.000001) return null;

  const scale = targetHeight / size.y;
  content.scale.setScalar(scale);
  content.updateMatrixWorld(true);

  const scaledBounds = new THREE.Box3().setFromObject(content);
  const center = scaledBounds.getCenter(new THREE.Vector3());
  content.position.set(-center.x, -scaledBounds.min.y, -center.z);
  content.updateMatrixWorld(true);

  return wrapper;
}

function addAnimalEntity(data, model) {
  const marker = createMarker(0xe2bc57);
  marker.position.set(0, data.type === 'elephant' ? 5.8 : 3.3, 0);
  model.add(marker);

  const cage = createAnimalCage(data.type);
  cage.position.set(data.pos.x, terrainHeight(data.pos.x, data.pos.z), data.pos.z);
  cage.rotation.y = rand(-0.25, 0.25);
  world.root.add(cage);
  world.root.add(model);

  const entity = {
    type: data.type,
    name: data.name,
    order: data.order,
    group: model,
    cage,
    marker,
    markerBaseY: marker.position.y,
    radius: data.type === 'elephant' ? 7 : 5,
    rescued: false,
    fact: data.fact,
    story: data.story,
    objective: data.objective,
    bob: rand(0, Math.PI * 2),
  };
  world.animals.push(entity);
  world.interactables.push(entity);
}

function createAnimalCage(type) {
  const group = new THREE.Group();
  const big = type === 'elephant';
  const width = big ? 9.5 : 6.2;
  const depth = big ? 7.2 : 4.8;
  const height = big ? 4.2 : 3.0;
  const bar = 0.11;

  const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, depth), new THREE.MeshStandardMaterial({ color: 0x5c4a31, roughness: 0.95 }));
  floor.position.y = 0.05;
  floor.receiveShadow = true;
  group.add(floor);

  const makeBar = (x, y, z, sx, sy, sz) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(sx, sy, sz), materials.cage);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);
    return mesh;
  };

  const posts = [
    [-width / 2, depth / 2], [width / 2, depth / 2], [-width / 2, -depth / 2], [width / 2, -depth / 2],
  ];
  posts.forEach(([x, z]) => makeBar(x, height / 2, z, 0.22, height, 0.22));
  makeBar(0, height, depth / 2, width + 0.25, bar, bar);
  makeBar(0, height, -depth / 2, width + 0.25, bar, bar);
  makeBar(-width / 2, height, 0, bar, bar, depth + 0.25);
  makeBar(width / 2, height, 0, bar, bar, depth + 0.25);

  const sideCount = big ? 8 : 6;
  for (let i = 1; i < sideCount; i++) {
    const t = i / sideCount;
    makeBar(-width / 2 + t * width, height / 2, depth / 2, bar, height * 0.92, bar);
    makeBar(-width / 2 + t * width, height / 2, -depth / 2, bar, height * 0.92, bar);
  }
  for (let i = 1; i < Math.max(4, sideCount - 1); i++) {
    const t = i / Math.max(4, sideCount - 1);
    makeBar(-width / 2, height / 2, -depth / 2 + t * depth, bar, height * 0.92, bar);
    makeBar(width / 2, height / 2, -depth / 2 + t * depth, bar, height * 0.92, bar);
  }

  const gate = new THREE.Group();
  const gx = 0;
  const gz = depth / 2 + 0.08;
  gate.add(makeBar(-width * 0.18, height / 2, gz, bar, height * 0.86, bar));
  gate.add(makeBar(width * 0.18, height / 2, gz, bar, height * 0.86, bar));
  gate.add(makeBar(0, height * 0.82, gz, width * 0.36, bar, bar));
  gate.add(makeBar(0, height * 0.25, gz, width * 0.36, bar, bar));
  gate.position.x = gx;
  group.add(gate);
  group.userData.gate = gate;

  const lock = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.34, 0.18), materials.cageLock);
  lock.position.set(width * 0.22, height * 0.56, depth / 2 + 0.18);
  lock.castShadow = true;
  group.userData.lock = lock;
  group.add(lock);

  const sign = new THREE.Mesh(new THREE.BoxGeometry(big ? 2.2 : 1.7, 0.45, 0.08), new THREE.MeshStandardMaterial({ color: 0x1f281e, roughness: 0.7 }));
  sign.position.set(0, height + 0.42, depth / 2 + 0.08);
  group.add(sign);
  group.traverse(enableShadow);
  return group;
}

function removeAnimalCage(animal) {
  if (!animal?.cage) return;
  const cage = animal.cage;
  const lock = cage.userData.lock;
  if (lock) lock.visible = false;
  createMarkerBurst(cage.position.clone().add(new THREE.Vector3(0, 2.4, 0)), 0xe2bc57);
  world.root.remove(cage);
  animal.cage = null;
}

function createPlayerVisuals() {
  world.playerAvatar = createRangerOperator();
  world.playerAvatar.position.copy(player.position);
  world.root.add(world.playerAvatar);

  loadGLB('/assets/models/tranquilizer_rifle.glb', (model) => {
    model.scale.setScalar(0.7);
    model.position.set(0.44, -0.45, -0.92);
    model.rotation.set(-0.02, Math.PI, 0);
    model.traverse(enableShadow);
    world.weapon = model;
    camera.add(world.weapon);
  }, () => {
    world.weapon = createRealisticTranqRifle();
    camera.add(world.weapon);
  });
}

function createEnemies() {
  const starts = [
    new THREE.Vector3(98, 0, -54), new THREE.Vector3(112, 0, -70), new THREE.Vector3(-108, 0, 95),
    new THREE.Vector3(-124, 0, 82), new THREE.Vector3(132, 0, 112), new THREE.Vector3(147, 0, 126),
    new THREE.Vector3(40, 0, -130), new THREE.Vector3(-62, 0, -125),
  ];
  starts.forEach((pos, idx) => {
    const y = terrainHeight(pos.x, pos.z);
    loadGLB('/assets/models/poacher.glb', (model) => {
      model.position.set(pos.x, y, pos.z);
      model.scale.setScalar(1.1);
      model.traverse(enableShadow);
      addEnemyEntity(model, idx);
    }, () => {
      const model = createPoacher();
      model.position.set(pos.x, y, pos.z);
      addEnemyEntity(model, idx);
    });
  });
}

function addEnemyEntity(group, idx) {
  const center = group.position.clone();
  const patrol = [
    center.clone(),
    center.clone().add(new THREE.Vector3(rand(-18, 22), 0, rand(-18, 22))),
    center.clone().add(new THREE.Vector3(rand(-24, 20), 0, rand(-22, 18))),
  ];
  const entity = {
    group,
    idx,
    health: 1,
    stunned: false,
    radius: 2.2,
    speed: rand(3.2, 4.6),
    patrol,
    patrolIndex: 0,
    shotCooldown: rand(0.4, 2.2),
    hitMeshes: [],
  };
  group.traverse((obj) => {
    enableShadow(obj);
    if (obj.isMesh) {
      obj.userData.enemy = entity;
      entity.hitMeshes.push(obj);
    }
  });
  world.enemies.push(entity);
  world.root.add(group);
}

function createSkyDetails() {
  const moon = new THREE.Mesh(new THREE.SphereGeometry(8, 24, 16), new THREE.MeshBasicMaterial({ color: 0xfff2cf }));
  moon.position.set(150, 155, -200);
  world.root.add(moon);

  for (let i = 0; i < 7; i++) {
    const cloud = new THREE.Group();
    for (let j = 0; j < 5; j++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(rand(5, 12), 12, 8), new THREE.MeshBasicMaterial({ color: 0xe2dcc3, transparent: true, opacity: 0.52 }));
      puff.scale.y = 0.32;
      puff.position.set(j * rand(6, 9), rand(-1, 1), rand(-3, 3));
      cloud.add(puff);
    }
    cloud.position.set(rand(-260, 260), rand(78, 122), rand(-260, 260));
    world.root.add(cloud);
  }
}

function startGame(resetWorld = false) {
  game.state = 'briefing';
  game.started = true;
  game.elapsed = 0;
  game.nearTarget = null;
  game.missionStage = 0;
  game.cameraMode = 'fps';
  game.successTimer = 0;
  game.combatTimer = 0;
  world.musicMode = 'explore';
  world.musicTimer = 0;
  world.musicStep = 0;
  player.health = 100;
  player.stamina = 100;
  player.ammo = 12;
  player.reserve = 48;
  player.reloadTime = 0;
  player.fireCooldown = 0;
  player.rescued = 0;
  player.neutralized = 0;
  player.missionWon = false;
  input.keys.clear();
  input.aiming = false;
  hideAllOverlays();
  $('successBanner').classList.remove('show');
  hud.classList.add('active');
  if (resetWorld) createWorld();
  updateMissionText();
  startAudio();
  showMissionGuide('briefing');
}

function quitToMenu() {
  game.state = 'menu';
  input.aiming = false;
  document.body.classList.remove('aiming');
  document.exitPointerLock?.();
  hud.classList.remove('active');
  hideAllOverlays();
  mainMenu.classList.add('active');
}

function pauseGame() {
  if (game.state !== 'playing') return;
  game.state = 'paused';
  pauseModal.classList.add('active');
}

function resumeGame() {
  if (!game.started) return;
  hideModal(pauseModal);
  game.state = 'playing';
  requestPointerLock();
}

function endGame(win) {
  game.state = 'ended';
  document.exitPointerLock?.();
  endModal.classList.add('active');
  $('endTitle').textContent = win ? 'MISSION COMPLETE' : 'MISSION FAILED';
  $('endText').textContent = win
    ? `Operasi berhasil. ${player.rescued} satwa dievakuasi dan ${player.neutralized} pemburu liar dinetralkan tanpa kekerasan fatal.`
    : 'Health operator habis. Ulangi misi dengan pendekatan lebih hati-hati dan gunakan cover.';
  if (win) playRewardMusic();
}

function showModal(modal) { modal.classList.add('active'); }
function hideModal(modal) { modal.classList.remove('active'); }
function hideAllOverlays() {
  [mainMenu, settingsModal, creditsModal, howModal, fieldGuideModal, pauseModal, endModal].forEach((m) => m.classList.remove('active'));
}

function renderMissionGuide() {
  const list = $('guideAnimalList');
  if (!list) return;
  const rescuedByName = new Map(world.animals.map((animal) => [animal.name, animal.rescued]));
  list.innerHTML = animalMissionBriefs
    .sort((a, b) => a.order - b.order)
    .map((animal) => {
      const rescued = rescuedByName.get(animal.name);
      const status = rescued ? 'SUDAH AMAN' : animal.order === 1 ? 'PRIORITAS AWAL' : `PRIORITAS ${animal.order}`;
      return `<div class="guide-animal ${rescued ? 'done' : ''}">
        <div><b>${animal.order}. ${escapeHtml(animal.name)}</b><small>${escapeHtml(status)}</small></div>
        <p>${escapeHtml(animal.story)}</p>
        <span>${escapeHtml(animal.objective)}</span>
      </div>`;
    })
    .join('');
}

function showMissionGuide(returnState = 'playing') {
  game.guideReturnState = returnState;
  renderMissionGuide();
  $('briefingStory').textContent = animalMissionBriefs[0].story;
  $('guideStartBtn').textContent = returnState === 'briefing' ? 'MULAI OPERASI' : 'LANJUTKAN OPERASI';
  showModal(fieldGuideModal);
}

function continueFromGuide() {
  hideModal(fieldGuideModal);
  if (game.guideReturnState === 'briefing') {
    game.state = 'playing';
    requestPointerLock();
    toast('Operasi dimulai', 'Buku misi dibaca. Ikuti panah kuning dan bebaskan hewan sesuai urutan.');
  } else if (game.started) {
    game.state = 'playing';
    requestPointerLock();
  }
}

function requestPointerLock() {
  canvas.requestPointerLock?.();
}

function onPointerLockChange() {
  game.pointerLocked = document.pointerLockElement === canvas;
  if (!game.pointerLocked) {
    input.aiming = false;
    document.body.classList.remove('aiming');
  }
  if (!game.pointerLocked && game.state === 'playing') pauseGame();
}

function onKeyDown(e) {
  input.keys.add(e.code);
  if (game.state === 'playing') {
    if (['KeyW', 'KeyA', 'KeyS', 'KeyD', 'Space', 'ShiftLeft', 'ShiftRight'].includes(e.code)) e.preventDefault();
    if (e.code === 'KeyR') reloadWeapon();
    if (e.code === 'KeyE') interact();
    if (e.code === 'KeyB') { game.state = 'guide'; document.exitPointerLock?.(); showMissionGuide('playing'); }
    if (e.code === 'KeyV') cycleCameraMode();
    if (e.code === 'Digit1') setCameraMode('fps');
    if (e.code === 'Digit2') setCameraMode('third');
    if (e.code === 'Digit3') setCameraMode('top');
    if (e.code === 'Escape') pauseGame();
  }
}

function onKeyUp(e) {
  input.keys.delete(e.code);
}

function onMouseMove(e) {
  if (game.state !== 'playing' || !game.pointerLocked) return;
  const sens = 0.0018 * settings.sensitivity;
  player.yaw -= e.movementX * sens;
  if (game.cameraMode !== 'top') {
    player.pitch -= e.movementY * sens;
    player.pitch = THREE.MathUtils.clamp(player.pitch, -1.22, 1.05);
  }
}

function onMouseDown(e) {
  if (game.state !== 'playing') return;
  if (!game.pointerLocked) {
    requestPointerLock();
    return;
  }
  input.mouseDown = true;
  if (e.button === 2) {
    input.aiming = true;
    if (game.cameraMode !== 'fps') game.cameraMode = 'fps';
  }
  if (e.button === 0) fireDart();
}

function onMouseUp(e) {
  input.mouseDown = false;
  if (e.button === 2) input.aiming = false;
}

function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), 0.05);
  if (game.state === 'playing') updateGame(dt);
  renderer.render(scene, camera);
  updateFPS(dt);
}

function updateGame(dt) {
  game.elapsed += dt;
  player.fireCooldown = Math.max(0, player.fireCooldown - dt);
  player.damageCooldown = Math.max(0, player.damageCooldown - dt);
  updatePlayer(dt);
  updateEnemies(dt);
  updateDarts(dt);
  updateParticles(dt);
  updateAnimals(dt);
  updateInteractions();
  updateHUD();
  updateMinimap();
  updateMissionText();
  updateCombatAudioState(dt);
  updateAmbientAudio(dt);
  updateSuccessBanner(dt);
  if (player.health <= 0) endGame(false);
}

function updatePlayer(dt) {
  const { forward, right } = getCameraMovementBasis();
  const move = new THREE.Vector3();
  if (input.keys.has('KeyW')) move.add(forward);
  if (input.keys.has('KeyS')) move.sub(forward);
  if (input.keys.has('KeyD')) move.add(right);
  if (input.keys.has('KeyA')) move.sub(right);
  if (move.lengthSq() > 0) move.normalize();

  const wantsSprint = input.keys.has('ShiftLeft') || input.keys.has('ShiftRight');
  const sprinting = wantsSprint && player.stamina > 4 && move.lengthSq() > 0;
  const speed = sprinting ? 13.2 : 7.2;
  const next = player.position.clone().addScaledVector(move, speed * dt);
  next.x = THREE.MathUtils.clamp(next.x, -258, 258);
  next.z = THREE.MathUtils.clamp(next.z, -258, 258);

  const blocked = world.obstacles.some((ob) => {
    const dx = next.x - ob.position.x;
    const dz = next.z - ob.position.z;
    return dx * dx + dz * dz < (ob.radius + 1.1) ** 2;
  });
  if (!blocked) player.position.copy(next);

  const groundY = terrainHeight(player.position.x, player.position.z);
  player.position.y = THREE.MathUtils.lerp(player.position.y, groundY + 1.75, 0.25);

  if (sprinting) player.stamina = Math.max(0, player.stamina - 24 * dt);
  else player.stamina = Math.min(100, player.stamina + 16 * dt);

  if (player.reloadTime > 0) {
    player.reloadTime -= dt;
    if (player.reloadTime <= 0) finishReload();
  }

  updateCamera();
}

function updateCamera() {
  const forward = getForwardFromYaw(player.yaw);
  const lookTarget = player.position.clone().add(new THREE.Vector3(0, 0.95, 0)).addScaledVector(forward, 8);
  const cameraShake = player.recoil * (input.aiming ? 0.018 : 0.035);
  const scoped = game.cameraMode === 'fps' && input.aiming;
  const targetFov = scoped ? Math.max(30, settings.fov * 0.45) : settings.fov;
  if (Math.abs(camera.fov - targetFov) > 0.05) {
    camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, scoped ? 0.26 : 0.18);
    camera.updateProjectionMatrix();
  }
  document.body.classList.toggle('aiming', scoped);

  if (game.cameraMode === 'fps') {
    camera.position.copy(player.position);
    camera.rotation.order = 'YXZ';
    camera.rotation.y = player.yaw;
    camera.rotation.x = player.pitch - cameraShake;
    camera.rotation.z = 0;
  } else if (game.cameraMode === 'third') {
    const desired = player.position.clone()
      .add(new THREE.Vector3(0, 4.5, 0))
      .addScaledVector(forward, -9.5);
    camera.position.lerp(desired, 0.22);
    camera.lookAt(lookTarget);
  } else {
    const desired = player.position.clone()
      .add(new THREE.Vector3(0, 56, 0))
      .addScaledVector(forward, -12);
    camera.position.lerp(desired, 0.2);
    camera.lookAt(player.position.clone().addScaledVector(forward, 8));
  }

  if (world.weapon) {
    // Saat scope aktif, mesh sniper disembunyikan agar lensa/bodi senjata tidak menutup titik bidik.
    // Reticle CSS tetap berada tepat di pusat kamera/raycast.
    world.weapon.visible = game.cameraMode === 'fps' && !scoped;
    const recoilZ = player.recoil * 0.16;
    world.weapon.position.x = THREE.MathUtils.lerp(world.weapon.position.x, 0.44, 0.22);
    world.weapon.position.y = THREE.MathUtils.lerp(world.weapon.position.y, -0.45, 0.22);
    world.weapon.position.z = THREE.MathUtils.lerp(world.weapon.position.z, -0.9 + recoilZ, 0.3);
    world.weapon.rotation.x = -0.06 - player.recoil * 0.08;
  }
  if (world.playerAvatar) {
    world.playerAvatar.visible = game.cameraMode !== 'fps';
    world.playerAvatar.position.copy(player.position);
    world.playerAvatar.position.y = terrainHeight(player.position.x, player.position.z);
    world.playerAvatar.rotation.y = player.yaw;
  }
  player.recoil = Math.max(0, player.recoil * 0.82 - 0.002);
  $('cameraBadge').textContent = `CAM ${game.cameraMode.toUpperCase()}`;
}

function getForwardFromYaw(yaw) {
  return new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw)).normalize();
}

function getCameraMovementBasis() {
  const forward = getForwardFromYaw(player.yaw);
  const right = new THREE.Vector3(Math.cos(player.yaw), 0, -Math.sin(player.yaw)).normalize();
  return { forward, right };
}

function cycleCameraMode() {
  const idx = CAMERA_MODES.indexOf(game.cameraMode);
  setCameraMode(CAMERA_MODES[(idx + 1) % CAMERA_MODES.length]);
}

function setCameraMode(mode) {
  if (!CAMERA_MODES.includes(mode)) return;
  game.cameraMode = mode;
  if (mode === 'top') player.pitch = -0.65;
  if (mode !== 'fps') input.aiming = false;
  toast('Mode kamera diganti', mode === 'fps' ? 'FPS aktif.' : mode === 'third' ? 'Third person aktif.' : 'Kamera atas aktif.');
  updateCamera();
}

function updateEnemies(dt) {
  for (const enemy of world.enemies) {
    if (enemy.stunned) {
      enemy.group.rotation.z = THREE.MathUtils.lerp(enemy.group.rotation.z, -Math.PI / 2, 0.08);
      continue;
    }
    const pos = enemy.group.position;
    const playerFlat = new THREE.Vector3(player.position.x, pos.y, player.position.z);
    const dist = pos.distanceTo(playerFlat);
    let target = enemy.patrol[enemy.patrolIndex];
    const seesPlayer = dist < enemyAlertRadius;

    if (seesPlayer) {
      target = playerFlat;
      enemy.shotCooldown -= dt;
      if (dist > 8.5) {
        moveEnemyToward(enemy, target, dt, enemy.speed * (dist < 22 ? 0.92 : 1.08));
      }
      lookAtFlat(enemy.group, player.position);
      if (enemy.shotCooldown <= 0) {
        enemyAttack(enemy, dist);
        enemy.shotCooldown = rand(0.95, 1.9);
      }
    } else {
      moveEnemyToward(enemy, target, dt, enemy.speed * 0.72);
      lookAtFlat(enemy.group, target);
      if (pos.distanceTo(target) < 2.2) enemy.patrolIndex = (enemy.patrolIndex + 1) % enemy.patrol.length;
    }
    pos.y = terrainHeight(pos.x, pos.z);
  }
}

function moveEnemyToward(enemy, target, dt, speed) {
  const pos = enemy.group.position;
  const dir = new THREE.Vector3(target.x - pos.x, 0, target.z - pos.z);
  if (dir.lengthSq() < 0.01) return;
  dir.normalize();
  const next = pos.clone().addScaledVector(dir, speed * dt);
  next.y = terrainHeight(next.x, next.z);
  pos.copy(next);
}

function lookAtFlat(group, target) {
  const dx = target.x - group.position.x;
  const dz = target.z - group.position.z;
  group.rotation.y = Math.atan2(dx, dz);
}

function enemyAttack(enemy, dist) {
  if (dist > enemyAlertRadius || player.damageCooldown > 0) return;
  const damage = dist < 18 ? 12 : dist < 42 ? 8 : 5;
  player.health = Math.max(0, player.health - damage);
  player.damageCooldown = 0.22;
  createTracer(enemy.group.position.clone().add(new THREE.Vector3(0, 1.7, 0)), player.position.clone(), 0xff614f);
  playEnemyShot();
  game.combatTimer = Math.max(game.combatTimer, 4.5);
  toast('Terdeteksi pemburu liar', `Operator terkena serangan. Health -${damage}. Gunakan cover dan jarak aman.`);
}

function fireDart() {
  if (player.fireCooldown > 0 || player.reloadTime > 0) return;
  if (player.ammo <= 0) {
    playTone(80, 0.08, 'square', 0.05);
    reloadWeapon();
    return;
  }
  player.ammo--;
  player.fireCooldown = 0.22;
  player.recoil = 1;
  playGunShot();

  raycaster.setFromCamera(center, camera);
  raycaster.far = sniperMaxRange;
  const enemyMeshes = world.enemies.flatMap((enemy) => enemy.hitMeshes);
  const hits = raycaster.intersectObjects(enemyMeshes, true);
  const start = camera.position.clone();
  const end = start.clone().add(raycaster.ray.direction.clone().multiplyScalar(sniperMaxRange));
  let hitEnemy = null;

  if (hits.length) {
    const enemy = findEnemyFromObject(hits[0].object);
    if (enemy && !enemy.stunned) {
      hitEnemy = enemy;
      end.copy(hits[0].point);
      neutralizeEnemy(enemy);
    }
  }

  if (!hitEnemy) {
    const assisted = findLongRangeEnemyHit(raycaster.ray, input.aiming ? scopedAssistRadius : hipFireAssistRadius, sniperMaxRange);
    if (assisted) {
      hitEnemy = assisted.enemy;
      end.copy(assisted.point);
      neutralizeEnemy(hitEnemy);
    }
  }

  createTracer(start, end, hitEnemy ? 0x83d6e5 : 0xcfeaff);
}

function findEnemyFromObject(obj) {
  let node = obj;
  while (node) {
    if (node.userData.enemy) return node.userData.enemy;
    node = node.parent;
  }
  return null;
}

function findLongRangeEnemyHit(ray, radius, maxRange) {
  let best = null;
  let bestProjection = Infinity;
  for (const enemy of world.enemies) {
    if (enemy.stunned) continue;
    const samples = [
      enemy.group.position.clone().add(new THREE.Vector3(0, 0.95, 0)),
      enemy.group.position.clone().add(new THREE.Vector3(0, 1.45, 0)),
      enemy.group.position.clone().add(new THREE.Vector3(0, 1.9, 0)),
    ];
    for (const point of samples) {
      const toPoint = point.clone().sub(ray.origin);
      const projection = toPoint.dot(ray.direction);
      if (projection < 0 || projection > maxRange) continue;
      const closest = ray.origin.clone().addScaledVector(ray.direction, projection);
      const missDistance = closest.distanceTo(point);
      const distancePenalty = THREE.MathUtils.clamp(projection / maxRange, 0, 1) * 0.22;
      const allowed = Math.max(0.38, radius - distancePenalty);
      if (missDistance <= allowed && projection < bestProjection) {
        bestProjection = projection;
        best = { enemy, point: closest };
      }
    }
  }
  return best;
}

function neutralizeEnemy(enemy) {
  enemy.stunned = true;
  player.neutralized++;
  enemy.group.traverse((obj) => {
    if (obj.isMesh) obj.material = materials.tranquilized;
  });
  createMarkerBurst(enemy.group.position.clone().add(new THREE.Vector3(0, 2, 0)), 0x83d6e5);
  playTone(720, 0.12, 'sine', 0.2);
  game.combatTimer = Math.max(game.combatTimer, 2.5);
  toast('Target dinetralkan', 'Dart non-mematikan berhasil. Pemburu liar dapat diamankan tim ranger.');
}

function reloadWeapon() {
  if (player.reloadTime > 0 || player.ammo === player.maxAmmo || player.reserve <= 0) return;
  player.reloadTime = 1.45;
  playTone(220, 0.05, 'triangle', 0.08);
}

function finishReload() {
  const need = player.maxAmmo - player.ammo;
  const take = Math.min(need, player.reserve);
  player.ammo += take;
  player.reserve -= take;
  playTone(330, 0.07, 'triangle', 0.10);
}

function updateDarts(dt) {
  for (let i = world.darts.length - 1; i >= 0; i--) {
    const dart = world.darts[i];
    dart.life -= dt;
    dart.mesh.position.addScaledVector(dart.velocity, dt);
    if (dart.life <= 0) {
      world.root.remove(dart.mesh);
      world.darts.splice(i, 1);
    }
  }
}

function createTracer(start, end, color) {
  const geom = new THREE.BufferGeometry().setFromPoints([start, end]);
  const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.9 });
  const line = new THREE.Line(geom, mat);
  world.root.add(line);
  world.particles.push({ mesh: line, life: 0.08, maxLife: 0.08, type: 'fade' });
}

function updateParticles(dt) {
  for (let i = world.particles.length - 1; i >= 0; i--) {
    const p = world.particles[i];
    p.life -= dt;
    if (p.type === 'fade' && p.mesh.material) p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
    if (p.type === 'burst') {
      p.mesh.position.addScaledVector(p.velocity, dt);
      p.mesh.scale.multiplyScalar(1 + dt * 0.8);
      p.mesh.material.opacity = Math.max(0, p.life / p.maxLife);
    }
    if (p.life <= 0) {
      world.root.remove(p.mesh);
      world.particles.splice(i, 1);
    }
  }
}

function createMarkerBurst(position, color) {
  for (let i = 0; i < 12; i++) {
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 6), new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.9 }));
    mesh.position.copy(position);
    world.root.add(mesh);
    world.particles.push({
      mesh,
      velocity: new THREE.Vector3(rand(-2, 2), rand(0.7, 3), rand(-2, 2)),
      life: rand(0.45, 0.8),
      maxLife: 0.8,
      type: 'burst',
    });
  }
}

function updateAnimals(dt) {
  for (const animal of world.animals) {
    animal.bob += dt * 2.2;
    animal.marker.visible = !animal.rescued;
    animal.marker.position.y = animal.markerBaseY + Math.sin(animal.bob) * 0.08;
    animal.marker.rotation.y += dt * 1.4;
    if (animal.rescued) animal.group.scale.lerp(new THREE.Vector3(0.95, 0.95, 0.95), 0.03);
  }
}

function updateInteractions() {
  game.nearTarget = null;
  let best = Infinity;
  for (const item of world.interactables) {
    if (item.rescued) continue;
    const pos = item.group.position;
    const dist = horizontalDistance(player.position, pos);
    const radius = item.radius || 5;
    if (dist < radius && dist < best) {
      best = dist;
      game.nearTarget = item;
    }
  }

  const box = $('interactBox');
  if (game.nearTarget) {
    box.classList.add('show');
    if (game.nearTarget.type === 'base') {
      const ready = player.rescued >= 5 && player.neutralized >= 8;
      box.innerHTML = ready ? 'Tekan <kbd>E</kbd> untuk ekstraksi misi.' : 'Helipad: selesaikan misi rescue dan pengamanan area dulu.';
    } else {
      const currentAnimal = getCurrentAnimalObjective();
      const guards = getActivePoachersNear(game.nearTarget.group.position, rescueGuardRadius).length;
      if (currentAnimal && game.nearTarget !== currentAnimal) {
        box.innerHTML = `Urutan misi: rescue ${escapeHtml(currentAnimal.name)} dulu.`;
      } else if (guards > 0) {
        box.innerHTML = `Netralisir ${guards} pemburu di sekitar kandang sebelum rescue.`;
      } else {
        box.innerHTML = `Tekan <kbd>E</kbd> untuk membuka kandang dan rescue ${escapeHtml(game.nearTarget.name)}.`;
      }
    }
  } else {
    box.classList.remove('show');
  }
}

function interact() {
  const target = game.nearTarget;
  if (!target) return;
  if (target.type === 'base') {
    if (player.rescued >= 5 && player.neutralized >= 8) endGame(true);
    else toast('Misi belum lengkap', `Satwa: ${player.rescued}/5 · Pemburu liar: ${player.neutralized}/8.`);
    return;
  }

  const currentAnimal = getCurrentAnimalObjective();
  if (currentAnimal && target !== currentAnimal) {
    toast('Ikuti urutan rescue', `Prioritas saat ini: ${currentAnimal.name}. Ikuti tanda panah kuning di layar.`);
    return;
  }

  const guards = getActivePoachersNear(target.group.position, rescueGuardRadius);
  if (guards.length > 0) {
    toast('Area kandang belum aman', `Netralisir ${guards.length} pemburu liar dalam radius ${rescueGuardRadius} meter sebelum menyelamatkan ${target.name}.`);
    return;
  }

  if (!target.rescued) {
    target.rescued = true;
    player.rescued++;
    player.health = 100;
    target.marker.visible = false;
    removeAnimalCage(target);
    createMarkerBurst(target.group.position.clone().add(new THREE.Vector3(0, 2.2, 0)), 0xe2bc57);
    playRescueSound();
    playRewardMusic();
    showSuccessBanner(`Berhasil membebaskan ${target.name}`, `${target.story} Health operator pulih kembali ke 100%.`);
    toast(`${target.name} berhasil diselamatkan`, `${target.fact} Health kembali 100%.`);
  }
}

function getCurrentAnimalObjective() {
  return [...world.animals].sort((a, b) => a.order - b.order).find((animal) => !animal.rescued) || null;
}

function getCurrentObjective() {
  const animal = getCurrentAnimalObjective();
  if (animal) return { kind: 'animal', entity: animal, position: animal.group.position, label: animal.name };
  const activeEnemy = world.enemies.filter((enemy) => !enemy.stunned).sort((a, b) => horizontalDistance(player.position, a.group.position) - horizontalDistance(player.position, b.group.position))[0];
  if (activeEnemy) return { kind: 'enemy', entity: activeEnemy, position: activeEnemy.group.position, label: 'Pemburu liar terdekat' };
  return { kind: 'base', entity: world.base, position: world.base.position, label: 'Helipad ekstraksi' };
}

function getActivePoachersNear(position, radius) {
  return world.enemies.filter((enemy) => !enemy.stunned && horizontalDistance(enemy.group.position, position) <= radius);
}

function updateHUD() {
  $('healthText').textContent = `${Math.round(player.health)}%`;
  $('healthFill').style.width = `${player.health}%`;
  $('staminaText').textContent = `${Math.round(player.stamina)}%`;
  $('staminaFill').style.width = `${player.stamina}%`;
  $('ammoText').textContent = `${player.ammo}/${player.reserve}`;
  if (player.reloadTime > 0) {
    $('tranqText').textContent = 'Reloading';
    $('tranqFill').style.width = `${(1 - player.reloadTime / 1.45) * 100}%`;
  } else {
    $('tranqText').textContent = player.fireCooldown > 0 ? 'Cooldown' : 'Ready';
    $('tranqFill').style.width = `${Math.max(0, 1 - player.fireCooldown / 0.22) * 100}%`;
  }
}

function updateMissionText() {
  const rescued = `${player.rescued}/5 satwa`;
  const neutralized = `${player.neutralized}/8 pemburu liar`;
  const current = getCurrentObjective();
  $('missionTitle').textContent = 'Operasi Savana: Wild Rescue';
  if (current.kind === 'animal') {
    const guards = getActivePoachersNear(current.position, rescueGuardRadius).length;
    $('missionText').textContent = guards > 0
      ? `Prioritas ${current.entity.order}: ${current.label}. ${current.entity.objective} Bersihkan ${guards} pemburu di sekitar kandang dulu. Progress ${rescued}.`
      : `Prioritas ${current.entity.order}: ${current.label}. ${current.entity.objective} Progress ${rescued}.`;
  } else if (current.kind === 'enemy') {
    $('missionText').textContent = `Semua satwa sudah aman. Netralisir pemburu liar tersisa. Progress ${neutralized}.`;
  } else {
    $('missionText').textContent = 'Misi lapangan selesai. Kembali ke helipad pusat untuk ekstraksi.';
  }
  updateMissionGuidance(current);
  updateAnimalList(current);
}

function updateMissionGuidance(current = getCurrentObjective()) {
  const arrow = $('missionArrow');
  const distText = $('arrowDistance');
  if (!current?.position) return;
  const dx = current.position.x - player.position.x;
  const dz = current.position.z - player.position.z;
  const dist = Math.round(Math.sqrt(dx * dx + dz * dz));
  const worldAngle = Math.atan2(dx, dz);
  const relative = normalizeAngle(worldAngle - player.yaw + Math.PI);
  arrow.style.transform = `translateX(-50%) rotate(${relative}rad)`;
  arrow.dataset.kind = current.kind;
  distText.textContent = `${current.label} · ${dist} m`;
}

function updateAnimalList(current = getCurrentObjective()) {
  const list = $('animalList');
  const ordered = [...world.animals].sort((a, b) => a.order - b.order);
  list.innerHTML = ordered.map((animal) => {
    const active = current?.entity === animal;
    const guards = getActivePoachersNear(animal.group.position, rescueGuardRadius).length;
    const status = animal.rescued ? 'AMAN' : active ? (guards ? `LAWAN ${guards}` : 'RESCUE') : 'TERKUNCI';
    return `<div class="animal-row ${animal.rescued ? 'done' : active ? 'active' : ''}"><span>${animal.order}. ${escapeHtml(animal.name)}</span><b>${status}</b></div>`;
  }).join('');
}

function updateMinimap() {
  const ctx = minimapCtx;
  const w = minimap.width;
  const h = minimap.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = 'rgba(7, 10, 7, .88)';
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = 'rgba(255, 240, 190, .24)';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, w - 2, h - 2);
  ctx.strokeStyle = 'rgba(255,255,255,.08)';
  for (let i = 1; i < 4; i++) {
    ctx.beginPath(); ctx.moveTo((w / 4) * i, 0); ctx.lineTo((w / 4) * i, h); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, (h / 4) * i); ctx.lineTo(w, (h / 4) * i); ctx.stroke();
  }

  const current = getCurrentObjective();
  drawMiniDot(world.base.position, '#e9d98a', 5, 'H');
  for (const animal of world.animals) {
    if (animal.cage) drawMiniSquare(animal.cage.position, animal.rescued ? '#4d6d54' : '#d9ad42', animal.rescued ? 6 : 8);
    drawMiniDot(animal.group.position, animal.rescued ? '#5c7753' : '#f1d074', animal.rescued ? 2.5 : 3.5, String(animal.order));
  }
  for (const enemy of world.enemies) drawMiniDot(enemy.group.position, enemy.stunned ? '#6091a1' : '#dc5c51', enemy.stunned ? 2.8 : 3.7, enemy.stunned ? '' : '!');
  if (current?.position) drawMiniRing(current.position, current.kind === 'enemy' ? '#ff6b5e' : '#ffd65a');
  drawMiniPlayer();
  drawMinimapLegend();
}

function drawMiniPlayer() {
  const cx = minimap.width / 2 + (player.position.x / 280) * (minimap.width / 2);
  const cy = minimap.height / 2 + (player.position.z / 280) * (minimap.height / 2);
  minimapCtx.fillStyle = '#ffffff';
  minimapCtx.beginPath();
  minimapCtx.moveTo(cx + Math.sin(player.yaw) * -7, cy + Math.cos(player.yaw) * -7);
  minimapCtx.lineTo(cx + Math.sin(player.yaw + 2.45) * -7, cy + Math.cos(player.yaw + 2.45) * -7);
  minimapCtx.lineTo(cx + Math.sin(player.yaw - 2.45) * -7, cy + Math.cos(player.yaw - 2.45) * -7);
  minimapCtx.closePath();
  minimapCtx.fill();
}

function drawMiniSquare(pos, color, size) {
  const x = minimap.width / 2 + (pos.x / 280) * (minimap.width / 2);
  const y = minimap.height / 2 + (pos.z / 280) * (minimap.height / 2);
  minimapCtx.strokeStyle = color;
  minimapCtx.lineWidth = 1.5;
  minimapCtx.strokeRect(x - size / 2, y - size / 2, size, size);
}

function drawMiniRing(pos, color) {
  const x = minimap.width / 2 + (pos.x / 280) * (minimap.width / 2);
  const y = minimap.height / 2 + (pos.z / 280) * (minimap.height / 2);
  minimapCtx.strokeStyle = color;
  minimapCtx.lineWidth = 2;
  minimapCtx.beginPath();
  minimapCtx.arc(x, y, 9, 0, Math.PI * 2);
  minimapCtx.stroke();
}

function drawMinimapLegend() {
  const ctx = minimapCtx;
  ctx.font = '9px ui-sans-serif, system-ui';
  ctx.fillStyle = 'rgba(246,239,220,.86)';
  ctx.fillText('▲ Player  ! Musuh  □ Kandang', 10, minimap.height - 10);
}

function drawMiniDot(pos, color, r, label = '') {
  const x = minimap.width / 2 + (pos.x / 280) * (minimap.width / 2);
  const y = minimap.height / 2 + (pos.z / 280) * (minimap.height / 2);
  minimapCtx.fillStyle = color;
  minimapCtx.beginPath();
  minimapCtx.arc(x, y, r, 0, Math.PI * 2);
  minimapCtx.fill();
  if (label) {
    minimapCtx.font = 'bold 8px ui-sans-serif, system-ui';
    minimapCtx.textAlign = 'center';
    minimapCtx.textBaseline = 'middle';
    minimapCtx.fillStyle = '#120f08';
    minimapCtx.fillText(label, x, y + 0.2);
    minimapCtx.textAlign = 'start';
    minimapCtx.textBaseline = 'alphabetic';
  }
}

function updateFPS(dt) {
  game.frames++;
  game.fpsTime += dt;
  if (game.fpsTime >= 0.5) {
    game.lastFps = Math.round(game.frames / game.fpsTime);
    game.frames = 0;
    game.fpsTime = 0;
    $('fpsCounter').textContent = `FPS ${game.lastFps}`;
  }
}

function toast(title, text) {
  const stack = $('toastStack');
  const node = document.createElement('div');
  node.className = 'toast';
  node.innerHTML = `<strong>${escapeHtml(title)}</strong><span>${escapeHtml(text)}</span>`;
  stack.prepend(node);
  setTimeout(() => {
    node.style.opacity = '0';
    node.style.transform = 'translateX(10px)';
    node.style.transition = 'opacity .25s ease, transform .25s ease';
    setTimeout(() => node.remove(), 280);
  }, 5200);
  while (stack.children.length > 4) stack.lastElementChild.remove();
}

function showSuccessBanner(title, text) {
  $('successTitle').textContent = title;
  $('successText').textContent = text;
  const banner = $('successBanner');
  banner.classList.add('show');
  game.successTimer = 6.2;
}

function updateSuccessBanner(dt) {
  if (game.successTimer <= 0) return;
  game.successTimer -= dt;
  if (game.successTimer <= 0) $('successBanner').classList.remove('show');
}

function startAudio() {
  if (game.audioStarted) return;
  game.audioStarted = true;
  world.ambience = new AudioContext();
  world.musicTimer = 0;
  world.musicStep = 0;
  createAmbientBed();
  playTone(260, 0.08, 'sine', 0.05);
}

function createAmbientBed() {
  if (!world.ambience || settings.volume <= 0) return;
  const ctx = world.ambience;
  const wind = ctx.createOscillator();
  const windGain = ctx.createGain();
  wind.type = 'sine';
  wind.frequency.value = 82;
  windGain.gain.value = 0.018 * settings.volume;
  wind.connect(windGain).connect(ctx.destination);
  wind.start();

  const low = ctx.createOscillator();
  const lowGain = ctx.createGain();
  low.type = 'triangle';
  low.frequency.value = 41;
  lowGain.gain.value = 0.008 * settings.volume;
  low.connect(lowGain).connect(ctx.destination);
  low.start();

  const drone = ctx.createOscillator();
  const droneGain = ctx.createGain();
  drone.type = 'sine';
  drone.frequency.value = 98;
  droneGain.gain.value = 0.011 * settings.volume;
  drone.connect(droneGain).connect(ctx.destination);
  drone.start();
  world.ambienceNodes.push(wind, windGain, low, lowGain, drone, droneGain);
}

function updateAmbientAudio(dt) {
  if (!world.ambience || settings.volume <= 0) return;
  game.birdTimer -= dt;
  if (game.birdTimer <= 0) {
    game.birdTimer = rand(4.5, 9.5);
    if (world.musicMode === 'explore' && Math.random() > 0.35) playBirdCall();
  }
  world.musicTimer -= dt;
  if (world.musicTimer <= 0) {
    playDynamicMusicStep(world.musicStep++, world.musicMode);
    const intervals = { explore: 0.54, tension: 0.42, combat: 0.30, danger: 0.34, extraction: 0.46 };
    world.musicTimer = intervals[world.musicMode] || 0.48;
  }
}

function updateCombatAudioState(dt) {
  game.combatTimer = Math.max(0, game.combatTimer - dt);
  const activeEnemies = world.enemies.filter((enemy) => !enemy.stunned);
  const nearestEnemy = activeEnemies.reduce((nearest, enemy) => {
    const dist = horizontalDistance(player.position, enemy.group.position);
    return dist < nearest ? dist : nearest;
  }, Infinity);
  if (nearestEnemy < enemyAlertRadius) game.combatTimer = Math.max(game.combatTimer, 1.6);

  let mode = 'explore';
  const objective = getCurrentObjective();
  const objectiveDistance = objective?.position ? horizontalDistance(player.position, objective.position) : Infinity;
  if (player.health <= 32 && activeEnemies.length > 0) mode = 'danger';
  else if (game.combatTimer > 0.15) mode = 'combat';
  else if (objective?.kind === 'base' && player.rescued >= 5 && activeEnemies.length === 0) mode = 'extraction';
  else if (objectiveDistance < 42 || getActivePoachersNear(objective?.position || player.position, rescueGuardRadius).length > 0) mode = 'tension';

  if (settings.dynamicMusic === 'off') mode = 'explore';
  if (mode !== world.musicMode) {
    world.musicMode = mode;
    world.musicTimer = 0;
  }
  const badge = $('musicBadge');
  if (badge) badge.textContent = `MUSIC ${mode.toUpperCase()}`;
}

function playTone(freq, duration, type = 'sine', volume = 0.1) {
  if (!world.ambience || settings.volume <= 0) return;
  const ctx = world.ambience;
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  oscillator.frequency.value = freq;
  oscillator.type = type;
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * settings.volume), ctx.currentTime + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
  oscillator.connect(gain).connect(ctx.destination);
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration + 0.02);
}

function playGunShot() {
  if (!world.ambience || settings.volume <= 0) return;
  const ctx = world.ambience;
  const now = ctx.currentTime;

  const makeNoise = (duration, volume, filterType, frequency, q, delay = 0, decay = 1.7) => {
    const length = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = filterType;
    filter.frequency.setValueAtTime(frequency, now + delay);
    filter.Q.value = q;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0001, now + delay);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume * settings.volume), now + delay + 0.006);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + duration);
    source.connect(filter).connect(gain).connect(ctx.destination);
    source.start(now + delay);
    source.stop(now + delay + duration + 0.03);
  };

  // Sniper dart rifle: crack tajam, ledakan rendah, dan tail/echo pendek agar tidak terdengar seperti pistol biasa.
  makeNoise(0.075, 1.18, 'highpass', 1850, 0.65, 0, 1.15);
  makeNoise(0.22, 0.72, 'bandpass', 360, 1.05, 0.012, 1.85);
  makeNoise(0.34, 0.33, 'lowpass', 185, 0.7, 0.055, 2.3);
  makeNoise(0.18, 0.19, 'bandpass', 820, 0.85, 0.13, 1.6);
  makeNoise(0.24, 0.13, 'bandpass', 540, 0.75, 0.24, 1.9);

  const boom = ctx.createOscillator();
  const boomGain = ctx.createGain();
  boom.type = 'sine';
  boom.frequency.setValueAtTime(78, now);
  boom.frequency.exponentialRampToValueAtTime(38, now + 0.28);
  boomGain.gain.setValueAtTime(0.0001, now);
  boomGain.gain.exponentialRampToValueAtTime(0.55 * settings.volume, now + 0.012);
  boomGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.32);
  boom.connect(boomGain).connect(ctx.destination);
  boom.start(now);
  boom.stop(now + 0.35);

  const mechanical = ctx.createOscillator();
  const mechanicalGain = ctx.createGain();
  mechanical.type = 'square';
  mechanical.frequency.setValueAtTime(720, now + 0.018);
  mechanical.frequency.exponentialRampToValueAtTime(260, now + 0.075);
  mechanicalGain.gain.setValueAtTime(0.0001, now + 0.018);
  mechanicalGain.gain.exponentialRampToValueAtTime(0.18 * settings.volume, now + 0.026);
  mechanicalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
  mechanical.connect(mechanicalGain).connect(ctx.destination);
  mechanical.start(now + 0.018);
  mechanical.stop(now + 0.1);
}
function playEnemyShot() {
  if (!world.ambience || settings.volume <= 0) return;
  const ctx = world.ambience;
  const length = Math.floor(ctx.sampleRate * 0.12);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** 1.3;
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.0001, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.44 * settings.volume, ctx.currentTime + 0.006);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
  noise.connect(gain).connect(ctx.destination);
  noise.start();
  noise.stop(ctx.currentTime + 0.14);
  playTone(125, 0.10, 'sawtooth', 0.24);
}

function playRescueSound() {
  playTone(430, 0.09, 'sine', 0.18);
  setTimeout(() => playTone(660, 0.12, 'sine', 0.18), 90);
  setTimeout(() => playTone(880, 0.14, 'triangle', 0.16), 190);
}

function playRewardMusic() {
  const notes = [392, 494, 587, 784, 988, 1175];
  notes.forEach((note, idx) => {
    setTimeout(() => {
      playTone(note, 0.16, idx % 2 ? 'sine' : 'triangle', 0.16);
      if (idx === notes.length - 1) playTone(note / 2, 0.42, 'triangle', 0.11);
    }, idx * 105);
  });
}

function playDynamicMusicStep(step, mode = 'explore') {
  if (settings.volume <= 0 || game.state !== 'playing') return;

  const patterns = {
    explore: { melody: [196, 247, 294, 330, 294, 247, 220, 247, 294, 392, 370, 330, 294, 247, 220, 196], bass: [98, 0, 147, 0], volume: 0.038, wave: 'triangle' },
    tension: { melody: [220, 247, 262, 247, 220, 196, 220, 247, 294, 262, 247, 220], bass: [82, 98, 0, 110], volume: 0.052, wave: 'triangle' },
    combat: { melody: [294, 330, 370, 330, 294, 247, 294, 392], bass: [73, 73, 98, 110], volume: 0.073, wave: 'sawtooth' },
    danger: { melody: [196, 185, 196, 220, 196, 165, 185, 196], bass: [65, 65, 82, 0], volume: 0.068, wave: 'square' },
    extraction: { melody: [262, 330, 392, 523, 494, 392, 330, 262], bass: [131, 0, 196, 0], volume: 0.055, wave: 'triangle' },
  };
  const pattern = patterns[mode] || patterns.explore;
  const note = pattern.melody[step % pattern.melody.length];
  const accent = step % 8 === 0;
  playTone(note, accent ? 0.30 : 0.17, pattern.wave, accent ? pattern.volume * 1.45 : pattern.volume);

  const bass = pattern.bass[step % pattern.bass.length];
  if (bass) playTone(bass, mode === 'combat' ? 0.22 : 0.34, 'sine', pattern.volume * (mode === 'combat' ? 0.92 : 0.76));
  if (mode === 'combat' && step % 2 === 0) playTone(44, 0.10, 'triangle', 0.035);
  if (mode === 'danger' && step % 4 === 2) playTone(110, 0.18, 'sawtooth', 0.041);
}

function playBirdCall() {
  playTone(rand(860, 1180), 0.07, 'sine', 0.035);
  setTimeout(() => playTone(rand(1180, 1540), 0.06, 'sine', 0.03), 120);
}

function applySettings() {
  camera.fov = settings.fov;
  camera.updateProjectionMatrix();
  initRenderer();
}

function updateSettingsUI() {
  $('sensitivityRange').value = settings.sensitivity;
  $('fovRange').value = settings.fov;
  $('volumeRange').value = settings.volume;
  $('graphicsSelect').value = settings.graphics;
  $('dynamicMusicSelect').value = settings.dynamicMusic || 'on';
  updateSettingsPreview();
}

function updateSettingsPreview() {
  $('sensitivityValue').textContent = Number($('sensitivityRange').value).toFixed(2);
  $('fovValue').textContent = `${$('fovRange').value}°`;
  $('volumeValue').textContent = `${Math.round(Number($('volumeRange').value) * 100)}%`;
}

function loadGLB(url, onLoad, onFallback) {
  loader.load(url, (gltf) => onLoad(gltf.scene), undefined, () => onFallback());
}

function enableShadow(obj) {
  if (obj.isMesh) {
    obj.castShadow = true;
    obj.receiveShadow = true;
  }
}

function createAcaciaTree() {
  const group = new THREE.Group();
  group.userData.radius = 3.4;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.65, 5.6, 8), materials.bark);
  trunk.position.y = 2.8;
  trunk.rotation.z = rand(-0.12, 0.12);
  group.add(trunk);
  for (let i = 0; i < 3; i++) {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.24, rand(3.4, 5.8), 7), materials.bark);
    branch.position.set(rand(-1.6, 1.6), rand(4.2, 5.4), rand(-1.4, 1.4));
    branch.rotation.z = rand(-0.9, 0.9);
    branch.rotation.x = rand(-0.5, 0.5);
    group.add(branch);
  }
  for (let i = 0; i < 5; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(rand(2.4, 4.6), 16, 8), materials.leaves);
    leaf.position.set(rand(-4.2, 4.2), rand(5.8, 7.2), rand(-3.8, 3.8));
    leaf.scale.y = 0.25;
    group.add(leaf);
  }
  group.traverse(enableShadow);
  return group;
}

function createBaobabTree() {
  const group = new THREE.Group();
  group.userData.radius = 5.6;
  const trunk = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 2.6, 8.2, 12), materials.bark);
  trunk.position.y = 4.1;
  group.add(trunk);
  for (let i = 0; i < 6; i++) {
    const branch = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.38, rand(3, 5.5), 7), materials.bark);
    branch.position.set(rand(-1.5, 1.5), rand(7, 8.4), rand(-1.5, 1.5));
    branch.rotation.z = rand(-1.1, 1.1);
    branch.rotation.x = rand(-1.1, 1.1);
    group.add(branch);
  }
  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(rand(2.4, 3.2), 14, 8), materials.leaves);
    leaf.position.set(rand(-2.8, 2.8), rand(8.2, 9.3), rand(-2.8, 2.8));
    leaf.scale.y = 0.45;
    group.add(leaf);
  }
  group.traverse(enableShadow);
  return group;
}

function createTent(color) {
  const group = new THREE.Group();
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.9 });
  const canvas = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 4.6, 8, 3, 1, false), mat);
  canvas.rotation.y = Math.PI / 6;
  canvas.rotation.z = Math.PI / 2;
  canvas.position.y = 2.05;
  canvas.scale.z = 0.72;
  group.add(canvas);
  const flap = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 2.6), new THREE.MeshStandardMaterial({ color: 0x1c1a15, roughness: 0.8, side: THREE.DoubleSide }));
  flap.position.set(0, 1.45, -4.05);
  group.add(flap);
  group.traverse(enableShadow);
  return group;
}

function createProceduralHelicopter() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(1.5, 5.2, 8, 18), new THREE.MeshStandardMaterial({ color: 0x324137, roughness: 0.55, metalness: 0.25 }));
  body.rotation.z = Math.PI / 2;
  group.add(body);
  const cockpit = new THREE.Mesh(new THREE.SphereGeometry(1.25, 16, 10), new THREE.MeshStandardMaterial({ color: 0x243447, roughness: 0.25, metalness: 0.05, transparent: true, opacity: 0.85 }));
  cockpit.position.set(2.7, 0.15, 0);
  cockpit.scale.set(1.05, 0.75, 0.8);
  group.add(cockpit);
  const tail = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.35, 0.35), materials.metal);
  tail.position.set(-4.5, 0.1, 0);
  group.add(tail);
  const rotor = new THREE.Mesh(new THREE.BoxGeometry(11, 0.08, 0.32), materials.metal);
  rotor.position.set(0.2, 1.65, 0);
  const rotor2 = rotor.clone();
  rotor2.rotation.y = Math.PI / 2;
  group.add(rotor, rotor2);
  const skid1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.18, 0.18), materials.metal);
  skid1.position.set(0, -1.6, 1.35);
  const skid2 = skid1.clone(); skid2.position.z = -1.35;
  group.add(skid1, skid2);
  group.traverse(enableShadow);
  return group;
}

function createRangerOperator() {
  const group = new THREE.Group();
  const bootsMat = new THREE.MeshStandardMaterial({ color: 0x171915, roughness: 0.75 });
  const vestMat = new THREE.MeshStandardMaterial({ color: 0x293326, roughness: 0.82 });
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.52, 1.15, 8, 12), materials.cloth);
  body.position.y = 1.35;
  group.add(body);
  const vest = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.9, 0.38), vestMat);
  vest.position.set(0, 1.45, -0.03);
  group.add(vest);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 14, 10), materials.skin);
  head.position.y = 2.32;
  group.add(head);
  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.39, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), new THREE.MeshStandardMaterial({ color: 0x20261d, roughness: 0.68 }));
  helmet.position.y = 2.48;
  group.add(helmet);
  const visor = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.5), materials.blackMetal);
  visor.position.set(0, 2.38, -0.23);
  group.add(visor);
  const arm1 = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.74, 6, 8), materials.cloth);
  arm1.position.set(0.55, 1.58, -0.05); arm1.rotation.z = -0.58;
  const arm2 = arm1.clone(); arm2.position.x = -0.55; arm2.rotation.z = 0.58;
  group.add(arm1, arm2);
  for (let i = 0; i < 2; i++) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.15, 0.9, 6, 8), materials.cloth);
    leg.position.set(i === 0 ? -0.22 : 0.22, 0.52, 0);
    group.add(leg);
    const boot = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.46), bootsMat);
    boot.position.set(i === 0 ? -0.22 : 0.22, 0.08, -0.08);
    group.add(boot);
  }
  const pack = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.85, 0.22), new THREE.MeshStandardMaterial({ color: 0x202b1e, roughness: 0.8 }));
  pack.position.set(0, 1.45, 0.35);
  group.add(pack);
  const rifle = createRealisticTranqRifle(false);
  rifle.scale.setScalar(0.85);
  rifle.position.set(0.45, 1.42, -0.45);
  rifle.rotation.set(0.12, -0.18, -0.05);
  group.add(rifle);
  group.traverse(enableShadow);
  return group;
}

function createRealisticTranqRifle(firstPerson = true) {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.32, 1.45), materials.blackMetal);
  body.position.set(0, 0, -0.2);
  group.add(body);
  const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.58), materials.metal);
  receiver.position.set(0, -0.02, -0.72);
  group.add(receiver);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.08, 1.75, 16), materials.blackMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.02, -1.78);
  group.add(barrel);
  const suppressor = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.72, 18), materials.rubber);
  suppressor.rotation.x = Math.PI / 2;
  suppressor.position.set(0, 0.02, -2.72);
  group.add(suppressor);
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.27, 0.82), materials.rubber);
  stock.position.set(0, -0.02, 0.78);
  stock.rotation.x = -0.08;
  group.add(stock);
  const butt = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.42, 0.12), materials.rubber);
  butt.position.set(0, -0.04, 1.25);
  group.add(butt);
  const grip = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.26), materials.rubber);
  grip.position.set(0, -0.48, -0.45);
  grip.rotation.x = -0.28;
  group.add(grip);
  const triggerGuard = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.022, 8, 18), materials.blackMetal);
  triggerGuard.position.set(0, -0.27, -0.65);
  triggerGuard.rotation.x = Math.PI / 2;
  group.add(triggerGuard);
  const magazine = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.46, 0.26), new THREE.MeshStandardMaterial({ color: 0x1e2e34, roughness: 0.48, metalness: 0.45 }));
  magazine.position.set(0, -0.42, -0.88);
  magazine.rotation.x = -0.08;
  group.add(magazine);
  const scopeTube = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.92, 18), materials.blackMetal);
  scopeTube.rotation.x = Math.PI / 2;
  scopeTube.position.set(0, 0.34, -0.72);
  group.add(scopeTube);
  const lens1 = new THREE.Mesh(new THREE.CylinderGeometry(0.145, 0.145, 0.035, 18), materials.glass);
  lens1.rotation.x = Math.PI / 2;
  lens1.position.set(0, 0.34, -1.2);
  const lens2 = lens1.clone();
  lens2.position.z = -0.24;
  group.add(lens1, lens2);
  const rail = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.07, 1.25), materials.metal);
  rail.position.set(0, 0.23, -0.72);
  group.add(rail);
  const dartTube = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 1.05, 12), materials.dart);
  dartTube.rotation.x = Math.PI / 2;
  dartTube.position.set(0.19, 0.13, -1.28);
  group.add(dartTube);

  if (firstPerson) {
    group.position.set(0.44, -0.46, -0.9);
    group.rotation.set(-0.06, Math.PI, 0.02);
    group.scale.setScalar(0.72);
  }
  group.traverse(enableShadow);
  return group;
}

function createPoacher() {
  const group = new THREE.Group();
  const cloth = materials.poacherCloth;
  const vestMat = materials.tacticalVest;
  const pouchMat = materials.tacticalPouch;
  const maskMat = materials.tacticalMask;
  const bootMat = materials.tacticalBoot;
  const camoMat = materials.camoPatch;

  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.47, 1.32, 10, 14), cloth);
  body.position.y = 1.28;
  body.scale.set(0.9, 1.06, 0.72);
  group.add(body);

  const vest = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.9, 0.34), vestMat);
  vest.position.set(0, 1.45, 0.02);
  vest.rotation.x = -0.02;
  group.add(vest);

  const chestPlate = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.56, 0.38), new THREE.MeshStandardMaterial({ color: 0x0f1210, roughness: 0.62, metalness: 0.12 }));
  chestPlate.position.set(0, 1.52, -0.03);
  group.add(chestPlate);

  for (let i = 0; i < 5; i++) {
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.18, 0.09), pouchMat);
    pouch.position.set(-0.28 + i * 0.14, 1.16, -0.22);
    pouch.rotation.x = -0.05;
    group.add(pouch);
  }

  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.86, 0.13, 0.38), vestMat);
  belt.position.set(0, 0.92, 0.02);
  group.add(belt);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.18, 12), maskMat);
  neck.position.y = 2.08;
  group.add(neck);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.34, 18, 12), materials.skin);
  head.position.y = 2.35;
  group.add(head);

  const balaclava = new THREE.Mesh(new THREE.SphereGeometry(0.355, 18, 12), maskMat);
  balaclava.position.y = 2.36;
  balaclava.scale.set(1.03, 1.06, 1.01);
  group.add(balaclava);

  const faceOpening = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.17, 0.035), materials.skin);
  faceOpening.position.set(0, 2.38, -0.325);
  group.add(faceOpening);

  const goggles = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.12, 0.055), new THREE.MeshStandardMaterial({ color: 0x0a1114, roughness: 0.18, metalness: 0.18, emissive: 0x071316, emissiveIntensity: 0.2 }));
  goggles.position.set(0, 2.42, -0.355);
  group.add(goggles);

  const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.39, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.58), vestMat);
  helmet.position.y = 2.55;
  helmet.scale.set(1.08, 0.72, 1.02);
  group.add(helmet);

  const helmetBand = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.055, 0.08), camoMat);
  helmetBand.position.set(0, 2.5, -0.19);
  group.add(helmetBand);

  const shoulderL = new THREE.Mesh(new THREE.SphereGeometry(0.21, 12, 8), vestMat);
  shoulderL.scale.set(1.25, 0.62, 0.78);
  shoulderL.position.set(-0.55, 1.82, 0);
  const shoulderR = shoulderL.clone();
  shoulderR.position.x = 0.55;
  group.add(shoulderL, shoulderR);

  const upperArmL = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 0.58, 7, 9), cloth);
  upperArmL.position.set(-0.68, 1.52, -0.04);
  upperArmL.rotation.z = 0.34;
  const upperArmR = upperArmL.clone();
  upperArmR.position.x = 0.68;
  upperArmR.rotation.z = -0.34;
  group.add(upperArmL, upperArmR);

  const foreArmL = new THREE.Mesh(new THREE.CapsuleGeometry(0.11, 0.55, 7, 9), cloth);
  foreArmL.position.set(-0.53, 1.26, -0.25);
  foreArmL.rotation.x = -0.9;
  foreArmL.rotation.z = -0.25;
  const foreArmR = foreArmL.clone();
  foreArmR.position.x = 0.53;
  foreArmR.rotation.z = 0.25;
  group.add(foreArmL, foreArmR);

  const gloveL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 8), bootMat);
  gloveL.position.set(-0.41, 1.08, -0.55);
  const gloveR = gloveL.clone();
  gloveR.position.x = 0.41;
  group.add(gloveL, gloveR);

  const rifleGroup = new THREE.Group();
  const rifleBody = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.18, 1.35), materials.blackMetal);
  rifleBody.position.set(0, 0, -0.22);
  rifleGroup.add(rifleBody);
  const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 1.05, 12), materials.blackMetal);
  barrel.rotation.x = Math.PI / 2;
  barrel.position.set(0, 0.02, -1.1);
  rifleGroup.add(barrel);
  const stock = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.42), bootMat);
  stock.position.set(0, -0.02, 0.58);
  rifleGroup.add(stock);
  const mag = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.28, 0.17), materials.metal);
  mag.position.set(0, -0.22, -0.1);
  rifleGroup.add(mag);
  const optic = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.34, 12), materials.blackMetal);
  optic.rotation.x = Math.PI / 2;
  optic.position.set(0, 0.16, -0.38);
  rifleGroup.add(optic);
  rifleGroup.position.set(0, 1.27, -0.62);
  rifleGroup.rotation.x = -0.12;
  group.add(rifleGroup);

  const thighL = new THREE.Mesh(new THREE.CapsuleGeometry(0.16, 0.72, 8, 10), cloth);
  thighL.position.set(-0.22, 0.61, 0);
  thighL.rotation.z = -0.05;
  const thighR = thighL.clone();
  thighR.position.x = 0.22;
  thighR.rotation.z = 0.05;
  group.add(thighL, thighR);

  const kneeL = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.16, 0.12), vestMat);
  kneeL.position.set(-0.23, 0.34, -0.08);
  const kneeR = kneeL.clone();
  kneeR.position.x = 0.23;
  group.add(kneeL, kneeR);

  const shinL = new THREE.Mesh(new THREE.CapsuleGeometry(0.13, 0.52, 8, 10), cloth);
  shinL.position.set(-0.22, 0.17, 0.02);
  const shinR = shinL.clone();
  shinR.position.x = 0.22;
  group.add(shinL, shinR);

  const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.14, 0.38), bootMat);
  bootL.position.set(-0.22, 0.04, -0.07);
  const bootR = bootL.clone();
  bootR.position.x = 0.22;
  group.add(bootL, bootR);

  for (let i = 0; i < 7; i++) {
    const patch = new THREE.Mesh(new THREE.BoxGeometry(rand(0.08, 0.18), 0.012, rand(0.05, 0.11)), i % 2 ? camoMat : pouchMat);
    patch.position.set(rand(-0.34, 0.34), rand(1.1, 1.9), -0.18 - i * 0.002);
    patch.rotation.z = rand(-0.4, 0.4);
    group.add(patch);
  }

  const nameTag = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.055, 0.012), new THREE.MeshStandardMaterial({ color: 0x8d2f2a, roughness: 0.75 }));
  nameTag.position.set(0.16, 1.72, -0.205);
  group.add(nameTag);

  group.scale.setScalar(1.08);
  group.traverse(enableShadow);
  return group;
}
function createElephant() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.SphereGeometry(2.15, 24, 16), new THREE.MeshStandardMaterial({ color: 0x706b5f, roughness: 0.95 }));
  body.scale.set(1.55, 0.88, 0.95);
  body.position.y = 2.4;
  group.add(body);
  const head = new THREE.Mesh(new THREE.SphereGeometry(1.2, 20, 14), body.material);
  head.position.set(2.75, 2.35, 0);
  group.add(head);
  const trunk = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 1.7, 8, 12), body.material);
  trunk.position.set(3.55, 1.55, 0);
  trunk.rotation.z = 0.28;
  group.add(trunk);
  const ear1 = new THREE.Mesh(new THREE.SphereGeometry(0.85, 14, 10), body.material);
  ear1.scale.set(0.25, 1.15, 0.9);
  ear1.position.set(2.2, 2.5, 0.96);
  const ear2 = ear1.clone(); ear2.position.z = -0.96;
  group.add(ear1, ear2);
  for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.44, 1.55, 12), body.material);
    leg.position.set(i < 2 ? -1.1 : 1.15, 0.85, i % 2 === 0 ? -0.85 : 0.85);
    group.add(leg);
  }
  const tuskMat = new THREE.MeshStandardMaterial({ color: 0xe5dfcc, roughness: 0.6 });
  const tusk1 = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.9, 8), tuskMat);
  tusk1.position.set(3.55, 2.05, 0.35); tusk1.rotation.z = -Math.PI / 2.7;
  const tusk2 = tusk1.clone(); tusk2.position.z = -0.35;
  group.add(tusk1, tusk2);
  group.scale.setScalar(0.92);
  group.traverse(enableShadow);
  return group;
}

function createZebra() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.8, 2.2, 8, 18), materials.white);
  body.rotation.z = Math.PI / 2;
  body.position.y = 1.55;
  group.add(body);
  const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.33, 0.72, 8, 12), materials.white);
  head.position.set(1.75, 1.93, 0);
  head.rotation.z = -0.45;
  group.add(head);
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.4, 0.9, 10), materials.white);
  neck.position.set(1.1, 1.9, 0);
  neck.rotation.z = -0.35;
  group.add(neck);
  for (let i = 0; i < 9; i++) {
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.14, 0.06), materials.animalDark);
    stripe.position.set(-0.9 + i * 0.23, 1.62, 0.82);
    stripe.rotation.z = rand(-0.5, 0.5);
    group.add(stripe);
    const stripe2 = stripe.clone(); stripe2.position.z = -0.82;
    group.add(stripe2);
  }
  for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.12, 1.1, 6, 8), materials.white);
    leg.position.set(i < 2 ? -0.75 : 0.75, 0.68, i % 2 === 0 ? -0.42 : 0.42);
    group.add(leg);
  }
  const tail = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.8, 5, 8), materials.animalDark);
  tail.position.set(-1.75, 1.32, 0); tail.rotation.z = 0.8;
  group.add(tail);
  group.traverse(enableShadow);
  return group;
}

function createGazelle() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.58, 1.75, 8, 14), materials.animal);
  body.rotation.z = Math.PI / 2;
  body.position.y = 1.25;
  group.add(body);
  const belly = new THREE.Mesh(new THREE.CapsuleGeometry(0.34, 1.45, 8, 12), materials.white);
  belly.rotation.z = Math.PI / 2;
  belly.position.set(0, 1.02, 0.02);
  group.add(belly);
  const head = new THREE.Mesh(new THREE.CapsuleGeometry(0.25, 0.55, 8, 10), materials.animal);
  head.position.set(1.45, 1.58, 0);
  head.rotation.z = -0.45;
  group.add(head);
  const hornMat = new THREE.MeshStandardMaterial({ color: 0x21160f, roughness: 0.8 });
  const horn1 = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.72, 8), hornMat);
  horn1.position.set(1.58, 2.08, 0.14); horn1.rotation.z = -0.15;
  const horn2 = horn1.clone(); horn2.position.z = -0.14;
  group.add(horn1, horn2);
  for (let i = 0; i < 4; i++) {
    const leg = new THREE.Mesh(new THREE.CapsuleGeometry(0.07, 1.18, 5, 8), materials.animal);
    leg.position.set(i < 2 ? -0.58 : 0.58, 0.55, i % 2 === 0 ? -0.32 : 0.32);
    leg.rotation.z = i % 2 === 0 ? 0.08 : -0.08;
    group.add(leg);
  }
  group.traverse(enableShadow);
  return group;
}

function createMarker(color) {
  const group = new THREE.Group();
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.055, 8, 24), materials.marker);
  ring.rotation.x = Math.PI / 2;
  const icon = new THREE.Mesh(new THREE.OctahedronGeometry(0.32, 0), materials.marker);
  icon.position.y = 0.48;
  group.add(ring, icon);
  return group;
}

function randomWorldPosition(minDist, maxDist) {
  let p = new THREE.Vector3();
  for (let i = 0; i < 20; i++) {
    p.set(rand(-maxDist, maxDist), 0, rand(-maxDist, maxDist));
    if (Math.abs(p.x) < minDist && Math.abs(p.z) < minDist) continue;
    return p;
  }
  return p;
}

function qualityCount(low, medium, high) {
  if (settings.graphics === 'low') return low;
  if (settings.graphics === 'medium') return medium;
  return high;
}

function horizontalDistance(a, b) {
  const dx = a.x - b.x;
  const dz = a.z - b.z;
  return Math.sqrt(dx * dx + dz * dz);
}

function animalName(type) {
  return type === 'elephant' ? 'gajah' : type === 'zebra' ? 'zebra' : 'gazelle';
}

function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>'"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#039;', '"': '&quot;' }[c]));
}
