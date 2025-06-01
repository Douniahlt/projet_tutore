import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';

// ============== SYSTÈME DE GESTION AUDIO ==============
class AudioManager {
    constructor() {
        this.audio = null;
        this.isPlaying = false;
        this.volume = 0.3; // Volume par défaut (30%)
        this.audioPath = './resources/MusicProjTut.mp3'; // Chemin vers votre fichier audio

        // Charger les préférences sauvegardées
        this.loadAudioPreferences();

        // Initialiser l'audio
        this.initAudio();
    }

    initAudio() {
        try {
            this.audio = new Audio(this.audioPath);
            this.audio.loop = true; // Lecture en boucle
            this.audio.volume = this.volume;
            this.audio.preload = 'auto';

            // Événements audio
            this.audio.addEventListener('loadeddata', () => {
                console.log('🎵 Musique chargée avec succès');
                this.updateSoundButton();
            });

            this.audio.addEventListener('error', (e) => {
                console.warn('⚠️ Erreur de chargement audio:', e);
                this.handleAudioError();
            });

            this.audio.addEventListener('canplaythrough', () => {
                if (this.isPlaying && this.audio.paused) {
                    this.play();
                }
            });

            this.audio.addEventListener('ended', () => {
                if (this.isPlaying) {
                    this.audio.currentTime = 0;
                    this.play();
                }
            });

        } catch (error) {
            console.warn('⚠️ Impossible d\'initialiser l\'audio:', error);
            this.handleAudioError();
        }
    }

    play() {
        if (!this.audio) return false;

        try {
            const playPromise = this.audio.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    this.isPlaying = true;
                    this.saveAudioPreferences();
                    this.updateSoundButton();
                }).catch((error) => {
                    console.warn('⚠️ Lecture automatique bloquée par le navigateur:', error);
                    this.isPlaying = false;
                    this.updateSoundButton();
                });
            }

            return true;
        } catch (error) {
            console.warn('⚠️ Erreur lors de la lecture:', error);
            return false;
        }
    }

    pause() {
        if (!this.audio) return;

        try {
            this.audio.pause();
            this.isPlaying = false;
            this.saveAudioPreferences();
            this.updateSoundButton();
        } catch (error) {
            console.warn('⚠️ Erreur lors de la pause:', error);
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    setVolume(newVolume) {
        this.volume = Math.max(0, Math.min(1, newVolume));
        if (this.audio) {
            this.audio.volume = this.volume;
        }
        this.saveAudioPreferences();
    }

    fadeIn(duration = 2000) {
        if (!this.audio || this.isPlaying) return;

        this.audio.volume = 0;
        this.play();

        const targetVolume = this.volume;
        const steps = 50;
        const volumeIncrement = targetVolume / steps;
        const timeIncrement = duration / steps;

        let currentStep = 0;

        const fadeInterval = setInterval(() => {
            currentStep++;
            const newVolume = Math.min(volumeIncrement * currentStep, targetVolume);
            this.audio.volume = newVolume;

            if (currentStep >= steps) {
                clearInterval(fadeInterval);
            }
        }, timeIncrement);
    }

    updateSoundButton() {
        const soundButton = document.querySelector('#sound-button');
        if (!soundButton) return;
        
        if (this.audio && this.isPlaying && !this.audio.paused) {
            soundButton.innerHTML = '🔊';
            soundButton.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
            soundButton.style.boxShadow = '0 4px 15px rgba(76, 175, 80, 0.3)';
            soundButton.style.border = '2px solid #4CAF50';
            soundButton.title = t('soundEnabled');
        } else {
            soundButton.innerHTML = '🔇';
            // Garder un design neutre blanc au lieu de rouge
            soundButton.style.background = 'white';
            soundButton.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
            soundButton.style.border = '2px solid #e0e0e0';
            soundButton.title = t('soundDisabled');
        }
    }

    saveAudioPreferences() {
        const preferences = {
            isPlaying: this.isPlaying,
            volume: this.volume
        };
        localStorage.setItem('colorPerceptionAudio', JSON.stringify(preferences));
    }

    loadAudioPreferences() {
        try {
            const saved = localStorage.getItem('colorPerceptionAudio');
            if (saved) {
                const preferences = JSON.parse(saved);
                this.isPlaying = preferences.isPlaying || false;
                this.volume = preferences.volume || 0.3;
            }
        } catch (error) {
            console.warn('⚠️ Erreur lors du chargement des préférences audio:', error);
        }
    }

    handleAudioError() {
        this.isPlaying = false;
        const soundButton = document.querySelector('#sound-button');
        if (soundButton) {
            soundButton.style.display = 'none';
        }
    }
}

// Instance globale du gestionnaire audio
let audioManager = null;

// Système de gestion des langues pour le menu principal
const translations = {
    fr: {
        // Titre principal
        mainTitle: "COLOR PERCEPTION",

        // Menu principal
        soundControl: "Contrôle Audio",
        colorPerceptionTitle: "COLOR PERCEPTION",
        interactiveExperience: "Une expérience interactive",
        startGame: "Démarrer",

        // Nouvelles traductions audio
        soundEnabled: "Musique activée - Cliquer pour désactiver",
        soundDisabled: "Musique désactivée - Cliquer pour activer",
        audioVolumeLabel: "Volume de la musique",

        // Menu déroulant
        home: "Accueil",
        about: "À propos",
        settings: "Paramètres",
        help: "Aide",
        credits: "Crédits",

        // Introduction variable
        introTitle1: "Bienvenue dans l'Expérience des Couleurs",
        introContent1: "Vous êtes sur le point de découvrir les secrets de la perception visuelle.",

        introTitle2: "Qui sommes-nous ?",
        introContent2: "Nous sommes deux étudiantes, Néha et Dounia. Ce projet a été réalisé dans le cadre d'un projet tuteuré universitaire pour vulgariser les concepts scientifiques complexes.",

        introTitle3: "Notre Mission",
        introContent3: "Comprendre pourquoi une même couleur peut paraître différente selon son environnement et comment votre cerveau interprète les couleurs.",

        introTitle4: "Ce que vous allez apprendre",
        introContent4: "• Le contraste simultané de Michel-Eugène Chevreul\n• L'adaptation chromatique d'Edwin Land\n• L'effet du contexte sur la perception\n• Les mécanismes de la vision",

        introTitle5: "Prêt.e à commencer ?",
        introContent5: "Utilisez les boutons pour naviguer à votre rythme, ou appuyez sur ENTRÉE/ESPACE pour traverser le portail vers l'expérience interactive.",

        // Navigation
        previous: "← Précédent",
        next: "Suivant →",

        // Messages de transition
        transitionToGallery: "Transition vers la Galerie...",
        returningToMenu: "Retour au menu...",

        // Sélecteur de langue
        language: "Langue",

        // Bouton skip
        skipIntro: "Passer l'introduction"
    },
    en: {
        // Main title
        mainTitle: "COLOR PERCEPTION",

        // Main menu
        soundControl: "Sound Control",
        colorPerceptionTitle: "COLOR PERCEPTION",
        interactiveExperience: "An interactive experience",
        startGame: "Start Game",

        // New audio translations
        soundEnabled: "Music enabled - Click to disable",
        soundDisabled: "Music disabled - Click to enable",
        audioVolumeLabel: "Music volume",

        // Dropdown menu
        home: "Home",
        about: "About",
        settings: "Settings",
        help: "Help",
        credits: "Credits",

        // Variable introduction
        introTitle1: "Welcome to the Color Experience",
        introContent1: "You are about to discover the secrets of visual perception.",

        introTitle2: "Who are we?",
        introContent2: "We are two students, Néha and Dounia. This project was created as part of a university tutored project to popularize complex scientific concepts.",

        introTitle3: "Our Mission",
        introContent3: "Understanding why the same color can appear different depending on its environment and how your brain interprets colors.",

        introTitle4: "What you will learn",
        introContent4: "• Michel-Eugène Chevreul's simultaneous contrast\n• Edwin Land's chromatic adaptation\n• The effect of context on perception\n• The mechanisms of vision",

        introTitle5: "Ready to start?",
        introContent5: "Use the buttons to navigate at your own pace, or press ENTER/SPACE to cross the portal to the interactive experience.",

        // Navigation
        previous: "← Previous",
        next: "Next →",

        // Transition messages
        transitionToGallery: "Transition to Gallery...",
        returningToMenu: "Returning to menu...",

        // Language selector
        language: "Language",

        // Skip button
        skipIntro: "Skip"
    }
};

// État et configuration de la scène principale
const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xececec);

const camera = new THREE.PerspectiveCamera(45, canvas.width / canvas.height, 0.1, 100);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
});
renderer.setSize(canvas.width, canvas.height);

// Variables d'état pour les transitions
let transitionState = 'menu';
let whiteRoomReady = false;
let explanationStep = 0;
let currentLanguage = 'fr'; // Langue par défaut

// Références vers les objets 3D principaux
let whiteRoom;
let portalMesh;

// Fonction pour obtenir une traduction
function t(key, params = {}) {
    let text = translations[currentLanguage][key] || translations['fr'][key] || key;

    // Remplacer les paramètres dans le texte
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });

    return text;
}

// Fonction pour changer la langue
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('colorPerceptionLang', lang);
    updateUILanguage();
}

// Fonction pour mettre à jour l'interface avec la nouvelle langue
function updateUILanguage() {
    // Mettre à jour le titre principal
    const mainTitle = document.querySelector('div[style*="COLOR PERCEPTION"]');
    if (mainTitle) {
        mainTitle.textContent = t('mainTitle');
    }

    // Mettre à jour les éléments du panneau de contrôle
    updateControlPanelLanguage();

    // Mettre à jour le menu déroulant
    updateDropdownMenuLanguage();

    // Mettre à jour les boutons audio
    if (audioManager) {
        audioManager.updateSoundButton();
    }
}

// Classe pour gérer l'introduction à rythme variable
class VariablePaceIntroduction {
    constructor() {
        this.steps = [
            {
                titleKey: "introTitle1",
                contentKey: "introContent1",
                minDuration: 2000
            },
            {
                titleKey: "introTitle2",
                contentKey: "introContent2",
                minDuration: 3000
            },
            {
                titleKey: "introTitle3",
                contentKey: "introContent3",
                minDuration: 3000
            },
            {
                titleKey: "introTitle4",
                contentKey: "introContent4",
                minDuration: 4000
            },
            {
                titleKey: "introTitle5",
                contentKey: "introContent5",
                minDuration: 0
            }
        ];
        this.currentStep = 0;
        this.startTime = null;
        this.navigationEnabled = false;
    }

    showStep(stepIndex) {
        if (stepIndex < 0 || stepIndex >= this.steps.length) return;

        const step = this.steps[stepIndex];
        this.startTime = Date.now();
        this.navigationEnabled = false;

        // Supprimer tous les éléments d'introduction précédents
        const existingStep = document.querySelector('.intro-step');
        if (existingStep) {
            existingStep.remove();
        }

        // Supprimer aussi toute flèche de navigation existante
        const existingArrow = document.getElementById('intro-next');
        if (existingArrow) {
            existingArrow.remove();
        }

        // Créer le conteneur pour cette étape
        const stepElement = document.createElement('div');
        stepElement.className = 'intro-step';
        stepElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 30px 40px;
            border-radius: 15px;
            font-family: "Segoe UI", Helvetica, Arial, sans-serif;
            text-align: center;
            max-width: 600px;
            z-index: 100;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
            opacity: 0;
            transition: opacity 0.5s ease;
            position: relative;
        `;

        // Créer le contenu sans flèche de navigation
        stepElement.innerHTML = `
            <h2 style="margin: 0 0 15px 0; font-size: 24px; color: #66D9EF;">${t(step.titleKey)}</h2>
            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.5; white-space: pre-line;">${t(step.contentKey)}</p>
        `;

        document.body.appendChild(stepElement);

        // Animation d'entrée
        setTimeout(() => {
            stepElement.style.opacity = '1';

            // Maintenant que le stepElement est visible, on peut créer la flèche
            // avec une position basée sur ses dimensions réelles
            const rect = stepElement.getBoundingClientRect();

            // Créer la flèche de navigation en diagonale à l'extérieur du cadre
            const navigationArrow = document.createElement('div');
            navigationArrow.id = 'intro-next';
            navigationArrow.style.cssText = `
                position: fixed;
                bottom: ${window.innerHeight - rect.bottom + 20}px;
                right: ${window.innerWidth - rect.right + 20}px;
                width: 45px;
                height: 45px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 3px 10px rgba(0, 0, 0, 0.4);
                opacity: 0;
                z-index: 101;
            `;

            // Ajouter une icône de flèche
            navigationArrow.innerHTML = `
                <span style="color: white; font-size: 20px; transform: translateY(-2px);">→</span>
            `;

            // Style spécial pour le dernier bouton
            if (stepIndex === this.steps.length - 1) {
                navigationArrow.style.background = 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)';
                navigationArrow.innerHTML = `
                    <span style="color: white; font-size: 20px;">✓</span>
                `;
            }

            document.body.appendChild(navigationArrow);

            // Fade-in de la flèche
            setTimeout(() => {
                navigationArrow.style.opacity = '0.7';
            }, 200);

            // Event listeners pour la navigation
            navigationArrow.addEventListener('click', () => {
                if (this.navigationEnabled) {
                    if (stepIndex < this.steps.length - 1) {
                        this.nextStep();
                    } else {
                        // Si c'est la dernière étape, commencer l'approche du portail
                        if (whiteRoomReady) {
                            startPortalApproach();
                        }
                    }
                }
            });

            // Ajouter un effet de survol
            navigationArrow.addEventListener('mouseenter', () => {
                navigationArrow.style.transform = 'scale(1.15)';
                navigationArrow.style.opacity = '1';
            });

            navigationArrow.addEventListener('mouseleave', () => {
                navigationArrow.style.transform = 'scale(1)';
                navigationArrow.style.opacity = '0.7';
            });

            // Gérer le repositionnement en cas de redimensionnement
            const updateArrowPosition = () => {
                const updatedRect = stepElement.getBoundingClientRect();
                navigationArrow.style.bottom = `${window.innerHeight - updatedRect.bottom + 20}px`;
                navigationArrow.style.right = `${window.innerWidth - updatedRect.right + 20}px`;
            };

            window.addEventListener('resize', updateArrowPosition);
        }, 100);

        // Activer la navigation immédiatement sans délai
        this.enableNavigation();

        this.currentStep = stepIndex;
        explanationStep = stepIndex + 1;
    }

    enableNavigation() {
        this.navigationEnabled = true;
        const navArrow = document.getElementById('intro-next');
        if (navArrow) {
            navArrow.style.opacity = '0.7';
        }
    }

    nextStep() {
        if (this.currentStep < this.steps.length - 1) {
            this.showStep(this.currentStep + 1);
        }
    }

    previousStep() {
        // Gardons cette méthode pour la navigation par flèches du clavier
        if (this.currentStep > 0) {
            this.showStep(this.currentStep - 1);
        }
    }

    start() {
        this.showStep(0);
    }

    end() {
        const existingStep = document.querySelector('.intro-step');
        const existingArrow = document.getElementById('intro-next');

        if (existingStep) {
            existingStep.style.opacity = '0';
            setTimeout(() => {
                existingStep.remove();
            }, 500);
        }

        if (existingArrow) {
            existingArrow.style.opacity = '0';
            setTimeout(() => {
                existingArrow.remove();
            }, 500);
        }
    }
}

// Fonction pour créer un bouton skip qui reste visible pendant toute l'introduction
function createSkipButton() {
    // Supprimer le bouton précédent s'il existe déjà
    const existingSkipBtn = document.getElementById('skip-gallery-button');
    if (existingSkipBtn) {
        existingSkipBtn.remove();
    }

    // Créer le bouton Skip avec un style similaire au bouton de langue
    const skipButton = document.createElement('div');
    skipButton.id = 'skip-gallery-button';
    skipButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 10px 20px;
        border-radius: 30px;
        font-family: "Segoe UI", Helvetica, Arial, sans-serif;
        font-size: 14px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease;
        z-index: 200;
        display: flex;
        align-items: center;
        opacity: 0.85;
    `;

    // Contenu du bouton avec une icône de flèche
    skipButton.innerHTML = `
        ${t('skipIntro')} 
        <span style="margin-left: 5px; font-size: 18px;">➔</span>
    `;

    // Ajouter les effets de survol
    skipButton.addEventListener('mouseenter', () => {
        skipButton.style.transform = 'scale(1.05)';
        skipButton.style.opacity = '1';
        skipButton.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.4)';
    });

    skipButton.addEventListener('mouseleave', () => {
        skipButton.style.transform = 'scale(1)';
        skipButton.style.opacity = '0.85';
        skipButton.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.3)';
    });

    // Ajouter l'action du bouton pour accéder directement à la galerie
    skipButton.addEventListener('click', () => {
        // Animation de transition avant redirection
        const skipOverlay = document.createElement('div');
        skipOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: black;
            opacity: 0;
            z-index: 1000;
            transition: opacity 0.5s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-family: "Segoe UI", Helvetica, Arial, sans-serif;
            font-size: 24px;
        `;
        skipOverlay.textContent = t('transitionToGallery');
        document.body.appendChild(skipOverlay);

        // Effet de fondu
        setTimeout(() => {
            skipOverlay.style.opacity = '1';
            // Rediriger vers la galerie après le fondu
            setTimeout(() => {
                window.location.href = 'gallery.html';
            }, 800);
        }, 100);
    });

    document.body.appendChild(skipButton);
    return skipButton;
}

// Instance de l'introduction
let variableIntroduction = null;

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

// Shader pour l'effet tunnel du portail (inchangé)
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
            
            for(float step = 0.0; step < 50.0; step++) {
                i = step;
                z += d + 0.001;
                q = vec4(normalize(vec3((C + C - r) / r.y, 2.0)) * z, 0.2);
                q.z += T / 20.0;
                s = q.y + 0.1;
                q.y = abs(s);
                p = q;
                p.y -= 0.11;
                
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

// Construction de la pièce blanche environnante (inchangée)
function createWhiteRoom() {
    const whiteRoomGroup = new THREE.Group();
    whiteRoomGroup.name = 'whiteRoom';

    const roomSize = 16;
    const roomHeight = 8;
    const wallGeometry = new THREE.PlaneGeometry(roomSize, roomHeight);
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);

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

    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 0, -roomSize / 2);
    whiteRoomGroup.add(backWall);

    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomSize / 2, 0, 0);
    whiteRoomGroup.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomSize / 2, 0, 0);
    whiteRoomGroup.add(rightWall);

    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.rotation.y = Math.PI;
    frontWall.position.set(0, 0, roomSize / 2);
    whiteRoomGroup.add(frontWall);

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -roomHeight / 2, 0);
    whiteRoomGroup.add(floor);

    const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, roomHeight / 2, 0);
    whiteRoomGroup.add(ceiling);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    whiteRoomGroup.add(ambientLight);

    const mainLight = new THREE.PointLight(0xffffff, 0.8, 30);
    mainLight.position.set(0, roomHeight / 2 - 1, 0);
    whiteRoomGroup.add(mainLight);

    const cornerLights = [
        { x: roomSize / 4, y: roomHeight / 4, z: roomSize / 4 },
        { x: -roomSize / 4, y: roomHeight / 4, z: roomSize / 4 },
        { x: roomSize / 4, y: roomHeight / 4, z: -roomSize / 4 },
        { x: -roomSize / 4, y: roomHeight / 4, z: -roomSize / 4 }
    ];

    cornerLights.forEach(pos => {
        const light = new THREE.PointLight(0xf0f0ff, 0.3, 10);
        light.position.set(pos.x, pos.y, pos.z);
        whiteRoomGroup.add(light);
    });

    const plinthGeometry = new THREE.BoxGeometry(roomSize, 0.05, 0.05);
    const plinthMaterial = new THREE.MeshStandardMaterial({
        color: 0xefefef,
        roughness: 0.7
    });

    const backPlinthe = new THREE.Mesh(plinthGeometry, plinthMaterial);
    backPlinthe.position.set(0, -roomHeight / 2, -roomSize / 2);
    whiteRoomGroup.add(backPlinthe);

    const frontPlinthe = new THREE.Mesh(plinthGeometry, plinthMaterial);
    frontPlinthe.position.set(0, -roomHeight / 2, roomSize / 2);
    whiteRoomGroup.add(frontPlinthe);

    const sidePlinthGeometry = new THREE.BoxGeometry(0.05, 0.05, roomSize);
    const leftPlinthe = new THREE.Mesh(sidePlinthGeometry, plinthMaterial);
    leftPlinthe.position.set(-roomSize / 2, -roomHeight / 2, 0);
    whiteRoomGroup.add(leftPlinthe);

    const rightPlinthe = new THREE.Mesh(sidePlinthGeometry, plinthMaterial);
    rightPlinthe.position.set(roomSize / 2, -roomHeight / 2, 0);
    whiteRoomGroup.add(rightPlinthe);

    whiteRoomGroup.visible = false;
    scene.add(whiteRoomGroup);

    return whiteRoomGroup;
}

// Fonction de transition principale vers la galerie
function startGalleryTransition() {
    console.log('Démarrage de la transition vers la pièce blanche');

    if (transitionState !== 'menu') return;
    transitionState = 'entering';

    // Terminer l'introduction si elle est en cours
    if (variableIntroduction) {
        variableIntroduction.end();
    }

    // Masquage des éléments d'interface
    const bottomPanel = document.querySelector('div[style*="bottom: 0"]');
    const mainTitle = document.querySelector('div[style*="' + t('mainTitle') + '"]');
    const menuButton = document.querySelector('div[style*="top: 20px"]');
    const languageMenu = document.getElementById('language-menu-main');

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
    if (languageMenu) {
        languageMenu.style.opacity = '0';
        languageMenu.style.transition = 'all 0.5s ease';
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
                    cube.visible = false;
                    base.visible = false;
                    whiteRoom.visible = true;
                    portalMesh.visible = true;

                    camera.position.set(0, 0, 6);
                    camera.lookAt(0, 0, -4.5);

                    transitionState = 'white_room';
                    whiteRoomReady = true;

                    setTimeout(() => {
                        whiteOverlay.style.opacity = '0';
                        setTimeout(() => {
                            whiteOverlay.remove();
                            gsap.to(portalShaderMaterial.uniforms.portalIntensity, {
                                duration: 2,
                                value: 1.0,
                                ease: "power2.out"
                            });
                            // Lancement de l'introduction à rythme variable
                            createVariableIntroduction();
                        }, 800);
                    }, 300);
                }, 800);
            }
        });
    } else {
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
            createVariableIntroduction();
        }, 2500);
    }
}

// Création de l'introduction à rythme variable
function createVariableIntroduction() {
    variableIntroduction = new VariablePaceIntroduction();

    // Créer le bouton skip
    createSkipButton();

    // Délai avant de commencer l'introduction
    setTimeout(() => {
        variableIntroduction.start();
    }, 1000);
}

// Fonction d'approche et traversée du portail
function startPortalApproach() {
    if (transitionState !== 'white_room') return;

    console.log('Approche du portail interdimensionnel');
    transitionState = 'approaching_portal';

    // Terminer l'introduction
    if (variableIntroduction) {
    }

    if (window.gsap) {
        const tl = gsap.timeline();

        tl.to(camera.position, {
            duration: 3,
            z: 1.5,
            ease: "power2.inOut",
            onUpdate: () => {
                const progress = 1 - (camera.position.z - 1.5) / 2.5;
                portalShaderMaterial.uniforms.cameraProgress.value = progress * 0.3;
            }
        })

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
                    finalOverlay.innerHTML = t('transitionToGallery');
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

    const portalGeometry = new THREE.PlaneGeometry(3.2, 7.5, 64, 128);
    portalMesh = new THREE.Mesh(portalGeometry, portalShaderMaterial);
    portalMesh.position.set(0, -0.25, -6);
    portalMesh.visible = false;
    scene.add(portalMesh);

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

        const distributionType = Math.random();
        let x, y, z;

        if (distributionType < 0.7) {
            const side = Math.random();
            if (side < 0.25) {
                x = -1.8 - Math.random() * 0.8;
                y = -3.5 + Math.random() * 7;
                z = -6 + (Math.random() - 0.5) * 1.5;
            } else if (side < 0.5) {
                x = 1.8 + Math.random() * 0.8;
                y = -3.5 + Math.random() * 7;
                z = -6 + (Math.random() - 0.5) * 1.5;
            } else if (side < 0.75) {
                x = (Math.random() - 0.5) * 4;
                y = 3.2 + Math.random() * 0.8;
                z = -6 + (Math.random() - 0.5) * 1.5;
            } else {
                x = (Math.random() - 0.5) * 4;
                y = -3.8 + Math.random() * 0.6;
                z = -6 + (Math.random() - 0.5) * 1.5;
            }
        } else if (distributionType < 0.9) {
            const angle = Math.random() * Math.PI * 2;
            const radius = 3.5 + Math.random() * 1.5;
            x = Math.cos(angle) * radius;
            y = -2 + Math.random() * 6;
            z = -6 + Math.sin(angle) * radius * 0.3;
        } else {
            const angle = Math.random() * Math.PI * 2;
            const radius = 5 + Math.random() * 2;
            x = Math.cos(angle) * radius;
            y = -1 + Math.random() * 4;
            z = -6 + Math.sin(angle) * radius * 0.4;
        }

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        const colorChoice = Math.random();
        if (colorChoice < 0.4) {
            colors[i3] = 0.1 + Math.random() * 0.2;
            colors[i3 + 1] = 0.7 + Math.random() * 0.3;
            colors[i3 + 2] = 0.8 + Math.random() * 0.2;
        } else if (colorChoice < 0.7) {
            colors[i3] = 0.6 + Math.random() * 0.4;
            colors[i3 + 1] = 0.2 + Math.random() * 0.3;
            colors[i3 + 2] = 0.8 + Math.random() * 0.2;
        } else {
            colors[i3] = 0.9 + Math.random() * 0.1;
            colors[i3 + 1] = 0.6 + Math.random() * 0.3;
            colors[i3 + 2] = 0.1 + Math.random() * 0.2;
        }

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

    const positions = window.portalParticles.geometry.attributes.position.array;
    const velocities = window.particleVelocities;
    const time = Date.now() * 0.001;

    for (let i = 0; i < positions.length / 3; i++) {
        const i3 = i * 3;
        const v = velocities[i];

        v.angle += v.speed;

        const waveOffset = Math.sin(time * 0.6 + i * 0.04) * 0.15;

        positions[i3] = v.originalX + Math.cos(v.angle + time * 0.3) * waveOffset;
        positions[i3 + 2] = -6 + Math.sin(v.angle + time * 0.2) * (waveOffset * 0.6);

        positions[i3 + 1] = v.originalY + Math.sin(time * 1.2 + v.angle) * 0.12;

        positions[i3] += v.x;
        positions[i3 + 1] += v.verticalSpeed * 0.8;
        positions[i3 + 2] += v.z;

        if (positions[i3] < -7 || positions[i3] > 7) v.x = -v.x;
        if (positions[i3 + 1] < -5 || positions[i3 + 1] > 5) v.verticalSpeed = -v.verticalSpeed;
        if (positions[i3 + 2] < -9 || positions[i3 + 2] > -3) v.z = -v.z;
    }

    window.portalParticles.geometry.attributes.position.needsUpdate = true;

    if (window.portalLight) {
        const lightPulse = 2.8 + 0.5 * Math.sin(time * 0.8);
        window.portalLight.intensity = lightPulse;
    }

    if (window.portalGlow) {
        const glowPulse = 1.8 + 0.4 * Math.sin(time * 0.6);
        window.portalGlow.intensity = glowPulse;
    }

    if (window.portalShadow) {
        const shadowPulse = 1 + 0.12 * Math.sin(time * 0.7);
        window.portalShadow.scale.set(shadowPulse, shadowPulse, 1);
    }
}

// Gestion de la visibilité des éléments selon l'état
function updatePortalVisibility() {
    if (transitionState === 'white_room' || transitionState === 'approaching_portal' || transitionState === 'transitioning') {
        if (portalMesh) portalMesh.visible = true;
        if (window.portalLight) window.portalLight.visible = true;
        if (window.portalGlow) window.portalGlow.visible = true;
        if (window.portalShadow) window.portalShadow.visible = true;
        if (window.portalParticles) window.portalParticles.visible = true;
        if (cube) cube.visible = false;
        if (base) base.visible = false;

        animatePortal();
    } else {
        if (portalMesh) portalMesh.visible = false;
        if (window.portalLight) window.portalLight.visible = false;
        if (window.portalGlow) window.portalGlow.visible = false;
        if (window.portalShadow) window.portalShadow.visible = false;
        if (window.portalParticles) window.portalParticles.visible = false;
        if (cube) cube.visible = true;
        if (base) base.visible = true;
    }
}

// Fonction pour mettre à jour le panneau de contrôle avec la langue
function updateControlPanelLanguage() {
    const soundTitle = document.querySelector('.sound-title');
    const playTitle = document.querySelector('.play-title');
    const colorPerceptionTitle = document.querySelector('.color-perception-title');
    const subtitle = document.querySelector('.subtitle');

    if (soundTitle) soundTitle.textContent = t('soundControl');
    if (playTitle) playTitle.textContent = t('startGame');
    if (colorPerceptionTitle) colorPerceptionTitle.textContent = t('colorPerceptionTitle');
    if (subtitle) subtitle.textContent = t('interactiveExperience');
}

// Fonction pour mettre à jour le menu déroulant avec la langue
function updateDropdownMenuLanguage() {
    const menuItems = document.querySelectorAll('.menu-item');
    const menuTexts = ['home', 'about', 'settings', 'help', 'credits'];

    menuItems.forEach((item, index) => {
        if (index < menuTexts.length) {
            item.textContent = t(menuTexts[index]);
        }
    });
}

// Construction de l'interface utilisateur principale avec support multilingue
function createMenuElements() {
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
    mainTitle.textContent = t('mainTitle');

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

    const leftColumn = document.createElement('div');
    leftColumn.style.display = 'flex';
    leftColumn.style.flexDirection = 'column';
    leftColumn.style.alignItems = 'center';
    leftColumn.style.justifyContent = 'center';
    leftColumn.style.textAlign = 'center';
    leftColumn.style.width = '25%';

    const soundTitle = document.createElement('div');
    soundTitle.className = 'sound-title';
    soundTitle.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    soundTitle.style.fontSize = '16px';
    soundTitle.style.color = '#333';
    soundTitle.style.marginBottom = '10px';
    soundTitle.textContent = t('soundControl');

    // BOUTON SON CONNECTÉ AU SYSTÈME AUDIO
    const soundButton = document.createElement('div');
    soundButton.id = 'sound-button'; // ID pour que l'AudioManager puisse le trouver
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
    soundButton.style.transition = 'all 0.3s ease';
    soundButton.style.fontSize = '20px';
    soundButton.innerHTML = '🔇'; // Icône par défaut

    // EVENT LISTENER CONNECTÉ AU SYSTÈME AUDIO
    soundButton.addEventListener('click', () => {
        if (audioManager) {
            audioManager.toggle();
        }
    });

    // Effets de survol
    soundButton.addEventListener('mouseenter', () => {
        soundButton.style.transform = 'scale(1.1)';
        soundButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    });

    soundButton.addEventListener('mouseleave', () => {
        soundButton.style.transform = 'scale(1)';
        soundButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
    });

    leftColumn.appendChild(soundTitle);
    leftColumn.appendChild(soundButton);

    const centerColumn = document.createElement('div');
    centerColumn.style.display = 'flex';
    centerColumn.style.flexDirection = 'column';
    centerColumn.style.alignItems = 'center';
    centerColumn.style.justifyContent = 'center';
    centerColumn.style.textAlign = 'center';
    centerColumn.style.width = '50%';

    const colorPerceptionTitle = document.createElement('div');
    colorPerceptionTitle.className = 'color-perception-title';
    colorPerceptionTitle.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    colorPerceptionTitle.style.fontSize = '24px';
    colorPerceptionTitle.style.fontWeight = 'bold';
    colorPerceptionTitle.style.color = '#333';
    colorPerceptionTitle.style.letterSpacing = '2px';
    colorPerceptionTitle.textContent = t('colorPerceptionTitle');

    const subtitle = document.createElement('div');
    subtitle.className = 'subtitle';
    subtitle.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    subtitle.style.fontSize = '14px';
    subtitle.style.color = '#666';
    subtitle.style.marginTop = '5px';
    subtitle.textContent = t('interactiveExperience');

    centerColumn.appendChild(colorPerceptionTitle);
    centerColumn.appendChild(subtitle);

    const rightColumn = document.createElement('div');
    rightColumn.style.display = 'flex';
    rightColumn.style.flexDirection = 'column';
    rightColumn.style.alignItems = 'center';
    rightColumn.style.justifyContent = 'center';
    rightColumn.style.textAlign = 'center';
    rightColumn.style.width = '25%';

    const playTitle = document.createElement('div');
    playTitle.className = 'play-title';
    playTitle.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
    playTitle.style.fontSize = '16px';
    playTitle.style.color = '#333';
    playTitle.style.marginBottom = '10px';
    playTitle.textContent = t('startGame');

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

    // BOUTON PLAY CONNECTÉ AU SYSTÈME AUDIO
    playButton.addEventListener('click', (event) => {
        event.preventDefault();
        console.log('Lancement de l\'expérience demandé par l\'utilisateur');
        
        // Démarrer la musique en fade-in UNIQUEMENT si l'utilisateur n'a pas explicitement désactivé le son
        if (audioManager && localStorage.getItem('colorPerceptionAudio')) {
            // Vérifier les préférences sauvegardées
            try {
                const preferences = JSON.parse(localStorage.getItem('colorPerceptionAudio'));
                // Ne démarrer la musique que si l'utilisateur la souhaitait activée
                if (preferences.isPlaying === true && !audioManager.isPlaying) {
                    audioManager.fadeIn(1500);
                }
            } catch (error) {
                console.warn('⚠️ Erreur lors de la lecture des préférences audio:', error);
            }
        } else if (audioManager && !audioManager.isPlaying) {
            // Comportement par défaut pour un nouvel utilisateur (première visite)
            audioManager.fadeIn(1500);
        }
        
        startGalleryTransition();
    });

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

    bottomPanel.appendChild(leftColumn);
    bottomPanel.appendChild(centerColumn);
    bottomPanel.appendChild(rightColumn);

    // MENU DÉROULANT AVEC PARAMÈTRES AUDIO
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

    // Éléments du menu déroulant avec fonctionnalités
    const menuItems = [
        {
            key: 'home',
            action: () => {
                // Remettre à zéro la vue
                if (transitionState === 'menu') {
                    camera.position.set(0, 0, 5);
                    camera.lookAt(0, 0, 0);
                    controls.reset();
                }
            }
        },
        {
            key: 'about',
            action: () => {
                // Afficher les informations sur le projet
                const aboutModal = document.createElement('div');
                aboutModal.style.cssText = `
                   position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                   background: rgba(0, 0, 0, 0.8); z-index: 1000; display: flex;
                   align-items: center; justify-content: center; padding: 20px;
               `;
                aboutModal.innerHTML = `
                   <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px;">
                       <h2 style="margin: 0 0 15px 0; color: #333;">${currentLanguage === 'fr' ? 'À propos du projet' : 'About the project'}</h2>
                       <p style="line-height: 1.6; color: #666; margin-bottom: 20px;">
                           ${currentLanguage === 'fr' ?
                        'Ce projet explore les illusions d\'optique liées à la perception des couleurs, créé par Néha et Dounia dans le cadre d\'un projet tuteuré universitaire.' :
                        'This project explores optical illusions related to color perception, created by Néha and Dounia as part of a university tutored project.'
                    }
                       </p>
                       <button onclick="this.parentElement.parentElement.remove()" style="
                           background: #667eea; color: white; border: none; padding: 10px 20px;
                           border-radius: 5px; cursor: pointer; float: right;
                       ">${currentLanguage === 'fr' ? 'Fermer' : 'Close'}</button>
                   </div>
               `;
                document.body.appendChild(aboutModal);
                aboutModal.addEventListener('click', (e) => {
                    if (e.target === aboutModal) aboutModal.remove();
                });
            }
        },
        {
            key: 'settings',
            action: () => {
                // PARAMÈTRES AVEC CONTRÔLE AUDIO
                const settingsModal = document.createElement('div');
                settingsModal.style.cssText = `
                   position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                   background: rgba(0, 0, 0, 0.8); z-index: 1000; display: flex;
                   align-items: center; justify-content: center; padding: 20px;
               `;
                settingsModal.innerHTML = `
                   <div style="background: white; padding: 30px; border-radius: 15px; max-width: 400px;">
                       <h2 style="margin: 0 0 15px 0; color: #333;">${currentLanguage === 'fr' ? 'Paramètres' : 'Settings'}</h2>
                       
                       <div style="margin-bottom: 20px;">
                           <label style="display: block; margin-bottom: 10px; color: #666;">
                               ${currentLanguage === 'fr' ? 'Volume de la musique :' : 'Music volume:'}
                           </label>
                           <input type="range" id="volume-slider" min="0" max="100" value="${Math.round((audioManager?.volume || 0.3) * 100)}" style="width: 100%; margin-bottom: 5px;">
                           <div style="text-align: center; font-size: 14px; color: #999;">
                               <span id="volume-display">${Math.round((audioManager?.volume || 0.3) * 100)}%</span>
                           </div>
                       </div>
                       
                       <div style="margin-bottom: 15px;">
                           <label style="display: block; margin-bottom: 5px; color: #666;">
                               ${currentLanguage === 'fr' ? 'Qualité graphique :' : 'Graphics quality:'}
                           </label>
                           <select style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                               <option>${currentLanguage === 'fr' ? 'Élevée' : 'High'}</option>
                               <option>${currentLanguage === 'fr' ? 'Moyenne' : 'Medium'}</option>
                               <option>${currentLanguage === 'fr' ? 'Faible' : 'Low'}</option>
                           </select>
                       </div>
                       
                       <div style="margin-bottom: 20px;">
                           <label style="display: block; margin-bottom: 5px; color: #666;">
                               <input type="checkbox" checked> ${currentLanguage === 'fr' ? 'Effets visuels' : 'Visual effects'}
                           </label>
                           <label style="display: block; margin-bottom: 5px; color: #666;">
                               <input type="checkbox" checked> ${currentLanguage === 'fr' ? 'Particules' : 'Particles'}
                           </label>
                       </div>
                       
                       <button onclick="this.parentElement.parentElement.remove()" style="
                           background: #667eea; color: white; border: none; padding: 10px 20px;
                           border-radius: 5px; cursor: pointer; float: right;
                       ">${currentLanguage === 'fr' ? 'Fermer' : 'Close'}</button>
                   </div>
               `;
                document.body.appendChild(settingsModal);

                // EVENT LISTENER POUR LE CONTRÔLE DE VOLUME
                const volumeSlider = settingsModal.querySelector('#volume-slider');
                const volumeDisplay = settingsModal.querySelector('#volume-display');

                volumeSlider.addEventListener('input', function () {
                    const newVolume = this.value / 100;
                    volumeDisplay.textContent = this.value + '%';
                    if (audioManager) {
                        audioManager.setVolume(newVolume);
                    }
                });

                settingsModal.addEventListener('click', (e) => {
                    if (e.target === settingsModal) settingsModal.remove();
                });
            }
        },
        {
            key: 'help',
            action: () => {
                // Afficher l'aide et les contrôles
                const helpModal = document.createElement('div');
                helpModal.style.cssText = `
                   position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                   background: rgba(0, 0, 0, 0.8); z-index: 1000; display: flex;
                   align-items: center; justify-content: center; padding: 20px;
               `;
                helpModal.innerHTML = `
                   <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px;">
                       <h2 style="margin: 0 0 15px 0; color: #333;">${currentLanguage === 'fr' ? 'Aide & Contrôles' : 'Help & Controls'}</h2>
                       <div style="line-height: 1.6; color: #666;">
                           <h4>${currentLanguage === 'fr' ? 'Contrôles de la souris :' : 'Mouse controls:'}</h4>
                           <ul>
                               <li>${currentLanguage === 'fr' ? 'Clic gauche + glisser : Faire tourner la vue' : 'Left click + drag: Rotate view'}</li>
                               <li>${currentLanguage === 'fr' ? 'Survol du cube : Effet interactif' : 'Hover cube: Interactive effect'}</li>
                               <li>${currentLanguage === 'fr' ? 'Clic sur le bouton Play : Démarrer l\'expérience' : 'Click Play button: Start experience'}</li>
                               <li>${currentLanguage === 'fr' ? 'Bouton audio : Contrôler la musique de fond' : 'Audio button: Control background music'}</li>
                           </ul>
                           <h4>${currentLanguage === 'fr' ? 'Navigation :' : 'Navigation:'}</h4>
                           <ul>
                               <li>${currentLanguage === 'fr' ? 'Flèches ← → : Navigation dans les expériences' : 'Arrow keys ← →: Navigate experiments'}</li>
                               <li>${currentLanguage === 'fr' ? 'Espace : Lancer une expérience' : 'Space: Launch experiment'}</li>
                               <li>${currentLanguage === 'fr' ? 'Échap : Retour ou fermer' : 'Escape: Back or close'}</li>
                          </ul>
                      </div>
                      <button onclick="this.parentElement.parentElement.remove()" style="
                          background: #667eea; color: white; border: none; padding: 10px 20px;
                          border-radius: 5px; cursor: pointer; float: right;
                      ">${currentLanguage === 'fr' ? 'Fermer' : 'Close'}</button>
                  </div>
              `;
                document.body.appendChild(helpModal);
                helpModal.addEventListener('click', (e) => {
                    if (e.target === helpModal) helpModal.remove();
                });
            }
        },
        {
            key: 'credits',
            action: () => {
                // Afficher les crédits
                const creditsModal = document.createElement('div');
                creditsModal.style.cssText = `
                  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                  background: rgba(0, 0, 0, 0.8); z-index: 1000; display: flex;
                  align-items: center; justify-content: center; padding: 20px;
              `;
                creditsModal.innerHTML = `
                  <div style="background: white; padding: 30px; border-radius: 15px; max-width: 500px; text-align: center;">
                      <h2 style="margin: 0 0 20px 0; color: #333;">${currentLanguage === 'fr' ? 'Crédits' : 'Credits'}</h2>
                      <div style="line-height: 1.8; color: #666;">
                          <h4 style="color: #667eea; margin: 15px 0 10px 0;">${currentLanguage === 'fr' ? 'Idées' : 'Ideas'}</h4>
                          <p>Néha & Dounia</p>
                          
                          <h4 style="color: #667eea; margin: 15px 0 10px 0;">${currentLanguage === 'fr' ? 'Développement et Musique' : 'Development & Music'}</h4>
                          <p>Dounia</p>
                          
                          <h4 style="color: #667eea; margin: 15px 0 10px 0;">${currentLanguage === 'fr' ? 'Technologies utilisées' : 'Technologies used'}</h4>
                          <p>Three.js, WebGL, GSAP, JavaScript ES6+</p>
                          
                          <h4 style="color: #667eea; margin: 15px 0 10px 0;">${currentLanguage === 'fr' ? 'Références scientifiques' : 'Scientific references'}</h4>
                          <p>Michel-Eugène Chevreul, Edwin Land, Edward Adelson, Richard Gregory</p>
                          
                          <h4 style="color: #667eea; margin: 15px 0 10px 0;">${currentLanguage === 'fr' ? 'Remerciements' : 'Acknowledgments'}</h4>
                          <p>${currentLanguage === 'fr' ? 'Université Paris 8- Projet tuteuré 2024' : 'University Paris 8 - Tutored Project 2025'}</p>
                      </div>
                      <button onclick="this.parentElement.parentElement.remove()" style="
                          background: #667eea; color: white; border: none; padding: 10px 20px;
                          border-radius: 5px; cursor: pointer; margin-top: 15px;
                      ">${currentLanguage === 'fr' ? 'Fermer' : 'Close'}</button>
                  </div>
              `;
                document.body.appendChild(creditsModal);
                creditsModal.addEventListener('click', (e) => {
                    if (e.target === creditsModal) creditsModal.remove();
                });
            }
        }
    ];

    menuItems.forEach((item, index) => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.style.fontFamily = '"Segoe UI", Helvetica, Arial, sans-serif';
        menuItem.style.fontSize = '16px';
        menuItem.style.padding = '10px 20px';
        menuItem.style.cursor = 'pointer';
        menuItem.style.pointerEvents = 'auto';
        menuItem.style.transition = 'background-color 0.2s';
        menuItem.textContent = t(item.key);

        menuItem.addEventListener('mouseover', () => {
            menuItem.style.backgroundColor = '#f5f5f5';
        });

        menuItem.addEventListener('mouseout', () => {
            menuItem.style.backgroundColor = 'white';
        });

        menuItem.addEventListener('click', () => {
            item.action();
            menuPanel.style.display = 'none';
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

    interfaceContainer.appendChild(mainTitle);
    interfaceContainer.appendChild(bottomPanel);
    interfaceContainer.appendChild(menuButton);
    interfaceContainer.appendChild(menuPanel);

    document.addEventListener('click', (event) => {
        if (!menuButton.contains(event.target) && !menuPanel.contains(event.target)) {
            menuPanel.style.display = 'none';
        }
    });
}

// Reste du code identique (socle, contrôles, cube, etc.)
const baseGeometry = new THREE.BoxGeometry(3, 0.3, 3);
const baseMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    metalness: 0.1
});
const base = new THREE.Mesh(baseGeometry, baseMaterial);
base.position.y = -0.5;
scene.add(base);

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

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

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
      uniform float colorTransition;
      
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

const cubeGeometry = new THREE.BoxGeometry(2, 2, 2, 64, 64, 64);
const cube = new THREE.Mesh(cubeGeometry, cubeShaderMaterial);
cube.position.y = 0.5;
scene.add(cube);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let mouseIsOverCube = false;
let lastInteractionTime = 0;
let colorChangeReady = true;

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

function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

// Gestion des contrôles clavier améliorée
document.addEventListener('keydown', (event) => {
    // Navigation dans l'introduction
    if (variableIntroduction && transitionState === 'white_room') {
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                variableIntroduction.previousStep();
                break;
            case 'ArrowRight':
                event.preventDefault();
                variableIntroduction.nextStep();
                break;
            case 'Enter':
            case ' ':
                if (whiteRoomReady && explanationStep >= 5) {
                    event.preventDefault();
                    startPortalApproach();
                }
                break;
        }
    }
});

function animate() {
    requestAnimationFrame(animate);

    cubeShaderMaterial.uniforms.time.value += 0.01;
    portalShaderMaterial.uniforms.iTime.value += 0.016;

    updatePortalVisibility();

    if (transitionState === 'menu') {
        controls.update();
    }

    renderer.render(scene, camera);
}

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

window.myCamera = camera;
window.myControls = controls;
window.getPortalState = () => ({
    transitionState,
    whiteRoomReady,
    explanationStep
});

function init() {
    console.log('Système de portail dimensionnel - Initialisation (Version Multilingue avec Audio)');
    console.log('Séquence d\'expérience:');
    console.log('  1. Interface d\'accueil avec cube interactif et sélection de langue');
    console.log('  2. Transition par zoom vers la pièce blanche');
    console.log('  3. Introduction à rythme variable avec navigation');
    console.log('  4. Traversée vers la galerie interactive améliorée');
    console.log('🎵 Système audio: Musique de fond avec contrôles');

    // INITIALISER LE GESTIONNAIRE AUDIO
    audioManager = new AudioManager();

    // Charger la langue sauvegardée
    const savedLang = localStorage.getItem('colorPerceptionLang');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
        document.getElementById('language-select-main').value = savedLang;
    }

    // Event listener pour le changement de langue dans le menu principal
    document.getElementById('language-select-main').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });

    initScene();
    createMenuElements();
    updateUILanguage();
    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}