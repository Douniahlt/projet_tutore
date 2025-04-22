import * as THREE from './three.module.min.js';
import { OrbitControls } from './OrbitControls.js';


const styleElement = document.createElement('style');
styleElement.textContent = `
    #fade-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        z-index: 9000;
        pointer-events: none;
        transition: opacity 1s ease-in-out;
    }
    
    .modal-panel {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 0 20px rgba(0,0,0,0.5);
        z-index: 9500;
        opacity: 0;
        transition: opacity 0.5s ease-in-out;
        max-width: 80%;
        max-height: 80%;
        overflow: auto;
    }
    
    .game-panel {
        width: 80%;
        max-width: 800px;
    }
    
    .controls {
        margin-top: 15px;
        display: flex;
        flex-direction: column;
        gap: 10px;
    }
    
    button {
        padding: 8px 15px;
        background-color: #4285f4;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
    }
    
    button:hover {
        background-color: #3367d6;
    }
    
    .explanation {
        margin-top: 15px;
        font-size: 14px;
        color: #333;
    }
`;
document.head.appendChild(styleElement);

// Variables d'état
let currentState = 'intro'; // 'intro', 'transition', 'exhibit-0', 'exhibit-1', etc.
let currentExhibit = 0;
const totalExhibits = 4;

// Contenus des explications
const exhibitContent = [
    {
        title: "Introduction aux illusions d'optique",
        description: "Bienvenue dans cette expérience interactive sur les illusions d'optique et la perception des couleurs. Vous allez découvrir comment notre cerveau interprète les couleurs et pourquoi il peut être facilement trompé.",
        gameId: "intro-game"
    },
    {
        title: "Le contraste simultané",
        description: "Le contraste simultané est un phénomène où une même couleur peut sembler différente selon son environnement. Découvert par Michel-Eugène Chevreul au XIXe siècle, il montre que notre cerveau interprète les couleurs en fonction des contrastes qui les entourent.",
        gameId: "contrast-game"
    },
    {
        title: "L'adaptation chromatique",
        description: "Notre système visuel ajuste automatiquement notre perception des couleurs en fonction de l'éclairage ambiant. Une même couleur peut paraître différente selon la lumière qui l'éclaire, mais notre cerveau compense cette différence.",
        gameId: "chromatic-game"
    },
    {
        title: "Les illusions contextuelles",
        description: "Les couleurs semblent différentes lorsqu'elles sont placées dans des environnements contrastés. Notre cerveau traite les informations visuelles de manière relative, ce qui peut conduire à des perceptions trompeuses.",
        gameId: "contextual-game"
    }
];

// Connexion au bouton Play existant
function connectPlayButton() {
    // Recherche des boutons qui pourraient être le bouton Play
    const potentialButtons = document.querySelectorAll('div[style*="cursor: pointer"], button');

    potentialButtons.forEach(button => {
        // Vérifier si c'est le bouton Play (contient le symbole de lecture ou le mot "Play")
        const buttonText = button.textContent || button.innerHTML;
        if (buttonText.includes('▶') || buttonText.includes('Play') ||
            buttonText.includes('PLAY') || buttonText.includes('Start') ||
            button.innerHTML.includes('&#9654;')) {

            // Ajouter notre gestionnaire d'événements
            button.addEventListener('click', startGuidedExperience);
            console.log('Play button connected to guided experience');
        }
    });
}

// Lancer l'expérience guidée
function startGuidedExperience() {
    console.log('Starting guided experience');

    // Créer l'overlay s'il n'existe pas encore
    let fadeOverlay = document.getElementById('fade-overlay');
    if (!fadeOverlay) {
        fadeOverlay = document.createElement('div');
        fadeOverlay.id = 'fade-overlay';
        fadeOverlay.style.position = 'fixed';
        fadeOverlay.style.top = '0';
        fadeOverlay.style.left = '0';
        fadeOverlay.style.width = '100%';
        fadeOverlay.style.height = '100%';
        fadeOverlay.style.backgroundColor = 'black';
        fadeOverlay.style.opacity = '0';
        fadeOverlay.style.transition = 'opacity 1s ease-in-out';
        fadeOverlay.style.zIndex = '9000';
        fadeOverlay.style.pointerEvents = 'none';
        document.body.appendChild(fadeOverlay);
    }

    // Masquer l'interface d'accueil
    const interfaceElements = document.querySelectorAll('div[style*="position: absolute"]');
    interfaceElements.forEach(element => {
        if (element.id !== 'fade-overlay' && !element.classList.contains('modal-panel')) {
            fadeOutElement(element);
        }
    });

    // Transition vers la première explication
    fadeScreen(false, 1000, () => {
        currentState = 'transition';
        // Simulation d'un zoom sans utiliser THREE
        simulateZoom(() => {
            showExhibit(0);
        });
    });
}

// Fonction pour simuler un zoom sans THREE
function simulateZoom(callback) {
    console.log('Simulating zoom effect');

    setTimeout(() => {
        console.log('Zoom transition completed');
        if (callback) callback();
    }, 1500);
}

// Fonction pour afficher un exhibit
function showExhibit(index) {
    console.log(`Showing exhibit ${index}`);

    if (index >= totalExhibits) {
        // Fin de l'expérience, retour à l'accueil
        returnToIntro();
        return;
    }

    currentExhibit = index;
    currentState = `exhibit-${index}`;

    // Se déplacer vers l'exhibit dans le musée 3D
    moveToExhibit(index);
    
    // Mettre à jour le contenu de l'exhibit
    updateExhibitContent(index, exhibitContent[index]);

    // Créer le panneau d'explication
    createExplanationPanel(exhibitContent[index], () => {
        // Après fermeture de l'explication, montrer le mini-jeu
        showExhibitGame(index);
    });
}

// Fonction pour créer le panneau d'explication
function createExplanationPanel(content, onContinue) {
    console.log(`Creating explanation panel: ${content.title}`);

    // Supprimer tout panneau existant
    const existingPanel = document.getElementById('explanation-panel');
    if (existingPanel) {
        existingPanel.parentNode.removeChild(existingPanel);
    }

    // Créer le nouveau panneau
    const panel = document.createElement('div');
    panel.id = 'explanation-panel';
    panel.className = 'modal-panel';

    // Contenu du panneau
    panel.innerHTML = `
        <h2>${content.title}</h2>
        <p>${content.description}</p>
        <button id="continue-btn">Continuer</button>
    `;

    // Ajouter au document
    document.body.appendChild(panel);

    // Animation d'apparition
    setTimeout(() => {
        panel.style.opacity = '1';
    }, 50);

    // Événement du bouton Continuer
    document.getElementById('continue-btn').addEventListener('click', () => {
        fadeOutElement(panel);
        setTimeout(() => {
            if (panel.parentNode) {
                panel.parentNode.removeChild(panel);
            }
            if (onContinue) onContinue();
        }, 500);
    });
}

// Fonction pour afficher le mini-jeu correspondant
function showExhibitGame(index) {
    console.log(`Showing game for exhibit ${index}`);

    // Supprimer tout jeu existant
    const existingGame = document.getElementById('game-container');
    if (existingGame) {
        existingGame.parentNode.removeChild(existingGame);
    }

    // Créer le conteneur du jeu
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.className = 'modal-panel game-panel';
    gameContainer.style.zIndex = '9600'; // Au-dessus de la scène THREE.js

    // Structure du conteneur
    gameContainer.innerHTML = `
        <div id="${exhibitContent[index].gameId}" class="game-content"></div>
        <div class="museum-navigation">
            <button id="prev-exhibit-btn" ${index === 0 ? 'disabled' : ''}>Précédent</button>
            <button id="next-exhibit-btn">${index < totalExhibits - 1 ? 'Suivant' : 'Terminer'}</button>
        </div>
    `;

    // Ajouter au document
    document.body.appendChild(gameContainer);

    // Animation d'apparition
    setTimeout(() => {
        gameContainer.style.opacity = '1';
    }, 50);

    // Initialiser le mini-jeu selon l'index
    initGame(index, exhibitContent[index].gameId);

    // Événement du bouton Suivant/Terminer
    document.getElementById('next-exhibit-btn').addEventListener('click', () => {
        fadeOutElement(gameContainer);
        setTimeout(() => {
            if (gameContainer.parentNode) {
                gameContainer.parentNode.removeChild(gameContainer);
            }
            showExhibit(index + 1);
        }, 500);
    });
    
    // Événement du bouton Précédent
    if (index > 0) {
        document.getElementById('prev-exhibit-btn').addEventListener('click', () => {
            fadeOutElement(gameContainer);
            setTimeout(() => {
                if (gameContainer.parentNode) {
                    gameContainer.parentNode.removeChild(gameContainer);
                }
                showExhibit(index - 1);
            }, 500);
        });
    }
}

// Fonction pour initialiser chaque mini-jeu
function initGame(index, containerId) {
    console.log(`Initializing game ${index} in container ${containerId}`);

    const container = document.getElementById(containerId);
    if (!container) {
        console.error(`Container ${containerId} not found`);
        return;
    }

    switch (index) {
        case 0:
            // Introduction - Simple animation de cercle coloré
            createIntroGame(container);
            break;
        case 1:
            // Contraste simultané
            createContrastGame(container);
            break;
        case 2:
            // Adaptation chromatique
            createChromaticGame(container);
            break;
        case 3:
            // Illusions contextuelles
            createContextualGame(container);
            break;
    }
}

// Fonctions pour chaque mini-jeu
function createIntroGame(container) {
    console.log('Creating intro game');

    // Créer le canvas
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 300;
    container.appendChild(canvas);

    // Contexte de dessin
    const ctx = canvas.getContext('2d');

    // Fonction d'animation
    function draw(time) {
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Paramètres du cercle
        const radius = 100;
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Créer un dégradé circulaire
        const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius);

        // Animer les couleurs
        const t = time / 1000;
        gradient.addColorStop(0, 'hsl(' + (t * 50) % 360 + ', 100%, 50%)');
        gradient.addColorStop(0.5, 'hsl(' + ((t * 50) + 120) % 360 + ', 100%, 50%)');
        gradient.addColorStop(1, 'hsl(' + ((t * 50) + 240) % 360 + ', 100%, 50%)');

        // Dessiner le cercle
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.fill();

        // Ajouter un texte explicatif
        ctx.fillStyle = 'black';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Les illusions d\'optique jouent avec notre perception des couleurs', centerX, centerY + radius + 30);

        // Continuer l'animation
        requestAnimationFrame(draw);
    }

    // Lancer l'animation
    requestAnimationFrame(draw);
}

function createContrastGame(container) {
    console.log('Creating contrast simultaneous game');

    // Créer le HTML du jeu
    container.innerHTML = `
        <canvas id="contrast-canvas" width="400" height="300"></canvas>
        <div class="controls">
            <div>
                <label>Couleur du fond gauche:</label>
                <input type="range" id="left-bg" min="0" max="200" value="50">
            </div>
            <div>
                <label>Couleur du fond droit:</label>
                <input type="range" id="right-bg" min="100" max="255" value="200">
            </div>
            <button id="toggle-connector">Révéler la vérité</button>
        </div>
        <div class="explanation">
            <p>Bien que difficile à croire, les deux carrés gris sont <strong>exactement de la même couleur</strong>!</p>
            <p>Le contraste simultané modifie notre perception en fonction de l'environnement.</p>
        </div>
    `;

    // Récupérer le canvas
    const canvas = document.getElementById('contrast-canvas');
    const ctx = canvas.getContext('2d');

    // Variables du jeu
    let leftBg = 50;
    let rightBg = 200;
    let showConnector = false;

    // Fonction de dessin
    function drawIllusion() {
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Fond gauche
        ctx.fillStyle = `rgb(${leftBg}, ${leftBg}, ${leftBg})`;
        ctx.fillRect(0, 0, canvas.width / 2, canvas.height);

        // Fond droit
        ctx.fillStyle = `rgb(${rightBg}, ${rightBg}, ${rightBg})`;
        ctx.fillRect(canvas.width / 2, 0, canvas.width / 2, canvas.height);

        // Carré gris identique des deux côtés
        const squareColor = 153; // Gris moyen (#999999)
        ctx.fillStyle = `rgb(${squareColor}, ${squareColor}, ${squareColor})`;

        // Carré gauche
        ctx.fillRect(canvas.width / 4 - 40, canvas.height / 2 - 40, 80, 80);

        // Carré droit
        ctx.fillRect(3 * canvas.width / 4 - 40, canvas.height / 2 - 40, 80, 80);

        // Connecteur optionnel pour montrer que les carrés sont identiques
        if (showConnector) {
            ctx.beginPath();
            ctx.moveTo(canvas.width / 4, canvas.height / 2);
            ctx.lineTo(3 * canvas.width / 4, canvas.height / 2);
            ctx.strokeStyle = `rgb(${squareColor}, ${squareColor}, ${squareColor})`;
            ctx.lineWidth = 5;
            ctx.stroke();
        }
    }

    // Initialiser l'illustration
    drawIllusion();

    // Mettre en place les contrôles
    document.getElementById('left-bg').addEventListener('input', function () {
        leftBg = parseInt(this.value);
        drawIllusion();
    });

    document.getElementById('right-bg').addEventListener('input', function () {
        rightBg = parseInt(this.value);
        drawIllusion();
    });

    document.getElementById('toggle-connector').addEventListener('click', function () {
        showConnector = !showConnector;
        this.textContent = showConnector ? 'Masquer le connecteur' : 'Révéler la vérité';
        drawIllusion();
    });
}

function createChromaticGame(container) {
    console.log('Creating chromatic adaptation game');

    // Créer le HTML du jeu
    container.innerHTML = `
        <canvas id="chromatic-canvas" width="400" height="300"></canvas>
        <div class="controls">
            <div>
                <label>Intensité Rouge:</label>
                <input type="range" id="red-filter" min="0" max="100" value="20">
            </div>
            <div>
                <label>Intensité Vert:</label>
                <input type="range" id="green-filter" min="0" max="100" value="0">
            </div>
            <div>
                <label>Intensité Bleu:</label>
                <input type="range" id="blue-filter" min="0" max="100" value="0">
            </div>
            <button id="toggle-filter">Révéler les vraies couleurs</button>
        </div>
        <div class="explanation">
            <p>L'adaptation chromatique permet à notre cerveau de "corriger" les couleurs en fonction de l'éclairage.</p>
            <p>Tous ces objets sont réellement blancs, mais l'éclairage coloré modifie notre perception.</p>
        </div>
    `;

    // Récupérer le canvas
    const canvas = document.getElementById('chromatic-canvas');
    const ctx = canvas.getContext('2d');

    // Variables du jeu
    let colorFilter = {
        red: 20,
        green: 0,
        blue: 0
    };
    let revealTrueColors = false;

    // Fonction de dessin
    function drawChromaticIllusion() {
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Formes à dessiner
        const shapes = [
            { x: 100, y: 150, type: 'circle' },
            { x: 300, y: 150, type: 'square' }
        ];

        // Appliquer le filtre coloré sur tout le canvas
        if (!revealTrueColors) {
            const filterColor = `rgba(${255 - colorFilter.red}, ${255 - colorFilter.green}, ${255 - colorFilter.blue}, 0.3)`;
            ctx.fillStyle = filterColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Dessiner les formes
        shapes.forEach(shape => {
            if (!revealTrueColors) {
                // Couleur modifiée par l'éclairage
                const r = Math.min(255, 240 + colorFilter.red);
                const g = Math.min(255, 240 + colorFilter.green);
                const b = Math.min(255, 240 + colorFilter.blue);
                ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
            } else {
                // Couleur réelle (blanc)
                ctx.fillStyle = '#f0f0f0';
            }

            if (shape.type === 'circle') {
                ctx.beginPath();
                ctx.arc(shape.x, shape.y, 50, 0, Math.PI * 2);
                ctx.fill();
            } else if (shape.type === 'square') {
                ctx.fillRect(shape.x - 40, shape.y - 40, 80, 80);
            }
        });

        // Texte explicatif
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Ces objets sont blancs (#f0f0f0)', canvas.width / 2, 250);
    }

    // Initialiser l'illustration
    drawChromaticIllusion();

    // Mettre en place les contrôles
    document.getElementById('red-filter').addEventListener('input', function () {
        colorFilter.red = parseInt(this.value);
        drawChromaticIllusion();
    });

    document.getElementById('green-filter').addEventListener('input', function () {
        colorFilter.green = parseInt(this.value);
        drawChromaticIllusion();
    });

    document.getElementById('blue-filter').addEventListener('input', function () {
        colorFilter.blue = parseInt(this.value);
        drawChromaticIllusion();
    });

    document.getElementById('toggle-filter').addEventListener('click', function () {
        revealTrueColors = !revealTrueColors;
        this.textContent = revealTrueColors ? 'Appliquer l\'éclairage coloré' : 'Révéler les vraies couleurs';
        drawChromaticIllusion();
    });
}

function createContextualGame(container) {
    console.log('Creating contextual illusion game');

    // Créer le HTML du jeu
    container.innerHTML = `
        <canvas id="contextual-canvas" width="400" height="400"></canvas>
        <div class="controls">
            <div>
                <label>Taille de la grille:</label>
                <input type="range" id="grid-size" min="6" max="12" value="8">
            </div>
            <div>
                <label>Couleur des carrés:</label>
                <input type="range" id="square-color" min="60" max="200" value="120">
            </div>
            <button id="toggle-connections">Révéler la vérité</button>
        </div>
        <div class="explanation">
            <p>Dans cette illusion contextuelle, tous les petits carrés centraux ont <strong>exactement la même couleur</strong>.</p>
            <p>Notre cerveau perçoit différemment leur luminosité selon l'arrière-plan sur lequel ils se trouvent.</p>
        </div>
    `;

    // Récupérer le canvas
    const canvas = document.getElementById('contextual-canvas');
    const ctx = canvas.getContext('2d');

    // Variables du jeu
    let gridSize = 8;
    let squareColor = 120;
    let showConnections = false;
    let squares = [];

    // Fonction de dessin
    function drawContextualIllusion() {
        // Effacer le canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Taille des cellules
        const cellSize = canvas.width / gridSize;

        // Vider le tableau des carrés
        squares = [];

        // Dessiner la grille en damier
        for (let x = 0; x < gridSize; x++) {
            for (let y = 0; y < gridSize; y++) {
                // Couleur du fond (alternance)
                ctx.fillStyle = (x + y) % 2 === 0 ? '#aaaaaa' : '#eeeeee';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);

                // Petits carrés centraux
                if (y > 1 && y < gridSize - 2 && x > 1 && x < gridSize - 2) {
                    // Même couleur pour tous les carrés
                    ctx.fillStyle = `rgb(${squareColor}, ${squareColor}, ${squareColor})`;

                    const squareX = x * cellSize + cellSize / 3;
                    const squareY = y * cellSize + cellSize / 3;
                    const squareSize = cellSize / 3;

                    ctx.fillRect(squareX, squareY, squareSize, squareSize);

                    // Stocker les positions des carrés pour les connecteurs
                    squares.push({
                        x: squareX + squareSize / 2,
                        y: squareY + squareSize / 2
                    });
                }
            }
        }

        // Dessiner les connecteurs si activés
        if (showConnections && squares.length > 1) {
            ctx.beginPath();
            ctx.moveTo(squares[0].x, squares[0].y);

            for (let i = 1; i < squares.length; i++) {
                ctx.lineTo(squares[i].x, squares[i].y);
            }

            ctx.strokeStyle = `rgb(${squareColor}, ${squareColor}, ${squareColor})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    }

    // Initialiser l'illustration
    drawContextualIllusion();

    // Mettre en place les contrôles
    document.getElementById('grid-size').addEventListener('input', function () {
        gridSize = parseInt(this.value);
        drawContextualIllusion();
    });

    document.getElementById('square-color').addEventListener('input', function () {
        squareColor = parseInt(this.value);
        drawContextualIllusion();
    });

    document.getElementById('toggle-connections').addEventListener('click', function () {
        showConnections = !showConnections;
        this.textContent = showConnections ? 'Masquer les connecteurs' : 'Révéler la vérité';
        drawContextualIllusion();
    });
}

// Fonction pour revenir à l'introduction
function returnToIntro() {
    console.log('Returning to intro');

    // Transition en fondu
    fadeScreen(false, 1000, () => {
        // Réinitialiser l'état
        currentState = 'intro';

        // Masquer le musée THREE.js
        if (museumContainer) {
            museumContainer.style.opacity = '0';
            museumContainer.style.pointerEvents = 'none';
        }
        
        // Supprimer les éléments du jeu
        const gameContainer = document.getElementById('game-container');
        if (gameContainer) {
            gameContainer.parentNode.removeChild(gameContainer);
        }
        
        // Réafficher l'interface d'accueil
        const interfaceContainer = document.querySelector('div[style*="position: absolute"]');
        if (interfaceContainer) {
            fadeInElement(interfaceContainer);
        }

        // Fin de la transition
        fadeScreen(true, 1000);
    });
}

// Utilitaires pour les transitions
function fadeOutElement(element, duration = 500) {
    if (!element) return;

    // Sauvegarder l'opacité d'origine
    const originalOpacity = element.style.opacity || '1';
    element.dataset.originalOpacity = originalOpacity;

    // Appliquer la transition
    element.style.transition = `opacity ${duration / 1000}s ease-out`;
    element.style.opacity = '0';
}

function fadeInElement(element, duration = 500) {
    if (!element) return;

    // Récupérer l'opacité d'origine ou utiliser 1
    const targetOpacity = element.dataset.originalOpacity || '1';

    // Réinitialiser à 0 et appliquer une transition
    element.style.opacity = '0';
    element.style.display = element.dataset.originalDisplay || 'block';

    // Forcer un reflow pour s'assurer que la transition fonctionne
    void element.offsetWidth;

    // Appliquer la transition
    element.style.transition = `opacity ${duration / 1000}s ease-in`;
    element.style.opacity = targetOpacity;
}

function fadeScreen(fadeIn = true, duration = 1000, callback = null) {
    // Créer ou récupérer l'overlay
    let fadeOverlay = document.getElementById('fade-overlay');
    
    if (!fadeOverlay) {
        fadeOverlay = document.createElement('div');
        fadeOverlay.id = 'fade-overlay';
        fadeOverlay.style.position = 'fixed'; // Change to fixed to cover entire viewport
        fadeOverlay.style.top = '0';
        fadeOverlay.style.left = '0';
        fadeOverlay.style.width = '100%';
        fadeOverlay.style.height = '100%';
        fadeOverlay.style.backgroundColor = 'black';
        fadeOverlay.style.transition = `opacity ${duration/1000}s ease-in-out`;
        fadeOverlay.style.zIndex = '9000'; // Inférieur aux panneaux modaux
        fadeOverlay.style.pointerEvents = 'none';
        document.body.appendChild(fadeOverlay);
        console.log('Fade overlay created');
    } else {
        console.log('Using existing fade overlay');
    }
    
    // Réinitialiser l'opacité
    fadeOverlay.style.opacity = fadeIn ? '1' : '0';
    
    // Forcer un reflow
    void fadeOverlay.offsetWidth;
    
    // Appliquer la transition
    fadeOverlay.style.opacity = fadeIn ? '0' : '1';
    
    // Exécuter le callback après la transition
    setTimeout(() => {
        if (callback) callback();
        
        // Ne pas supprimer l'overlay, simplement le cacher si fadeIn est true
        if (fadeIn && fadeOverlay) {
            fadeOverlay.style.opacity = '0';
        }
    }, duration);
}

// Fonction d'easing pour les animations (si nécessaire)
function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}

// Insérez cette fonction à la fin du script pour vérifier l'état de l'overlay
function debugOverlay() {
    const overlay = document.getElementById('fade-overlay');
    if (overlay) {
        console.log('Overlay found with opacity:', overlay.style.opacity);
        if (overlay.style.opacity === '1' && currentState !== 'transition') {
            console.log('Forcing overlay transparency');
            overlay.style.opacity = '0';
        }
    } else {
        console.log('Overlay not found');
    }

    // Vérifier si le panneau d'explication est visible
    const panel = document.getElementById('explanation-panel');
    if (panel) {
        console.log('Panel found with opacity:', panel.style.opacity);
        if (panel.style.opacity === '0' || panel.style.opacity === '') {
            console.log('Forcing panel visibility');
            panel.style.opacity = '1';
        }
    } else {
        console.log('Explanation panel not found');
    }
}

// Appeler cette fonction après le chargement de l'explication
setTimeout(debugOverlay, 2000);

// Initialisation lorsque la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing guided experience');
    
    // Appliquer les styles CSS
    if (!document.getElementById('guided-experience-styles')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'guided-experience-styles';
        document.head.appendChild(styleElement);
    }
    
    // Attendre un peu pour que l'interface d'origine soit chargée
    setTimeout(() => {
        connectPlayButton();
        
        // Démarrer le débogage périodique
        setInterval(debugOverlay, 5000); // Check every 5 seconds instead of once
    }, 1000);
});

// Variables THREE.js pour le musée virtuel
let scene, camera, renderer;
let museumControls;
let museumScene = null;
let isMuseumCreated = false;
let museumContainer = null;
let currentFrame = null;
let frames = [];
let targetPosition = new THREE.Vector3();
let cameraTarget = new THREE.Vector3();

// Fonction pour initialiser la scène THREE.js du musée
function createMuseum() {
    if (isMuseumCreated) return;
    
    console.log('Creating THREE.js museum environment');
    
    // Créer le conteneur pour le rendu THREE.js
    museumContainer = document.createElement('div');
    museumContainer.id = 'museum-container';
    museumContainer.style.position = 'fixed';
    museumContainer.style.top = '0';
    museumContainer.style.left = '0';
    museumContainer.style.width = '100%';
    museumContainer.style.height = '100%';
    museumContainer.style.zIndex = '8900';
    museumContainer.style.opacity = '0';
    museumContainer.style.transition = 'opacity 1s ease-in-out';
    document.body.appendChild(museumContainer);
    
    // Initialiser la scène THREE.js
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    // Ajouter un éclairage
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    // Configurer les ombres
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 50;
    
    // Caméra
    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.6, 5); // Position à hauteur humaine
    
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    museumContainer.appendChild(renderer.domElement);
    
    // Contrôles pour la navigation
    museumControls = new OrbitControls(camera, renderer.domElement);
    museumControls.enableDamping = true;
    museumControls.dampingFactor = 0.05;
    museumControls.screenSpacePanning = false;
    museumControls.minDistance = 1;
    museumControls.maxDistance = 15;
    museumControls.maxPolarAngle = Math.PI / 2;
    
    // Créer le sol
    const floorGeometry = new THREE.PlaneGeometry(50, 50);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xdddddd,
        roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // Rotation pour que le sol soit horizontal
    floor.receiveShadow = true;
    scene.add(floor);
    
    // Créer les murs
    createMuseumWalls();
    
    // Créer les cadres pour les exhibits
    createExhibitFrames();
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Mettre à jour les contrôles
        museumControls.update();
        
        // Animation de transition douce de la caméra vers la cible
        if (currentFrame) {
            camera.position.lerp(targetPosition, 0.05);
            cameraTarget.lerp(currentFrame.position, 0.05);
            camera.lookAt(cameraTarget);
        }
        
        renderer.render(scene, camera);
    }
    
    // Gérer le redimensionnement de la fenêtre
    window.addEventListener('resize', onWindowResize);
    
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    
    // Démarrer l'animation
    animate();
    isMuseumCreated = true;
}

// Fonction pour créer les murs du musée
function createMuseumWalls() {
    // Matériau pour les murs
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf5f5f5,
        roughness: 0.7
    });
    
    // Dimensions du musée
    const width = 40;
    const height = 6;
    const depth = 20;
    
    // Mur du fond
    const backWallGeometry = new THREE.BoxGeometry(width, height, 0.2);
    const backWall = new THREE.Mesh(backWallGeometry, wallMaterial);
    backWall.position.set(0, height/2, -depth/2);
    backWall.castShadow = true;
    backWall.receiveShadow = true;
    scene.add(backWall);
    
    // Mur gauche
    const leftWallGeometry = new THREE.BoxGeometry(0.2, height, depth);
    const leftWall = new THREE.Mesh(leftWallGeometry, wallMaterial);
    leftWall.position.set(-width/2, height/2, 0);
    leftWall.castShadow = true;
    leftWall.receiveShadow = true;
    scene.add(leftWall);
    
    // Mur droit
    const rightWallGeometry = new THREE.BoxGeometry(0.2, height, depth);
    const rightWall = new THREE.Mesh(rightWallGeometry, wallMaterial);
    rightWall.position.set(width/2, height/2, 0);
    rightWall.castShadow = true;
    rightWall.receiveShadow = true;
    scene.add(rightWall);
    
    // Plafond
    const ceilingGeometry = new THREE.BoxGeometry(width, 0.2, depth);
    const ceiling = new THREE.Mesh(ceilingGeometry, wallMaterial);
    ceiling.position.set(0, height, 0);
    ceiling.receiveShadow = true;
    scene.add(ceiling);
}

// Fonction pour créer les cadres des exhibits
function createExhibitFrames() {
    frames = [];
    
    // Matériau pour les cadres
    const frameMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8b5a2b,
        roughness: 0.5
    });
    
    // Dimensions et positions des cadres
    const framePositions = [
        { x: -12, y: 2, z: -9.9, title: "Introduction" },
        { x: -4, y: 2, z: -9.9, title: "Contraste simultané" },
        { x: 4, y: 2, z: -9.9, title: "Adaptation chromatique" },
        { x: 12, y: 2, z: -9.9, title: "Illusions contextuelles" }
    ];
    
    framePositions.forEach((pos, index) => {
        // Créer le cadre extérieur
        const frameGeometry = new THREE.BoxGeometry(5, 3.5, 0.2);
        const frame = new THREE.Mesh(frameGeometry, frameMaterial);
        frame.position.set(pos.x, pos.y, pos.z);
        frame.castShadow = true;
        scene.add(frame);
        
        // Créer la toile à l'intérieur du cadre
        const canvasGeometry = new THREE.PlaneGeometry(4.5, 3);
        const canvasTexture = new THREE.CanvasTexture(createOffscreenCanvas(400, 300));
        const canvasMaterial = new THREE.MeshBasicMaterial({ 
            map: canvasTexture,
            side: THREE.FrontSide
        });
        
        const canvas = new THREE.Mesh(canvasGeometry, canvasMaterial);
        canvas.position.set(pos.x, pos.y, pos.z + 0.11);
        scene.add(canvas);
        
        // Créer le texte du titre
        createTextLabel(pos.x, pos.y - 2, pos.z + 0.2, pos.title);
        
        frames.push({
            frame: frame,
            canvas: canvas,
            texture: canvasTexture,
            position: new THREE.Vector3(pos.x, pos.y, pos.z),
            index: index
        });
    });
}

// Fonction pour créer une étiquette de texte
function createTextLabel(x, y, z, text) {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 100;
    const context = canvas.getContext('2d');
    context.fillStyle = 'white';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = 'Bold 30px Arial';
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(text, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const labelMaterial = new THREE.MeshBasicMaterial({ 
        map: texture,
        transparent: true
    });
    
    const labelGeometry = new THREE.PlaneGeometry(2, 0.5);
    const label = new THREE.Mesh(labelGeometry, labelMaterial);
    label.position.set(x, y, z);
    scene.add(label);
    
    return label;
}

// Fonction pour créer un canvas hors écran 
function createOffscreenCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    
    // Remplir avec un dégradé de fond pour commencer
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#f0f0f0');
    gradient.addColorStop(1, '#e0e0e0');
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
    
    return canvas;
}

// Fonction pour simuler le zoom dans le cube
function simulateZoom(callback) {
    console.log('Zooming into the cube with THREE.js');
    
    // Créer le musée s'il n'existe pas déjà
    createMuseum();
    
    // Chercher le cube à animer dans la scène originale
    const originalScene = document.querySelector('canvas');
    let originalCube = null;
    
    if (originalScene) {
        console.log('Found original scene');
        
        // Ajouter un cube temporaire pour la transition si on ne trouve pas l'original
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cubeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x4285f4,
            roughness: 0.3,
            metalness: 0.3
        });
        
        const tempCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
        tempCube.position.set(0, 1, 0);
        tempCube.rotation.set(Math.PI/6, Math.PI/4, 0);
        tempCube.scale.set(1, 1, 1);
        scene.add(tempCube);
        
        // Animation de zoom
        let startTime = null;
        const duration = 3000; // ms
        
        function animateZoom(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Échelle initiale de la caméra
            if (progress < 0.5) {
                // Dans la première moitié, zoom vers le cube
                const zoomProgress = easeInOutQuad(progress * 2);
                camera.position.z = 5 * (1 - zoomProgress) + 1.5 * zoomProgress;
                
                // Faire tourner le cube
                tempCube.rotation.y += 0.02;
                tempCube.rotation.x += 0.01;
            } else {
                // Dans la seconde moitié, zoom arrière pour révéler le musée
                const zoomOutProgress = easeInOutQuad((progress - 0.5) * 2);
                camera.position.z = 1.5 * (1 - zoomOutProgress) + 5 * zoomOutProgress;
                
                // Faire disparaître le cube
                tempCube.scale.set(
                    1 * (1 - zoomOutProgress),
                    1 * (1 - zoomOutProgress),
                    1 * (1 - zoomOutProgress)
                );
                
                // Opacité du conteneur du musée
                museumContainer.style.opacity = zoomOutProgress.toString();
            }
            
            if (progress < 1) {
                requestAnimationFrame(animateZoom);
            } else {
                // Animation terminée, supprimer le cube temporaire
                scene.remove(tempCube);
                
                // Activer les contrôles et afficher le premier exhibit
                museumControls.enabled = true;
                setTimeout(() => {
                    moveToExhibit(0);
                    
                    // Exécuter le callback
                    if (callback) callback();
                }, 500);
            }
        }
        
        // Démarrer l'animation
        museumControls.enabled = false;
        museumContainer.style.opacity = '1';
        requestAnimationFrame(animateZoom);
    } else {
        console.log('Original scene not found, using fallback');
        museumContainer.style.opacity = '1';
        
        setTimeout(() => {
            moveToExhibit(0);
            if (callback) callback();
        }, 1000);
    }
}

// Fonction pour se déplacer vers un exhibit
function moveToExhibit(index) {
    if (index < 0 || index >= frames.length) return;
    
    currentFrame = frames[index];
    
    // Position de la caméra devant l'exhibit
    targetPosition = new THREE.Vector3(
        currentFrame.position.x,
        currentFrame.position.y,
        currentFrame.position.z + 4
    );
    
    // Désactiver les contrôles pendant la transition
    museumControls.enabled = false;
    
    // Réactiver les contrôles après la transition
    setTimeout(() => {
        museumControls.enabled = true;
    }, 1000);
    
    console.log(`Moving to exhibit ${index}`);
}

// Fonction pour mettre à jour le contenu d'un exhibit
function updateExhibitContent(index, content) {
    if (index < 0 || index >= frames.length) return;
    
    const frame = frames[index];
    const canvas = createOffscreenCanvas(400, 300);
    const ctx = canvas.getContext('2d');
    
    // Dessiner le contenu selon l'index
    switch (index) {
        case 0:
            drawIntroContent(ctx, canvas.width, canvas.height);
            break;
        case 1:
            drawContrastContent(ctx, canvas.width, canvas.height);
            break;
        case 2:
            drawChromaticContent(ctx, canvas.width, canvas.height);
            break;
        case 3:
            drawContextualContent(ctx, canvas.width, canvas.height);
            break;
    }
    
    // Mettre à jour la texture
    frame.texture.needsUpdate = true;
    frame.texture.image = canvas;
}

// Fonction pour dessiner les différents contenus
function drawIntroContent(ctx, width, height) {
    // Fond
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);
    
    // Cercle coloré
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, 100);
    gradient.addColorStop(0, 'hsl(0, 100%, 50%)');
    gradient.addColorStop(0.5, 'hsl(120, 100%, 50%)');
    gradient.addColorStop(1, 'hsl(240, 100%, 50%)');
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(width/2, height/2, 100, 0, Math.PI * 2);
    ctx.fill();
    
    // Texte
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Illusions d\'optique: perception des couleurs', width/2, height-50);
}

function drawContrastContent(ctx, width, height) {
    // Fond
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, width, height);
    
    // Carré gauche gris foncé
    ctx.fillStyle = 'rgb(50, 50, 50)';
    ctx.fillRect(50, 75, 150, 150);
    
    // Carré droit gris clair
    ctx.fillStyle = 'rgb(200, 200, 200)';
    ctx.fillRect(200, 75, 150, 150);
    
    // Carrés gris moyens identiques au centre
    ctx.fillStyle = 'rgb(120, 120, 120)';
    ctx.fillRect(100, 125, 50, 50);  // Sur fond sombre
    ctx.fillRect(250, 125, 50, 50);  // Sur fond clair
    
    // Texte
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Contraste simultané', width/2, height-50);
}

function drawChromaticContent(ctx, width, height) {
    // Fond
    ctx.fillStyle = 'rgba(255, 200, 200, 0.3)';  // Teinte rougeâtre
    ctx.fillRect(0, 0, width, height);
    
    // Formes blanches
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.arc(150, 150, 50, 0, Math.PI * 2);  // Cercle
    ctx.fill();
    
    ctx.fillRect(250, 100, 80, 80);  // Carré
    
    // Texte
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Adaptation chromatique', width/2, height-50);
}

function drawContextualContent(ctx, width, height) {
    // Fond
    ctx.fillStyle = '#e0e0e0';
    ctx.fillRect(0, 0, width, height);
    
    // Damier
    const gridSize = 8;
    const cellSize = Math.min(width, height) / gridSize;
    
    for (let x = 0; x < gridSize; x++) {
        for (let y = 0; y < gridSize; y++) {
            // Couleur du fond
            ctx.fillStyle = (x + y) % 2 === 0 ? '#aaaaaa' : '#eeeeee';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            
            // Petits carrés centraux
            if (y > 1 && y < gridSize - 2 && x > 1 && x < gridSize - 2) {
                ctx.fillStyle = 'rgb(120, 120, 120)';
                const squareX = x * cellSize + cellSize / 3;
                const squareY = y * cellSize + cellSize / 3;
                const squareSize = cellSize / 3;
                ctx.fillRect(squareX, squareY, squareSize, squareSize);
            }
        }
    }
    
    // Texte
    ctx.fillStyle = 'black';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Illusions contextuelles', width/2, height-50);
}

// Fonction easing pour les animations
function easeInOutQuad(x) {
    return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}