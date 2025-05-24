import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';

// Configuration de la scène principale
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xececec); // Fond gris clair

// Configuration de la caméra
const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

// Configuration du renderer
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true 
});
renderer.setSize(canvas.width, canvas.height);

// Variables d'état pour les transitions
let transitionState = 'menu'; // États: 'menu', 'entering', 'white_room', 'approaching_portal', 'transitioning'
let whiteRoomReady = false;
let explanationStep = 0;

// Références vers les objets 3D principaux
let whiteRoom;
let portalMesh;

// Gestion du redimensionnement de la fenêtre
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

// Conteneur pour les éléments d'interface
const interfaceContainer = document.createElement('div');
interfaceContainer.style.position = 'absolute';
interfaceContainer.style.width = '100%';
interfaceContainer.style.height = '100%';
interfaceContainer.style.top = '0';
interfaceContainer.style.left = '0';
interfaceContainer.style.pointerEvents = 'none';
document.body.appendChild(interfaceContainer);

// Shader pour l'effet tunnel du portail
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
        
        float g(vec4 p, float s) {
            return abs(dot(sin(p *= s), cos(p.zxwy)) - 1.0) / s;
        }
        
        vec3 getGalleryPalette(float progress) {
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
            
            vec3 basePalette = getGalleryPalette(cameraProgress);
            
            // Génération de l'effet tunnel vertical
            for(float step = 0.0; step < 50.0; step++) {
                i = step;
                z += d + 0.001;
                q = vec4(normalize(vec3((C + C - r) / r.y, 2.0)) * z, 0.2);
                q.z += T / 20.0;
                s = q.y + 0.1;
                q.y = abs(s);
                p = q;
                p.y -= 0.11;
                
                // Tunnel droit sans rotation
                p.y -= 0.2;
                d = abs(g(p, 6.0) - g(p, 18.0)) / 3.0;
                
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
            
            // Ajout d'une lueur centrale
            float pulse = (1.2 + sin(T * 0.5) * sin(1.1 * T) * sin(1.6 * T)) * 600.0;
            vec2 center = q.xy;
            float centerDist = length(center);
            if(centerDist > 0.0) {
                vec4 centerGlow = vec4(basePalette + 0.05, 1.0);
                o += pulse * centerGlow / centerDist;
            }
            
            O = tanh(o / 80000.0);
            O.rgb = pow(O.rgb, vec3(0.9));
            
            if (blur > 0.1) {
                vec3 blurredColor = O.rgb * (1.0 - blur * 0.3);
                blurredColor = mix(blurredColor, basePalette, blur * 0.5);
                O.rgb = blurredColor;
            }
            
            vec3 finalColor = mix(vec3(0.1), O.rgb, portalIntensity);
            gl_FragColor = vec4(finalColor, portalIntensity);
        }
    `,
    transparent: true,
    side: THREE.DoubleSide
});

// Construction de la pièce blanche environnante
function createWhiteRoom() {
    const whiteRoomGroup = new THREE.Group();
    whiteRoomGroup.name = 'whiteRoom';
    
    // Dimensions de la pièce
    const roomSize = 16;
    const roomHeight = 8;
    const wallGeometry = new THREE.PlaneGeometry(roomSize, roomHeight);
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);
    
    // Matériaux pour les surfaces
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide,
        roughness: 0.9,
        metalness: 0.1
    });
    
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xf8f8f8,
        side: THREE.DoubleSide,
        roughness: 0.75,
        metalness: 0.05
    });
    
    // Construction des murs
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 0, -roomSize/2);
    whiteRoomGroup.add(backWall);
    
    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomSize/2, 0, 0);
    whiteRoomGroup.add(leftWall);
    
    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomSize/2, 0, 0);
    whiteRoomGroup.add(rightWall);
    
    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.rotation.y = Math.PI;
    frontWall.position.set(0, 0, roomSize/2);
    whiteRoomGroup.add(frontWall);
    
    // Sol et plafond
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -roomHeight/2, 0);
    whiteRoomGroup.add(floor);
    
    const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, roomHeight/2, 0);
    whiteRoomGroup.add(ceiling);
    
    // Système d'éclairage de la pièce
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    whiteRoomGroup.add(ambientLight);
    
    const mainLight = new THREE.PointLight(0xffffff, 0.8, 30);
    mainLight.position.set(0, roomHeight/2 - 1, 0);
    whiteRoomGroup.add(mainLight);
    
    // Éclairage d'ambiance dans les coins
    const cornerLights = [
        { x: roomSize/4, y: roomHeight/4, z: roomSize/4 },
        { x: -roomSize/4, y: roomHeight/4, z: roomSize/4 },
        { x: roomSize/4, y: roomHeight/4, z: -roomSize/4 },
        { x: -roomSize/4, y: roomHeight/4, z: -roomSize/4 }
    ];
    
    cornerLights.forEach(pos => {
        const light = new THREE.PointLight(0xf0f0ff, 0.3, 10);
        light.position.set(pos.x, pos.y, pos.z);
        whiteRoomGroup.add(light);
    });
    
    // Détails architecturaux
    const plinthGeometry = new THREE.BoxGeometry(roomSize, 0.05, 0.05);
    const plinthMaterial = new THREE.MeshStandardMaterial({
        color: 0xefefef,
        roughness: 0.7
    });
    
    const backPlinthe = new THREE.Mesh(plinthGeometry, plinthMaterial);
    backPlinthe.position.set(0, -roomHeight/2, -roomSize/2);
    whiteRoomGroup.add(backPlinthe);
    
    const frontPlinthe = new THREE.Mesh(plinthGeometry, plinthMaterial);
    frontPlinthe.position.set(0, -roomHeight/2, roomSize/2);
    whiteRoomGroup.add(frontPlinthe);
    
    const sidePlinthGeometry = new THREE.BoxGeometry(0.05, 0.05, roomSize);
    const leftPlinthe = new THREE.Mesh(sidePlinthGeometry, plinthMaterial);
    leftPlinthe.position.set(-roomSize/2, -roomHeight/2, 0);
    whiteRoomGroup.add(leftPlinthe);
    
    const rightPlinthe = new THREE.Mesh(sidePlinthGeometry, plinthMaterial);
    rightPlinthe.position.set(roomSize/2, -roomHeight/2, 0);
    whiteRoomGroup.add(rightPlinthe);
    
    whiteRoomGroup.visible = false;
    scene.add(whiteRoomGroup);
    
    return whiteRoomGroup;
}

// Système de textes explicatifs progressifs
function createExplanationTexts() {
    const explanations = [
        {
            title: "Bienvenue dans l'Expérience des Couleurs",
            text: "Vous êtes sur le point de découvrir les secrets de la perception visuelle.",
            duration: 3000
        },
        {
            title: "Qui sommes-nous ?",
            text: "Nous sommes deux étudiantes, Néha et Dounia. Ce projet a été réalisé dans le cadre d'un projet tuteuré universitaire pour vulgariser les concepts scientifiques complexes. ",
            duration: 4000
        },
        {
            title: "Notre Mission",
            text: "Comprendre pourquoi une même couleur peut paraître différente selon son environnement et comment votre cerveau interprète les couleurs.",
            duration: 4000
        },
        {
            title: "Ce que vous allez apprendre",
            text: "• Le contraste simultané de Michel-Eugène Chevreul\n• L'adaptation chromatique\n• L'effet du contexte sur la perception\n• Les mécanismes de la vision",
            duration: 5000
        },
        {
            title: "Prêt.e à commencer ?",
            text: "Appuyez sur ENTRÉE ou ESPACE pour traverser le portail vers l'expérience interactive.",
            duration: 0 // Reste affiché
        }
    ];
    
    let currentStep = 0;
    
    function showNextExplanation() {
        if (currentStep >= explanations.length) return;
        
        const explanation = explanations[currentStep];
        
        // Création dynamique du conteneur de texte
        const textElement = document.createElement('div');
        textElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 30px 40px;
            border-radius: 15px;
            font-family: "Segoe UI", Helvetica, Arial, sans-serif;
            text-align: center;
            max-width: 600px;
            opacity: 0;
            transition: opacity 1s ease;
            z-index: 100;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        `;
        
        textElement.innerHTML = `
            <h2 style="margin: 0 0 15px 0; font-size: 24px; color: #66D9EF;">${explanation.title}</h2>
            <p style="margin: 0; font-size: 16px; line-height: 1.5; white-space: pre-line;">${explanation.text}</p>
        `;
        
        document.body.appendChild(textElement);
        
        // Animation d'entrée
        setTimeout(() => {
            textElement.style.opacity = '1';
        }, 100);
        
        // Gestion de la disparition automatique
        if (explanation.duration > 0) {
            setTimeout(() => {
                textElement.style.opacity = '0';
                setTimeout(() => {
                    textElement.remove();
                    currentStep++;
                    showNextExplanation();
                }, 1000);
            }, explanation.duration);
        } else {
            // Le dernier texte reste affiché
            currentStep++;
            explanationStep = currentStep;
        }
    }
    
    // Démarrage des explications après un court délai
    setTimeout(() => {
        showNextExplanation();
    }, 1000);
}

// Fonction de transition principale vers la galerie
function startGalleryTransition() {
    console.log('Démarrage de la transition vers la pièce blanche');
    
    if (transitionState !== 'menu') return;
    transitionState = 'entering';
    
    // Masquage des éléments d'interface
    const bottomPanel = document.querySelector('div[style*="bottom: 0"]');
    const mainTitle = document.querySelector('div[style*="COLOR PERCEPTION"]');
    const menuButton = document.querySelector('div[style*="top: 20px"]');
    
    if (bottomPanel) {
        bottomPanel.style.opacity = '0';
        bottomPanel.style.transform = 'translateX(-50%) translateY(100%)';
        bottomPanel.style.transition = 'all 0.5s ease';
    }
    if (mainTitle) {
        mainTitle.style.opacity = '0';
        mainTitle.style.transform = 'translateX(-50%) translateY(-50px)';
        mainTitle.style.transition = 'all 0.5s ease';
    }
    if (menuButton) {
        menuButton.style.opacity = '0';
        menuButton.style.transition = 'all 0.5s ease';
    }
    
    controls.enabled = false;
    
    if (window.gsap) {
        // Animation de zoom vers le cube
        gsap.to(camera.position, {
            duration: 2.5,
            x: 0,
            y: 0.5,
            z: 0,
            ease: "power2.inOut",
            onComplete: () => {
                // Transition vers la pièce blanche
                const whiteOverlay = document.createElement('div');
                whiteOverlay.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: white; opacity: 0; z-index: 500;
                    transition: opacity 0.8s ease;
                `;
                document.body.appendChild(whiteOverlay);
                
                setTimeout(() => whiteOverlay.style.opacity = '1', 100);
                
                setTimeout(() => {
                    // Basculement vers la scène de la pièce blanche
                    cube.visible = false;
                    base.visible = false;
                    whiteRoom.visible = true;
                    portalMesh.visible = true;
                    
                    // Positionnement de la caméra pour voir le portail
                    camera.position.set(0, 0, 6);
                    camera.lookAt(0, 0, -4.5);
                    
                    transitionState = 'white_room';
                    whiteRoomReady = true;
                    
                    // Révélation progressive de la scène
                    setTimeout(() => {
                        whiteOverlay.style.opacity = '0';
                        setTimeout(() => {
                            whiteOverlay.remove();
                            // Animation d'apparition du portail
                            gsap.to(portalShaderMaterial.uniforms.portalIntensity, {
                                duration: 2,
                                value: 1.0,
                                ease: "power2.out"
                            });
                            // Lancement des explications
                            createExplanationTexts();
                        }, 800);
                    }, 300);
                }, 800);
            }
        });
    } else {
        // Version de secours sans GSAP
        setTimeout(() => {
            cube.visible = false;
            base.visible = false;
            whiteRoom.visible = true;
            portalMesh.visible = true;
            camera.position.set(0, 0, 6);
            camera.lookAt(0, 0, -4.5);
            transitionState = 'white_room';
            whiteRoomReady = true;
            portalShaderMaterial.uniforms.portalIntensity.value = 1.0;
            createExplanationTexts();
        }, 2500);
    }
}

// Fonction d'approche et traversée du portail
function startPortalApproach() {
    if (transitionState !== 'white_room') return;
    
    console.log('Approche du portail interdimensionnel');
    transitionState = 'approaching_portal';
    
    // Nettoyage des textes d'explication
    const explanationTexts = document.querySelectorAll('div[style*="backdrop-filter: blur(10px)"]');
    explanationTexts.forEach(text => text.remove());
    
    if (window.gsap) {
        const tl = gsap.timeline();
        
        // Phase d'approche
        tl.to(camera.position, {
            duration: 3,
            z: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                const progress = 1 - (camera.position.z - 1.5) / 2.5;
                portalShaderMaterial.uniforms.cameraProgress.value = progress * 0.3;
            }
        })
        
        // Phase de traversée
        .to(camera.position, {
            duration: 2,
            z: -2,
            ease: "power2.inOut",
            onUpdate: () => {
                const progress = Math.max(0, 1 - (camera.position.z + 2) / 3.5);
                portalShaderMaterial.uniforms.cameraProgress.value = 0.3 + progress * 0.7;
                portalShaderMaterial.uniforms.blur.value = progress * 3;
            }
        })
        
        // Transition finale vers la galerie
        .to({}, {
            duration: 1,
            onStart: () => {
                transitionState = 'transitioning';
                const finalOverlay = document.createElement('div');
                finalOverlay.style.cssText = `
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: black; opacity: 0; z-index: 9999;
                    transition: opacity 1.5s ease; display: flex;
                    align-items: center; justify-content: center;
                    color: white; font-size: 24px; font-family: "Segoe UI", sans-serif;
                `;
                finalOverlay.innerHTML = 'Transition vers la Galerie...';
                document.body.appendChild(finalOverlay);
                
                setTimeout(() => finalOverlay.style.opacity = '1', 100);
                setTimeout(() => {
                    window.location.href = 'gallery.html';
                }, 1500);
            }
        });
    } else {
        setTimeout(() => {
            window.location.href = 'gallery.html';
        }, 3000);
    }
}

// Initialisation de tous les éléments 3D
function initScene() {
    whiteRoom = createWhiteRoom();
    
    // Création du portail avec ses dimensions de porte
    const portalGeometry = new THREE.PlaneGeometry(3.2, 7.5, 64, 128);
    portalMesh = new THREE.Mesh(portalGeometry, portalShaderMaterial);
    portalMesh.position.set(0, -0.25, -6); // Positionné pour toucher le sol
    portalMesh.visible = false;
    scene.add(portalMesh);
    
    // Système d'éclairage du portail
    const portalLight = new THREE.PointLight(0x66D9EF, 3.0, 15);
    portalLight.position.set(0, 0, -5);
    portalLight.visible = false;
    scene.add(portalLight);
    
    window.portalLight = portalLight;
    
    const portalGlow = new THREE.PointLight(0x4DABF7, 2.0, 18);
    portalGlow.position.set(0, 0, -5.5);
    portalGlow.visible = false;
    scene.add(portalGlow);
    
    window.portalGlow = portalGlow;
    
    // Ombre projetée au sol
    const shadowPlane = new THREE.Mesh(
        new THREE.CircleGeometry(2.5, 32),
        new THREE.MeshBasicMaterial({
            color: 0x001122,
            transparent: true,
            opacity: 0.08,
            depthWrite: false
        })
    );
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -3.45, -6);
    shadowPlane.visible = false;
    scene.add(shadowPlane);
    
    window.portalShadow = shadowPlane;
    
    // Génération du système de particules
    createPortalParticles();
}

// Système de particules encadrant le portail
function createPortalParticles() {
    const particleCount = 450;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const velocities = [];
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Distribution spatiale des particules autour de la porte
        const distributionType = Math.random();
        let x, y, z;
        
        if (distributionType < 0.7) {
            // Particules formant le cadre de la porte
            const side = Math.random();
            if (side < 0.25) {
                // Montant gauche
                x = -1.8 - Math.random() * 0.8;
                y = -3.5 + Math.random() * 7;
                z = -6 + (Math.random() - 0.5) * 1.5;
            } else if (side < 0.5) {
                // Montant droit
                x = 1.8 + Math.random() * 0.8;
                y = -3.5 + Math.random() * 7;
                z = -6 + (Math.random() - 0.5) * 1.5;
            } else if (side < 0.75) {
                // Linteau supérieur
                x = (Math.random() - 0.5) * 4;
                y = 3.2 + Math.random() * 0.8;
                z = -6 + (Math.random() - 0.5) * 1.5;
            } else {
                // Seuil de la porte
                x = (Math.random() - 0.5) * 4;
                y = -3.8 + Math.random() * 0.6;
                z = -6 + (Math.random() - 0.5) * 1.5;
            }
        } else if (distributionType < 0.9) {
            // Particules en orbite élargie
            const angle = Math.random() * Math.PI * 2;
            const radius = 3.5 + Math.random() * 1.5;
            x = Math.cos(angle) * radius;
            y = -2 + Math.random() * 6;
            z = -6 + Math.sin(angle) * radius * 0.3;
        } else {
            // Particules d'ambiance éparses
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 2;
            x = Math.cos(angle) * radius;
            y = -1 + Math.random() * 4;
            z = -6 + Math.sin(angle) * radius * 0.4;
        }
        
        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;
        
        // Palette de couleurs variée pour les particules
        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
            // Particules cyan/turquoise (40%)
            colors[i3] = 0.1 + Math.random() * 0.2;     // Rouge faible
            colors[i3 + 1] = 0.7 + Math.random() * 0.3; // Vert dominant
            colors[i3 + 2] = 0.8 + Math.random() * 0.2; // Bleu intense
        } else if (colorChoice < 0.7) {
            // Particules magenta/violet (30%)
            colors[i3] = 0.6 + Math.random() * 0.4;     // Rouge moyen
            colors[i3 + 1] = 0.2 + Math.random() * 0.3; // Vert réduit
            colors[i3 + 2] = 0.8 + Math.random() * 0.2; // Bleu fort
        } else {
            // Particules dorées/orangées (30%)
            colors[i3] = 0.9 + Math.random() * 0.1;     // Rouge élevé
            colors[i3 + 1] = 0.6 + Math.random() * 0.3; // Vert moyen
            colors[i3 + 2] = 0.1 + Math.random() * 0.2; // Bleu minimal
        }
        
        // Paramètres de mouvement pour chaque particule
        velocities.push({
            x: (Math.random() - 0.5) * 0.025,
            y: (Math.random() - 0.5) * 0.025,
            z: (Math.random() - 0.5) * 0.015,
            angle: Math.random() * Math.PI * 2,
            speed: 0.002 + Math.random() * 0.012,
            originalX: x,
            originalY: y,
            verticalSpeed: (Math.random() - 0.5) * 0.015
        });
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.12,
        transparent: true,
        opacity: 0.85,
        vertexColors: true,
        blending: THREE.AdditiveBlending
    });
    
    const particleSystem = new THREE.Points(particles, particleMaterial);
   particleSystem.visible = false;
   scene.add(particleSystem);
   
   window.portalParticles = particleSystem;
   window.particleVelocities = velocities;
}

// Fonction d'animation des particules du portail
function animatePortal() {
   if (!window.portalParticles) return;
   
   // Animation continue des particules autour de la porte
   const positions = window.portalParticles.geometry.attributes.position.array;
   const velocities = window.particleVelocities;
   const time = Date.now() * 0.001;
   
   for (let i = 0; i < positions.length / 3; i++) {
       const i3 = i * 3;
       const v = velocities[i];
       
       // Mouvement orbital autour de la structure de porte
       v.angle += v.speed;
       
       // Ondulation subtile autour des positions de base
       const waveOffset = Math.sin(time * 0.6 + i * 0.04) * 0.15;
       
       // Maintien des particules dans leur zone avec mouvement fluide
       positions[i3] = v.originalX + Math.cos(v.angle + time * 0.3) * waveOffset;
       positions[i3 + 2] = -6 + Math.sin(v.angle + time * 0.2) * (waveOffset * 0.6);
       
       // Animation verticale pour les montants de la porte
       positions[i3 + 1] = v.originalY + Math.sin(time * 1.2 + v.angle) * 0.12;
       
       // Déplacement général pour maintenir la vivacité
       positions[i3] += v.x;
       positions[i3 + 1] += v.verticalSpeed * 0.8;
       positions[i3 + 2] += v.z;
       
       // Système de rebond pour garder les particules dans la zone
       if (positions[i3] < -7 || positions[i3] > 7) v.x = -v.x;
       if (positions[i3 + 1] < -5 || positions[i3 + 1] > 5) v.verticalSpeed = -v.verticalSpeed;
       if (positions[i3 + 2] < -9 || positions[i3 + 2] > -3) v.z = -v.z;
   }
   
   window.portalParticles.geometry.attributes.position.needsUpdate = true;
   
   // Animation de l'éclairage avec pulsation naturelle
   if (window.portalLight) {
       const lightPulse = 2.8 + 0.5 * Math.sin(time * 0.8);
       window.portalLight.intensity = lightPulse;
   }
   
   if (window.portalGlow) {
       const glowPulse = 1.8 + 0.4 * Math.sin(time * 0.6);
       window.portalGlow.intensity = glowPulse;
   }
   
   // Pulsation de l'ombre au sol
   if (window.portalShadow) {
       const shadowPulse = 1 + 0.12 * Math.sin(time * 0.7);
       window.portalShadow.scale.set(shadowPulse, shadowPulse, 1);
   }
}

// Gestion de la visibilité des éléments selon l'état
function updatePortalVisibility() {
   if (transitionState === 'white_room' || transitionState === 'approaching_portal' || transitionState === 'transitioning') {
       // Activation de tous les éléments du portail
       if (portalMesh) portalMesh.visible = true;
       if (window.portalLight) window.portalLight.visible = true;
       if (window.portalGlow) window.portalGlow.visible = true;
       if (window.portalShadow) window.portalShadow.visible = true;
       if (window.portalParticles) window.portalParticles.visible = true;
       if (cube) cube.visible = false;
       if (base) base.visible = false;
       
       // Lancement de l'animation du portail
       animatePortal();
   } else {
       // Mode menu - masquage du portail
       if (portalMesh) portalMesh.visible = false;
       if (window.portalLight) window.portalLight.visible = false;
       if (window.portalGlow) window.portalGlow.visible = false;
       if (window.portalShadow) window.portalShadow.visible = false;
       if (window.portalParticles) window.portalParticles.visible = false;
       if (cube) cube.visible = true;
       if (base) base.visible = true;
   }
}

// Construction de l'interface utilisateur principale
function createMenuElements() {
   // Titre principal en en-tête
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
   
   // Panneau de contrôle inférieur
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
   
   // Section contrôle audio
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
   
   // Section centrale d'information
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
   
   // Section de lancement du jeu
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
   
   // Gestionnaire d'événement pour le bouton de lancement
   playButton.addEventListener('click', (event) => {
       event.preventDefault();
       console.log('Lancement de l\'expérience demandé par l\'utilisateur');
       startGalleryTransition();
   });
   
   // Effets visuels au survol du bouton
   playButton.addEventListener('mouseenter', () => {
       playButton.style.backgroundColor = '#4CAF50';
       playButton.style.color = 'white';
       playButton.style.transform = 'scale(1.1)';
       playButton.style.transition = 'all 0.3s ease';
   });
   
   playButton.addEventListener('mouseleave', () => {
       playButton.style.backgroundColor = 'white';
       playButton.style.color = '#333';
       playButton.style.transform = 'scale(1)';
   });
   
   rightColumn.appendChild(playTitle);
   rightColumn.appendChild(playButton);
   
   // Assembly des colonnes dans le panneau
   bottomPanel.appendChild(leftColumn);
   bottomPanel.appendChild(centerColumn);
   bottomPanel.appendChild(rightColumn);
   
   // Menu de navigation principal
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
   
   // Éléments du menu déroulant
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
   
   // Gestion du menu déroulant
   menuButton.addEventListener('click', () => {
       if (menuPanel.style.display === 'none' || menuPanel.style.display === '') {
           menuPanel.style.display = 'flex';
       } else {
           menuPanel.style.display = 'none';
       }
   });
   
   // Intégration des éléments dans l'interface
   interfaceContainer.appendChild(mainTitle);
   interfaceContainer.appendChild(bottomPanel);
   interfaceContainer.appendChild(menuButton);
   interfaceContainer.appendChild(menuPanel);
   
   // Fermeture automatique du menu au clic extérieur
   document.addEventListener('click', (event) => {
       if (!menuButton.contains(event.target) && !menuPanel.contains(event.target)) {
           menuPanel.style.display = 'none';
       }
   });
}

// Socle de présentation pour le cube
const baseGeometry = new THREE.BoxGeometry(3, 0.3, 3);
const baseMaterial = new THREE.MeshStandardMaterial({ 
   color: 0xffffff,
   roughness: 0.2,
   metalness: 0.1
});
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -0.5;
scene.add(base);

// Configuration des contrôles de caméra
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

// Système d'éclairage de la scène principale
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Palette de couleurs pour les transitions du cube
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

// Shader personnalisé pour les effets visuels du cube
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
      
      // Implémentation du bruit de Perlin pour les déformations
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
          
          // Calcul des déformations basées sur la hauteur
          float yInfluence = (position.y + 1.0) / 2.0;
          
          // Génération des vagues de base
          float baseWaves = snoise(vec2(position.x * 10.0 + position.z * 10.0, position.y * 5.0 + time)) * 0.05;
          
          // Lignes horizontales périodiques
          float horizontalLines = sin(position.y * 50.0) * 0.03;
          
          // Combinaison des déformations
          vec3 displacement = normal * (baseWaves + horizontalLines * (1.0 - yInfluence * 0.8));
          
          // Effet interactif au contact de la souris
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
              
              // Génération d'ondes concentriques au point d'interaction
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
      uniform float colorTransition;
      
      varying vec2 vUv;
      varying vec3 vPosition;
      varying vec3 vNormal;
      
      void main() {
          // Gradient vertical de couleur
          float t = (vPosition.y + 1.0) / 2.0;
          
          // Effet de réflexion sur les arêtes
          float edgeEffect = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
          
          vec3 color = mix(bottomColor, topColor, t);
          
          // Ajout d'iridescence subtile
          color += vec3(0.05, 0.07, 0.1) * edgeEffect;
          
          // Zone d'influence interactive
          vec2 faceUV = vec2(0.0);
          if (abs(vNormal.z) > 0.9) {
              faceUV = vec2(vPosition.x, vPosition.y);
          } else if (abs(vNormal.x) > 0.9) {
              faceUV = vec2(vPosition.z, vPosition.y);
          } else if (abs(vNormal.y) > 0.9) {
              faceUV = vec2(vPosition.x, vPosition.z);
          }
          
          faceUV = faceUV * 0.5 + 0.5;
          
          // Effet de brillance au point d'interaction
          float distToMouse = distance(faceUV, mousePos);
          float glow = smoothstep(0.4, 0.0, distToMouse) * mouseInfluence * 0.3;
          
          color += vec3(0.2, 0.2, 0.3) * glow;
          
          gl_FragColor = vec4(color, 1.0);
      }
  `,
  side: THREE.DoubleSide
});

// Création du cube principal avec géométrie haute définition
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2, 64, 64, 64);
const cube = new THREE.Mesh(cubeGeometry, cubeShaderMaterial);
cube.position.y = 0.5;
scene.add(cube);

// Variables pour la gestion des interactions
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseIsOverCube = false;
let lastInteractionTime = 0;
let colorChangeReady = true;

// Fonction de transition entre les couleurs du cube
function transitionToNextColor() {
  if (!colorChangeReady || transitionState !== 'menu') return;
  
  currentColorIndex = (currentColorIndex + 1) % pastelColors.length;
  
  targetTopColor = pastelColors[currentColorIndex].top.clone();
  targetBottomColor = pastelColors[currentColorIndex].bottom.clone();
  
  // Animation de transition fluide
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

// Gestionnaire des interactions souris avec le cube
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
      
      // Calcul des coordonnées UV selon la face touchée
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

// Fonction d'animation personnalisée (alternative à GSAP)
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
      
      function update() {
        const now = Date.now();
        if (now >= startTime + duration * 1000) {
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

// Fonction d'interpolation pour les animations
function easeOutCubic(x) {
return 1 - Math.pow(1 - x, 3);
}

// Gestion des contrôles clavier dans la pièce blanche
document.addEventListener('keydown', (event) => {
if (transitionState === 'white_room' && whiteRoomReady && explanationStep >= 5) {
    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        startPortalApproach();
    }
}
});

// Boucle d'animation principale
function animate() {
 requestAnimationFrame(animate);
 
 // Mise à jour des temps pour les shaders
 cubeShaderMaterial.uniforms.time.value += 0.01;
 portalShaderMaterial.uniforms.iTime.value += 0.016;
 
 // Gestion de l'affichage selon l'état de l'application
 updatePortalVisibility();
 
 // Mise à jour des contrôles seulement en mode menu
 if (transitionState === 'menu') {
     controls.update();
 }
 
 renderer.render(scene, camera);
}

// Feuille de style intégrée
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

// Variables globales pour le débogage et l'accès externe
window.myCamera = camera;
window.myControls = controls;
window.getPortalState = () => ({ 
transitionState, 
whiteRoomReady,
explanationStep
});

// Fonction d'initialisation principale
function init() {
console.log('Système de portail dimensionnel - Initialisation');
console.log('Séquence d\'expérience:');
console.log('  1. Interface d\'accueil avec cube interactif');
console.log('  2. Transition par zoom vers la pièce blanche');
console.log('  3. Présentation du portail avec explications');
console.log('  4. Traversée vers la galerie interactive');

// Mise en place de la scène 3D
initScene();

// Construction de l'interface utilisateur
createMenuElements();

// Lancement de la boucle d'animation
animate();
}

// Point d'entrée de l'application
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', init);
} else {
init();
}
          