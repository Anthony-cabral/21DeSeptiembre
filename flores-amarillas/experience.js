import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js';

const experience = document.querySelector('#experience');
const canvas = document.querySelector('#threeCanvas');
const startPanel = document.querySelector('#startPanel');
const startButton = document.querySelector('#startJourney');
const journeyHud = document.querySelector('#journeyHud');
const journeyTitle = document.querySelector('#journeyTitle');
const journeySub = document.querySelector('#journeySub');
const skipButton = document.querySelector('#skipJourney');
const flash = document.querySelector('#flash');
const main = document.querySelector('#mainContent');
const header = document.querySelector('#siteHeader');
const music = document.querySelector('#bgMusic');

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const renderer = new THREE.WebGLRenderer({ canvas, antialias: !matchMedia('(max-width: 700px)').matches, alpha: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.6));
renderer.setSize(innerWidth, innerHeight, false);
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x070407);
scene.fog = new THREE.FogExp2(0x100608, 0.012);
const camera = new THREE.PerspectiveCamera(62, innerWidth / innerHeight, .1, 700);
camera.position.set(0, 0, 7);

const ambient = new THREE.AmbientLight(0xffd27a, 1.25);
scene.add(ambient);
const point = new THREE.PointLight(0xffa31a, 26, 85, 1.4);
point.position.set(0, 0, -7);
scene.add(point);

function makeFlowerTexture(pink = false) {
  const c = document.createElement('canvas'); c.width = 256; c.height = 256;
  const x = c.getContext('2d'); x.translate(128, 128);
  for (let i = 0; i < 12; i++) {
    x.save(); x.rotate((Math.PI * 2 / 12) * i);
    const g = x.createLinearGradient(0, -15, 0, -95);
    g.addColorStop(0, pink ? '#efb1bd' : '#f4b924'); g.addColorStop(1, pink ? '#ffd5dc' : '#ffe36c');
    x.fillStyle = g; x.beginPath(); x.ellipse(0, -65, 18, 50, 0, 0, Math.PI * 2); x.fill(); x.restore();
  }
  x.fillStyle = pink ? '#cf7b8f' : '#673210'; x.beginPath(); x.arc(0, 0, 34, 0, Math.PI * 2); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function makePetalTexture(pink = false) {
  const c = document.createElement('canvas'); c.width = 96; c.height = 128;
  const x = c.getContext('2d');
  const g = x.createLinearGradient(0, 0, 96, 128); g.addColorStop(0, pink ? '#ffd2dc' : '#ffe06c'); g.addColorStop(1, pink ? '#e99cad' : '#e8a91a');
  x.fillStyle = g; x.beginPath(); x.moveTo(48, 4); x.bezierCurveTo(90, 34, 84, 94, 48, 122); x.bezierCurveTo(10, 95, 7, 36, 48, 4); x.fill();
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function makeTextTexture(text) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 220;
  const x = c.getContext('2d'); x.clearRect(0, 0, c.width, c.height);
  x.textAlign = 'center'; x.textBaseline = 'middle'; x.font = 'italic 62px Georgia';
  x.shadowColor = '#ffb41e'; x.shadowBlur = 24; x.fillStyle = '#fff0ad'; x.fillText(text, 512, 105);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

const flowerTex = makeFlowerTexture(false), pinkFlowerTex = makeFlowerTexture(true);
const petalTex = makePetalTexture(false), pinkPetalTex = makePetalTexture(true);
const tunnel = new THREE.Group(); scene.add(tunnel);

const isMobile = matchMedia('(max-width: 700px)').matches;
const flowerCount = isMobile ? 44 : 70;
for (let i = 0; i < flowerCount; i++) {
  const mat = new THREE.SpriteMaterial({ map: i % 7 === 0 ? pinkFlowerTex : flowerTex, transparent: true, depthWrite: false, opacity: .98 });
  const s = new THREE.Sprite(mat);
  const side = i % 2 ? 1 : -1;
  s.position.set(side * (4 + Math.random() * 8), (Math.random() - .5) * 12, -8 - i * 5 - Math.random() * 14);
  const sc = 1.1 + Math.random() * 3.2; s.scale.set(sc, sc, 1); s.userData.spin = (Math.random() - .5) * .006; tunnel.add(s);
}

for (let i = 0; i < (isMobile ? 70 : 120); i++) {
  const mat = new THREE.SpriteMaterial({ map: i % 8 === 0 ? pinkPetalTex : petalTex, transparent: true, depthWrite: false, opacity: .75 });
  const p = new THREE.Sprite(mat); p.position.set((Math.random() - .5) * 24, (Math.random() - .5) * 15, -3 - Math.random() * 430);
  const sc = .16 + Math.random() * .42; p.scale.set(sc, sc * 1.35, 1); p.userData.drift = .003 + Math.random() * .007; tunnel.add(p);
}

const starGeo = new THREE.BufferGeometry();
const positions = [];
for (let i = 0; i < (isMobile ? 500 : 900); i++) positions.push((Math.random() - .5) * 30, (Math.random() - .5) * 18, -Math.random() * 460);
starGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
const stars = new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xffc83d, size: .045, transparent: true, opacity: .92, depthWrite: false }));
scene.add(stars);

// Radial streaks accentuate the fast part of the trip.
const streakGroup = new THREE.Group(); scene.add(streakGroup);
for (let i = 0; i < (isMobile ? 45 : 80); i++) {
  const g = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0,0,0), new THREE.Vector3(0,0,-(2 + Math.random()*6))]);
  const line = new THREE.Line(g, new THREE.LineBasicMaterial({ color: i%6===0?0xffb8ca:0xffdd72, transparent:true, opacity:.35 }));
  const a=Math.random()*Math.PI*2, r=2+Math.random()*9; line.position.set(Math.cos(a)*r, Math.sin(a)*r, -25-Math.random()*370); streakGroup.add(line);
}

const memoryFiles = [
  ['assets/moments/01-gatito.jpeg','Obviamente este tenía que estar aquí ♡'],
  ['assets/moments/02-nosotros.jpeg','Una de mis favoritas'],
  ['assets/moments/03-flores-rosadas.jpeg','Un recuerdo bonito'],
  ['assets/moments/04-gatitos.jpeg','Mira esos dos jajajja'],
  ['assets/moments/05-gatitos-jugando.jpeg','Caos chiquito y bonito'],
  ['assets/moments/06-gatitos-durmiendo.jpeg','De esas cositas que guardo']
];
const loader = new THREE.TextureLoader();
const memoryGroup = new THREE.Group(); scene.add(memoryGroup);
function addMemory(url, caption, i) {
  loader.load(url, tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const img = tex.image; const ratio = img.width / img.height;
    const h = ratio > 1.2 ? 3.3 : 4.2; const w = h * ratio;
    const group = new THREE.Group();
    const frame = new THREE.Mesh(new THREE.PlaneGeometry(w + .34, h + .68), new THREE.MeshBasicMaterial({ color: 0xfff8e8 }));
    frame.position.z = -.02; group.add(frame);
    const photo = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshBasicMaterial({ map: tex })); photo.position.y=.15; group.add(photo);
    const txt = new THREE.Sprite(new THREE.SpriteMaterial({ map: makeTextTexture(caption), transparent:true, depthWrite:false })); txt.position.set(0,-h/2-.15,.03); txt.scale.set(Math.min(4.5,w+1),.95,1); group.add(txt);
    const side = i % 2 ? 1 : -1;
    group.position.set(side*(3.1 + (i%3)*1.15), (i%3-1)*2.1, -105 - i*42);
    group.rotation.z = (i%2?-.08:.08); group.rotation.y = side * -.13;
    group.userData.baseX = group.position.x; group.userData.floatOffset = i*.7; memoryGroup.add(group);
  });
}
memoryFiles.forEach((m,i)=>addMemory(m[0],m[1],i));

const quoteData = [
  ['Te pensé bonito', -58, -3.9, 2.8], ['Flores para ti', -82, 4.2, -1.5],
  ['Eres para mí ♡', -170, -4.2, -2.8], ['Un recuerdo bonito', -240, 4.1, 2.8],
  ['Gracias por tanto', -330, -3.5, 1.8]
];
quoteData.forEach(([text,z,x,y])=>{const s=new THREE.Sprite(new THREE.SpriteMaterial({map:makeTextTexture(text),transparent:true,depthWrite:false}));s.position.set(x,y,z);s.scale.set(6.4,1.4,1);scene.add(s)});

let started = false, finished = false, startTime = 0;
let currentZ = 7;
const totalDuration = reducedMotion ? 4800 : 14500;
const hudMoments = [
  [0,'Un pequeño viaje para ti...','mira alrededor ✦'],
  [2800,'Flores, flores y más flores','sí, eran necesarias jajajja'],
  [5600,'Y entre ellas... unos recuerdos','de esos que me hacen sonreír'],
  [9300,'Ahora un poquito más rápido','agárrate ♡'],
  [11900,'Ya casi llegamos','tu jardín está adelante ✦']
];
let hudIndex=0;

function playMusic() {
  music.volume = .34;
  music.play().catch(()=>{});
}
function easeInCubic(t){return t*t*t}
function finishJourney(){
  if(finished)return; finished=true; flash.classList.add('on');
  setTimeout(()=>{
    experience.classList.add('hidden'); document.body.classList.remove('locked');
    main.hidden=false; header.hidden=false; document.documentElement.style.setProperty('--journey-done','1');
  },560);
}
function startJourney(){
  if(started)return; started=true; playMusic(); startPanel.classList.add('out'); journeyHud.hidden=false; skipButton.hidden=false; startTime=performance.now();
}
startButton.addEventListener('click',startJourney);
skipButton.addEventListener('click',finishJourney);

function animate(now){
  requestAnimationFrame(animate);
  const t = now * .001;
  tunnel.children.forEach((o,i)=>{o.rotation.z += o.userData.spin||0; if(o.userData.drift){o.position.y += Math.sin(t+i)*o.userData.drift; o.rotation.z += .002;}});
  memoryGroup.children.forEach((g,i)=>{g.position.x=g.userData.baseX+Math.sin(t*.9+g.userData.floatOffset)*.18;g.rotation.z+=(i%2?1:-1)*.00035;});
  stars.rotation.z=t*.002; point.position.x=Math.sin(t*.8)*1.5; point.position.y=Math.cos(t*.55)*1.0;

  if(started && !finished){
    const elapsed=now-startTime; const progress=Math.min(1,elapsed/totalDuration);
    const boosted = progress < .58 ? progress*.44 : .255 + easeInCubic((progress-.58)/.42)*.745;
    currentZ = 7 - boosted*415; camera.position.z=currentZ;
    camera.position.x=Math.sin(t*1.35)*(.08+progress*.26); camera.position.y=Math.cos(t*1.1)*(.07+progress*.2);
    point.position.z=currentZ-7;
    streakGroup.children.forEach(l=>{l.material.opacity=progress>.58 ? .24 + (progress-.58)*1.2 : .08;});
    if(hudIndex < hudMoments.length-1 && elapsed >= hudMoments[hudIndex+1][0]){hudIndex++;journeyTitle.textContent=hudMoments[hudIndex][1];journeySub.textContent=hudMoments[hudIndex][2];}
    if(progress>=1)finishJourney();
  }
  renderer.render(scene,camera);
}
requestAnimationFrame(animate);

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight,false);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));});

// If WebGL is unavailable, still let the page work.
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();finishJourney();},{once:true});
