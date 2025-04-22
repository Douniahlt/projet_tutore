// Fichier JavaScript pour l'expérience guidée des illusions d'optique

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
    
    #virtual-museum {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        perspective: 1000px;
        background: linear-gradient(#f5f5f5, #e0e0e0);
        display: none;
        z-index: 8500;
    }
    
    .museum-wall {
        position: absolute;
        background-color: #f0f0f0;
        box-shadow: inset 0 0 50px rgba(0,0,0,0.1);
    }
    
    .museum-floor {
        position: absolute;
        bottom: 0;
        width: 100%;
        height: 25%;
        background: linear-gradient(to bottom, #d9d9d9, #bdbdbd);
        transform: rotateX(60deg);
        transform-origin: bottom;
    }
    
    .museum-ceiling {
        position: absolute;
        top: 0;
        width: 100%;
        height: 25%;
        background-color: #f5f5f5;
    }
    
    .exhibit-frame {
        position: absolute;
        border: 20px solid #8b5a2b;
        border-radius: 5px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        transform-style: preserve-3d;
        background-color: white;
        transform: translateZ(-5px);
    }
    
    .game-panel {
        border: none;
        background: transparent;
        box-shadow: none;
    }
    
    .museum-navigation {
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 9600;
        display: flex;
        gap: 20px;
    }
    
    .modal-panel {
        background-color: rgba(255, 255, 255, 0.9);
    }
    
    .zoom-animation {
        animation: zoomInto 2.5s forwards;
    }
    
    @keyframes zoomInto {
        0% { transform: scale(1) rotateY(0deg); }
        50% { transform: scale(5) rotateY(180deg); }
        100% { transform: scale(10) rotateY(360deg); opacity: 0; }
    }
    
    .museum-transition {
        animation: moveToNextExhibit 1.5s ease-in-out;
    }
    
    @keyframes moveToNextExhibit {
        0% { transform: translateX(0); }
        50% { transform: translateX(-100px); opacity: 0.5; }
        100% { transform: translateX(0); opacity: 1; }
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
    console.log('Simulating zoom effect into the cube');
    
    // Trouver le cube dans la scène (en supposant que c'est un élément visible)
    const cubeElements = document.querySelectorAll('div[style*="transform"]');
    let cube = null;
    
    // Chercher l'élément qui ressemble le plus à un cube
    cubeElements.forEach(el => {
        if (el.style.transform.includes('rotate') || el.style.transform.includes('matrix3d')) {
            cube = el;
        }
    });
    
    if (cube) {
        // Ajouter la classe d'animation de zoom
        cube.classList.add('zoom-animation');
        console.log('Zooming into cube');
        
        // Préparer le musée en arrière-plan
        const museum = createMuseumEnvironment();
        
        // Attendre la fin de l'animation pour afficher le musée
        setTimeout(() => {
            console.log('Zoom transition completed');
            museum.style.display = 'block';
            if (callback) callback();
        }, 2500); // Correspond à la durée de l'animation
    } else {
        // Fallback si le cube n'est pas trouvé
        console.log('Cube not found, using fallback transition');
        const museum = createMuseumEnvironment();
        museum.style.display = 'block';
        
        setTimeout(() => {
            console.log('Fallback transition completed');
            if (callback) callback();
        }, 1500);
    }
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
    
    // Appliquer l'effet de transition du musée
    const museum = document.getElementById('virtual-museum');
    if (museum) {
        museum.classList.add('museum-transition');
        setTimeout(() => {
            museum.classList.remove('museum-transition');
        }, 1500);
    }

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
    
    // Supprimer le cadre existant s'il y en a un
    const existingFrame = document.getElementById('exhibit-frame');
    if (existingFrame) {
        existingFrame.parentNode.removeChild(existingFrame);
    }
    
    // Créer le cadre d'exposition
    const exhibitFrame = document.createElement('div');
    exhibitFrame.id = 'exhibit-frame';
    exhibitFrame.className = 'exhibit-frame';
    exhibitFrame.style.width = '60%';
    exhibitFrame.style.height = '70%';
    exhibitFrame.style.left = '20%';
    exhibitFrame.style.top = '15%';
    
    // Ajouter le cadre au musée
    const museum = document.getElementById('virtual-museum');
    if (museum) {
        museum.appendChild(exhibitFrame);
    } else {
        document.body.appendChild(exhibitFrame);
    }

    // Créer le conteneur du jeu
    const gameContainer = document.createElement('div');
    gameContainer.id = 'game-container';
    gameContainer.className = 'modal-panel game-panel';
    gameContainer.style.position = 'relative';
    gameContainer.style.top = '0';
    gameContainer.style.left = '0';
    gameContainer.style.transform = 'none';
    gameContainer.style.width = '100%';
    gameContainer.style.height = '100%';
    gameContainer.style.margin = '0';
    gameContainer.style.padding = '20px';

    // Structure du conteneur
    gameContainer.innerHTML = `
        <div id="${exhibitContent[index].gameId}" class="game-content"></div>
    `;

    // Ajouter au cadre
    exhibitFrame.appendChild(gameContainer);
    
    // Créer les boutons de navigation du musée
    const navigationDiv = document.createElement('div');
    navigationDiv.className = 'museum-navigation';
    navigationDiv.innerHTML = `
        <button id="prev-exhibit-btn" ${index === 0 ? 'disabled' : ''}>Précédent</button>
        <button id="next-exhibit-btn">${index < totalExhibits - 1 ? 'Suivant' : 'Terminer'}</button>
    `;
    document.body.appendChild(navigationDiv);

    // Animation d'apparition
    setTimeout(() => {
        gameContainer.style.opacity = '1';
        exhibitFrame.style.opacity = '1';
    }, 50);

    // Initialiser le mini-jeu selon l'index
    initGame(index, exhibitContent[index].gameId);

    // Événement du bouton Suivant/Terminer
    document.getElementById('next-exhibit-btn').addEventListener('click', () => {
        fadeOutElement(exhibitFrame);
        fadeOutElement(navigationDiv);
        setTimeout(() => {
            if (navigationDiv.parentNode) {
                navigationDiv.parentNode.removeChild(navigationDiv);
            }
            showExhibit(index + 1);
        }, 500);
    });
    
    // Événement du bouton Précédent
    if (index > 0) {
        document.getElementById('prev-exhibit-btn').addEventListener('click', () => {
            fadeOutElement(exhibitFrame);
            fadeOutElement(navigationDiv);
            setTimeout(() => {
                if (navigationDiv.parentNode) {
                    navigationDiv.parentNode.removeChild(navigationDiv);
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

// À ajouter à votre fichier js principal
function showDetailedExplanation(title, explanation) {
    if (window.enhancedIllusions && window.enhancedIllusions.showTransition) {
        window.enhancedIllusions.showTransition(title, function() {
            // Afficher le panneau explicatif plus détaillé
            const panel = document.createElement('div');
            panel.className = 'explanation-panel';
            panel.innerHTML = `
                <h2>${title}</h2>
                <div class="explanation-content">${explanation}</div>
                <button class="continue-btn">Continuer</button>
            `;
            document.body.appendChild(panel);
            
            // Gérer le bouton de continuation
            panel.querySelector('.continue-btn').addEventListener('click', function() {
                panel.classList.add('fade-out');
                setTimeout(() => panel.remove(), 500);
            });
        });
    }
}

// Fonction pour revenir à l'introduction
function returnToIntro() {
    console.log('Returning to intro');

    // Transition en fondu
    fadeScreen(false, 1000, () => {
        // Réinitialiser l'état
        currentState = 'intro';

        // Masquer le musée
        const museum = document.getElementById('virtual-museum');
        if (museum) {
            museum.style.display = 'none';
        }
        
        // Supprimer les éléments du musée
        const exhibitFrame = document.getElementById('exhibit-frame');
        if (exhibitFrame) {
            exhibitFrame.parentNode.removeChild(exhibitFrame);
        }
        
        const navigationDiv = document.querySelector('.museum-navigation');
        if (navigationDiv) {
            navigationDiv.parentNode.removeChild(navigationDiv);
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
    if (!document.getElementById('guided-experience-stles')) {
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

// Fonction pour créer l'environnement du musée
function createMuseumEnvironment() {
    // Vérifier si le musée existe déjà
    if (document.getElementById('virtual-museum')) {
        return document.getElementById('virtual-museum');
    }
    
    const museum = document.createElement('div');
    museum.id = 'virtual-museum';
    
    // Créer les murs, le sol et le plafond
    const leftWall = document.createElement('div');
    leftWall.className = 'museum-wall';
    leftWall.style.left = '0';
    leftWall.style.top = '0';
    leftWall.style.width = '20%';
    leftWall.style.height = '100%';
    
    const rightWall = document.createElement('div');
    rightWall.className = 'museum-wall';
    rightWall.style.right = '0';
    rightWall.style.top = '0';
    rightWall.style.width = '20%';
    rightWall.style.height = '100%';
    
    const backWall = document.createElement('div');
    backWall.className = 'museum-wall';
    backWall.style.left = '20%';
    backWall.style.top = '0';
    backWall.style.width = '60%';
    backWall.style.height = '100%';
    
    const floor = document.createElement('div');
    floor.className = 'museum-floor';
    
    const ceiling = document.createElement('div');
    ceiling.className = 'museum-ceiling';
    
    // Assembler le musée
    museum.appendChild(leftWall);
    museum.appendChild(rightWall);
    museum.appendChild(backWall);
    museum.appendChild(floor);
    museum.appendChild(ceiling);
    
    document.body.appendChild(museum);
    
    return museum;
}