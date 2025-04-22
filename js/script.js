import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';

// Initialisation de la scène avec le canvas existant
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xececec); // Fond gris très clair comme Evolution of Trust

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

// Ajuster le renderer pour qu'il remplisse la fenêtre
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

// Création des éléments d'interface inspirée de Evolution of Trust
function createMenuElements() {
    // Titre principal en haut (comme Evolution of Trust)
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
    
    // Colonne de gauche
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
    
    // Colonne centrale
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
    subtitle.textContent = 'An interactive experience';
    
    centerColumn.appendChild(colorPerceptionTitle);
    centerColumn.appendChild(subtitle);
    
    // Colonne de droite
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
    playTitle.textContent = 'Start Game';
    
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
    playButton.innerHTML = '&#9654;';
    
    rightColumn.appendChild(playTitle);
    rightColumn.appendChild(playButton);
    
    // Ajouter colonnes au panneau
    bottomPanel.appendChild(leftColumn);
    bottomPanel.appendChild(centerColumn);
    bottomPanel.appendChild(rightColumn);
    
    // Menu en haut à gauche
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
    
    const menuItems = ['Home', 'About', 'Levels', 'Settings', 'Help'];
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

// Socle pour le cube (ajusté pour être plus haut)
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

// Éclairage pour un rendu réaliste
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Couleurs pastel à cycler
const pastelColors = [
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xffdddd) }, // Blanc-rose
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xddffdd) }, // Blanc-vert pastel
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xdde5ff) }, // Blanc-bleu pastel
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xf5ddff) }, // Blanc-lavande
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xfff2dd) }, // Blanc-pêche
    { top: new THREE.Color(0xffffff), bottom: new THREE.Color(0xe9ddff) }  // Blanc-violet pastel
];

let currentColorIndex = 0;
let targetTopColor = pastelColors[currentColorIndex].top.clone();
let targetBottomColor = pastelColors[currentColorIndex].bottom.clone();

// Créer le cube avec shader avancé pour les vagues
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
        
        // Fonction de bruit simplex 2D
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
            
            // Calculer l'influence de la vague basée sur l'axe Y
            float yInfluence = (position.y + 1.0) / 2.0; // 0 en bas, 1 en haut
            
            // Vagues de base (plus prononcées en bas)
            float baseWaves = snoise(vec2(position.x * 10.0 + position.z * 10.0, position.y * 5.0 + time)) * 0.05;
            
            // Vagues horizontales comme sur l'image
            float horizontalLines = sin(position.y * 50.0) * 0.03;
            
            // Déplacement combiné de base (vagues légères partout)
            vec3 displacement = normal * (baseWaves + horizontalLines * (1.0 - yInfluence * 0.8));
            
            // Effet d'onde concentrique autour de la position de la souris
            if (mouseInfluence > 0.0) {
                // Convertir la position actuelle en coordonnées UV de la face
                vec2 faceUV = vec2(0.0);
                
                if (abs(normal.z) > 0.9) {
                    // Face avant/arrière
                    faceUV = vec2(position.x, position.y);
                } else if (abs(normal.x) > 0.9) {
                    // Face gauche/droite
                    faceUV = vec2(position.z, position.y);
                } else if (abs(normal.y) > 0.9) {
                    // Face haut/bas
                    faceUV = vec2(position.x, position.z);
                }
                
                // Normaliser les coordonnées de -1,1 à 0,1
                faceUV = faceUV * 0.5 + 0.5;
                
                // Distance à la position de la souris sur la face
                float distToMouse = distance(faceUV, mousePos);
                
                // Onde concentrique autour du point de la souris - EFFET RENFORCÉ
                float waveRadius = 0.4; // Rayon plus large
                if (distToMouse < waveRadius) {
                    // Effet de vague renforcé
                    float waveStrength = (1.0 - distToMouse / waveRadius) * mouseInfluence * 0.4;
                    
                    // Plusieurs ondes concentriques (combinaison de fréquences)
                    float wave1 = sin((1.0 - distToMouse / waveRadius) * 15.0 - time * 2.0);
                    float wave2 = sin((1.0 - distToMouse / waveRadius) * 30.0 - time * 3.0) * 0.5;
                    
                    // Combiner les ondes pour un effet plus complexe
                    float combinedWave = wave1 + wave2;
                    
                    // Appliquer le déplacement de vague avec une amplitude plus importante
                    displacement += normal * combinedWave * waveStrength;
                }
            }
            
            // Appliquer le déplacement
            vec3 newPosition = position + displacement;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `,
    fragmentShader: `
        uniform vec3 topColor;
        uniform vec3 bottomColor;
        uniform float mouseInfluence;
        uniform vec2 mousePos;
        uniform float colorTransition;
        
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        
        void main() {
            // Dégradé vertical
            float t = (vPosition.y + 1.0) / 2.0; // 0 à 1 du bas vers le haut
            
            // Effet nacré, plus prononcé sur les bords
            float edgeEffect = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
            
            // Variation de couleur légère basée sur la position
            vec3 color = mix(bottomColor, topColor, t);
            
            // Ajouter une subtile iridescence
            color += vec3(0.05, 0.07, 0.1) * edgeEffect;
            
            // Zone d'influence du curseur (effet subtil de brillance)
            // Convertir la position en coordonnées UV de la face
            vec2 faceUV = vec2(0.0);
            if (abs(vNormal.z) > 0.9) {
                faceUV = vec2(vPosition.x, vPosition.y);
            } else if (abs(vNormal.x) > 0.9) {
                faceUV = vec2(vPosition.z, vPosition.y);
            } else if (abs(vNormal.y) > 0.9) {
                faceUV = vec2(vPosition.x, vPosition.z);
            }
            
            // Normaliser à 0-1
            faceUV = faceUV * 0.5 + 0.5;
            
            // Effet de brillance au point d'interaction
            float distToMouse = distance(faceUV, mousePos);
            float glow = smoothstep(0.4, 0.0, distToMouse) * mouseInfluence * 0.3;
            
            // Ajouter la brillance
            color += vec3(0.2, 0.2, 0.3) * glow;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `,
    side: THREE.DoubleSide
});

// Créer le cube avec une géométrie haute résolution pour les vagues
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2, 64, 64, 64);
const cube = new THREE.Mesh(cubeGeometry, cubeShaderMaterial);
cube.position.y = 0.5; // Positionner au-dessus du socle
scene.add(cube);

// Détection d'interaction avec le cube
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseIsOverCube = false;
let lastInteractionTime = 0;
let colorChangeReady = true;

// Fonction pour changer la couleur avec transition douce
function transitionToNextColor() {
    if (!colorChangeReady) return;
    
    // Avancer à la prochaine couleur
    currentColorIndex = (currentColorIndex + 1) % pastelColors.length;
    
    // Stocker les couleurs cibles
    targetTopColor = pastelColors[currentColorIndex].top.clone();
    targetBottomColor = pastelColors[currentColorIndex].bottom.clone();
    
    // Animation de transition de couleur
    const startTopColor = cubeShaderMaterial.uniforms.topColor.value.clone();
    const startBottomColor = cubeShaderMaterial.uniforms.bottomColor.value.clone();
    
    const duration = 1.0; // 1 seconde pour la transition
    const startTime = Date.now();
    const endTime = startTime + duration * 1000;
    
    colorChangeReady = false;
    
    function updateColor() {
        const now = Date.now();
        const progress = Math.min((now - startTime) / (duration * 1000), 1.0);
        const easedProgress = easeOutCubic(progress);
        
        // Interpoler les couleurs
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

// Gérer les mouvements de la souris
window.addEventListener('mousemove', (event) => {
    // Mettre à jour les coordonnées normalisées de la souris
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Utiliser raycaster pour voir si on survole le cube
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(cube);
    
    if (intersects.length > 0) {
        // Arrêter la rotation auto au survol
        controls.autoRotate = false;
        
        // Si on vient juste d'entrer sur le cube
        if (!mouseIsOverCube) {
            const now = Date.now();
            if (now - lastInteractionTime > 500) {
                transitionToNextColor();
                lastInteractionTime = now;
            }
        }
        
        mouseIsOverCube = true;
        
        // Obtenir le point d'intersection et la face
        const intersect = intersects[0];
        const face = intersect.face;
        const point = intersect.point;
        
        // Convertir le point d'intersection en coordonnées UV de la face
        let faceUV = new THREE.Vector2();
        
        // Déterminer la face et mapper correctement les coordonnées
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
        
        // Mettre à jour la position de la souris pour le shader
        cubeShaderMaterial.uniforms.mousePos.value.copy(faceUV);
        
        // Animation pour l'influence de la souris
        gsapLike(cubeShaderMaterial.uniforms.mouseInfluence, 'value', 1.0, 0.2);
        
        document.body.style.cursor = 'pointer';
    } else {
        // Réactiver la rotation auto
        controls.autoRotate = true;
        
        if (mouseIsOverCube) {
            mouseIsOverCube = false;
        }
        
        // Réduire l'influence de la souris
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
    
    // Mettre à jour le temps pour les animations de vagues
    cubeShaderMaterial.uniforms.time.value += 0.01;
    
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

// À la fin de script.js
window.myCamera = camera;
window.myControls = controls;

// Démarrer l'animation
animate();