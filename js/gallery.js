// État de la galerie
let currentCheckpoint = 0;
const totalCheckpoints = 4;
let isTransitioning = false;
let currentMiniGame = null;

// Configuration des checkpoints
const checkpoints = [
    {
        title: "Introduction au Contraste",
        description: "Découvrez comment notre perception des couleurs est influencée par leur environnement.",
        position: 0,
        explanation: {
            title: "Le Contraste Simultané",
            content: `
                <p>Nos yeux ne voient pas les couleurs de manière absolue, mais relative à leur environnement.</p>
                <p>Une même couleur peut paraître plus claire ou plus foncée selon ce qui l'entoure.</p>
                <p>Ce phénomène, découvert par Michel-Eugène Chevreul au XIXe siècle, explique pourquoi les artistes utilisent des couleurs complémentaires.</p>
            `
        },
        miniGameType: "contrast-comparison"
    },
    {
        title: "Contraste Simultané",
        description: "Explorez comment une même couleur peut sembler différente selon son contexte.",
        position: 10,
        explanation: {
            title: "L'Illusion de Luminosité",
            content: `
                <p>Regardez ces deux carrés gris. Ils vous semblent différents ?</p>
                <p>En réalité, ils sont exactement de la même couleur !</p>
                <p>C'est votre cerveau qui interprète différemment la même information selon le contexte.</p>
            `
        },
        miniGameType: "brightness-illusion"
    },
    {
        title: "Adaptation Chromatique",
        description: "Comprenez comment notre œil s'adapte aux différentes sources lumineuses.",
        position: 20,
        explanation: {
            title: "La Balance des Blancs Naturelle",
            content: `
                <p>Votre œil ajuste automatiquement sa perception selon l'éclairage ambiant.</p>
                <p>Un objet blanc reste "blanc" que vous soyez sous le soleil ou sous une ampoule.</p>
                <p>Cette adaptation chromatique est la raison pour laquelle les photos peuvent paraître "trop jaunes" ou "trop bleues".</p>
            `
        },
        miniGameType: "white-balance"
    },
    {
        title: "Illusions Contextuelles",
        description: "Observez comment le contexte modifie notre perception des couleurs.",
        position: 30,
        explanation: {
            title: "L'Effet du Contexte",
            content: `
                <p>Le contexte visuel influence drastiquement notre perception.</p>
                <p>Les mêmes couleurs peuvent sembler complètement différentes selon leur environnement.</p>
                <p>C'est pourquoi choisir la couleur d'une peinture sur un petit échantillon peut être trompeur !</p>
            `
        },
        miniGameType: "context-effect"
    }
];

// Initialisation de Three.js
const canvas = document.getElementById('gallery-canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
    canvas: canvas, 
    antialias: true,
    powerPreference: "high-performance"
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;

camera.position.set(0, 0, 1);
camera.lookAt(0, 0, 0);

// SHADER : Tunnel
const tunnelMaterial = new THREE.ShaderMaterial({
    uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        cameraProgress: { value: 0 }
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
        uniform float cameraProgress;
        varying vec2 vUv;
        
        float g(vec4 p, float s) {
            return abs(dot(sin(p *= s), cos(p.zxwy)) - 1.0) / s;
        }
        
        // Fonction pour obtenir la palette de couleur selon la progression
        vec3 getColorPalette(float progress) {
            // Checkpoint 0 (0-10) : Rose pastel
            if (progress < 5.0) {
                return vec3(0.95, 0.85, 0.90); // Rose doux
            }
            // Checkpoint 1 (10-20) : Bleu pastel  
            else if (progress < 15.0) {
                return vec3(0.85, 0.90, 0.98); // Bleu clair
            }
            // Checkpoint 2 (20-30) : Vert pastel
            else if (progress < 25.0) {
                return vec3(0.88, 0.95, 0.90); // Vert menthe
            }
            // Checkpoint 3 (30+) : Lavande pastel
            else {
                return vec3(0.92, 0.88, 0.98); // Lavande doux
            }
        }
        
        void main() {
            vec4 O;
            vec2 C = vUv * iResolution.xy;
            
            float i = 0.0, d = 0.0, z = 0.0, s = 0.0;
            float T = iTime + cameraProgress;
            vec4 o = vec4(0.0), q, p;
            vec4 U = vec4(2.0, 1.0, 0.0, 3.0);
            vec2 r = iResolution.xy;
            
            // Obtenir la palette de couleur actuelle
            vec3 basePalette = getColorPalette(cameraProgress);
            
            for(float step = 0.0; step < 79.0; step++) {
                i = step;
                z += d + 0.0005;
                q = vec4(normalize(vec3((C + C - r) / r.y, 2.0)) * z, 0.2);
                q.z += T / 30.0;
                s = q.y + 0.1;
                q.y = abs(s);
                p = q;
                p.y -= 0.11;
                
                vec4 angles = 11.0 * vec4(U.z, U.y, U.w, U.z) - 2.0 * p.z;
                float c1 = cos(angles.x);
                float s1 = sin(angles.x);
                
                vec2 temp = p.xy;
                p.x = temp.x * c1 - temp.y * s1;
                p.y = temp.x * s1 + temp.y * c1;
                
                p.y -= 0.2;
                d = abs(g(p, 8.0) - g(p, 24.0)) / 4.0;
                
                // COULEURS PASTEL PROPRES basées sur la palette actuelle
                vec4 pastelColors = vec4(
                    basePalette.r + 0.1 * cos(0.8 * U.x + 3.0 * q.z + iTime * 0.05),
                    basePalette.g + 0.1 * cos(0.6 * U.y + 4.0 * q.z + iTime * 0.07), 
                    basePalette.b + 0.1 * cos(0.4 * U.z + 5.0 * q.z + iTime * 0.03),
                    0.9 + 0.1 * cos(0.5 * U.w + 6.0 * q.z + iTime * 0.02)
                );
                
                p = pastelColors;
                
                float multiplier = (s > 0.0 ? 1.0 : 0.1) * p.w;
                float denominator = max(s > 0.0 ? d : d*d*d, 0.0005);
                o += multiplier * p / denominator;
            }
            
            // LUEUR CENTRALE harmonieuse avec la palette
            float pulse = (1.3 + sin(T * 0.6) * sin(1.2 * T) * sin(1.7 * T)) * 900.0;
            vec2 center = q.xy;
            float centerDist = length(center);
            if(centerDist > 0.0) {
                vec4 centerGlow = vec4(
                    basePalette.r + 0.05 * sin(T * 0.2),
                    basePalette.g + 0.05 * cos(T * 0.25),
                    basePalette.b + 0.05 * sin(T * 0.3),
                    1.0
                );
                o += pulse * centerGlow / centerDist;
            }
            
            // TONE MAPPING DOUX pour des couleurs pastel
            O = tanh(o / 110000.0);
            
            // Correction gamma douce
            O.rgb = pow(O.rgb, vec3(0.85));
            
            // Base pastel subtile pour unifier
            vec3 pastelBase = mix(basePalette, vec3(0.96, 0.97, 0.98), 0.3);
            O.rgb = mix(O.rgb, pastelBase, 0.08);
            
            gl_FragColor = O;
        }
    `
});

// Créer le plan
const tunnelGeometry = new THREE.PlaneGeometry(4, 4);
const tunnelMesh = new THREE.Mesh(tunnelGeometry, tunnelMaterial);
tunnelMesh.position.set(0, 0, 0);
scene.add(tunnelMesh);

// Gestion des éléments DOM
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const exitBtn = document.getElementById('exit-btn');
const progressDots = document.querySelectorAll('.progress-dot');
const infoPanel = document.getElementById('info-panel');
const checkpointTitle = document.getElementById('checkpoint-title');
const checkpointDescription = document.getElementById('checkpoint-description');
const startGameBtn = document.getElementById('start-game');

// Variables globales pour les mini-jeux
let contrastRevealed = false;
let brightnessSlider = null;
let isolationState = false;

// NOUVEAU : Système d'explications détaillées
function createExplanationModal() {
    const modal = document.createElement('div');
    modal.id = 'explanation-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        z-index: 200;
        display: none;
        justify-content: center;
        align-items: center;
        padding: 20px;
    `;
    
    const content = document.createElement('div');
    content.style.cssText = `
        max-width: 600px;
        max-height: 80vh;
        background: linear-gradient(135deg, rgba(20, 20, 40, 0.95), rgba(40, 20, 60, 0.95));
        border-radius: 20px;
        padding: 40px;
        color: white;
        font-family: "Segoe UI", Helvetica, Arial, sans-serif;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.1);
        overflow-y: auto;
        text-align: left;
    `;
    
    content.innerHTML = `
        <h2 id="explanation-title" style="margin: 0 0 20px 0; font-size: 28px; color: #fff;"></h2>
        <div id="explanation-content" style="line-height: 1.6; font-size: 16px;"></div>
        <div style="margin-top: 30px; text-align: center;">
            <button id="start-mini-game" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 25px;
                padding: 15px 30px;
                color: white;
                font-size: 18px;
                font-weight: 600;
                cursor: pointer;
                margin-right: 15px;
                transition: all 0.3s ease;
                text-transform: uppercase;
                letter-spacing: 1px;
            ">Lancer l'Expérience</button>
            <button id="skip-explanation" style="
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 25px;
                padding: 15px 30px;
                color: white;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Passer</button>
        </div>
    `;
    
    modal.appendChild(content);
    document.body.appendChild(modal);
    
    // Event listeners pour les boutons
    document.getElementById('start-mini-game').addEventListener('click', () => {
        modal.style.display = 'none';
        launchMiniGame(checkpoints[currentCheckpoint].miniGameType);
    });
    
    document.getElementById('skip-explanation').addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Fermer en cliquant en dehors
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    return modal;
}

// NOUVEAU : Conteneur pour les mini-jeux
function createMiniGameContainer() {
    const container = document.createElement('div');
    container.id = 'mini-game-container';
    container.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;  
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.95);
        z-index: 300;
        display: none;
        justify-content: center;
        align-items: center;
        padding: 20px;
        overflow: hidden;
    `;
    
    container.innerHTML = `
        <div style="
            width: 90%;
            max-width: 900px;
            height: 85%;
            max-height: calc(100vh - 40px);
            background: linear-gradient(135deg, rgba(30, 30, 50, 0.95), rgba(50, 30, 70, 0.95));
            border-radius: 20px;
            padding: 20px;
            position: relative;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.1);
            overflow-y: auto;
            overflow-x: hidden;
        ">
            <button id="close-mini-game" style="
                position: absolute;
                top: 15px;
                right: 15px;
                width: 35px;
                height: 35px;
                border-radius: 50%;
                background: rgba(255, 100, 100, 0.3);
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                z-index: 10;
            ">✕</button>
            <div id="mini-game-content" style="
                width: 100%;
                height: auto;
                min-height: 100%;
                color: white;
                font-family: 'Segoe UI', Helvetica, Arial, sans-serif;
                padding-top: 10px;
            "></div>
        </div>
    `;
    
    document.body.appendChild(container);
    
    document.getElementById('close-mini-game').addEventListener('click', () => {
        container.style.display = 'none';
        currentMiniGame = null;
    });
    
    return container;
}

// Créer les modales
const explanationModal = createExplanationModal();
const miniGameContainer = createMiniGameContainer();

// NOUVEAU : Afficher l'explication détaillée
function showDetailedExplanation(checkpoint) {
    const modal = document.getElementById('explanation-modal');
    const title = document.getElementById('explanation-title');
    const content = document.getElementById('explanation-content');
    
    title.textContent = checkpoint.explanation.title;
    content.innerHTML = checkpoint.explanation.content;
    
    modal.style.display = 'flex';
    
    // Animation d'entrée
    if (window.gsap) {
        gsap.fromTo(modal.children[0], 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
}

// NOUVEAU : Lancer un mini-jeu selon le type
function launchMiniGame(gameType) {
    const container = document.getElementById('mini-game-container');
    const content = document.getElementById('mini-game-content');
    
    currentMiniGame = gameType;
    container.style.display = 'flex';
    
    // Réinitialiser les variables
    contrastRevealed = false;
    isolationState = false;
    
    switch(gameType) {
        case 'contrast-comparison':
            createContrastComparisonGame(content);
            break;
        case 'brightness-illusion':
            createBrightnessIllusionGame(content);
            break;
        case 'white-balance':
            createWhiteBalanceGame(content);
            break;
        case 'context-effect':
            createContextEffectGame(content);
            break;
    }
    
    // Animation d'entrée
    if (window.gsap) {
        gsap.fromTo(container.children[0], 
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
}

// Contraste Simultané
function createContrastComparisonGame(container) {
    container.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 20px; font-size: 24px;">Expérience : Contraste Simultané</h2>
        <p style="text-align: center; margin-bottom: 20px; font-size: 16px;">Observez ces deux carrés gris. Vous semblent-ils de la même couleur ?</p>
        
        <div style="display: flex; justify-content: center; align-items: center; gap: 40px; margin: 30px 0;">
            <div id="bg-left" style="width: 180px; height: 180px; background: #000; display: flex; justify-content: center; align-items: center; border-radius: 10px; transition: all 0.5s ease;">
                <div id="square1" style="width: 80px; height: 80px; background: #808080; transition: all 0.3s ease;"></div>
            </div>
            <div id="bg-right" style="width: 180px; height: 180px; background: #fff; display: flex; justify-content: center; align-items: center; border-radius: 10px; transition: all 0.5s ease;">
                <div id="square2" style="width: 80px; height: 80px; background: #808080; transition: all 0.3s ease;"></div>
            </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <label style="display: block; margin-bottom: 10px; font-size: 14px;">Modifiez l'arrière-plan de gauche :</label>
            <input type="range" id="bg-brightness" min="0" max="255" value="0" 
                   style="width: 280px; margin-bottom: 8px;">
            <div style="margin-bottom: 15px; font-size: 12px;">
                Luminosité : <span id="bg-value">0</span> (0 = noir, 255 = blanc)
            </div>
            
            <label style="display: block; margin-bottom: 10px; font-size: 14px;">Modifiez la couleur des carrés :</label>
            <input type="range" id="square-brightness" min="0" max="255" value="128" 
                   style="width: 280px; margin-bottom: 8px;">
            <div style="margin-bottom: 20px; font-size: 12px;">
                Gris des carrés : <span id="square-value">128</span>
            </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <button id="reveal-truth-btn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 20px;
                padding: 12px 25px;
                color: white;
                font-size: 16px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
            ">Révéler la Vérité</button>
        </div>
        
        <div id="truth-reveal" style="
            display: none; 
            margin-top: 20px; 
            padding: 20px; 
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.05));
            border-radius: 12px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            backdrop-filter: blur(10px);
        ">
            <h3 style="color: #FFD700; margin: 0 0 12px 0; font-size: 18px;">🎯 Révélation Surprenante !</h3>
            <p style="font-size: 16px; line-height: 1.5; margin-bottom: 12px; color: #fff;">
                <strong>Les deux carrés gris sont exactement de la même couleur !</strong>
            </p>
            <p style="font-size: 14px; line-height: 1.5; color: rgba(255, 255, 255, 0.9); margin-bottom: 15px;">
                Votre cerveau interprète différemment la même couleur selon le contraste avec l'arrière-plan.
                C'est le <strong>contraste simultané</strong> découvert par Michel-Eugène Chevreul.
            </p>
            <div style="padding: 12px; background: rgba(255, 215, 0, 0.1); border-radius: 8px; border-left: 3px solid #FFD700;">
                <p style="margin: 0; font-style: italic; color: #FFD700; font-size: 14px;">
                    💡 Astuce : Continuez à ajuster les curseurs pour voir l'effet changer !
                </p>
            </div>
        </div>
    `;
    
    // Event listeners (identiques à avant)
    const bgSlider = document.getElementById('bg-brightness');
    const squareSlider = document.getElementById('square-brightness');
    const bgValue = document.getElementById('bg-value');
    const squareValue = document.getElementById('square-value');
    const bgLeft = document.getElementById('bg-left');
    const square1 = document.getElementById('square1');
    const square2 = document.getElementById('square2');
    
    bgSlider.addEventListener('input', function() {
        const value = this.value;
        bgLeft.style.background = `rgb(${value}, ${value}, ${value})`;
        bgValue.textContent = value;
    });
    
    squareSlider.addEventListener('input', function() {
        const value = this.value;
        const color = `rgb(${value}, ${value}, ${value})`;
        square1.style.background = color;
        square2.style.background = color;
        squareValue.textContent = value;
    });
    
    document.getElementById('reveal-truth-btn').addEventListener('click', function() {
        const truthDiv = document.getElementById('truth-reveal');
        if (!contrastRevealed) {
            truthDiv.style.display = 'block';
            this.textContent = 'Masquer l\'explication';
            this.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
            contrastRevealed = true;
            
            if (window.gsap) {
                gsap.fromTo(truthDiv, 
                    { opacity: 0, transform: 'translateY(20px)' },
                    { opacity: 1, transform: 'translateY(0)', duration: 0.5, ease: "back.out(1.7)" }
                );
            }
        } else {
            truthDiv.style.display = 'none';
            this.textContent = 'Révéler la Vérité';
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            contrastRevealed = false;
        }
    });
}

//Illusion de Luminosité
function createBrightnessIllusionGame(container) {
    container.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 30px;">Expérience : Illusion de Luminosité</h2>
        <p style="text-align: center; margin-bottom: 30px; font-size: 18px;">Ajustez le curseur pour que les deux carrés vous paraissent de même luminosité :</p>
        
        <div style="display: flex; justify-content: center; align-items: center; margin: 40px 0;">
            <div style="width: 350px; height: 220px; background: linear-gradient(to right, #000 0%, #fff 100%); position: relative; border-radius: 10px;">
                <div id="test-square" style="
                    position: absolute;
                    top: 50%;
                    left: 20%;
                    transform: translateY(-50%);
                    width: 60px;
                    height: 60px;
                    background: rgb(128, 128, 128);
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    transition: all 0.2s ease;
                "></div>
                <div style="
                    position: absolute;
                    top: 50%;
                    right: 20%;
                    transform: translateY(-50%);
                    width: 60px;
                    height: 60px;
                    background: rgb(128, 128, 128);
                    border: 2px solid rgba(0, 0, 0, 0.3);
                "></div>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <label style="display: block; margin-bottom: 15px; font-size: 16px; color: #fff;">Luminosité du carré de gauche :</label>
            <input type="range" id="brightness-slider" min="0" max="255" value="128" 
                   style="width: 350px; margin-bottom: 15px;">
            <div style="margin-bottom: 30px; font-size: 16px; color: #FFD700;">
                Valeur actuelle : <span id="brightness-value" style="font-weight: bold;">128</span> / 255
            </div>
            
            <div style="padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; margin-bottom: 20px;">
                <p style="margin: 0; font-size: 16px; color: #fff;">
                    🎯 <strong>Défi :</strong> Trouvez la valeur où les deux carrés vous paraissent identiques !
                </p>
            </div>
        </div>
        
        <div style="text-align: center;">
            <button id="show-solution-btn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 25px;
                padding: 15px 30px;
                color: white;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
                transition: all 0.3s ease;
            ">Révéler la Solution</button>
        </div>
        
        <div id="solution-text" style="
            display: none; 
            margin-top: 25px; 
            padding: 25px; 
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 193, 7, 0.05));
            border-radius: 15px;
            border: 1px solid rgba(255, 215, 0, 0.3);
        ">
            <h3 style="color: #FFD700; margin: 0 0 15px 0; font-size: 20px;">💡 Solution Révélée</h3>
            <p style="font-size: 17px; line-height: 1.6; color: #fff; margin-bottom: 15px;">
                <strong>Les deux carrés ont exactement la même couleur</strong> (valeur 128) mais votre cerveau les perçoit différemment !
            </p>
            <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
                Le dégradé d'arrière-plan crée une <strong>illusion de contraste</strong> qui trompe votre perception.
                C'est pourquoi le carré de gauche semble plus clair que celui de droite.
            </p>
        </div>
    `;
    
    // Event listeners
    const slider = document.getElementById('brightness-slider');
    const valueDisplay = document.getElementById('brightness-value');
    const testSquare = document.getElementById('test-square');
    
    slider.addEventListener('input', function() {
        const value = this.value;
        testSquare.style.background = `rgb(${value}, ${value}, ${value})`;
        valueDisplay.textContent = value;
        
        // Feedback visuel quand on s'approche de 128
        if (Math.abs(value - 128) < 10) {
            valueDisplay.style.color = '#4CAF50';
            valueDisplay.style.fontWeight = 'bold';
        } else {
            valueDisplay.style.color = '#FFD700';
            valueDisplay.style.fontWeight = 'normal';
        }
    });
    
    document.getElementById('show-solution-btn').addEventListener('click', function() {
        const solutionDiv = document.getElementById('solution-text');
        if (solutionDiv.style.display === 'none') {
            solutionDiv.style.display = 'block';
            this.textContent = 'Masquer la Solution';
            this.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
            
            // Animation d'apparition
            if (window.gsap) {
                gsap.fromTo(solutionDiv, 
                    { opacity: 0, transform: 'translateY(20px)' },
                    { opacity: 1, transform: 'translateY(0)', duration: 0.5, ease: "back.out(1.7)" }
                );
            }
        } else {
            solutionDiv.style.display = 'none';
            this.textContent = 'Révéler la Solution';
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    });
}

//Illusion de Luminosité -> A AMELIORER
function createBrightnessIllusionGame(container) {
    container.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 30px;">Expérience : Illusion de Luminosité</h2>
        <p style="text-align: center; margin-bottom: 30px;">Ajustez le curseur pour rendre les deux zones de même luminosité :</p>
        
        <div style="display: flex; justify-content: center; align-items: center; margin: 30px 0;">
            <div style="width: 300px; height: 200px; background: linear-gradient(to right, #000 0%, #fff 100%); position: relative;">
                <div id="test-square" style="
                    position: absolute;
                    top: 50%;
                    left: 25%;
                    transform: translateY(-50%);
                    width: 50px;
                    height: 50px;
                    background: rgb(128, 128, 128);
                "></div>
                <div style="
                    position: absolute;
                    top: 50%;
                    right: 25%;
                    transform: translateY(-50%);
                    width: 50px;
                    height: 50px;
                    background: rgb(128, 128, 128);
                "></div>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <label style="display: block; margin-bottom: 10px;">Luminosité du carré de gauche :</label>
            <input type="range" id="brightness-slider" min="0" max="255" value="128" 
                   style="width: 300px;">
            <div style="margin-top: 10px;">
                Valeur : <span id="brightness-value">128</span>
            </div>
        </div>
        
        <div style="text-align: center;">
            <button id="show-solution-btn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 25px;
                padding: 12px 25px;
                color: white;
                font-size: 16px;
                cursor: pointer;
            ">Voir la Solution</button>
        </div>
        
        <div id="solution-text" style="display: none; margin-top: 20px; padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px;">
            <p><strong>Solution :</strong> Les deux carrés ont la même couleur (128, 128, 128) mais paraissent différents à cause du dégradé d'arrière-plan !</p>
        </div>
    `;
    
    // Event listeners
    const slider = document.getElementById('brightness-slider');
    const valueDisplay = document.getElementById('brightness-value');
    const testSquare = document.getElementById('test-square');
    
    slider.addEventListener('input', function() {
        const value = this.value;
        testSquare.style.background = `rgb(${value}, ${value}, ${value})`;
        valueDisplay.textContent = value;
    });
    
    document.getElementById('show-solution-btn').addEventListener('click', function() {
        const solutionDiv = document.getElementById('solution-text');
        if (solutionDiv.style.display === 'none') {
            solutionDiv.style.display = 'block';
            this.textContent = 'Masquer la Solution';
        } else {
            solutionDiv.style.display = 'none';
            this.textContent = 'Voir la Solution';
        }
    });
}

//Balance des Blancs
function createWhiteBalanceGame(container) {
    container.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 30px;">Expérience : Adaptation Chromatique</h2>
        <p style="text-align: center; margin-bottom: 30px;">Regardez cette image sous différents éclairages :</p>
        
        <div style="display: flex; justify-content: center; align-items: center; margin: 30px 0;">
            <div id="lighting-demo" style="
                width: 400px;
                height: 300px;
                background: white;
                border-radius: 10px;
                display: flex;
                justify-content: center;
                align-items: center;
                transition: all 1s ease;
            ">
                <div style="
                    width: 80px;
                    height: 80px;
                    background: white;
                    border: 2px solid #333;
                    margin: 10px;
                "></div>
                <div style="
                    width: 80px;
                    height: 80px;
                    background: #ff6b6b;
                    margin: 10px;
                "></div>
                <div style="
                    width: 80px;
                    height: 80px;
                    background: #4ecdc4;
                    margin: 10px;
                "></div>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <button id="daylight-btn" style="margin: 5px; padding: 10px 20px; background: #87CEEB; border: none; border-radius: 5px; cursor: pointer; color: #000;">Lumière du Jour</button>
            <button id="tungsten-btn" style="margin: 5px; padding: 10px 20px; background: #FFB347; border: none; border-radius: 5px; cursor: pointer; color: #000;">Ampoule Tungstène</button>
            <button id="fluorescent-btn" style="margin: 5px; padding: 10px 20px; background: #98FB98; border: none; border-radius: 5px; cursor: pointer; color: #000;">Néon Fluorescent</button>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px;">
            <p><strong>Observation :</strong> Le carré blanc reste "blanc" dans votre perception, même si sa couleur réelle change selon l'éclairage !</p>
        </div>
    `;
    
    // Event listeners pour les boutons d'éclairage
    const demo = document.getElementById('lighting-demo');
    
    document.getElementById('daylight-btn').addEventListener('click', function() {
        demo.style.filter = 'sepia(0%) saturate(100%) hue-rotate(0deg)';
    });
    
    document.getElementById('tungsten-btn').addEventListener('click', function() {
        demo.style.filter = 'sepia(30%) saturate(120%) hue-rotate(10deg)';
    });
    
    document.getElementById('fluorescent-btn').addEventListener('click', function() {
        demo.style.filter = 'sepia(10%) saturate(110%) hue-rotate(90deg)';
    });
}

// Effet de Contexte
function createContextEffectGame(container) {
    container.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 30px;">Expérience : L'Effet du Contexte</h2>
        <p style="text-align: center; margin-bottom: 30px;">La même couleur dans différents contextes :</p>
        
        <div id="context-demo" style="display: flex; justify-content: space-around; align-items: center; margin: 50px 0;">
            <div class="context-bg" style="width: 200px; height: 200px; background: linear-gradient(45deg, #ff6b6b, #ffd93d); display: flex; justify-content: center; align-items: center;">
                <div class="test-circle" style="width: 60px; height: 60px; background: #808080; border-radius: 50%;"></div>
            </div>
            <div class="context-bg" style="width: 200px; height: 200px; background: linear-gradient(45deg, #4ecdc4, #44a08d); display: flex; justify-content: center; align-items: center;">
                <div class="test-circle" style="width: 60px; height: 60px; background: #808080; border-radius: 50%;"></div>
            </div>
            <div class="context-bg" style="width: 200px; height: 200px; background: linear-gradient(45deg, #667eea, #764ba2); display: flex; justify-content: center; align-items: center;">
                <div class="test-circle" style="width: 60px; height: 60px; background: #808080; border-radius: 50%;"></div>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <button id="isolation-btn" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none;
                border-radius: 25px;
                padding: 12px 25px;
                color: white;
                font-size: 16px;
                cursor: pointer;
            ">Isoler les Cercles</button>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px;">
            <p><strong>Révélation :</strong> Les trois cercles sont exactement de la même couleur grise !</p>
            <p>Seul le contexte coloré change votre perception.</p>
        </div>
    `;
    
    // Event listener pour l'isolation
    document.getElementById('isolation-btn').addEventListener('click', function() {
        const backgrounds = document.querySelectorAll('.context-bg');
        
        if (!isolationState) {
            // Isoler : mettre tous les fonds en gris
            backgrounds.forEach(bg => {
                bg.style.background = '#333';
            });
            this.textContent = 'Remettre les Contextes';
            isolationState = true;
        } else {
            // Remettre les contextes colorés
            backgrounds[0].style.background = 'linear-gradient(45deg, #ff6b6b, #ffd93d)';
            backgrounds[1].style.background = 'linear-gradient(45deg, #4ecdc4, #44a08d)';
            backgrounds[2].style.background = 'linear-gradient(45deg, #667eea, #764ba2)';
            this.textContent = 'Isoler les Cercles';
            isolationState = false;
        }
    });
}

// Navigation entre checkpoints
function navigateToCheckpoint(targetCheckpoint, animate = true) {
    if (isTransitioning || targetCheckpoint < 0 || targetCheckpoint >= totalCheckpoints) {
        return;
    }
    
    currentCheckpoint = targetCheckpoint;
    const checkpoint = checkpoints[targetCheckpoint];
    
    if (animate && window.gsap) {
        isTransitioning = true;
        gsap.to(tunnelMaterial.uniforms.cameraProgress, {
            duration: 3,
            value: checkpoint.position,
            ease: "power2.inOut",
            onComplete: () => {
                isTransitioning = false;
                setTimeout(() => {
                    showDetailedExplanation(checkpoint);
                }, 500);
            }
        });
    } else {
        tunnelMaterial.uniforms.cameraProgress.value = checkpoint.position;
        setTimeout(() => {
            showDetailedExplanation(checkpoint);
        }, 100);
    }
    
    updateUI();
}

// Mettre à jour l'interface utilisateur
function updateUI() {
    progressDots.forEach((dot, index) => {
        if (index < totalCheckpoints) {
            dot.classList.toggle('active', index === currentCheckpoint);
            dot.style.display = 'block';
        } else {
            dot.style.display = 'none'; // Masquer le 5ème point (quiz supprimé)
        }
    });
    
    prevBtn.disabled = currentCheckpoint === 0;
    nextBtn.disabled = currentCheckpoint === totalCheckpoints - 1;
    
    const checkpoint = checkpoints[currentCheckpoint];
    checkpointTitle.textContent = checkpoint.title;
    checkpointDescription.textContent = checkpoint.description;
}

// Afficher le panneau d'information
function showInfoPanel() {
    infoPanel.classList.add('visible');
    setTimeout(() => {
        infoPanel.classList.remove('visible');
    }, 3000);
}

// Event listeners
prevBtn.addEventListener('click', () => {
    if (!isTransitioning && currentCheckpoint > 0) {
        navigateToCheckpoint(currentCheckpoint - 1);
    }
});

nextBtn.addEventListener('click', () => {
    if (!isTransitioning && currentCheckpoint < totalCheckpoints - 1) {
        navigateToCheckpoint(currentCheckpoint + 1);
    }
});

exitBtn.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        opacity: 0;
        z-index: 10000;
        transition: opacity 1s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 24px;
        font-family: "Segoe UI", Helvetica, Arial, sans-serif;
    `;
    overlay.innerHTML = 'Returning to menu...';
    document.body.appendChild(overlay);
    
    setTimeout(() => {
        overlay.style.opacity = '1';
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    }, 100);
});

progressDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        if (!isTransitioning && index < totalCheckpoints) {
            navigateToCheckpoint(index);
        }
    });
});

// Le bouton "Commencer l'expérience" lance l'explication détaillée
startGameBtn.addEventListener('click', () => {
    const checkpoint = checkpoints[currentCheckpoint];
    showDetailedExplanation(checkpoint);
    infoPanel.classList.remove('visible');
});

// Navigation au clavier
document.addEventListener('keydown', (event) => {
    if (isTransitioning) return;
    
    // Fermer les modales avec Échap
    if (event.key === 'Escape') {
        const explanationModal = document.getElementById('explanation-modal');
        const miniGameContainer = document.getElementById('mini-game-container');
        
        if (explanationModal && explanationModal.style.display === 'flex') {
            explanationModal.style.display = 'none';
            return;
        }
        
        if (miniGameContainer && miniGameContainer.style.display === 'flex') {
            miniGameContainer.style.display = 'none';
            currentMiniGame = null;
            return;
        }
        
        exitBtn.click();
        return;
    }
    
    switch(event.key) {
        case 'ArrowLeft':
            if (currentCheckpoint > 0) {
                navigateToCheckpoint(currentCheckpoint - 1);
            }
            break;
        case 'ArrowRight':
            if (currentCheckpoint < totalCheckpoints - 1) {
                navigateToCheckpoint(currentCheckpoint + 1);
            }
            break;
        case ' ':
            event.preventDefault();
            const checkpoint = checkpoints[currentCheckpoint];
            showDetailedExplanation(checkpoint);
            break;
        case 'Enter':
            if (currentMiniGame) {
                console.log('Action dans le mini-jeu:', currentMiniGame);
            }
            break;
    }
});

// Gestion du redimensionnement
function handleResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    tunnelMaterial.uniforms.iResolution.value.set(
        window.innerWidth, 
        window.innerHeight
    );
}

window.addEventListener('resize', handleResize);

// Animation principale
function animate() {
    requestAnimationFrame(animate);
    tunnelMaterial.uniforms.iTime.value += 0.016;
    renderer.render(scene, camera);
}

// Initialisation
function init() {
    console.log('🎨 Galerie Interactive - Perception des Couleurs');
    console.log('📍 Navigation: Flèches ← → ou clic sur les points');
    console.log('🎮 Interactions: Espace pour les explications, Échap pour sortir');
    console.log('🔬 Mini-jeux: Expériences interactives à chaque checkpoint');
    
    updateUI();
    
    // Afficher le panneau d'info initial
    setTimeout(() => {
        showInfoPanel();
    }, 1500);
    
    animate();
}

// Démarrer
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}