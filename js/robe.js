// Système de traduction pour robe.js
const translations = {
    fr: {
        // Étapes d'explication
        step1Title: "La Perception des Couleurs",
        step1Content: `
            <p>As-tu déjà eu un doute sur une couleur ?</p>
            <p>Un vêtement qui paraît différent à la lumière ?</p>
            <p>Un objet qui change de teinte selon son environnement ?</p>
            <p>La couleur peut parfois tromper ton œil.</p>`,
        
        step2Title: "La Robe qui a Divisé Internet",
        step2Content: `
            <p>Connais-tu cette photo devenue virale ?</p>
            <p>Des millions de personnes en ont débattu sur Internet.</p>`,
        
        step3Title: "Que vois-tu ?",
        step3Content: `
            <p>Que vois-tu sur cette robe ?</p>
            <div class="choice-buttons">
                <button id="blue-black-btn" class="choice-btn">Bleu et noir</button>
                <button id="white-gold-btn" class="choice-btn">Blanc et doré</button>
                <button id="unsure-btn" class="choice-btn">Je ne sais pas</button>
            </div>
            <p class="hint">Fais ton choix avant de passer à la suite.</p>`,
        
        step4Title: "Un Phénomène Fascinant",
        step4Content: `
            <p>Eh bien... les deux réponses existent !</p>
            <p>Certaines personnes voient la robe bleue et noire,<br>
            d'autres la voient blanche et dorée.</p>
            <p>Pourquoi une simple photo peut-elle nous diviser ?</p>`,
        
        step5Title: "L'Explication Scientifique",
        step5Content: `
            <p>Ton cerveau interprète la couleur en fonction :</p>
            <ul class="explanation-list">
                <li><strong>de la lumière perçue</strong></li>
                <li><strong>des couleurs environnantes</strong></li>
                <li><strong>de ses propres attentes</strong></li>
            </ul>
            <p>Ce n'est pas l'image qui change, mais ta perception.</p>`,
        
        // Messages finaux
        finalTitle: "Testons ta Perception !",
        finalContent1: "Maintenant que tu en sais plus sur la perception des couleurs,",
        finalContent2: "es-tu prêt(e) à tester tes capacités ?",
        finalContent3: "Découvre si ton œil peut détecter les subtilités chromatiques !",
        gameButton: "Jouer au Test de Perception",
        
        // Messages contextuels
        contextMessage1: "Cliquez sur le bouton ci-dessous pour faire apparaître l'effet de contexte.",
        contextMessage2: "Cliquez sur le bouton ci-dessous pour montrer que les couleurs sont maintenant les mêmes.",
        activateButton: "Activer",
        
        // Navigation
        returningToGallery: "Retour à la galerie...",
        loadingTest: "Chargement du test de perception...",
        exitTitle: "Retour à la galerie",
        
        // Labels des cubes
        sameColor: "MÊME COULEUR"
    },
    
    en: {
        // Explanation steps
        step1Title: "Color Perception",
        step1Content: `
            <p>Have you ever doubted a color?</p>
            <p>A garment that looks different in light?</p>
            <p>An object that changes hue depending on its environment?</p>
            <p>Color can sometimes deceive your eye.</p>`,
        
        step2Title: "The Dress that Divided the Internet",
        step2Content: `
            <p>Do you know this photo that went viral?</p>
            <p>Millions of people debated it on the Internet.</p>`,
        
        step3Title: "What do you see?",
        step3Content: `
            <p>What do you see on this dress?</p>
            <div class="choice-buttons">
                <button id="blue-black-btn" class="choice-btn">Blue and black</button>
                <button id="white-gold-btn" class="choice-btn">White and gold</button>
                <button id="unsure-btn" class="choice-btn">I don't know</button>
            </div>
            <p class="hint">Make your choice before moving on.</p>`,
        
        step4Title: "A Fascinating Phenomenon",
        step4Content: `
            <p>Well... both answers exist!</p>
            <p>Some people see the dress as blue and black,<br>
            others see it as white and gold.</p>
            <p>Why can a simple photo divide us?</p>`,
        
        step5Title: "The Scientific Explanation",
        step5Content: `
            <p>Your brain interprets color based on:</p>
            <ul class="explanation-list">
                <li><strong>perceived light</strong></li>
                <li><strong>surrounding colors</strong></li>
                <li><strong>its own expectations</strong></li>
            </ul>
            <p>It's not the image that changes, but your perception.</p>`,
        
        // Final messages
        finalTitle: "Let's Test Your Perception!",
        finalContent1: "Now that you know more about color perception,",
        finalContent2: "are you ready to test your abilities?",
        finalContent3: "Discover if your eye can detect chromatic subtleties!",
        gameButton: "Play the Perception Test",
        
        // Contextual messages
        contextMessage1: "Click the button below to show the context effect.",
        contextMessage2: "Click the button below to show that the colors are now the same.",
        activateButton: "Activate",
        
        // Navigation
        returningToGallery: "Returning to gallery...",
        loadingTest: "Loading perception test...",
        exitTitle: "Return to gallery",
        
        // Labels for cubes
        sameColor: "SAME COLOR"
    }
};

// Variables globales pour Three.js
let scene, camera, renderer;
let room;
let currentStep = 0;
let controls;
let robePhoto, blueBlackCube, whiteGoldCube, spotlightBlue, spotlightYellow;
var affiche_explication_la = false; // Avec var on est sûr que c'est une variable globale
var affiche_explication_la_rec = false; // Pour les liaisons

// Variables de traduction
let currentLanguage = 'fr';

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
    // Mettre à jour le contenu de l'étape actuelle
    showExplanation(currentStep);
    
    // Mettre à jour le bouton de sortie
    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) {
        exitBtn.title = t('exitTitle');
    }
}

// Créer le menu de sélection de langue
function createLanguageMenu() {
    const languageMenu = document.createElement('div');
    languageMenu.id = 'language-menu';
    languageMenu.style.cssText = `
        position: fixed;
        top: 20px;
        left: 20px;
        z-index: 150;
        background: rgba(255, 255, 255, 0.15);
        backdrop-filter: blur(15px);
        border-radius: 25px;
        padding: 10px 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s ease;
    `;

    languageMenu.innerHTML = `
        <span style="color: white; font-size: 14px; font-weight: 600;">🌐</span>
        <select id="language-select" style="
            background: transparent;
            border: none;
            color: white;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            outline: none;
        ">
            <option value="fr" style="background: #333; color: white;">Français</option>
            <option value="en" style="background: #333; color: white;">English</option>
        </select>
    `;

    document.body.appendChild(languageMenu);

    // Event listener pour le changement de langue
    document.getElementById('language-select').addEventListener('change', (e) => {
        changeLanguage(e.target.value);
    });

    return languageMenu;
}

// Configuration des étapes de l'explication
const explanationSteps = [
    {
        titleKey: "step1Title",
        contentKey: "step1Content"
    },
    {
        titleKey: "step2Title",
        contentKey: "step2Content",
        showRobeImage: true
    },
    {
        titleKey: "step3Title",
        contentKey: "step3Content"
    },
    {
        titleKey: "step4Title",
        contentKey: "step4Content"
    },
    {
        titleKey: "step5Title",
        contentKey: "step5Content"
    }
];

// Gestionnaire du bouton de sortie
const exitBtn = document.getElementById('exit-btn');
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
    overlay.innerHTML = t('returningToGallery');
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.style.opacity = '1';
        setTimeout(() => {
            window.location.href = 'gallery.html';
        }, 1000);
    }, 100);
});

// Initialisation de la scène Three.js
function initializeLanguage() {
    // Charger la langue sauvegardée
    const savedLang = localStorage.getItem('colorPerceptionLang');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
    }
    
    // Créer le menu de langue
    createLanguageMenu();
    
    // Mettre à jour la sélection
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }
    
    // Mettre à jour l'interface avec la langue chargée
    updateUILanguage();
}

init();
animate();

// Fonction d'initialisation
function init() {
    // Créer la scène
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Fond noir

    // Créer la caméra
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 3);

    // Créer le renderer
    renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById('robe'),
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    // Créer la pièce blanche vide
    createWhiteRoom();

    // Préparer les éléments de démonstration (cachés au début)
    createDemonstrationElements();

    // Ajouter le redimensionnement de la fenêtre
    window.addEventListener('resize', onWindowResize);

    // Régler la caméra pour un cadrage optimal
    setCameraPosition();

    // Effet de fondu entrant pour la pièce
    fadeInRoom();

    // Créer l'interface d'explication EN BAS
    createBottomTextInterface();

    // Ajouter les contrôles OrbitControls (désactivés au début)
    if (THREE.OrbitControls) {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.rotateSpeed = 0.5;
        controls.enabled = false;
    } else {
        console.warn("THREE.OrbitControls not found, camera controls disabled");
    }

    // Initialiser la traduction
    initializeLanguage();

    // Démarrer l'expérience après le fondu
    setTimeout(() => {
        showExplanation(0);
    }, 2000);
}

// Créer une pièce blanche vide
function createWhiteRoom() {
    room = new THREE.Group();

    const roomSize = 16;
    const roomHeight = 8;
    let ambiance_light = 0.5; // Lumière ambiante pour la pièce
    
    // Ajouter une lumière ambiante douce
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, ambiance_light);
    room.add(ambientLight);
    
    // Matériau blanc pour les murs avec légère brillance
    const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0xBAB6BC,
        side: THREE.DoubleSide,
        roughness: 1.0,
        metalness: 0.1
    });

    // Sol légèrement différent pour un meilleur effet visuel
    const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0xBAB6BC,
        side: THREE.DoubleSide,
        roughness: 0.75,
        metalness: 0.05
    });

    // Créer les géométries
    const wallGeometry = new THREE.PlaneGeometry(roomSize, roomHeight);
    const floorGeometry = new THREE.PlaneGeometry(roomSize, roomSize);

    // Murs
    const backWall = new THREE.Mesh(wallGeometry, wallMaterial);
    backWall.position.set(0, 0, -roomSize / 2);
    room.add(backWall);

    const leftWall = new THREE.Mesh(wallGeometry, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomSize / 2, 0, 0);
    room.add(leftWall);

    const rightWall = new THREE.Mesh(wallGeometry, wallMaterial);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomSize / 2, 0, 0);
    room.add(rightWall);

    const frontWall = new THREE.Mesh(wallGeometry, wallMaterial);
    frontWall.rotation.y = Math.PI;
    frontWall.position.set(0, 0, roomSize / 2);
    room.add(frontWall);

    // Sol
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -roomHeight / 2, 0);
    room.add(floor);

    // Plafond
    const ceiling = new THREE.Mesh(floorGeometry, wallMaterial);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, roomHeight / 2, 0);
    room.add(ceiling);

    // Ajouter des spots lumineux au plafond
    const spotCount = 2;
    for (let i = 0; i < spotCount; i++) {
        for (let j = 0; j < spotCount; j++) {
            const x = (i / (spotCount - 1) - 0.5) * roomSize * 0.8;
            const z = (j / (spotCount - 1) - 0.5) * roomSize * 0.8;

            // Lumière spot
            const spotLight = new THREE.PointLight(0xffffff, 0.3, roomSize);
            spotLight.position.set(x, roomHeight / 2 - 0.1, z);
            room.add(spotLight);

            // Petit spot visuel (représentation visuelle de la source de lumière)
            const spotGeometry = new THREE.BoxGeometry(0.2, 0.1, 0.2);
            const spotMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
            const spot = new THREE.Mesh(spotGeometry, spotMaterial);
            spot.position.copy(spotLight.position);
            room.add(spot);
        }
    }

    // Ajouter des plinthes discrètes
    const plinthGeometry = new THREE.BoxGeometry(roomSize, 0.1, 0.05);
    const plinthMaterial = new THREE.MeshStandardMaterial({
        color: 0xeeeeee,
        roughness: 0.7
    });

    const backPlinthe = new THREE.Mesh(plinthGeometry, plinthMaterial);
    backPlinthe.position.set(0, -roomHeight / 2 + 0.05, -roomSize / 2 + 0.02);
    room.add(backPlinthe);

    const frontPlinthe = new THREE.Mesh(plinthGeometry, plinthMaterial);
    frontPlinthe.position.set(0, -roomHeight / 2 + 0.05, roomSize / 2 - 0.02);
    room.add(frontPlinthe);

    const sidePlinthGeometry = new THREE.BoxGeometry(0.05, 0.1, roomSize);

    const leftPlinthe = new THREE.Mesh(sidePlinthGeometry, plinthMaterial);
    leftPlinthe.position.set(-roomSize / 2 + 0.02, -roomHeight / 2 + 0.05, 0);
    room.add(leftPlinthe);

    const rightPlinthe = new THREE.Mesh(sidePlinthGeometry, plinthMaterial);
    rightPlinthe.position.set(roomSize / 2 - 0.02, -roomHeight / 2 + 0.05, 0);
    room.add(rightPlinthe);

    // Opacité initiale à 0 pour l'effet de fondu
    room.traverse(object => {
        if (object.isMesh) {
            if (object.material) {
                object.material = object.material.clone(); // Clone pour éviter de modifier d'autres matériaux
                object.material.transparent = true;
                object.material.opacity = 0;
            }
        }
        if (object.isLight) {
            object.originalIntensity = object.intensity;
            object.intensity = 0; // Lumières éteintes au début
        }
    });

    // Ajouter à la scène
    scene.add(room);
}

// Dans createDemonstrationElements(), ajustons les cubes et les lumières
function createDemonstrationElements() {
    // Charger l'image de la robe
    const textureLoader = new THREE.TextureLoader();
    const robeTexture = textureLoader.load('images/the_dress.jpg',
        // Callback de succès pour s'assurer que l'image est bien chargée
        function (texture) {
            // Ajuster la taille du cadre pour correspondre aux proportions de l'image
            const imgWidth = texture.image.width;
            const imgHeight = texture.image.height;
            const ratio = imgHeight / imgWidth;

            // Recréer le cadre avec les bonnes proportions
            const frameWidth = 3.5;
            const frameHeight = frameWidth * ratio;
            const newFrameGeometry = new THREE.PlaneGeometry(frameWidth, frameHeight);
            robePhoto.geometry.dispose();
            robePhoto.geometry = newFrameGeometry;

            // Ajouter un léger cadre blanc autour de l'image
            const frameBorder = new THREE.Mesh(
                new THREE.BoxGeometry(frameWidth + 0.1, frameHeight + 0.1, 0.05),
                new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.7 })
            );
            frameBorder.position.set(0, 0, -7.85); // Juste derrière la photo
            frameBorder.visible = false;
            scene.add(frameBorder);

            // Lier le cadre à la photo pour qu'ils apparaissent ensemble
            robePhoto.userData.frameBorder = frameBorder;
        }
    );

    // Créer un cadre pour l'image de la robe
    const frameGeometry = new THREE.PlaneGeometry(3.5, 5); // Dimensions temporaires
    const frameMaterial = new THREE.MeshStandardMaterial({
        map: robeTexture,
        side: THREE.DoubleSide
    });

    robePhoto = new THREE.Mesh(frameGeometry, frameMaterial);
    robePhoto.position.set(0, 0, -1); // Beaucoup plus à l'avant de la pièce pour une meilleure visibilité
    robePhoto.visible = false; // Caché au début
    scene.add(robePhoto);

    // Créer les cubes de couleur pour la démonstration
    const cubeGeometry = new THREE.BoxGeometry(2.5, 2.5, 2.5); // Cubes plus grands comme demandé

    // Cube 1: Version "Bleu et Noir" 
    const blueBlackMaterial = new THREE.MeshStandardMaterial({
        color: 0x3E4762, // Couleur bleu-noir de la robe
        roughness: 0.6,
        metalness: 0.2
    });

    blueBlackCube = new THREE.Mesh(cubeGeometry, blueBlackMaterial);
    blueBlackCube.position.set(-2.5, 0, -5); // Légèrement plus espacés
    blueBlackCube.visible = false; // Caché au début
    scene.add(blueBlackCube);

    // Cube 2: Version "Blanc et Or"
    const whiteGoldMaterial = new THREE.MeshStandardMaterial({
        color: 0xD6C6A5, // Couleur blanc-or de la robe
        roughness: 0.6,
        metalness: 0.4
    });

    whiteGoldCube = new THREE.Mesh(cubeGeometry, whiteGoldMaterial);
    whiteGoldCube.position.set(2.5, 0, -5); // Légèrement plus espacés
    whiteGoldCube.visible = false; // Caché au début
    scene.add(whiteGoldCube);

    // Ajouter des socles pour les cubes (pour un meilleur effet visuel)
    const pedestalGeometry = new THREE.BoxGeometry(3, 0.2, 3);
    const pedestalMaterial = new THREE.MeshStandardMaterial({
        color: 0xEEEEEE,
        roughness: 0.8
    });

    const pedestal1 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal1.position.set(-2.5, -1.35, -5);
    pedestal1.visible = false;
    scene.add(pedestal1);
    blueBlackCube.userData.pedestal = pedestal1;

    const pedestal2 = new THREE.Mesh(pedestalGeometry, pedestalMaterial);
    pedestal2.position.set(2.5, -1.35, -5);
    pedestal2.visible = false;
    scene.add(pedestal2);
    whiteGoldCube.userData.pedestal = pedestal2;

    // Ajouter des étiquettes pour les cubes - MODIFIÉ POUR LA TRADUCTION
    const createLabel = (position) => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 128;
        const context = canvas.getContext('2d');
        context.fillStyle = '#FFFFFF';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = '#000000';
        context.font = 'bold 36px Arial';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(t('sameColor'), canvas.width / 2, canvas.height / 2);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide
        });

        const labelGeometry = new THREE.PlaneGeometry(1.5, 0.75);
        const label = new THREE.Mesh(labelGeometry, material);
        label.position.copy(position);
        label.position.y -= 1.6; // Sous le socle
        label.rotation.x = -Math.PI / 4; // Légèrement incliné pour être visible
        label.visible = false;
        scene.add(label);
        
        // Ajouter une fonction pour mettre à jour le texte
        label.updateText = () => {
            context.fillStyle = '#FFFFFF';
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.fillStyle = '#000000';
            context.fillText(t('sameColor'), canvas.width / 2, canvas.height / 2);
            texture.needsUpdate = true;
        };
        
        return label;
    };

    const label1 = createLabel(new THREE.Vector3(-2.5, 0, -3));
    const label2 = createLabel(new THREE.Vector3(2.5, 0, -3));

    blueBlackCube.userData.label = label1;
    whiteGoldCube.userData.label = label2;
}

function createBottomTextInterface() {
    const bottomPanel = document.createElement('div');
    bottomPanel.id = 'bottom-text-panel';
    bottomPanel.style.cssText = `
        position: fixed;
        bottom: 0;
        left: 0;
        width: 100%;
        background: rgba(30, 30, 50, 0.3);
        backdrop-filter: blur(10px);
        border-top: 1px solid rgba(255, 255, 255, 0.1);
        padding: 15px 20px;
        color: white;
        font-family: "Segoe UI", Helvetica, Arial, sans-serif;
        z-index: 100;
        max-height: 25vh;
        overflow-y: auto;
        box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2);
    `;

    const content = document.createElement('div');
    content.id = 'bottom-content';
    content.style.cssText = `
        max-width: 800px;
        margin: 0 auto;
        text-align: center;
    `;

    const title = document.createElement('h2');
    title.id = 'bottom-title';
    title.style.cssText = `
        margin: 0 0 10px 0;
        font-size: 20px;
        color: #66D9EF;
        font-weight: 600;
    `;

    const text = document.createElement('div');
    text.id = 'bottom-text';
    text.style.cssText = `
        font-size: 16px;
        line-height: 1.4;
        margin-bottom: 15px;
    `;

    // Créer la flèche de navigation sur le côté
    const arrowBtn = document.createElement('button');
    arrowBtn.id = 'bottom-arrow-btn';
    arrowBtn.innerHTML = '→';
    arrowBtn.style.cssText = `
        position: fixed;
        bottom: 60px;
        right: 20px;
        width: 40px;
        height: 40px;
        background: rgba(77, 109, 227, 0.8);
        border: none;
        color: white;
        font-size: 20px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        z-index: 101;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    arrowBtn.addEventListener('mouseenter', () => {
        arrowBtn.style.transform = 'scale(1.1)';
        arrowBtn.style.background = 'rgba(91, 125, 245, 0.9)';
    });

    arrowBtn.addEventListener('mouseleave', () => {
        arrowBtn.style.transform = 'scale(1)';
        arrowBtn.style.background = 'rgba(77, 109, 227, 0.8)';
    });

    arrowBtn.onclick = () => nextStep();

    // Ajouter l'événement clavier pour la flèche droite
    document.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowRight' || event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            nextStep();
        }
    });

    document.body.appendChild(arrowBtn);

    content.appendChild(title);
    content.appendChild(text);
    bottomPanel.appendChild(content);
    document.body.appendChild(bottomPanel);

    // Styles pour les éléments de contenu
    const style = document.createElement('style');
    style.textContent = `
        #bottom-text-panel p {
            margin: 6px 0;
            line-height: 1.3;
            font-size: 16px;
        }
        
        #bottom-text-panel .choice-buttons {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin: 15px 0;
            flex-wrap: wrap;
        }
        
        #bottom-text-panel .choice-btn {
            background: linear-gradient(135deg, rgba(50, 50, 80, 0.8), rgba(80, 50, 100, 0.8));
            border: 2px solid rgba(255, 255, 255, 0.2);
           color: white;
           font-size: 15px;
           padding: 10px 18px;
           border-radius: 15px;
           cursor: pointer;
           transition: all 0.3s ease;
           box-shadow: 0 2px 8px rgba(0,0,0,0.2);
           font-family: "Segoe UI", Helvetica, Arial, sans-serif;
       }
       
       #bottom-text-panel .choice-btn:hover {
           transform: translateY(-2px) scale(1.02);
           box-shadow: 0 4px 12px rgba(0,0,0,0.3);
           background: linear-gradient(135deg, rgba(60, 60, 100, 0.9), rgba(100, 60, 130, 0.9));
           border-color: rgba(255, 255, 255, 0.4);
       }
       
       #bottom-text-panel .explanation-list {
           text-align: left;
           max-width: 450px;
           margin: 10px auto;
           padding-left: 20px;
       }
       
       #bottom-text-panel .explanation-list li {
           margin-bottom: 6px;
           color: rgba(255, 255, 255, 0.95);
           font-size: 15px;
           line-height: 1.3;
       }
       
       #bottom-text-panel .explanation-list strong {
           color: rgb(239, 237, 102);
       }
       
       #bottom-text-panel .hint {
           font-size: 14px !important;
           opacity: 0.8;
           font-style: italic;
           margin-top: 8px;
       }
   `;
   document.head.appendChild(style);
}

// Les plans de contexte des plans verticaux avec une couleur qui sont à moitié transparents en globals
const contextPlaneGeometry = new THREE.PlaneGeometry(1, 5);
const petit_contextPlaneGeometry = new THREE.PlaneGeometry(3.5, 0.2);
const contextPlaneMaterial1 = new THREE.MeshBasicMaterial({
   color: 0xF0D29F,
   transparent: true,
   opacity: 0.0
});
const contextPlaneMaterial2 = new THREE.MeshBasicMaterial({
   color: 0x231479,
   transparent: true,
   opacity: 0.0
});
const contextPlaneMaterial3 = new THREE.MeshBasicMaterial({
   color: 0x867568,
   transparent: true,
   opacity: 0.0
});
const contextPlaneMaterial4 = new THREE.MeshBasicMaterial({
   color: 0x8885bf,
   transparent: true,
   opacity: 0.0
});
const contextPlane1 = new THREE.Mesh(contextPlaneGeometry, contextPlaneMaterial1);
const contextPlane2 = new THREE.Mesh(contextPlaneGeometry, contextPlaneMaterial2);
const contextPlane3 = new THREE.Mesh(petit_contextPlaneGeometry, contextPlaneMaterial3);
const contextPlane4 = new THREE.Mesh(petit_contextPlaneGeometry, contextPlaneMaterial4);

// FONCTION MODIFIÉE - utilise maintenant l'interface en bas avec traduction
function showExplanation(stepIndex) {
   currentStep = stepIndex;
   const step = explanationSteps[stepIndex];

   // Mettre à jour le contenu du panneau en bas avec traduction
   const title = document.getElementById('bottom-title');
   const text = document.getElementById('bottom-text');

   if (title && text) {
       title.textContent = t(step.titleKey);
       text.innerHTML = t(step.contentKey);
   }

   // Gérer l'affichage de l'image de la robe directement sur l'écran
   const existingRobeImage = document.getElementById('screen-robe-image');

   // Afficher l'image pour les étapes 1, 2 et 3 (indices 1, 2)
   if (stepIndex >= 1 && stepIndex <= 2) {
       if (!existingRobeImage) {
           const screenRobeImage = document.createElement('div');
           screenRobeImage.id = 'screen-robe-image';
           screenRobeImage.style.cssText = `
               position: fixed;
               top: 45%;
               left: 50%;
               transform: translate(-50%, -50%);
               width: 300px;
               height: 400px;
               background-image: url('images/the_dress.jpg');
               background-size: cover;
               background-position: center;
               border-radius: 15px;
               box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
               border: 3px solid rgba(255, 255, 255, 0.2);
               z-index: 50;
               backdrop-filter: blur(5px);
           `;
           document.body.appendChild(screenRobeImage);
       }
   } else {
       // Supprimer l'image pour les autres étapes
       if (existingRobeImage) {
           existingRobeImage.remove();
       }
   }

   // Masquer l'objet 3D de la robe
   if (robePhoto) {
       robePhoto.visible = false;
       if (robePhoto.userData.frameBorder) {
           robePhoto.userData.frameBorder.visible = false;
       }
   }

   // Afficher les triangles seulement à partir de "L'Explication Scientifique" (index 4)
   if (stepIndex >= 4) {
       // Cubes de gauche (bleu-noir)
       if (blueBlackCube) {
           blueBlackCube.visible = false;
           if (blueBlackCube.userData.pedestal) blueBlackCube.userData.pedestal.visible = true;
           if (blueBlackCube.userData.label) {
               blueBlackCube.userData.label.visible = true;
               // Mettre à jour le texte de l'étiquette avec la traduction
               blueBlackCube.userData.label.updateText();
           }
       }

       // Cubes de droite (blanc-or)
       if (whiteGoldCube) {
           whiteGoldCube.visible = false;
           if (whiteGoldCube.userData.pedestal) whiteGoldCube.userData.pedestal.visible = true;
           if (whiteGoldCube.userData.label) {
               whiteGoldCube.userData.label.visible = true;
               // Mettre à jour le texte de l'étiquette avec la traduction
               whiteGoldCube.userData.label.updateText();
           }
       }

       // Triangles de gauche (bleu-noir)
       let cone1Geometry = new THREE.ConeGeometry(3, 5);
       let cone2Geometry = new THREE.ConeGeometry(3, 5);
       let cone1Material = new THREE.MeshBasicMaterial({ color: 0x161232 });
       let cone2Material = new THREE.MeshBasicMaterial({ color: 0x2138DF });

       let cone1 = new THREE.Mesh(cone1Geometry, cone1Material);
       let cone2 = new THREE.Mesh(cone2Geometry, cone2Material);

       cone1.position.set(-2.5, 0, -4);
       cone2.position.set(-2.5, 1, -4);
       cone1.scale.set(0.4, 0.4, 0.4);
       cone2.scale.set(0.4, 0.4, 0.4);
       scene.add(cone1);
       scene.add(cone2);

       // Triangles de droite (blanc-doré)
       let cone3Geometry = new THREE.ConeGeometry(3, 5);
       let cone4Geometry = new THREE.ConeGeometry(3, 5);
       let cone3Material = new THREE.MeshBasicMaterial({ color: 0xF6DF62 });
       let cone4Material = new THREE.MeshBasicMaterial({ color: 0xFFFEFF });

       let cone3 = new THREE.Mesh(cone3Geometry, cone3Material);
       let cone4 = new THREE.Mesh(cone4Geometry, cone4Material);

       cone3.position.set(2.5, 0, -4);
       cone4.position.set(2.5, 1, -4);
       cone3.scale.set(0.4, 0.4, 0.4);
       cone4.scale.set(0.4, 0.4, 0.4);
       scene.add(cone3);
       scene.add(cone4);

       // Plans de contexte
       contextPlane1.position.set(-1.5, 0, -2.5);
       contextPlane2.position.set(1.5, 0, -2.5);
       scene.add(contextPlane1);
       scene.add(contextPlane2);

       contextPlane3.position.set(0, -0.5, -2);
       contextPlane4.position.set(0, 0.5, -2);
       scene.add(contextPlane3);
       scene.add(contextPlane4);
   } else {
       // Cacher TOUS les éléments avant "L'Explication Scientifique"
       if (blueBlackCube) {
           blueBlackCube.visible = false;
           if (blueBlackCube.userData.pedestal) blueBlackCube.userData.pedestal.visible = false;
           if (blueBlackCube.userData.label) {
               blueBlackCube.userData.label.visible = false;
           }
       }

       if (whiteGoldCube) {
           whiteGoldCube.visible = false;
           if (whiteGoldCube.userData.pedestal) whiteGoldCube.userData.pedestal.visible = false;
           if (whiteGoldCube.userData.label) {
               whiteGoldCube.userData.label.visible = false;
           }
       }
   }

   // Activer les lumières spéciales avec animation
   if (spotlightBlue) {
       spotlightBlue.visible = true;
       if (spotlightBlue.userData.visual) spotlightBlue.userData.visual.visible = true;
   }

   if (spotlightYellow) {
       spotlightYellow.visible = true;
       if (spotlightYellow.userData.visual) spotlightYellow.userData.visual.visible = true;
   }

   // Créer une ambiance
   scene.background = new THREE.Color(0x000011); // Fond légèrement bleuté
   // Réduire les lumières ambiantes
   room.traverse(object => {
       if (object.isLight && object !== spotlightBlue && object !== spotlightYellow) {
           if (window.gsap) {
               gsap.to(object, {
                   intensity: 0.1, // Réduire l'intensité
                   duration: 2
               });
           } else {
               object.intensity = 0.1;
           }
       }
   });

   // Activer les contrôles si nécessaire
   if (controls) {
       controls.enabled = !!step.enableControls;

       // Si les contrôles sont activés, ajouter une indication visuelle
       if (step.enableControls && !document.getElementById('controls-hint')) {
           const hint = document.createElement('div');
           hint.id = 'controls-hint';
           hint.innerHTML = currentLanguage === 'fr' ? 
               'Cliquer et faire glisser pour tourner la caméra' :
               'Click and drag to rotate camera';
           hint.style.cssText = `
               position: fixed;
               top: 20px;
               left: 50%;
               transform: translateX(-50%);
               background: rgba(0,0,0,0.6);
               color: white;
               padding: 10px 20px;
               border-radius: 20px;
               font-size: 14px;
               opacity: 0;
               transition: opacity 1s;
               pointer-events: none;
               z-index: 100;
           `;
           document.body.appendChild(hint);

           setTimeout(() => {
               hint.style.opacity = '1';
               setTimeout(() => {
                   hint.style.opacity = '0';
                   setTimeout(() => {
                       hint.remove();
                   }, 1000);
               }, 4000);
           }, 500);
       }
   }

   // Gérer les boutons spéciaux avec traduction
   if (step.titleKey === "step3Title") {
       const blueBlackBtn = document.getElementById('blue-black-btn');
       const whiteGoldBtn = document.getElementById('white-gold-btn');
       const unsureBtn = document.getElementById('unsure-btn');

       // Améliorer l'interaction des boutons de choix
       const handleChoice = (choice) => {
           localStorage.setItem('dressPerception', choice);

           // Désactiver tous les boutons
           const buttons = document.querySelectorAll('.choice-btn');
           buttons.forEach(btn => {
               btn.disabled = true;
               btn.style.opacity = '0.5';
           });

           // Mettre en évidence le bouton sélectionné
           const selectedBtn = document.getElementById(`${choice}-btn`);
           if (selectedBtn) {
               selectedBtn.style.opacity = '1';
               selectedBtn.style.transform = 'scale(1.1)';
               selectedBtn.style.boxShadow = '0 0 20px rgba(255,255,255,0.5)';
           }

           // Attendre un peu avant de passer à l'étape suivante
           setTimeout(nextStep, 800);
       };

       if (blueBlackBtn) {
           blueBlackBtn.onclick = () => handleChoice('blue-black');
       }

       if (whiteGoldBtn) {
           whiteGoldBtn.onclick = () => handleChoice('white-gold');
       }

       if (unsureBtn) {
           unsureBtn.onclick = () => handleChoice('unsure');
       }
   }

   // Ajouter les gestionnaires pour les contrôles de démonstration
   if (step.enableControls) {
       const toggleLightsBtn = document.getElementById('toggle-lights-btn');
       const swapLightsBtn = document.getElementById('swap-lights-btn');
       const bothLightsBtn = document.getElementById('both-lights-btn');

       if (toggleLightsBtn) {
           toggleLightsBtn.onclick = () => {
               spotlightBlue.visible = !spotlightBlue.visible;
               spotlightYellow.visible = !spotlightYellow.visible;

               // Mettre aussi à jour les visuels des lumières
               if (spotlightBlue.userData.visual) {
                   spotlightBlue.userData.visual.visible = spotlightBlue.visible;
               }
               if (spotlightYellow.userData.visual) {
                   spotlightYellow.userData.visual.visible = spotlightYellow.visible;
               }
           };
       }

       if (swapLightsBtn) {
           swapLightsBtn.onclick = () => {
               // Animation de l'échange
               if (window.gsap) {
                   // Sauvegarder les positions originales
                   const bluePos = spotlightBlue.position.clone();
                   const yellowPos = spotlightYellow.position.clone();

                   // Animation d'échange
                   gsap.to(spotlightBlue.position, {
                       x: yellowPos.x,
                       y: yellowPos.y,
                       z: yellowPos.z,
                       duration: 1,
                       ease: "power2.inOut"
                   });

                   gsap.to(spotlightYellow.position, {
                       x: bluePos.x,
                       y: bluePos.y,
                       z: bluePos.z,
                       duration: 1,
                       ease: "power2.inOut"
                   });

                   // Mettre à jour les visuels des lumières
                   if (spotlightBlue.userData.visual) {
                       gsap.to(spotlightBlue.userData.visual.position, {
                           x: yellowPos.x,
                           y: yellowPos.y,
                           z: yellowPos.z,
                           duration: 1,
                           ease: "power2.inOut"
                       });
                   }

                   if (spotlightYellow.userData.visual) {
                       gsap.to(spotlightYellow.userData.visual.position, {
                           x: bluePos.x,
                           y: bluePos.y,
                           z: bluePos.z,
                           duration: 1,
                           ease: "power2.inOut"
                       });
                   }
               } else {
                   // Échange sans animation
                   const tempPos = spotlightBlue.position.clone();
                   spotlightBlue.position.copy(spotlightYellow.position);
                   spotlightYellow.position.copy(tempPos);

                   // Mettre à jour les visuels
                   if (spotlightBlue.userData.visual) {
                       spotlightBlue.userData.visual.position.copy(spotlightBlue.position);
                   }
                   if (spotlightYellow.userData.visual) {
                       spotlightYellow.userData.visual.position.copy(spotlightYellow.position);
                   }
               }

               // Échanger les cibles
               const tempTarget = spotlightBlue.target;
               spotlightBlue.target = spotlightYellow.target;
               spotlightYellow.target = tempTarget;
           };
       }

       if (bothLightsBtn) {
           bothLightsBtn.onclick = () => {
               // Activer les deux lumières avec effet
               spotlightBlue.visible = true;
               spotlightYellow.visible = true;

               if (spotlightBlue.userData.visual) spotlightBlue.userData.visual.visible = true;
               if (spotlightYellow.userData.visual) spotlightYellow.userData.visual.visible = true;

               // Effet flash
               if (window.gsap) {
                   // Augmenter l'intensité puis la ramener
                   gsap.to([spotlightBlue, spotlightYellow], {
                       intensity: 4,
                       duration: 0.5,
                       yoyo: true,
                       repeat: 1,
                       ease: "power2.inOut"
                   });
               }
           };
       }
   }
}

// Passer à l'étape suivante
function nextStep() {
   if (currentStep < explanationSteps.length - 1) {
       showExplanation(currentStep + 1);
       affiche_explication_la = true;
       affiche_explication_la_rec = true;
   } else {
       // À la dernière étape, masquer le panneau du bas et activer les contrôles
       const bottomPanel = document.getElementById('bottom-text-panel');
       const arrowBtn = document.getElementById('bottom-arrow-btn');
       if (bottomPanel) {
           bottomPanel.style.display = 'none';
       }
       if (arrowBtn) {
           arrowBtn.style.display = 'none';
       }

       // Activer les contrôles complets
       if (controls) {
           controls.enabled = false;
       }
       affiche_explication_la = false;
       affiche_explication_la_rec = false;

       // PREMIÈRE fenêtre d'explication sur la perception des couleurs
       if (affiche_explication_la == false) {
           const explanationWindow = document.createElement('div');
           explanationWindow.style.position = 'fixed';
           explanationWindow.style.bottom = '20px';
           explanationWindow.style.left = '50%';
           explanationWindow.style.transform = 'translateX(-50%)';
           explanationWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
           explanationWindow.style.padding = '20px';
           explanationWindow.style.borderRadius = '10px';
           explanationWindow.style.color = 'white';
           explanationWindow.style.maxWidth = '400px';
           explanationWindow.style.zIndex = '1000';
           explanationWindow.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
           explanationWindow.style.display = 'flex';
           explanationWindow.style.flexDirection = 'column';
           explanationWindow.style.alignItems = 'center';
           explanationWindow.style.backdropFilter = 'blur(10px)';

           const explanationText = document.createElement('p');
           explanationText.innerHTML = t('contextMessage1');
           explanationText.style.textAlign = 'center';
           explanationText.style.marginBottom = '15px';
           explanationText.style.lineHeight = '1.3';

           const closeButton = document.createElement('button');
           closeButton.textContent = t('activateButton');
           closeButton.style.padding = '10px 20px';
           closeButton.style.backgroundColor = '#3498db';
           closeButton.style.color = 'white';
           closeButton.style.border = 'none';
           closeButton.style.borderRadius = '5px';
           closeButton.style.cursor = 'pointer';
           closeButton.style.transition = 'background-color 0.3s';

           closeButton.addEventListener('mouseover', () => {
               closeButton.style.backgroundColor = '#2980b9';
           });

           closeButton.addEventListener('mouseout', () => {
               closeButton.style.backgroundColor = '#3498db';
           });

           closeButton.addEventListener('click', () => {
               // Fermer la fenêtre
               explanationWindow.style.opacity = '0';
               setTimeout(() => {
                   affiche_explication_la_rec = true;
                   document.body.removeChild(explanationWindow);

                   // MAINTENANT afficher la DEUXIÈME fenêtre
                   showSecondExplanationWindow();
               }, 500);

               // Changer l'opacité des plans de contexte
               if (contextPlaneMaterial1) {
                   affiche_explication_la_rec = true;
                   contextPlaneMaterial1.opacity = 0.5;
               }
               if (contextPlaneMaterial2) {
                   affiche_explication_la_rec = true;
                   contextPlaneMaterial2.opacity = 0.5;
               }

               // Animation de transition pour une meilleure expérience
               if (window.gsap) {
                   gsap.to([contextPlaneMaterial1, contextPlaneMaterial2], {
                       opacity: 0.5,
                       duration: 1.2,
                       ease: "power2.inOut"
                   });
               }
           });

           explanationWindow.appendChild(explanationText);
           explanationWindow.appendChild(closeButton);
           document.body.appendChild(explanationWindow);

           // Animation d'apparition de la fenêtre
           explanationWindow.style.opacity = '0';
           setTimeout(() => {
               explanationWindow.style.opacity = '1';
               explanationWindow.style.transition = 'opacity 0.5s';
           }, 100);
       }
   }
}

// NOUVELLE FONCTION pour afficher la deuxième fenêtre séparément
function showSecondExplanationWindow() {
   if (affiche_explication_la_rec == true) {
       const explanationWindow = document.createElement('div');
       explanationWindow.style.position = 'fixed';
       explanationWindow.style.bottom = '20px';
       explanationWindow.style.left = '50%';
       explanationWindow.style.transform = 'translateX(-50%)';
       explanationWindow.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
       explanationWindow.style.padding = '20px';
       explanationWindow.style.borderRadius = '10px';
       explanationWindow.style.color = 'white';
       explanationWindow.style.maxWidth = '400px';
       explanationWindow.style.zIndex = '1000';
       explanationWindow.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.3)';
       explanationWindow.style.display = 'flex';
       explanationWindow.style.flexDirection = 'column';
       explanationWindow.style.alignItems = 'center';
       explanationWindow.style.backdropFilter = 'blur(10px)';

       const explanationText = document.createElement('p');
       explanationText.innerHTML = t('contextMessage2');
       explanationText.style.textAlign = 'center';
       explanationText.style.marginBottom = '15px';
       explanationText.style.lineHeight = '1.3';

       const closeButton = document.createElement('button');
       closeButton.textContent = t('activateButton');
       closeButton.style.padding = '10px 20px';
       closeButton.style.backgroundColor = '#3498db';
       closeButton.style.color = 'white';
       closeButton.style.border = 'none';
       closeButton.style.borderRadius = '5px';
       closeButton.style.cursor = 'pointer';
       closeButton.style.transition = 'background-color 0.3s';

       closeButton.addEventListener('mouseover', () => {
           closeButton.style.backgroundColor = '#2980b9';
       });

       closeButton.addEventListener('mouseout', () => {
           closeButton.style.backgroundColor = '#3498db';
       });

       closeButton.addEventListener('click', () => {
           explanationWindow.style.opacity = '0';
           setTimeout(() => {
               affiche_explication_la_rec = true;
               document.body.removeChild(explanationWindow);
               
               // Afficher la troisième fenêtre avec "Testons ta perception" et lien vers jeu1.html
               showFinalExplanationWindow();
           }, 500);

           // Changer l'opacité des plans de contexte horizontaux
           if (contextPlaneMaterial3) {
               contextPlaneMaterial3.opacity = 1.0;
           }
           if (contextPlaneMaterial4) {
               contextPlaneMaterial4.opacity = 1.0;
           }
       });

       explanationWindow.appendChild(explanationText);
       explanationWindow.appendChild(closeButton);
       document.body.appendChild(explanationWindow);

       // Animation d'apparition de la fenêtre
       explanationWindow.style.opacity = '0';
       setTimeout(() => {
           explanationWindow.style.opacity = '1';
           explanationWindow.style.transition = 'opacity 0.5s';
       }, 100);
   }
}

// NOUVELLE FONCTION - Fenêtre finale avec bouton de redirection vers jeu1.html
function showFinalExplanationWindow() {
   // Créer un panneau en bas de page dans le même style que les explications précédentes
   const bottomPanel = document.createElement('div');
   bottomPanel.id = 'final-explanation-panel';
   bottomPanel.style.cssText = `
       position: fixed;
       bottom: 0;
       left: 0;
       width: 100%;
       background: rgba(30, 30, 50, 0.3);
       backdrop-filter: blur(10px);
       border-top: 1px solid rgba(255, 255, 255, 0.1);
       padding: 15px 20px;
       color: white;
       font-family: "Segoe UI", Helvetica, Arial, sans-serif;
       z-index: 100;
       box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2);
       transition: transform 0.5s ease, opacity 0.5s ease;
   `;

   const content = document.createElement('div');
   content.style.cssText = `
       max-width: 800px;
       margin: 0 auto;
       text-align: center;
   `;

   const title = document.createElement('h2');
   title.style.cssText = `
       margin: 0 0 10px 0;
       font-size: 20px;
       color: #66D9EF;
       font-weight: 600;
   `;
   title.textContent = t('finalTitle');

   const text = document.createElement('div');
   text.style.cssText = `
       font-size: 16px;
       line-height: 1.4;
       margin-bottom: 15px;
   `;
   text.innerHTML = `
       <p>${t('finalContent1')} ${t('finalContent2')}</p>
       <p>${t('finalContent3')}</p>
   `;

   const gameButton = document.createElement('button');
   gameButton.textContent = t('gameButton');
   gameButton.style.cssText = `
       background: linear-gradient(135deg, rgba(50, 50, 80, 0.8), rgba(80, 50, 100, 0.8));
       border: 2px solid rgba(255, 255, 255, 0.2);
       color: white;
       font-size: 15px;
       padding: 10px 18px;
       border-radius: 15px;
       cursor: pointer;
       transition: all 0.3s ease;
       box-shadow: 0 2px 8px rgba(0,0,0,0.2);
       font-family: "Segoe UI", Helvetica, Arial, sans-serif;
       margin-top: 5px;
   `;

   gameButton.addEventListener('mouseenter', () => {
       gameButton.style.transform = 'translateY(-2px) scale(1.02)';
       gameButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
       gameButton.style.background = 'linear-gradient(135deg, rgba(60, 60, 100, 0.9), rgba(100, 60, 130, 0.9))';
       gameButton.style.borderColor = 'rgba(255, 255, 255, 0.4)';
   });

   gameButton.addEventListener('mouseleave', () => {
       gameButton.style.transform = 'translateY(0) scale(1)';
       gameButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
       gameButton.style.background = 'linear-gradient(135deg, rgba(50, 50, 80, 0.8), rgba(80, 50, 100, 0.8))';
       gameButton.style.borderColor = 'rgba(255, 255, 255, 0.2)';
   });

   gameButton.addEventListener('click', () => {
       // Animation de transition avant de rediriger
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
       overlay.innerHTML = t('loadingTest');
       document.body.appendChild(overlay);

       setTimeout(() => {
           overlay.style.opacity = '1';
           setTimeout(() => {
               window.location.href = 'jeu1.html';
           }, 800);
       }, 100);
   });

   content.appendChild(title);
   content.appendChild(text);
   content.appendChild(gameButton);
   bottomPanel.appendChild(content);
   document.body.appendChild(bottomPanel);

   // Animation d'apparition du panneau
   bottomPanel.style.transform = 'translateY(100%)';
   bottomPanel.style.opacity = '0';
   
   setTimeout(() => {
       bottomPanel.style.transform = 'translateY(0)';
       bottomPanel.style.opacity = '1';
   }, 100);
}

// Effet de fondu à l'apparition de la pièce
function fadeInRoom() {
   // Augmenter l'opacité des matériaux progressivement
   room.traverse(object => {
       if (object.isMesh && object.material && object.material.opacity !== undefined) {
           // Animation avec GSAP si disponible
           if (window.gsap) {
               gsap.to(object.material, {
                   opacity: 1,
                   duration: 1.5,
                   ease: "power2.inOut"
               });
           } else {
               // Animation manuelle en fallback
               let opacity = 0;
               const fadeInterval = setInterval(() => {
                   opacity += 0.02;
                   if (opacity >= 1) {
                       opacity = 1;
                       clearInterval(fadeInterval);
                   }
                   object.material.opacity = opacity;
               }, 30);
           }
       }
       if (object.isLight) {
           // Animation des lumières
           if (window.gsap) {
               gsap.to(object, {
                   intensity: object.originalIntensity || 0.3,
                   duration: 2,
                   delay: 0.5,
                   ease: "power2.inOut"
               });
           } else {
               let intensity = 0;
               const targetIntensity = object.originalIntensity || 0.3;
               const lightInterval = setInterval(() => {
                   intensity += 0.01;
                   if (intensity >= targetIntensity) {
                       intensity = targetIntensity;
                       clearInterval(lightInterval);
                   }
                   object.intensity = intensity;
               }, 30);
           }
       }
   });

   // Entrée de la caméra dans la pièce
   if (window.gsap) {
       gsap.from(camera.position, {
           z: 8,
           duration: 2.5,
           ease: "power3.out"
       });
   }
}

// Réglage de la position de la caméra pour un bon cadrage de la pièce
function setCameraPosition() {
   camera.position.set(0, 0, 3.5);
   camera.lookAt(0, 0, 0);
}

// Gestion du redimensionnement de la fenêtre
function onWindowResize() {
   camera.aspect = window.innerWidth / window.innerHeight;
   camera.updateProjectionMatrix();
   renderer.setSize(window.innerWidth, window.innerHeight);
}

// Boucle d'animation
function animate() {
   requestAnimationFrame(animate);
   // Mettre à jour les contrôles s'ils sont activés
   if (controls && controls.enabled) {
       controls.update();
   }

   renderer.render(scene, camera);
}

// INITIALISATION AU CHARGEMENT DE LA PAGE - AJOUT CRUCIAL
document.addEventListener('DOMContentLoaded', () => {
   // Charger la langue sauvegardée dès le chargement
   const savedLang = localStorage.getItem('colorPerceptionLang');
   if (savedLang && translations[savedLang]) {
       currentLanguage = savedLang;
   }
});

// Fallback au cas où DOMContentLoaded serait déjà passé
if (document.readyState === 'loading') {
   document.addEventListener('DOMContentLoaded', () => {
       const savedLang = localStorage.getItem('colorPerceptionLang');
       if (savedLang && translations[savedLang]) {
           currentLanguage = savedLang;
       }
   });
} else {
   const savedLang = localStorage.getItem('colorPerceptionLang');
   if (savedLang && translations[savedLang]) {
       currentLanguage = savedLang;
   }
}