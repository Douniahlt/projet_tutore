// game-enhancements.js - Ajoute des effets 3D aux mini-jeux existants
(function() {
    // Configuration globale
    const enhancementConfig = {
        transitionSpeed: 1000, // Durée des transitions en ms
        enableShadows: true,
        enablePostProcessing: true
    };
    
    // Fonction pour améliorer le mini-jeu sur le contraste simultané
    function enhanceContrastGame(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Récupérer ou créer un canvas dans le conteneur
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            container.appendChild(canvas);
        }
        
        // Configuration de Three.js
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(canvas.width, canvas.height);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        camera.position.z = 5;
        
        // Éclairage
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Créer deux zones de couleur différente
        const leftPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 4),
            new THREE.MeshBasicMaterial({ color: 0x333333 })
        );
        leftPlane.position.x = -1.5;
        scene.add(leftPlane);
        
        const rightPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(2, 4),
            new THREE.MeshBasicMaterial({ color: 0xdddddd })
        );
        rightPlane.position.x = 1.5;
        scene.add(rightPlane);
        
        // Carré central identique des deux côtés
        const centerMaterial = new THREE.MeshBasicMaterial({ color: 0x999999 });
        
        const leftSquare = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.8),
            centerMaterial
        );
        leftSquare.position.set(-1.5, 0, 0.1);
        scene.add(leftSquare);
        
        const rightSquare = new THREE.Mesh(
            new THREE.PlaneGeometry(0.8, 0.8),
            centerMaterial
        );
        rightSquare.position.set(1.5, 0, 0.1);
        scene.add(rightSquare);
        
        // Connecteur (initialement invisible)
        const connector = new THREE.Mesh(
            new THREE.PlaneGeometry(3, 0.2),
            new THREE.MeshBasicMaterial({ 
                color: 0x999999, 
                transparent: true, 
                opacity: 0 
            })
        );
        connector.position.z = 0.05;
        scene.add(connector);
        
        // Contrôles
        const controls = document.createElement('div');
        controls.className = 'enhanced-controls';
        controls.innerHTML = `
            <div>
                <label>Fond gauche:</label>
                <input type="range" id="contrast-left-bg" min="20" max="100" value="30">
            </div>
            <div>
                <label>Fond droit:</label>
                <input type="range" id="contrast-right-bg" min="60" max="220" value="180">
            </div>
            <button id="contrast-reveal">Révéler la vérité</button>
            <div class="explanation">
                <p>Les deux carrés centraux sont <strong>exactement de la même couleur</strong>!</p>
                <p>C'est le phénomène de contraste simultané découvert par Michel-Eugène Chevreul.</p>
            </div>
        `;
        container.appendChild(controls);
        
        // Gestion des contrôles
        document.getElementById('contrast-left-bg').addEventListener('input', function() {
            const value = parseInt(this.value);
            const color = new THREE.Color(value/255, value/255, value/255);
            leftPlane.material.color = color;
        });
        
        document.getElementById('contrast-right-bg').addEventListener('input', function() {
            const value = parseInt(this.value);
            const color = new THREE.Color(value/255, value/255, value/255);
            rightPlane.material.color = color;
        });
        
        document.getElementById('contrast-reveal').addEventListener('click', function() {
            const connectorMaterial = connector.material;
            const isVisible = connectorMaterial.opacity > 0;
            
            if (isVisible) {
                this.textContent = "Révéler la vérité";
                connectorMaterial.opacity = 0;
            } else {
                this.textContent = "Masquer le connecteur";
                connectorMaterial.opacity = 1;
            }
        });
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Légère rotation pour un effet 3D subtil
            scene.rotation.y = Math.sin(Date.now() * 0.0005) * 0.1;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Redimensionnement
        window.addEventListener('resize', function() {
            if (!canvas) return;
            
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
        });
    }
    
    // Fonction pour améliorer le mini-jeu sur l'adaptation chromatique
    function enhanceChromaticGame(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Récupérer ou créer un canvas
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            container.appendChild(canvas);
        }
        
        // Configuration de Three.js
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(canvas.width, canvas.height);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        camera.position.z = 5;
        
        // Éclairage de base
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Groupe d'objets blancs
        const objectsGroup = new THREE.Group();
        scene.add(objectsGroup);
        
        // Créer des objets blancs
        const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
        const whiteMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xffffff,
            roughness: 0.2,
            metalness: 0.1
        });
        
        const sphere = new THREE.Mesh(sphereGeometry, whiteMaterial.clone());
        sphere.position.set(-1.5, 0, 0);
        objectsGroup.add(sphere);
        
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cube = new THREE.Mesh(cubeGeometry, whiteMaterial.clone());
        cube.position.set(0, 0, 0);
        objectsGroup.add(cube);
        
        const coneGeometry = new THREE.ConeGeometry(0.5, 1, 32);
        const cone = new THREE.Mesh(coneGeometry, whiteMaterial.clone());
        cone.position.set(1.5, 0, 0);
        objectsGroup.add(cone);
        
        // Filtre coloré (plan semi-transparent)
        const filterGeometry = new THREE.PlaneGeometry(10, 10);
        const filterMaterial = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            opacity: 0.1,
            side: THREE.DoubleSide
        });
        const filter = new THREE.Mesh(filterGeometry, filterMaterial);
        filter.position.z = -1;
        scene.add(filter);
        
        // Contrôles
        const controls = document.createElement('div');
        controls.className = 'enhanced-controls';
        controls.innerHTML = `
            <div>
                <label>Filtre Rouge:</label>
                <input type="range" id="filter-red" min="0" max="100" value="50">
            </div>
            <div>
                <label>Filtre Vert:</label>
                <input type="range" id="filter-green" min="0" max="100" value="0">
            </div>
            <div>
                <label>Filtre Bleu:</label>
                <input type="range" id="filter-blue" min="0" max="100" value="0">
            </div>
            <button id="chromatic-reveal">Voir les vraies couleurs</button>
            <div class="explanation">
                <p>Ces objets sont tous <strong>blancs</strong>, mais l'éclairage coloré modifie notre perception.</p>
                <p>C'est l'adaptation chromatique : notre cerveau s'adapte à l'environnement lumineux.</p>
            </div>
        `;
        container.appendChild(controls);
        
        // Variables pour le filtre de couleur
        let colorFilter = {
            red: 0.5,
            green: 0,
            blue: 0
        };
        
        // Fonction pour mettre à jour le filtre de couleur
        function updateColorFilter() {
            filterMaterial.color.setRGB(
                colorFilter.red,
                colorFilter.green,
                colorFilter.blue
            );
            
            // Ajuster aussi la couleur de l'éclairage
            directionalLight.color.setRGB(
                0.5 + colorFilter.red * 0.5,
                0.5 + colorFilter.green * 0.5,
                0.5 + colorFilter.blue * 0.5
            );
        }
        
        // Gestion des contrôles
        document.getElementById('filter-red').addEventListener('input', function() {
            colorFilter.red = parseInt(this.value) / 100;
            updateColorFilter();
        });
        
        document.getElementById('filter-green').addEventListener('input', function() {
            colorFilter.green = parseInt(this.value) / 100;
            updateColorFilter();
        });
        
        document.getElementById('filter-blue').addEventListener('input', function() {
            colorFilter.blue = parseInt(this.value) / 100;
            updateColorFilter();
        });
        
        let showingTrueColors = false;
        document.getElementById('chromatic-reveal').addEventListener('click', function() {
            showingTrueColors = !showingTrueColors;
            
            if (showingTrueColors) {
                // Montrer les vraies couleurs
                filter.visible = false;
                directionalLight.color.set(0xffffff);
                this.textContent = "Rétablir l'éclairage coloré";
            } else {
                // Rétablir l'éclairage coloré
                filter.visible = true;
                updateColorFilter();
                this.textContent = "Voir les vraies couleurs";
            }
        });
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotation douce des objets
            objectsGroup.rotation.y += 0.005;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Redimensionnement
        window.addEventListener('resize', function() {
            if (!canvas) return;
            
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
        });
    }
    
    // Fonction pour améliorer le mini-jeu sur les illusions contextuelles
    function enhanceContextualGame(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        // Récupérer ou créer un canvas
        let canvas = container.querySelector('canvas');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            container.appendChild(canvas);
        }
        
        // Configuration Three.js
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.setSize(canvas.width, canvas.height);
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 1000);
        camera.position.z = 5;
        
        // Éclairage
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(1, 1, 1);
        scene.add(directionalLight);
        
        // Groupe pour la grille
        const gridGroup = new THREE.Group();
        scene.add(gridGroup);
        
        // Paramètres de la grille
        let gridSize = 8;
        let centralSquareColor = 0x777777;
        let showConnections = false;
        
        // Matériaux
        const lightMaterial = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
        const darkMaterial = new THREE.MeshBasicMaterial({ color: 0xaaaaaa });
        const centerMaterial = new THREE.MeshBasicMaterial({ color: centralSquareColor });
        
        // Fonction pour créer la grille
        function createGrid() {
            // Nettoyer le groupe
            while (gridGroup.children.length > 0) {
                gridGroup.remove(gridGroup.children[0]);
            }
            
            // Taille des cellules
            const cellSize = 4 / gridSize;
            const centerSize = cellSize * 0.4;
            
            // Stocker les positions centrales
            const centerPositions = [];
            
            // Créer la grille en damier
            for (let x = 0; x < gridSize; x++) {
                for (let y = 0; y < gridSize; y++) {
                    // Position
                    const posX = (x - gridSize/2 + 0.5) * cellSize;
                    const posY = (y - gridSize/2 + 0.5) * cellSize;
                    
                    // Motif en damier
                    const material = (x + y) % 2 === 0 ? darkMaterial : lightMaterial;
                    
                    // Cellule
                    const cellGeometry = new THREE.PlaneGeometry(cellSize, cellSize);
                    const cell = new THREE.Mesh(cellGeometry, material);
                    cell.position.set(posX, posY, 0);
                    gridGroup.add(cell);
                    
                    // Ajouter un carré central dans certaines cellules
                    if (x > 1 && x < gridSize - 2 && y > 1 && y < gridSize - 2) {
                        const centerGeometry = new THREE.PlaneGeometry(centerSize, centerSize);
                        const centerSquare = new THREE.Mesh(centerGeometry, centerMaterial);
                        centerSquare.position.set(posX, posY, 0.1);
                        gridGroup.add(centerSquare);
                        
                        // Stocker la position centrale
                        centerPositions.push(new THREE.Vector3(posX, posY, 0.15));
                    }
                }
            }
            
            // Créer les connecteurs si demandé
            if (showConnections && centerPositions.length > 1) {
                const connectGeometry = new THREE.BufferGeometry().setFromPoints(centerPositions);
                const connectMaterial = new THREE.LineBasicMaterial({ color: centralSquareColor });
                const connections = new THREE.Line(connectGeometry, connectMaterial);
                gridGroup.add(connections);
            }
        }
        
        // Créer la grille initiale
        createGrid();
        
        // Contrôles
        const controls = document.createElement('div');
        controls.className = 'enhanced-controls';
        controls.innerHTML = `
            <div>
                <label>Taille de la grille:</label>
                <input type="range" id="grid-size" min="6" max="12" value="8">
            </div>
            <div>
                <label>Couleur des carrés:</label>
                <input type="range" id="square-color" min="50" max="200" value="120">
            </div>
            <button id="contextual-reveal">Révéler la vérité</button>
            <div class="explanation">
                <p>Tous les petits carrés centraux sont <strong>exactement de la même couleur</strong>!</p>
                <p>Cette illusion contextuelle montre comment notre perception est influencée par l'environnement.</p>
            </div>
        `;
        container.appendChild(controls);
        
        // Gestion des contrôles
        document.getElementById('grid-size').addEventListener('input', function() {
            gridSize = parseInt(this.value);
            createGrid();
        });
        
        document.getElementById('square-color').addEventListener('input', function() {
            const value = parseInt(this.value);
            const hexValue = Math.floor(value * 2.55).toString(16).padStart(2, '0');
            centralSquareColor = parseInt(hexValue + hexValue + hexValue, 16);
            centerMaterial.color.set(centralSquareColor);
            createGrid();
        });
        
        document.getElementById('contextual-reveal').addEventListener('click', function() {
            showConnections = !showConnections;
            this.textContent = showConnections ? 'Masquer les connections' : 'Révéler la vérité';
            createGrid();
        });
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            // Rotation douce de la grille
            gridGroup.rotation.x = Math.sin(Date.now() * 0.0005) * 0.1;
            gridGroup.rotation.y = Math.cos(Date.now() * 0.0006) * 0.1;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Redimensionnement
        window.addEventListener('resize', function() {
            if (!canvas) return;
            
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            
            renderer.setSize(width, height);
        });
    }
    
    // Système de transitions améliorées pour les explications
    function createEnhancedTransition(message, callback) {
        // Créer un élément de transition
        const transitionEl = document.createElement('div');
        transitionEl.className = 'enhanced-transition';
        transitionEl.innerHTML = `
            <div class="transition-content">
                <h3>${message}</h3>
                <div class="spinner"></div>
            </div>
        `;
        document.body.appendChild(transitionEl);
        
        // Animation d'entrée
        setTimeout(() => {
            transitionEl.classList.add('active');
            
            // Animation de sortie
            setTimeout(() => {
                transitionEl.classList.remove('active');
                
                // Suppression après la sortie
                setTimeout(() => {
                    transitionEl.remove();
                    if (callback) callback();
                }, 500);
            }, 2000); // Durée d'affichage
        }, 10);
    }
    
    // Styles CSS pour les améliorations
    function applyEnhancedStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .enhanced-controls {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                background-color: rgba(255, 255, 255, 0.9);
                padding: 15px;
                border-top: 1px solid #e0e0e0;
                box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.1);
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 100;
            }
            
            .enhanced-controls div {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .enhanced-controls label {
                min-width: 120px;
                font-weight: bold;
            }
            
            .enhanced-controls input[type="range"] {
                flex: 1;
                height: 8px;
                -webkit-appearance: none;
                background: #e0e0e0;
                border-radius: 4px;
                outline: none;
            }
            
            .enhanced-controls input[type="range"]::-webkit-slider-thumb {
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                background: #3498db;
                cursor: pointer;
            }
            
            .enhanced-controls button {
                align-self: center;
                padding: 8px 16px;
                background-color: #3498db;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: bold;
                transition: background-color 0.3s ease;
            }
            
            .enhanced-controls button:hover {
                background-color: #2980b9;
            }
            
            .explanation {
                margin-top: 10px;
                padding: 10px;
                background-color: rgba(52, 152, 219, 0.1);
                border-radius: 4px;
                font-style: italic;
            }
            
            .enhanced-transition {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(44, 62, 80, 0.9);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
                opacity: 0;
                pointer-events: none;
                transition: opacity 0.5s ease;
            }
            
            .enhanced-transition.active {
                opacity: 1;
                pointer-events: auto;
            }
            
            .transition-content {
                background-color: white;
                padding: 30px 40px;
                border-radius: 10px;
                text-align: center;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
                transform: translateY(20px);
                transition: transform 0.5s ease;
            }
            
            .enhanced-transition.active .transition-content {
                transform: translateY(0);
            }
            
            .spinner {
                margin: 20px auto 0;
                width: 40px;
                height: 40px;
                border: 4px solid rgba(52, 152, 219, 0.2);
                border-top-color: #3498db;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Fonction d'initialisation
    function initialize() {
        console.log("Initialisation des améliorations de jeux...");
        
        // Appliquer les styles
        applyEnhancedStyles();
        
        // Observer les changements du DOM pour détecter quand les mini-jeux sont chargés
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    // Si un des conteneurs de jeu apparaît, améliorer le jeu
                    const contrastGame = document.getElementById('contrast-game');
                    if (contrastGame && !contrastGame.dataset.enhanced) {
                        contrastGame.dataset.enhanced = "true";
                        enhanceContrastGame('contrast-game');
                    }
                    
                    const chromaticGame = document.getElementById('chromatic-game');
                    if (chromaticGame && !chromaticGame.dataset.enhanced) {
                        chromaticGame.dataset.enhanced = "true";
                        enhanceChromaticGame('chromatic-game');
                    }
                    
                    const contextualGame = document.getElementById('contextual-game');
                    if (contextualGame && !contextualGame.dataset.enhanced) {
                        contextualGame.dataset.enhanced = "true";
                        enhanceContextualGame('contextual-game');
                    }
                }
            });
        });
        
        // Observer les changements dans le document
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Exposer les fonctions pour un usage direct
        window.enhancedIllusions = {
            enhanceContrastGame,
            enhanceChromaticGame,
            enhanceContextualGame,
            showTransition: createEnhancedTransition
        };
    }
    
    // Charger quand le DOM est prêt
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();