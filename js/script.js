import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';

// Initialisation de la scène avec le canvas existant
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xececec);

// Ajustement pour utiliser les dimensions du canvas existant
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Utiliser le canvas existant
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true 
});
renderer.setSize(canvas.width, canvas.height);

// Variables pour l'effet portail
let isInsideCube = false;
let portalIntensity = 0;
let cameraInsideProgress = 0;
let transitionState = 'menu'; // 'menu', 'entering', 'portal', 'transitioning'


function updateRendererSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
}

updateRendererSize();
window.addEventListener('resize', updateRendererSize);

// Conteneur principal pour l'interface
const interfaceContainer = document.createElement('div');
interfaceContainer.style.position = 'absolute';
interfaceContainer.style.width = '100%';
interfaceContainer.style.height = '100%';
interfaceContainer.style.top = '0';
interfaceContainer.style.left = '0';
interfaceContainer.style.pointerEvents = 'none';
document.body.appendChild(interfaceContainer);

// Shader pour l'effet portail
const portalShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        portalIntensity: { value: 0 },
        cameraProgress: { value: 0 },
        blur: { value: 0 }
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float iTime;
        uniform vec2 iResolution;
        uniform float portalIntensity;
        uniform float cameraProgress;
        uniform float blur;
        varying vec2 vUv;
        
        // Simplifié du shader fourni - Effet tunnel galerie
        float g(vec4 p, float s) {
            return abs(dot(sin(p *= s), cos(p.zxwy)) - 1.0) / s;
        }
        
        vec3 getGalleryPalette(float progress) {
            // Rose doux vers bleu clair vers vert menthe vers lavande
            if (progress < 0.25) {
                return mix(vec3(0.95, 0.85, 0.90), vec3(0.85, 0.90, 0.98), progress * 4.0);
            } else if (progress < 0.5) {
                return mix(vec3(0.85, 0.90, 0.98), vec3(0.88, 0.95, 0.90), (progress - 0.25) * 4.0);
            } else if (progress < 0.75) {
                return mix(vec3(0.88, 0.95, 0.90), vec3(0.92, 0.88, 0.98), (progress - 0.5) * 4.0);
            } else {
                return vec3(0.92, 0.88, 0.98);
            }
        }
        
        void main() {
            vec4 O;
            vec2 C = vUv * iResolution.xy;
            
            float i = 0.0, d = 0.0, z = 0.0, s = 0.0;
            float T = iTime + cameraProgress * 5.0;
            vec4 o = vec4(0.0), q, p;
            vec4 U = vec4(2.0, 1.0, 0.0, 3.0);
            vec2 r = iResolution.xy;
            
            // Palette de couleur évoluant avec la progression
            vec3 basePalette = getGalleryPalette(cameraProgress);
            
            // Effet tunnel simplifié
            for(float step = 0.0; step < 50.0; step++) {
                i = step;
                z += d + 0.001;
                q = vec4(normalize(vec3((C + C - r) / r.y, 2.0)) * z, 0.2);
                q.z += T / 20.0;
                s = q.y + 0.1;
                q.y = abs(s);
                p = q;
                p.y -= 0.11;
                
                // Rotation pour effet tunnel
                float angle = 11.0 * 2.0 - 2.0 * p.z;
                float c1 = cos(angle);
                float s1 = sin(angle);
                
                vec2 temp = p.xy;
                p.x = temp.x * c1 - temp.y * s1;
                p.y = temp.x * s1 + temp.y * c1;
                
                p.y -= 0.2;
                d = abs(g(p, 6.0) - g(p, 18.0)) / 3.0;
                
                // Couleurs pastel évolutives
                vec4 pastelColors = vec4(
                    basePalette.r + 0.1 * cos(0.8 * U.x + 3.0 * q.z + iTime * 0.3),
                    basePalette.g + 0.1 * cos(0.6 * U.y + 4.0 * q.z + iTime * 0.4), 
                    basePalette.b + 0.1 * cos(0.4 * U.z + 5.0 * q.z + iTime * 0.2),
                    0.9 + 0.1 * cos(0.5 * U.w + 6.0 * q.z + iTime * 0.1)
                );
                
                p = pastelColors;
                
                float multiplier = (s > 0.0 ? 1.0 : 0.1) * p.w;
                float denominator = max(s > 0.0 ? d : d*d*d, 0.001);
                o += multiplier * p / denominator;
            }
            
            // Lueur centrale
            float pulse = (1.2 + sin(T * 0.5) * sin(1.1 * T) * sin(1.6 * T)) * 600.0;
            vec2 center = q.xy;
            float centerDist = length(center);
            if(centerDist > 0.0) {
                vec4 centerGlow = vec4(basePalette + 0.05, 1.0);
                o += pulse * centerGlow / centerDist;
            }
            
            // Tone mapping
            O = tanh(o / 80000.0);
            O.rgb = pow(O.rgb, vec3(0.9));
            
            // Appliquer le flou progressif
            vec2 blurOffset = vec2(blur * 0.01);
            vec3 blurredColor = O.rgb;
            if (blur > 0.1) {
                // Simulation de flou simple
                blurredColor *= (1.0 - blur * 0.3);
                blurredColor = mix(blurredColor, basePalette, blur * 0.5);
            }
            
            // Mélanger avec l'intensité du portail
            vec3 finalColor = mix(vec3(0.1), blurredColor, portalIntensity);
            
            gl_FragColor = vec4(finalColor, portalIntensity);
        }
    `,
    transparent: true,
    side: THREE.DoubleSide
});

// FONCTION MODIFIÉE : Transition vers la galerie avec effet portail
function startGalleryTransition() {
    console.log('🌀 Démarrage de la transition portail vers la galerie');
    
    if (transitionState !== 'menu') return;
    transitionState = 'entering';
    
    // Désactiver les contrôles pendant la transition
    controls.enabled = false;
    
    // Position initiale de la caméra
    const startPosition = camera.position.clone();
    
    // Phase 1: Se rapprocher du cube et révéler le portail
    if (window.gsap) {
        console.log('🎬 Animation GSAP : Entrée dans le cube portail');
        
        const tl = gsap.timeline();
        
        // Phase 1: Se rapprocher et révéler le portail
        tl.to(camera.position, {
            duration: 2,
            x: 0,
            y: 0.5,
            z: 2.5,
            ease: "power2.inOut"
        })
        .to(portalShaderMaterial.uniforms.portalIntensity, {
            duration: 1.5,
            value: 1.0,
            ease: "power2.out"
        }, 0.5)
        
        // Phase 2: Entrer dans le cube
        .to(camera.position, {
            duration: 2,
            z: 1,
            ease: "power2.inOut",
            onStart: () => {
                transitionState = 'portal';
                isInsideCube = true;
            }
        })
        
        // Phase 3: Progression dans le portail avec flou
        .to({}, {
            duration: 3,
            onUpdate: function() {
                const progress = this.progress();
                cameraInsideProgress = progress;
                portalShaderMaterial.uniforms.cameraProgress.value = progress;
                portalShaderMaterial.uniforms.blur.value = progress * 2;
                
                // Caméra avance dans le tunnel
                camera.position.z = 1 - progress * 2;
            },
            ease: "power2.inOut"
        })
        
        // Phase 4: Transition finale vers la galerie
        .to({}, {
            duration: 1,
            onStart: () => {
                transitionState = 'transitioning';
                // Créer l'overlay de transition
                const transitionOverlay = document.createElement('div');
                transitionOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, transparent 0%, black 70%);
                    opacity: 0;
                    z-index: 9999;
                    transition: opacity 1.5s ease-in-out;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 24px;
                    font-family: "Segoe UI", Helvetica, Arial, sans-serif;
                    pointer-events: none;
                `;
                transitionOverlay.innerHTML = '🌀 Entering the Gallery Portal...';
                document.body.appendChild(transitionOverlay);
                
                setTimeout(() => transitionOverlay.style.opacity = '1', 100);
                
                setTimeout(() => {
                    console.log('✨ Transition vers gallery.html');
                    window.location.href = 'gallery.html';
                }, 1500);
            }
        });
        
    } else {
        console.log('🔄 Animation fallback : Transition portail');
        
        // Fallback sans GSAP
        let progress = 0;
        const duration = 6000; // 6 secondes total
        const startTime = Date.now();
        
        function animatePortal() {
            const elapsed = Date.now() - startTime;
            progress = Math.min(elapsed / duration, 1);
            
            if (progress < 0.3) {
                // Approche du cube
                const t = progress / 0.3;
                camera.position.z = startPosition.z * (1 - t) + 2.5 * t;
                portalShaderMaterial.uniforms.portalIntensity.value = t;
            } else if (progress < 0.6) {
                // Entrée dans le cube
                const t = (progress - 0.3) / 0.3;
                camera.position.z = 2.5 * (1 - t) + 1 * t;
                if (!isInsideCube) {
                    isInsideCube = true;
                    transitionState = 'portal';
                }
            } else {
                // Dans le portail
                const t = (progress - 0.6) / 0.4;
                cameraInsideProgress = t;
                portalShaderMaterial.uniforms.cameraProgress.value = t;
                portalShaderMaterial.uniforms.blur.value = t * 2;
                camera.position.z = 1 - t * 2;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animatePortal);
            } else {
                // Transition finale
                const overlay = document.createElement('div');
                overlay.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: black; opacity: 0; z-index: 9999;
                    transition: opacity 1s ease; display: flex;
                    align-items: center; justify-content: center;
                    color: white; font-size: 24px;
                `;
                overlay.innerHTML = '🌀 Portal Transition...';
                document.body.appendChild(overlay);
                
                setTimeout(() => overlay.style.opacity = '1', 100);
                setTimeout(() => window.location.href = 'gallery.html', 1000);
            }
        }
        
        animatePortal();
    }
}

// Création des éléments d'interface (identique mais avec le nouveau bouton)
function createMenuElements() {
    // Titre principal
    const mainTitle = document.createElement('div');
    mainTitle.style.position = 'absolute';
    mainTitle.style.top = '5%';
    mainTitle.style.left = '50%';
    mainTitle.style.transform = 'translateX(-50%)';
    mainTitle.style.color = 'white';
    mainTitle.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    mainTitle.style.fontSize = '38px';
    mainTitle.style.fontWeight = '600';
    mainTitle.style.letterSpacing = '3px';
    mainTitle.style.textAlign = 'center';
    mainTitle.style.textTransform = 'uppercase';
    mainTitle.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)';
    mainTitle.style.zIndex = '100';
    mainTitle.textContent = 'COLOR PERCEPTION';
    
    // Panneau inférieur
    const bottomPanel = document.createElement('div');
    bottomPanel.style.position = 'absolute';
    bottomPanel.style.bottom = '0';
    bottomPanel.style.left = '50%';
    bottomPanel.style.transform = 'translateX(-50%)';
    bottomPanel.style.width = '80%';
    bottomPanel.style.height = '120px';
    bottomPanel.style.backgroundColor = 'white';
    bottomPanel.style.borderTopLeftRadius = '15px';
    bottomPanel.style.borderTopRightRadius = '15px';
    bottomPanel.style.boxShadow = '0 -2px 10px rgba(0,0,0,0.1)';
    bottomPanel.style.display = 'flex';
    bottomPanel.style.justifyContent = 'space-around';
    bottomPanel.style.alignItems = 'center';
    bottomPanel.style.padding = '10px 30px';
    bottomPanel.style.zIndex = '90';
    
    // Colonne de gauche (Sound)
    const leftColumn = document.createElement('div');
    leftColumn.style.display = 'flex';
    leftColumn.style.flexDirection = 'column';
    leftColumn.style.alignItems = 'center';
    leftColumn.style.justifyContent = 'center';
    leftColumn.style.textAlign = 'center';
    leftColumn.style.width = '25%';
    
    const soundTitle = document.createElement('div');
    soundTitle.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    soundTitle.style.fontSize = '16px';
    soundTitle.style.color = '#333';
    soundTitle.style.marginBottom = '10px';
    soundTitle.textContent = 'Sound Control';
    
    const soundButton = document.createElement('div');
    soundButton.style.width = '50px';
    soundButton.style.height = '50px';
    soundButton.style.borderRadius = '50%';
    soundButton.style.backgroundColor = 'white';
    soundButton.style.border = '2px solid #e0e0e0';
    soundButton.style.display = 'flex';
    soundButton.style.alignItems = 'center';
    soundButton.style.justifyContent = 'center';
    soundButton.style.cursor = 'pointer';
    soundButton.style.pointerEvents = 'auto';
    soundButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    soundButton.innerHTML = '&#128266;';
    
    leftColumn.appendChild(soundTitle);
    leftColumn.appendChild(soundButton);
    
    // Colonne centrale (Titre)
    const centerColumn = document.createElement('div');
    centerColumn.style.display = 'flex';
    centerColumn.style.flexDirection = 'column';
    centerColumn.style.alignItems = 'center';
    centerColumn.style.justifyContent = 'center';
    centerColumn.style.textAlign = 'center';
    centerColumn.style.width = '50%';
    
    const colorPerceptionTitle = document.createElement('div');
    colorPerceptionTitle.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    colorPerceptionTitle.style.fontSize = '24px';
    colorPerceptionTitle.style.fontWeight = 'bold';
    colorPerceptionTitle.style.color = '#333';
    colorPerceptionTitle.style.letterSpacing = '2px';
    colorPerceptionTitle.textContent = 'COLOR PERCEPTION';
    
    const subtitle = document.createElement('div');
    subtitle.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    subtitle.style.fontSize = '14px';
    subtitle.style.color = '#666';
    subtitle.style.marginTop = '5px';
    subtitle.textContent = 'An interactive portal experience';
    
    centerColumn.appendChild(colorPerceptionTitle);
    centerColumn.appendChild(subtitle);
    
    // Colonne de droite (Play - Portal)
    const rightColumn = document.createElement('div');
    rightColumn.style.display = 'flex';
    rightColumn.style.flexDirection = 'column';
    rightColumn.style.alignItems = 'center';
    rightColumn.style.justifyContent = 'center';
    rightColumn.style.textAlign = 'center';
    rightColumn.style.width = '25%';
    
    const playTitle = document.createElement('div');
    playTitle.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    playTitle.style.fontSize = '16px';
    playTitle.style.color = '#333';
    playTitle.style.marginBottom = '10px';
    playTitle.textContent = 'Enter Portal';
    
    const playButton = document.createElement('div');
    playButton.style.width = '50px';
    playButton.style.height = '50px';
    playButton.style.borderRadius = '50%';
    playButton.style.backgroundColor = 'white';
    playButton.style.border = '2px solid #e0e0e0';
    playButton.style.display = 'flex';
    playButton.style.alignItems = 'center';
    playButton.style.justifyContent = 'center';
    playButton.style.cursor = 'pointer';
    playButton.style.pointerEvents = 'auto';
    playButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    playButton.innerHTML = '🌀'; // Icône portail
    
    // EVENT LISTENER pour lancer le portail
    playButton.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('🌀 Bouton Portal cliqué');
        startGalleryTransition();
    });
    
    // Effet hover amélioré pour le portail
    playButton.addEventListener('mouseenter', () => {
        playButton.style.backgroundColor = '#667eea';
        playButton.style.color = 'white';
        playButton.style.transform = 'scale(1.1) rotate(180deg)';
        playButton.style.transition = 'all 0.5s ease';
        playButton.style.boxShadow = '0 0 20px rgba(102, 126, 234, 0.5)';
    });
    
    playButton.addEventListener('mouseleave', () => {
        playButton.style.backgroundColor = 'white';
        playButton.style.color = '#333';
        playButton.style.transform = 'scale(1) rotate(0deg)';
        playButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    });
    
    rightColumn.appendChild(playTitle);
    rightColumn.appendChild(playButton);
    
    // Ajouter colonnes au panneau
    bottomPanel.appendChild(leftColumn);
    bottomPanel.appendChild(centerColumn);
    bottomPanel.appendChild(rightColumn);
    
    // Menu en haut à gauche (identique)
    const menuButton = document.createElement('div');
    menuButton.style.position = 'absolute';
    menuButton.style.top = '20px';
    menuButton.style.left = '20px';
    menuButton.style.width = '40px';
    menuButton.style.height = '40px';
    menuButton.style.backgroundColor = 'white';
    menuButton.style.borderRadius = '50%';
    menuButton.style.display = 'flex';
    menuButton.style.alignItems = 'center';
    menuButton.style.justifyContent = 'center';
    menuButton.style.cursor = 'pointer';
    menuButton.style.pointerEvents = 'auto';
    menuButton.style.zIndex = '100';
    menuButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    menuButton.innerHTML = '☰';
    
    const menuPanel = document.createElement('div');
    menuPanel.style.position = 'absolute';
    menuPanel.style.top = '70px';
    menuPanel.style.left = '20px';
    menuPanel.style.backgroundColor = 'white';
    menuPanel.style.borderRadius = '10px';
    menuPanel.style.display = 'none';
    menuPanel.style.flexDirection = 'column';
    menuPanel.style.padding = '10px 0';
    menuPanel.style.zIndex = '100';
    menuPanel.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    
    const menuItems = ['Home', 'About', 'Portal Gallery', 'Settings', 'Help'];
    menuItems.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
        menuItem.style.fontSize = '16px';
        menuItem.style.padding = '10px 20px';
        menuItem.style.cursor = 'pointer';
        menuItem.style.pointerEvents = 'auto';
        menuItem.style.transition = 'background-color 0.2s';
        menuItem.textContent = item;
        
        menuItem.addEventListener('mouseover', () => {
            menuItem.style.backgroundColor = '#f5f5f5';
        });
        
        menuItem.addEventListener('mouseout', () => {
            menuItem.style.backgroundColor = 'white';
        });
        
        menuPanel.appendChild(menuItem);
    });
    
    menuButton.addEventListener('click', () => {
        if (menuPanel.style.display === 'none' || menuPanel.style.display === '') {
            menuPanel.style.display = 'flex';
        } else {
            menuPanel.style.display = 'none';
        }
    });
    
    // Ajouter éléments à l'interface
    interfaceContainer.appendChild(mainTitle);
    interfaceContainer.appendChild(bottomPanel);
    interfaceContainer.appendChild(menuButton);
    interfaceContainer.appendChild(menuPanel);
    
    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !menuPanel.contains(event.target)) {
            menuPanel.style.display = 'none';
        }
    });
}

// Socle pour le cube
const baseGeometry = new THREE.BoxGeometry(3, 0.3, 3);
const baseMaterial = new THREE.MeshStandardMaterial({ 
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1
});
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -0.5;
scene.add(base);

// Contrôles OrbitControls limités
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2.5;
controls.update();

// Éclairage
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Couleurs pastel pour le cube extérieur
const pastelColors = [
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xffdddd) },
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xddffdd) },
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xdde5ff) },
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xf5ddff) },
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xfff2dd) },
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xe9ddff) }
];

let currentColorIndex = 0;
let targetTopColor = pastelColors[currentColorIndex].top.clone();
let targetBottomColor = pastelColors[currentColorIndex].bottom.clone();

// Shader pour l'extérieur du cube (mode menu)
const cubeShaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        mousePos: { value: new THREE.Vector2(0.5, 0.5) },
        mouseInfluence: { value: 0 },
        topColor: { value: new THREE.Color(0xffffff) },
        bottomColor: { value: new THREE.Color(0xffdddd) },
        colorTransition: { value: 0.0 }
    },
    vertexShader: `
        uniform float time;
        uniform vec2 mousePos;
        uniform float mouseInfluence;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }

        float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                              -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy));
            vec2 x0 = v -   i + dot(i, C.xx);
            vec2 i1;
            i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec4 x12 = x0.xyxy + C.xxzz;
            x12.xy -= i1;
            i = mod(i, 289.0);
            vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                           + i.x + vec3(0.0, i1.x, 1.0));
            vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                                  dot(x12.zw, x12.zw)), 0.0);
            m = m*m;
            m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * x12.xz + h.yz * x12.yw;
            return 130.0 * dot(m, g);
        }
        
        void main() {
            vUv = uv;
            vPosition = position;
            vNormal = normal;
            
            float yInfluence = (position.y + 1.0) / 2.0;
            float baseWaves = snoise(vec2(position.x * 10.0 + position.z * 10.0, position.y * 5.0 + time)) * 0.05;
            float horizontalLines = sin(position.y * 50.0) * 0.03;
            
            vec3 displacement = normal * (baseWaves + horizontalLines * (1.0 - yInfluence * 0.8));
            
            if (mouseInfluence > 0.0) {
                vec2 faceUV = vec2(0.0);
                
                if (abs(normal.z) > 0.9) {
                    faceUV = vec2(position.x, position.y);
                } else if (abs(normal.x) > 0.9) {
                    faceUV = vec2(position.z, position.y);
                } else if (abs(normal.y) > 0.9) {
                    faceUV = vec2(position.x, position.z);
                }
                
                faceUV = faceUV * 0.5 + 0.5;
                float distToMouse = distance(faceUV, mousePos);
                float waveRadius = 0.4;
                if (distToMouse < waveRadius) {
                    float waveStrength = (1.0 - distToMouse / waveRadius) * mouseInfluence * 0.4;
                    float wave1 = sin((1.0 - distToMouse / waveRadius) * 15.0 - time * 2.0);
                    float wave2 = sin((1.0 - distToMouse / waveRadius) * 30.0 - time * 3.0) * 0.5;
                    float combinedWave = wave1 + wave2;
                    displacement += normal * combinedWave * waveStrength;
                }
            }
            
            vec3 newPosition = position + displacement;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float mouseInfluence;
        uniform vec2 mousePos;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            float t = (vPosition.y + 1.0) / 2.0;
            float edgeEffect = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
            vec3 color = mix(bottomColor, topColor, t);
            color += vec3(0.05, 0.07, 0.1) * edgeEffect;
            
            vec2 faceUV = vec2(0.0);
            if (abs(vNormal.z) > 0.9) {
                faceUV = vec2(vPosition.x, vPosition.y);
            } else if (abs(vNormal.x) > 0.9) {
                faceUV = vec2(vPosition.z, vPosition.y);
            } else if (abs(vNormal.y) > 0.9) {
                faceUV = vec2(vPosition.x, vPosition.z);
            }
            
            faceUV = faceUV * 0.5 + 0.5;
            float distToMouse = distance(faceUV, mousePos);
            float glow = smoothstep(0.4, 0.0, distToMouse) * mouseInfluence * 0.3;
            color += vec3(0.2, 0.2, 0.3) * glow;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    side: THREE.DoubleSide
});

// Créer le cube principal avec géométrie haute résolution
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2, 64, 64, 64);
const cube = new THREE.Mesh(cubeGeometry, cubeShaderMaterial);
cube.position.y = 0.5;
scene.add(cube);

// NOUVEAU : Créer un plan pour l'effet portail à l'intérieur du cube
const portalGeometry = new THREE.PlaneGeometry(1.8, 1.8);
const portalMesh = new THREE.Mesh(portalGeometry, portalShaderMaterial);
portalMesh.position.set(0, 0.5, 0); // Au centre du cube
portalMesh.visible = false; // Invisible au début
scene.add(portalMesh);

// Variables pour l'interaction
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseIsOverCube = false;
let lastInteractionTime = 0;
let colorChangeReady = true;

// Fonction pour changer la couleur du cube extérieur
function transitionToNextColor() {
    if (!colorChangeReady || transitionState !== 'menu') return;
    
    currentColorIndex = (currentColorIndex + 1) % pastelColors.length;
    targetTopColor = pastelColors[currentColorIndex].top.clone();
    targetBottomColor = pastelColors[currentColorIndex].bottom.clone();
    
    const startTopColor = cubeShaderMaterial.uniforms.topColor.value.clone();
    const startBottomColor = cubeShaderMaterial.uniforms.bottomColor.value.clone();
    
    const duration = 1.0;
    const startTime = Date.now();
    colorChangeReady = false;
    
    function updateColor() {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1.0);
        const easedProgress = easeOutCubic(progress);
        
        cubeShaderMaterial.uniforms.topColor.value.lerpColors(
            startTopColor, 
            targetTopColor, 
            easedProgress
        );
        
        cubeShaderMaterial.uniforms.bottomColor.value.lerpColors(
            startBottomColor, 
            targetBottomColor, 
            easedProgress
        );
        
        if (progress < 1.0) {
            requestAnimationFrame(updateColor);
        } else {
            colorChangeReady = true;
        }
    }
    
    updateColor();
}

// Gestion des mouvements de souris
window.addEventListener('mousemove', (event) => {
    if (transitionState !== 'menu') return;
    
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);
    
    if (intersects.length > 0) {
        controls.autoRotate = false;
        
        if (!mouseIsOverCube) {
            const now = Date.now();
            if (now - lastInteractionTime > 500) {
                transitionToNextColor();
                lastInteractionTime = now;
            }
        }
        
        mouseIsOverCube = true;
        
        const intersect = intersects[0];
        const face = intersect.face;
        const point = intersect.point;
        
        let faceUV = new THREE.Vector2();
        
        if (Math.abs(face.normal.z) > 0.9) {
            faceUV.x = (point.x + 1) * 0.5;
            faceUV.y = (point.y + 1) * 0.5;
        } else if (Math.abs(face.normal.x) > 0.9) {
            faceUV.x = (point.z + 1) * 0.5;
            faceUV.y = (point.y + 1) * 0.5;
        } else if (Math.abs(face.normal.y) > 0.9) {
            faceUV.x = (point.x + 1) * 0.5;
            faceUV.y = (point.z + 1) * 0.5;
        }
        
        cubeShaderMaterial.uniforms.mousePos.value.copy(faceUV);
        gsapLike(cubeShaderMaterial.uniforms.mouseInfluence, 'value', 1.0, 0.2);
        
        document.body.style.cursor = 'pointer';
    } else {
        controls.autoRotate = true;
        
        if (mouseIsOverCube) {
            mouseIsOverCube = false;
        }
        
        gsapLike(cubeShaderMaterial.uniforms.mouseInfluence, 'value', 0.0, 0.5);
        document.body.style.cursor = 'default';
    }
});

// Animation GSAP ou alternative
function gsapLike(object, property, targetValue, duration) {
    if (window.gsap) {
        gsap.to(object, {
            duration: duration,
            [property]: targetValue,
            ease: "power2.out"
        });
    } else {
        const startValue = object[property];
        const startTime = Date.now();
        const endTime = startTime + duration * 1000;
        
        function update() {
            const now = Date.now();
            if (now >= endTime) {
                object[property] = targetValue;
                return;
            }
            
            const progress = (now - startTime) / (duration * 1000);
            const easedProgress = easeOutCubic(progress);
            object[property] = startValue + (targetValue - startValue) * easedProgress;
            
            requestAnimationFrame(update);
        }
        
        update();
    }
}

// Fonction d'easing
function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

// Animation principale
function animate() {
    requestAnimationFrame(animate);
    
    // Mettre à jour le temps pour les shaders
    cubeShaderMaterial.uniforms.time.value += 0.01;
    portalShaderMaterial.uniforms.iTime.value += 0.016;
    
    // Gestion de l'état du portail selon la progression
    if (transitionState === 'portal' || transitionState === 'transitioning') {
        // Rendre le portail visible et ajuster l'opacité du cube
        portalMesh.visible = true;
        cube.material.transparent = true;
        cube.material.opacity = Math.max(0.3, 1 - portalShaderMaterial.uniforms.portalIntensity.value);
        
        // Orienter le portail vers la caméra
        portalMesh.lookAt(camera.position);
        
        // Animation du portail
        portalMesh.rotation.z += 0.01;
    } else {
        // Mode menu normal
        portalMesh.visible = false;
        cube.material.transparent = false;
        cube.material.opacity = 1;
    }
    
    controls.update();
    renderer.render(scene, camera);
}

// Créer les éléments d'interface
createMenuElements();

// Styles CSS
const style = document.createElement('style');
style.innerHTML = `
    body, html {
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        font-family: "Segoe UI", Helvetica, Arial, sans-serif;
    }
    #canvas {
        display: block;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
    }
`;
document.head.appendChild(style);

// Variables globales pour le debug
window.myCamera = camera;
window.myControls = controls;
window.portalState = () => ({ transitionState, isInsideCube, portalIntensity, cameraInsideProgress });

console.log('🌀 Cube Portal System Ready');
console.log('🎮 Click "Enter Portal" to start the gallery transition');
console.log('🔍 Debug: window.portalState() pour voir l\'état du portail');

// Démarrer l'animation
animate();