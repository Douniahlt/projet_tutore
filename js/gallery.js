// Système de gestion des langues
const translations = {
    fr: {
        // Navigation
        prevBtn: "‹",
        nextBtn: "›",
        exitBtn: "✕",
        exitTitle: "Retour au menu",
        startGame: "Commencer l'expérience",

        // Titres des checkpoints
        checkpoint1Title: "Introduction au Contraste",
        checkpoint1Desc: "Découvrez comment notre perception des couleurs est influencée par leur environnement.",
        checkpoint2Title: "Illusion de Luminosité",
        checkpoint2Desc: "Découvrez comment un dégradé peut tromper votre perception des couleurs identiques.",
        checkpoint3Title: "Adaptation Chromatique",
        checkpoint3Desc: "Comprenez comment notre œil s'adapte aux différentes sources lumineuses.",
        checkpoint4Title: "Illusions Contextuelles",
        checkpoint4Desc: "Observez comment le contexte modifie notre perception des couleurs.",

        // Explications scientifiques
        exp1Title: "Le Contraste Simultané de Chevreul",
        exp1Content: `
            <p>Nos yeux ne voient pas les couleurs de manière absolue, mais relative à leur environnement.</p>
            <p>Une même couleur peut paraître plus claire ou plus foncée selon ce qui l'entoure.</p>
            <p>Ce phénomène, découvert par <strong>Michel-Eugène Chevreul</strong> au XIXe siècle, explique pourquoi les artistes utilisent des couleurs complémentaires.</p>
            <p><a href="https://en.wikipedia.org/wiki/Simultaneous_contrast" target="_blank" style="color: #FFD700;">📖 En savoir plus</a></p>
        `,
        exp2Title: "L'Illusion d'Adelson",
        exp2Content: `
            <p>Regardez ces carrés dans un dégradé. Ils vous semblent différents ?</p>
            <p>Cette illusion démontre que notre cerveau évalue les couleurs en fonction du contexte local.</p>
            <p>Référence : <strong>Edward Adelson</strong> (1993) - "Perceptual Organization and the Judgment of Brightness"</p>
            <p><a href="http://persci.mit.edu/gallery/checkershadow" target="_blank" style="color: #FFD700;">📖 Voir l'illusion originale</a></p>
        `,
        exp3Title: "La Théorie Retinex de Land",
        exp3Content: `
            <p>Votre œil ajuste automatiquement sa perception selon l'éclairage ambiant après un temps d'adaptation.</p>
            <p>Cette adaptation chromatique permet de percevoir les couleurs de manière constante malgré les changements d'éclairage.</p>
            <p>Référence : <strong>Edwin Land</strong> (1977) - "The Retinex Theory of Color Vision"</p>
            <p><a href="https://en.wikipedia.org/wiki/Retinex" target="_blank" style="color: #FFD700;">📖 En savoir plus sur Retinex</a></p>
        `,
        exp4Title: "L'Effet du Contexte Visuel",
        exp4Content: `
            <p>Le contexte visuel influence drastiquement notre perception des couleurs.</p>
            <p>Les mêmes couleurs peuvent sembler complètement différentes selon leur environnement coloré.</p>
            <p>Référence : <strong>Richard Gregory</strong> (1997) - "Visual Illusions Classified"</p>
            <p><a href="https://www.illusionsindex.org/" target="_blank" style="color: #FFD700;">📖 Index des illusions</a></p>
        `,

        // Boutons communs
        launchExperience: "Lancer l'Expérience",
        skip: "Passer",
        close: "✕",

        // Expérience 1
        exp1GameTitle: "Expérience : Contraste Simultané",
        exp1Question1: "Question 1 sur 3",
        exp1Question2: "Question 2 sur 3",
        exp1Question3: "Question 3 sur 3",
        exp1QuestionText1: "Lequel de ces carrés vous paraît le plus foncé ?",
        exp1QuestionText2: "Et maintenant, lequel semble le plus foncé ?",
        exp1QuestionText3: "Dernière question : lequel paraît le plus foncé ?",
        exp1AnswerLeft: "Carré de Gauche",
        exp1AnswerEqual: "Ils sont identiques",
        exp1AnswerRight: "Carré de Droite",
        exp1FeedbackCorrect: "<strong>Bonne intuition !</strong> Le carré de droite semble effectivement plus foncé.",
        exp1FeedbackIncorrect: "<strong>Pas cette fois !</strong> C'est le carré de droite qui paraît plus foncé à la plupart des gens.",
        exp1NextQuestion: "Question Suivante",
        exp1ShowExplanation: "Voir l'Explication",
        exp1ExplanationTitle: "🎯 Explication Scientifique",
        exp1Revelation: "La Révélation",
        exp1RevealText: "Dans tous les cas, les deux carrés avaient exactement la même couleur !",
        exp1ExperimentTitle: "Expérimentez par vous-même :",
        exp1BgLabel: "Arrière-plan de gauche :",
        exp1SquareLabel: "Couleur des carrés :",
        exp1Brightness: "Luminosité",
        exp1Gray: "Gris",

        // Expérience 2
        exp2GameTitle: "Expérience : Illusion de Luminosité",
        exp2Instruction: "Ajustez le curseur pour que les deux carrés vous paraissent de même luminosité :",
        exp2SliderLabel: "Ajustez la luminosité du carré de gauche :",
        exp2CurrentValue: "Valeur actuelle",
        exp2Challenge: "🎯 <strong>Défi :</strong> Trouvez la valeur où les deux carrés vous paraissent identiques !",
        exp2ShowSolution: "Voir l'Explication",
        exp2HideSolution: "Masquer l'Explication",
        exp2SolutionTitle: "💡 Explication",
        exp2Perfect: "<strong>Parfait !</strong> Les deux carrés ont exactement la même couleur (128) mais paraissent différents à cause du dégradé !",
        exp2Different: "Avec votre réglage actuel ({value}), les carrés ont des valeurs différentes. La solution est 128 - ils paraissent différents même quand ils sont identiques !",
        exp2TechExplanation: "Le dégradé d'arrière-plan crée une <strong>illusion de contraste</strong> qui trompe votre perception. Votre cerveau compare les couleurs relativement à leur environnement local.",

        // Expérience 3
        exp3GameTitle: "Expérience : Adaptation Chromatique",
        exp3Instruction: "Observez ces objets sous différents éclairages. Votre œil va s'adapter progressivement.",
        exp3Paper: "Papier",
        exp3Apple: "Pomme",
        exp3Leaf: "Feuille",
        exp3ChangeSlowly: "Changez l'éclairage lentement :",
        exp3Daylight: "☀️ Lumière du Jour",
        exp3Tungsten: "💡 Ampoule Tungstène",
        exp3Fluorescent: "🔆 Néon Fluorescent",
        exp3ImportantNote: "⏱️ <strong>Important :</strong> Les changements sont lents (8 secondes) pour permettre l'adaptation naturelle",
        exp3DemoAdaptation: "🧠 Démonstration d'Adaptation",
        exp3BrutalChange: "⚡ Changement Brutal",
        exp3PhysicsTitle: "🔬 Ce qui se passe scientifiquement :",
        exp3PhysicsSubtitle: "Physique de la lumière :",
        exp3PhysicsText: "Chaque source lumineuse émet des longueurs d'onde différentes. Les objets ne peuvent refléter que les couleurs présentes dans la lumière qui les éclaire.",
        exp3AdaptationSubtitle: "Adaptation chromatique :",
        exp3AdaptationText: "Votre cerveau ajuste progressivement sa perception pour maintenir la constance des couleurs. Cette adaptation prend du temps (quelques minutes) et explique pourquoi vous ne remarquez pas immédiatement les changements d'éclairage.",
        exp3Reference: "<strong>Référence scientifique :</strong> Edwin Land (1977) - \"The Retinex Theory of Color Vision\"<br/><strong>Application pratique :</strong> C'est pourquoi les photos paraissent parfois \"trop jaunes\" ou \"trop bleues\" - votre appareil photo n'a pas notre capacité d'adaptation !",

        // Expérience 4
        exp4GameTitle: "Expérience : L'Effet du Contexte Chromatique",
        exp4Question: "<strong>Question :</strong> Classez ces cercles du plus clair au plus foncé",
        exp4Instruction: "Glissez et déposez les cercles dans l'ordre que vous percevez",
        exp4CircleA: "Cercle A",
        exp4CircleB: "Cercle B",
        exp4CircleC: "Cercle C",
        exp4DragInstruction: "Glissez les cercles dans les cases ci-dessous :",
        exp4Rank1: "Plus clair",
        exp4Rank2: "Moyen",
        exp4Rank3: "Plus foncé",
        exp4ValidateAnswer: "Valider ma Réponse",
        exp4ValidateComplete: "✅ Valider ma Réponse",
        exp4ValidateProgress: "Valider ma Réponse ({current}/3)",
        exp4IsolateCircles: "🔍 Isoler les Cercles",
        exp4RestoreContexts: "🎨 Remettre les Contextes",
        exp4RevealTruth: "✨ Révéler la Vérité",
        exp4RevelationTitle: "🎯 Révélation Surprenante !",
        exp4UserRanking: "📊 Votre classement :",
        exp4RankingNote: "💭 La plupart des gens perçoivent des différences qui n'existent pas réellement !",
        exp4TruthText: "Les trois cercles sont exactement de la même couleur grise (#888888) !",
        exp4WhyTitle: "🧠 Pourquoi cela arrive-t-il ?",
        exp4Reference: "<strong>Référence scientifique :</strong> Richard Gregory (1997) - \"Visual Illusions Classified\"<br/><strong>Application pratique :</strong> C'est pourquoi choisir une couleur de peinture sur un petit échantillon peut être trompeur !",

        // Messages système
        returningToMenu: "Retour au menu...",
        transitionInProgress: "Transition vers {light} en cours... (8 secondes)",
        adaptationDemo: "Démonstration en cours...",
        backgroundsNeutralized: "🔍 Arrière-plans neutralisés !<br/>Maintenant les cercles paraissent-ils identiques ?",
        contextsRestored: "🎨 Contextes rétablis !<br/>L'illusion reprend effet immédiatement.",
        brutalChange: "Changement brutal vers {temp} !",

        // Menu langue
        language: "Langue",
        french: "Français",
        english: "English"
    },
    en: {
        // Navigation
        prevBtn: "‹",
        nextBtn: "›",
        exitBtn: "✕",
        exitTitle: "Back to menu",
        startGame: "Start Experience",

        // Checkpoint titles
        checkpoint1Title: "Introduction to Contrast",
        checkpoint1Desc: "Discover how our color perception is influenced by their environment.",
        checkpoint2Title: "Brightness Illusion",
        checkpoint2Desc: "Discover how a gradient can fool your perception of identical colors.",
        checkpoint3Title: "Chromatic Adaptation",
        checkpoint3Desc: "Understand how our eye adapts to different light sources.",
        checkpoint4Title: "Contextual Illusions",
        checkpoint4Desc: "Observe how context modifies our color perception.",

        // Scientific explanations
        exp1Title: "Chevreul's Simultaneous Contrast",
        exp1Content: `
            <p>Our eyes don't see colors absolutely, but relative to their environment.</p>
            <p>The same color can appear lighter or darker depending on what surrounds it.</p>
            <p>This phenomenon, discovered by <strong>Michel-Eugène Chevreul</strong> in the 19th century, explains why artists use complementary colors.</p>
            <p><a href="https://en.wikipedia.org/wiki/Simultaneous_contrast" target="_blank" style="color: #FFD700;">📖 Learn more</a></p>
        `,
        exp2Title: "Adelson's Illusion",
        exp2Content: `
            <p>Look at these squares in a gradient. Do they seem different to you?</p>
            <p>This illusion demonstrates that our brain evaluates colors based on local context.</p>
            <p>Reference: <strong>Edward Adelson</strong> (1993) - "Perceptual Organization and the Judgment of Brightness"</p>
            <p><a href="http://persci.mit.edu/gallery/checkershadow" target="_blank" style="color: #FFD700;">📖 See original illusion</a></p>
        `,
        exp3Title: "Land's Retinex Theory",
        exp3Content: `
            <p>Your eye automatically adjusts its perception according to ambient lighting after an adaptation time.</p>
            <p>This chromatic adaptation allows us to perceive colors consistently despite lighting changes.</p>
            <p>Reference: <strong>Edwin Land</strong> (1977) - "The Retinex Theory of Color Vision"</p>
            <p><a href="https://en.wikipedia.org/wiki/Retinex" target="_blank" style="color: #FFD700;">📖 Learn more about Retinex</a></p>
        `,
        exp4Title: "Visual Context Effect",
        exp4Content: `
            <p>Visual context drastically influences our color perception.</p>
            <p>The same colors can appear completely different depending on their colored environment.</p>
            <p>Reference: <strong>Richard Gregory</strong> (1997) - "Visual Illusions Classified"</p>
            <p><a href="https://www.illusionsindex.org/" target="_blank" style="color: #FFD700;">📖 Illusions index</a></p>
        `,

        // Common buttons
        launchExperience: "Launch Experience",
        skip: "Skip",
        close: "✕",

        // Experience 1
        exp1GameTitle: "Experience: Simultaneous Contrast",
        exp1Question1: "Question 1 of 3",
        exp1Question2: "Question 2 of 3",
        exp1Question3: "Question 3 of 3",
        exp1QuestionText1: "Which of these squares appears darker to you?",
        exp1QuestionText2: "And now, which one seems darker?",
        exp1QuestionText3: "Last question: which one appears darker?",
        exp1AnswerLeft: "Left Square",
        exp1AnswerEqual: "They are identical",
        exp1AnswerRight: "Right Square",
        exp1FeedbackCorrect: "<strong>Good intuition!</strong> The right square does indeed seem darker.",
        exp1FeedbackIncorrect: "<strong>Not this time!</strong> It's the right square that appears darker to most people.",
        exp1NextQuestion: "Next Question",
        exp1ShowExplanation: "See Explanation",
        exp1ExplanationTitle: "🎯 Scientific Explanation",
        exp1Revelation: "The Revelation",
        exp1RevealText: "In all cases, both squares had exactly the same color!",
        exp1ExperimentTitle: "Experiment yourself:",
        exp1BgLabel: "Left background:",
        exp1SquareLabel: "Square color:",
        exp1Brightness: "Brightness",
        exp1Gray: "Gray",

        // Experience 2
        exp2GameTitle: "Experience: Brightness Illusion",
        exp2Instruction: "Adjust the slider so both squares appear to have the same brightness:",
        exp2SliderLabel: "Adjust the brightness of the left square:",
        exp2CurrentValue: "Current value",
        exp2Challenge: "🎯 <strong>Challenge:</strong> Find the value where both squares appear identical to you!",
        exp2ShowSolution: "See Explanation",
        exp2HideSolution: "Hide Explanation",
        exp2SolutionTitle: "💡 Explanation",
        exp2Perfect: "<strong>Perfect!</strong> Both squares have exactly the same color (128) but appear different due to the gradient!",
        exp2Different: "With your current setting ({value}), the squares have different values. The solution is 128 - they appear different even when identical!",
        exp2TechExplanation: "The background gradient creates a <strong>contrast illusion</strong> that deceives your perception. Your brain compares colors relative to their local environment.",

        // Experience 3
        exp3GameTitle: "Experience: Chromatic Adaptation",
        exp3Instruction: "Observe these objects under different lighting. Your eye will adapt gradually.",
        exp3Paper: "Paper",
        exp3Apple: "Apple",
        exp3Leaf: "Leaf",
        exp3ChangeSlowly: "Change lighting slowly:",
        exp3Daylight: "☀️ Daylight",
        exp3Tungsten: "💡 Tungsten Bulb",
        exp3Fluorescent: "🔆 Fluorescent Light",
        exp3ImportantNote: "⏱️ <strong>Important:</strong> Changes are slow (8 seconds) to allow natural adaptation",
        exp3DemoAdaptation: "🧠 Adaptation Demonstration",
        exp3BrutalChange: "⚡ Brutal Change",
        exp3PhysicsTitle: "🔬 What happens scientifically:",
        exp3PhysicsSubtitle: "Physics of light:",
        exp3PhysicsText: "Each light source emits different wavelengths. Objects can only reflect colors present in the light that illuminates them.",
        exp3AdaptationSubtitle: "Chromatic adaptation:",
        exp3AdaptationText: "Your brain gradually adjusts its perception to maintain color constancy. This adaptation takes time (several minutes) and explains why you don't immediately notice lighting changes.",
        exp3Reference: "<strong>Scientific reference:</strong> Edwin Land (1977) - \"The Retinex Theory of Color Vision\"<br/><strong>Practical application:</strong> This is why photos sometimes appear \"too yellow\" or \"too blue\" - your camera doesn't have our adaptation ability!",

        // Experience 4
        exp4GameTitle: "Experience: Chromatic Context Effect",
        exp4Question: "<strong>Question:</strong> Rank these circles from lightest to darkest",
        exp4Instruction: "Drag and drop the circles in the order you perceive",
        exp4CircleA: "Circle A",
        exp4CircleB: "Circle B",
        exp4CircleC: "Circle C",
        exp4DragInstruction: "Drag the circles into the boxes below:",
        exp4Rank1: "Lightest",
        exp4Rank2: "Medium",
        exp4Rank3: "Darkest",
        exp4ValidateAnswer: "Validate my Answer",
        exp4ValidateComplete: "✅ Validate my Answer",
        exp4ValidateProgress: "Validate my Answer ({current}/3)",
        exp4IsolateCircles: "🔍 Isolate Circles",
        exp4RestoreContexts: "🎨 Restore Contexts",
        exp4RevealTruth: "✨ Reveal Truth",
        exp4RevelationTitle: "🎯 Surprising Revelation!",
        exp4UserRanking: "📊 Your ranking:",
        exp4RankingNote: "💭 Most people perceive differences that don't actually exist!",
        exp4TruthText: "All three circles are exactly the same gray color (#888888)!",
        exp4WhyTitle: "🧠 Why does this happen?",
        exp4Reference: "<strong>Scientific reference:</strong> Richard Gregory (1997) - \"Visual Illusions Classified\"<br/><strong>Practical application:</strong> This is why choosing paint color from a small sample can be misleading!",

        // System messages
        returningToMenu: "Returning to menu...",
        transitionInProgress: "Transition to {light} in progress... (8 seconds)",
        adaptationDemo: "Demonstration in progress...",
        backgroundsNeutralized: "🔍 Backgrounds neutralized!<br/>Do the circles now appear identical?",
        contextsRestored: "🎨 Contexts restored!<br/>The illusion takes effect immediately.",
        brutalChange: "Brutal change to {temp}!",

        // Language menu
        language: "Language",
        french: "Français",
        english: "English"
    }
};

// État de la galerie
let currentCheckpoint = 0;
const totalCheckpoints = 4;
let isTransitioning = false;
let currentMiniGame = null;
let currentLanguage = 'fr'; // Langue par défaut

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
    // Mettre à jour les textes des checkpoints
    const checkpointTitle = document.getElementById('checkpoint-title');
    const checkpointDescription = document.getElementById('checkpoint-description');
    const startGameBtn = document.getElementById('start-game');

    if (checkpointTitle && checkpointDescription && startGameBtn) {
        const checkpoint = checkpoints[currentCheckpoint];
        checkpointTitle.textContent = t(checkpoint.titleKey);
        checkpointDescription.textContent = t(checkpoint.descKey);
        startGameBtn.textContent = t('startGame');
    }

    // Mettre à jour les boutons de navigation
    const exitBtn = document.getElementById('exit-btn');
    if (exitBtn) {
        exitBtn.title = t('exitTitle');
    }
}

// Configuration des checkpoints avec clés de traduction
const checkpoints = [
    {
        titleKey: "checkpoint1Title",
        descKey: "checkpoint1Desc",
        position: 0,
        explanation: {
            titleKey: "exp1Title",
            contentKey: "exp1Content"
        },
        miniGameType: "contrast-comparison"
    },
    {
        titleKey: "checkpoint2Title",
        descKey: "checkpoint2Desc",
        position: 10,
        explanation: {
            titleKey: "exp2Title",
            contentKey: "exp2Content"
        },
        miniGameType: "brightness-illusion"
    },
    {
        titleKey: "checkpoint3Title",
        descKey: "checkpoint3Desc",
        position: 20,
        explanation: {
            titleKey: "exp3Title",
            contentKey: "exp3Content"
        },
        miniGameType: "white-balance"
    },
    {
        titleKey: "checkpoint4Title",
        descKey: "checkpoint4Desc",
        position: 30,
        explanation: {
            titleKey: "exp4Title",
            contentKey: "exp4Content"
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
        
        vec3 getColorPalette(float progress) {
            if (progress < 5.0) {
                return vec3(0.95, 0.85, 0.90);
            }
            else if (progress < 15.0) {
                return vec3(0.85, 0.90, 0.98);
            }
            else if (progress < 25.0) {
                return vec3(0.88, 0.95, 0.90);
            }
            else {
                return vec3(0.92, 0.88, 0.98);
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
            
            O = tanh(o / 110000.0);
            O.rgb = pow(O.rgb, vec3(0.85));
            
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
let userResponses = [];

// Système d'explications détaillées
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
           "></button>
           <button id="skip-explanation" style="
               background: rgba(255, 255, 255, 0.1);
               border: 1px solid rgba(255, 255, 255, 0.3);
               border-radius: 25px;
               padding: 15px 30px;
               color: white;
               font-size: 16px;
               cursor: pointer;
               transition: all 0.3s ease;
           "></button>
       </div>
   `;

    modal.appendChild(content);
    document.body.appendChild(modal);

    document.getElementById('start-mini-game').addEventListener('click', () => {
        modal.style.display = 'none';
        launchMiniGame(checkpoints[currentCheckpoint].miniGameType);
    });

    document.getElementById('skip-explanation').addEventListener('click', () => {
        modal.style.display = 'none';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    return modal;
}

// Conteneur pour les mini-jeux
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
           "></button>
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

// Créer le menu de sélection de langue
function createLanguageMenu() {
    const languageMenu = document.createElement('div');
    languageMenu.id = 'language-menu';
    languageMenu.style.cssText = `
       position: absolute;
       top: 30px;
       left: 30px;
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

// Créer les modales
const explanationModal = createExplanationModal();
const miniGameContainer = createMiniGameContainer();
const languageMenu = createLanguageMenu();

// Afficher l'explication détaillée
function showDetailedExplanation(checkpoint) {
    const modal = document.getElementById('explanation-modal');
    const title = document.getElementById('explanation-title');
    const content = document.getElementById('explanation-content');
    const startBtn = document.getElementById('start-mini-game');
    const skipBtn = document.getElementById('skip-explanation');

    title.textContent = t(checkpoint.explanation.titleKey);
    content.innerHTML = t(checkpoint.explanation.contentKey);
    startBtn.textContent = t('launchExperience');
    skipBtn.textContent = t('skip');

    modal.style.display = 'flex';

    if (window.gsap) {
        gsap.fromTo(modal.children[0],
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
}

// Lancer un mini-jeu selon le type
function launchMiniGame(gameType) {
    const container = document.getElementById('mini-game-container');
    const content = document.getElementById('mini-game-content');
    const closeBtn = document.getElementById('close-mini-game');

    closeBtn.textContent = t('close');

    currentMiniGame = gameType;
    container.style.display = 'flex';

    contrastRevealed = false;
    isolationState = false;

    switch (gameType) {
        case 'contrast-comparison':
            createImprovedContrastComparisonGame(content);
            break;
        case 'brightness-illusion':
            createImprovedBrightnessIllusionGame(content);
            break;
        case 'white-balance':
            createImprovedWhiteBalanceGame(content);
            break;
        case 'context-effect':
            createImprovedContextEffectGame(content);
            break;
    }

    if (window.gsap) {
        gsap.fromTo(container.children[0],
            { scale: 0.8, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
        );
    }
}

// AMÉLIORATION 1: Contraste Simultané avec questions avant révélation
function createImprovedContrastComparisonGame(container) {
    let currentQuestion = 0;
    const questions = [
        {
            bgLeft: 0, bgRight: 255, gray: 128,
            questionKey: "exp1QuestionText1",
            correctAnswer: "right"
        },
        {
            bgLeft: 85, bgRight: 255, gray: 90,
            questionKey: "exp1QuestionText2",
            correctAnswer: "right"
        },
        {
            bgLeft: 0, bgRight: 255, gray: 35,
            questionKey: "exp1QuestionText3",
            correctAnswer: "right"
        }
    ];

    function showQuestion(questionIndex) {
        const q = questions[questionIndex];
        const questionTitle = questionIndex === 0 ? 'exp1Question1' :
            questionIndex === 1 ? 'exp1Question2' : 'exp1Question3';

        container.innerHTML = `
           <h2 style="text-align: center; margin-bottom: 20px;">${t(questionTitle)}</h2>
           <p style="text-align: center; margin-bottom: 30px; font-size: 18px;">${t(q.questionKey)}</p>
           
           <div style="display: flex; justify-content: center; align-items: center; gap: 40px; margin: 30px 0;">
               <div style="width: 180px; height: 180px; background: rgb(${q.bgLeft}, ${q.bgLeft}, ${q.bgLeft}); display: flex; justify-content: center; align-items: center; border-radius: 10px;">
                   <div style="width: 80px; height: 80px; background: rgb(${q.gray}, ${q.gray}, ${q.gray});"></div>
               </div>
               <div style="width: 180px; height: 180px; background: rgb(${q.bgRight}, ${q.bgRight}, ${q.bgRight}); display: flex; justify-content: center; align-items: center; border-radius: 10px;">
                   <div style="width: 80px; height: 80px; background: rgb(${q.gray}, ${q.gray}, ${q.gray});"></div>
               </div>
           </div>
           
           <div style="text-align: center; margin: 20px 0;">
               <button class="answer-btn" data-answer="left" style="
                   margin: 0 10px; padding: 12px 25px; background: rgba(255, 255, 255, 0.15);
                   border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 20px;
                   color: white; font-size: 16px; cursor: pointer; transition: all 0.3s ease;
               ">${t('exp1AnswerLeft')}</button>
               
               <button class="answer-btn" data-answer="equal" style="
                   margin: 0 10px; padding: 12px 25px; background: rgba(255, 255, 255, 0.15);
                   border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 20px;
                   color: white; font-size: 16px; cursor: pointer; transition: all 0.3s ease;
               ">${t('exp1AnswerEqual')}</button>
               
               <button class="answer-btn" data-answer="right" style="
                   margin: 0 10px; padding: 12px 25px; background: rgba(255, 255, 255, 0.15);
                   border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 20px;
                   color: white; font-size: 16px; cursor: pointer; transition: all 0.3s ease;
               ">${t('exp1AnswerRight')}</button>
           </div>
           
           <div id="question-feedback" style="display: none; margin-top: 20px; padding: 20px; border-radius: 10px; text-align: center;"></div>
       `;

        // Event listeners pour les réponses
        const answerBtns = container.querySelectorAll('.answer-btn');
        answerBtns.forEach(btn => {
            btn.addEventListener('click', () => handleQuestionAnswer(btn.dataset.answer, q.correctAnswer, questionIndex));
        });
    }

    function handleQuestionAnswer(userAnswer, correctAnswer, questionIndex) {
        const feedbackDiv = document.getElementById('question-feedback');
        const allBtns = container.querySelectorAll('.answer-btn');

        // Désactiver tous les boutons
        allBtns.forEach(btn => btn.style.pointerEvents = 'none');

        // Stocker la réponse
        userResponses[questionIndex] = userAnswer;

        // Afficher feedback
        const isCorrect = userAnswer === correctAnswer;
        feedbackDiv.style.display = 'block';
        feedbackDiv.style.background = isCorrect ?
            'linear-gradient(135deg, rgba(76, 175, 80, 0.2), rgba(69, 160, 73, 0.1))' :
            'linear-gradient(135deg, rgba(244, 67, 54, 0.2), rgba(211, 47, 47, 0.1))';
        feedbackDiv.innerHTML = '<p>' + (isCorrect ? t('exp1FeedbackCorrect') : t('exp1FeedbackIncorrect')) + '</p>';

        // Bouton pour continuer
        setTimeout(() => {
            if (questionIndex < questions.length - 1) {
                feedbackDiv.innerHTML += `<button onclick="nextQuestion()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; border: none; border-radius: 15px; color: white; cursor: pointer;">${t('exp1NextQuestion')}</button>`;
                window.nextQuestion = () => {
                    currentQuestion++;
                    showQuestion(currentQuestion);
                };
            } else {
                feedbackDiv.innerHTML += `<button onclick="showFinalExplanation()" style="margin-top: 15px; padding: 10px 20px; background: #667eea; border: none; border-radius: 15px; color: white; cursor: pointer;">${t('exp1ShowExplanation')}</button>`;
                window.showFinalExplanation = showContrastExplanation;
            }
        }, 1500);
    }

    function showContrastExplanation() {
        container.innerHTML = `
           <h2 style="text-align: center; margin-bottom: 20px;">${t('exp1ExplanationTitle')}</h2>
           
           <div style="padding: 25px; background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 193, 7, 0.05)); border-radius: 15px; margin-bottom: 25px;">
               <h3 style="color: #FFD700; margin: 0 0 15px 0;">${t('exp1Revelation')}</h3>
               <p style="font-size: 18px; margin-bottom: 15px;"><strong>${t('exp1RevealText')}</strong></p>
               <p>${t('exp1Content').replace(/<[^>]*>/g, '')}</p>
           </div>
           
           <h3 style="margin: 25px 0 15px 0;">${t('exp1ExperimentTitle')}</h3>
           
           <div style="display: flex; justify-content: center; align-items: center; gap: 40px; margin: 20px 0;">
               <div id="exp-bg-left" style="width: 180px; height: 180px; background: rgb(0, 0, 0); display: flex; justify-content: center; align-items: center; border-radius: 10px;">
                   <div id="exp-square-left" style="width: 80px; height: 80px; background: rgb(128, 128, 128);"></div>
               </div>
               <div style="width: 180px; height: 180px; background: rgb(255, 255, 255); display: flex; justify-content: center; align-items: center; border-radius: 10px;">
                   <div id="exp-square-right" style="width: 80px; height: 80px; background: rgb(128, 128, 128);"></div>
               </div>
           </div>
           
           <div style="text-align: center; margin: 20px 0;">
               <label style="display: block; margin-bottom: 10px;">${t('exp1BgLabel')}</label>
               <input type="range" id="bg-slider" min="0" max="255" value="0" style="width: 300px; margin-bottom: 8px;">
               <div>${t('exp1Brightness')} : <span id="bg-value">0</span></div>
               
               <label style="display: block; margin: 15px 0 10px 0;">${t('exp1SquareLabel')}</label>
               <input type="range" id="square-slider" min="0" max="255" value="128" style="width: 300px; margin-bottom: 8px;">
               <div>${t('exp1Gray')} : <span id="square-value">128</span></div>
           </div>
           
           <!-- Nouveau bouton "La robe" -->
         <div style="text-align: center; margin: 35px 0 25px;">
             <a href="jeu_robe.html" style="
                 display: inline-block;
                 background: linear-gradient(135deg,rgb(117, 107, 255) 0%,rgb(83, 192, 255) 100%);
                 border: none;
                 border-radius: 25px;
                 padding: 15px 40px;
                 color: white;
                 font-size: 18px;
                 font-weight: bold;
                 cursor: pointer;
                 text-decoration: none;
                 box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
                 transition: all 0.3s ease;
             ">
                 <span style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                     Cas d'Étude : La Robe
                     <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" style="margin-top: 2px;">
                         <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
                     </svg>
                 </span>
             </a>
         </div>
       `;

        // Event listeners pour les sliders (code existant)
        const bgSlider = document.getElementById('bg-slider');
        const squareSlider = document.getElementById('square-slider');
        const bgValue = document.getElementById('bg-value');
        const squareValue = document.getElementById('square-value');
        const bgLeft = document.getElementById('exp-bg-left');
        const squareLeft = document.getElementById('exp-square-left');
        const squareRight = document.getElementById('exp-square-right');

        bgSlider.addEventListener('input', function () {
            const value = this.value;
            bgLeft.style.background = `rgb(${value}, ${value}, ${value})`;
            bgValue.textContent = value;
        });

        squareSlider.addEventListener('input', function () {
            const value = this.value;
            const color = `rgb(${value}, ${value}, ${value})`;
            squareLeft.style.background = color;
            squareRight.style.background = color;
            squareValue.textContent = value;
        });

        // Faire briller le bouton "Voir +" pour attirer l'attention
        const style = document.createElement('style');
        style.textContent = `
           @keyframes glow {
               0%, 100% { box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3); }
               50% { box-shadow: 0 4px 25px rgba(255, 107, 107, 0.7); }
           }
           
           a[href="jeu_robe.html"]:hover {
               transform: translateY(-3px);
               box-shadow: 0 8px 25px rgba(255, 107, 107, 0.5);
           }
           
           a[href="jeu_robe.html"] {
               animation: glow 2s infinite ease-in-out;
           }
       `;
        document.head.appendChild(style);
    }

    // Commencer par la première question
    showQuestion(0);
}

// AMÉLIORATION 2: Illusion de Luminosité avec dégradé amélioré
function createImprovedBrightnessIllusionGame(container) {
    container.innerHTML = `
       <h2 style="text-align: center; margin-bottom: 30px;">${t('exp2GameTitle')}</h2>
       <p style="text-align: center; margin-bottom: 30px; font-size: 18px;">${t('exp2Instruction')}</p>
       
       <div style="display: flex; justify-content: center; align-items: center; margin: 40px 0;">
           <div style="width: 350px; height: 220px; background: linear-gradient(to right, #000000 0%, #1a1a1a 12.5%, #333333 25%, #4d4d4d 37.5%, #666666 50%, #808080 62.5%, #999999 75%, #b3b3b3 87.5%, #ffffff 100%); position: relative; border-radius: 10px;">
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
           <label style="display: block; margin-bottom: 15px; font-size: 16px; color: #fff;">${t('exp2SliderLabel')}</label>
           <input type="range" id="brightness-slider" min="0" max="255" value="128" 
                  style="width: 350px; margin-bottom: 15px;">
           <div style="margin-bottom: 30px; font-size: 16px; color: #FFD700;">
               ${t('exp2CurrentValue')} : <span id="brightness-value" style="font-weight: bold;">128</span> / 255
           </div>
           
           <div style="padding: 20px; background: rgba(255, 255, 255, 0.1); border-radius: 10px; margin-bottom: 20px;">
               <p style="margin: 0; font-size: 16px; color: #fff;">
                   ${t('exp2Challenge')}
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
           ">${t('exp2ShowSolution')}</button>
       </div>
       
       <div id="solution-text" style="
           display: none; 
           margin-top: 25px; 
           padding: 25px; 
           background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 193, 7, 0.05));
           border-radius: 15px;
           border: 1px solid rgba(255, 215, 0, 0.3);
       ">
           <h3 style="color: #FFD700; margin: 0 0 15px 0; font-size: 20px;">${t('exp2SolutionTitle')}</h3>
           <p id="dynamic-solution" style="font-size: 17px; line-height: 1.6; color: #fff; margin-bottom: 15px;"></p>
           <p style="font-size: 16px; line-height: 1.6; color: rgba(255, 255, 255, 0.9);">
               ${t('exp2TechExplanation')}
           </p>
           <div style="margin-top: 15px; padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 8px;">
               <p style="margin: 0; font-size: 14px; color: #66D9EF;">
                   <strong>Référence :</strong> Edward Adelson (1993) - "Perceptual Organization and the Judgment of Brightness"
               </p>
           </div>
       </div>
   `;

    // Event listeners
    const slider = document.getElementById('brightness-slider');
    const valueDisplay = document.getElementById('brightness-value');
    const testSquare = document.getElementById('test-square');
    const solutionBtn = document.getElementById('show-solution-btn');
    const solutionDiv = document.getElementById('solution-text');
    const dynamicSolution = document.getElementById('dynamic-solution');

    function updateSolution() {
        const currentValue = parseInt(slider.value);

        if (currentValue === 80) {
            dynamicSolution.innerHTML = currentLanguage === 'fr' ?
                '<strong>Point de référence !</strong> À 80, les deux carrés ont exactement la même couleur réelle. Mais vous paraissent-ils identiques ?' :
                '<strong>Reference point!</strong> At 80, both squares have exactly the same real color. But do they appear identical to you?';
        } else if (currentValue < 80) {
            dynamicSolution.innerHTML = currentLanguage === 'fr' ?
                `Vous avez réglé le carré de gauche plus foncé (${currentValue}) que sa valeur réelle (80). Cela montre que le fond noir le faisait paraître plus clair !` :
                `You've set the left square darker (${currentValue}) than its real value (80). This shows the black background made it appear brighter!`;
        } else {
            dynamicSolution.innerHTML = currentLanguage === 'fr' ?
                `Vous avez réglé le carré de gauche plus clair (${currentValue}) que sa valeur réelle (80). Cela montre que le fond noir le faisait paraître plus foncé !` :
                `You've set the left square brighter (${currentValue}) than its real value (80). This shows the black background made it appear darker!`;
        }
    }

    slider.addEventListener('input', function () {
        const value = this.value;
        testSquare.style.background = `rgb(${value}, ${value}, ${value})`;
        valueDisplay.textContent = value;



        // Mettre à jour la solution si elle est affichée
        if (solutionDiv.style.display !== 'none') {
            updateSolution();
        }
    });

    solutionBtn.addEventListener('click', function () {
        if (solutionDiv.style.display === 'none') {
            updateSolution();
            solutionDiv.style.display = 'block';
            this.textContent = t('exp2HideSolution');
            this.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';

            if (window.gsap) {
                gsap.fromTo(solutionDiv,
                    { opacity: 0, transform: 'translateY(20px)' },
                    { opacity: 1, transform: 'translateY(0)', duration: 0.5, ease: "back.out(1.7)" }
                );
            }
        } else {
            solutionDiv.style.display = 'none';
            this.textContent = t('exp2ShowSolution');
            this.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
    });
}

// AMÉLIORATION 3: Adaptation Chromatique physiquement correcte
function createImprovedWhiteBalanceGame(container) {
    let adaptationInProgress = false;
    let currentLighting = 'daylight';

    container.innerHTML = `
       <h2 style="text-align: center; margin-bottom: 30px;">${t('exp3GameTitle')}</h2>
       <p style="text-align: center; margin-bottom: 20px; font-size: 18px;">${t('exp3Instruction')}</p>
       
       <div style="display: flex; justify-content: center; align-items: center; margin: 40px 0;">
           <div id="lighting-scene" style="
               width: 500px;
               height: 350px;
               background: rgb(255, 255, 255);
               border-radius: 15px;
               display: flex;
               justify-content: space-around;
               align-items: center;
               transition: all 8s ease;
               box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
               position: relative;
               overflow: hidden;
               border: 3px solid #ddd;
           ">
               <div class="scene-object" data-base-color="255,255,255" style="
                   width: 100px;
                   height: 100px;
                   background: rgb(255, 255, 255);
                   border: 2px solid #ccc;
                   border-radius: 8px;
                   display: flex;
                   flex-direction: column;
                   align-items: center;
                   justify-content: center;
                   font-weight: bold;
                   color: #333;
                   font-size: 14px;
                   transition: all 8s ease;
                   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
               ">
                   <div>📄</div>
                   <div>${t('exp3Paper')}</div>
               </div>
               
               <div class="scene-object" data-base-color="200,50,50" style="
                   width: 100px;
                   height: 100px;
                   background: rgb(200, 50, 50);
                   border-radius: 50%;
                   display: flex;
                   flex-direction: column;
                   align-items: center;
                   justify-content: center;
                   font-weight: bold;
                   color: white;
                   font-size: 14px;
                   transition: all 8s ease;
                   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
               ">
                   <div>🍎</div>
                   <div>${t('exp3Apple')}</div>
               </div>
               
               <div class="scene-object" data-base-color="50,150,50" style="
                   width: 100px;
                   height: 100px;
                   background: rgb(50, 150, 50);
                   border-radius: 8px;
                   display: flex;
                   flex-direction: column;
                   align-items: center;
                   justify-content: center;
                   font-weight: bold;
                   color: white;
                   font-size: 14px;
                   transition: all 8s ease;
                   box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
               ">
                   <div>🌿</div>
                   <div>${t('exp3Leaf')}</div>
               </div>
               
               <div id="color-temp-indicator" style="
                   position: absolute;
                   top: 15px;
                   right: 15px;
                   padding: 8px 15px;
                   background: rgba(0, 0, 0, 0.7);
                   color: white;
                   border-radius: 20px;
                   font-size: 12px;
                   font-weight: bold;
                   transition: all 8s ease;
               ">6500K</div>
               
               <div id="adaptation-overlay" style="
                   position: absolute;
                   top: 0;
                   left: 0;
                   width: 100%;
                   height: 100%;
                   background: transparent;
                   pointer-events: none;
                   transition: all 8s ease;
               "></div>
           </div>
       </div>
       
       <div style="text-align: center; margin: 30px 0;">
           <h3 style="margin-bottom: 20px; color: #fff;">${t('exp3ChangeSlowly')}</h3>
           <div style="display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
               <button class="light-btn" data-light="daylight" data-temp="6500K" style="
                   padding: 12px 20px; 
                   background: linear-gradient(135deg, #87CEEB, #B0E0E6); 
                   border: 2px solid #4682B4;
                   border-radius: 25px; cursor: pointer; color: #000; 
                   font-weight: bold; transition: all 0.3s ease;
                   transform: scale(1.1);
               ">${t('exp3Daylight')}</button>
               
               <button class="light-btn" data-light="tungsten" data-temp="2700K" style="
                   padding: 12px 20px; 
                   background: linear-gradient(135deg, #FFB347, #FFA500); 
                   border: 2px solid transparent;
                   border-radius: 25px; cursor: pointer; color: #000; 
                   font-weight: bold; transition: all 0.3s ease;
               ">${t('exp3Tungsten')}</button>
               
               <button class="light-btn" data-light="fluorescent" data-temp="4000K" style="
                   padding: 12px 20px; 
                   background: linear-gradient(135deg, #98FB98, #90EE90); 
                   border: 2px solid transparent;
                   border-radius: 25px; cursor: pointer; color: #000; 
                   font-weight: bold; transition: all 0.3s ease;
               ">${t('exp3Fluorescent')}</button>
           </div>
           <p style="font-size: 14px; color: rgba(255, 255, 255, 0.8); margin-top: 15px;">
               ${t('exp3ImportantNote')}
           </p>
       </div>
       
       <div style="text-align: center; margin: 30px 0;">
           <button id="demo-adaptation" style="
               background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
               border: none; border-radius: 25px; padding: 15px 30px;
               color: white; font-size: 16px; font-weight: bold; cursor: pointer;
               transition: all 0.3s ease; margin: 0 10px;
           ">${t('exp3DemoAdaptation')}</button>
           
           <button id="compare-lighting" style="
               background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
               border: none; border-radius: 25px; padding: 15px 30px;
               color: white; font-size: 16px; font-weight: bold; cursor: pointer;
               transition: all 0.3s ease; margin: 0 10px;
           ">${t('exp3BrutalChange')}</button>
       </div>
       
       <div id="explanation-panel" style="
           margin-top: 30px; padding: 25px; 
           background: rgba(255, 255, 255, 0.1); 
           border-radius: 15px; border: 1px solid rgba(255, 255, 255, 0.2);
       ">
           <h4 style="color: #66D9EF; margin: 0 0 15px 0;">${t('exp3PhysicsTitle')}</h4>
           
           <div style="margin-bottom: 20px;">
               <h5 style="color: #FFD700; margin: 0 0 8px 0;">${t('exp3PhysicsSubtitle')}</h5>
               <p style="margin: 0 0 10px 0; line-height: 1.6; font-size: 15px;">
                   ${t('exp3PhysicsText')}
               </p>
               <ul style="margin: 0; padding-left: 20px; line-height: 1.6; font-size: 14px;">
                   <li><strong>${t('exp3Daylight')} (6500K) :</strong> ${currentLanguage === 'fr' ? 'Contient toutes les couleurs de manière équilibrée' : 'Contains all colors in a balanced way'}</li>
                   <li><strong>${t('exp3Tungsten')} (2700K) :</strong> ${currentLanguage === 'fr' ? 'Plus de rouge/orange, moins de bleu' : 'More red/orange, less blue'}</li>
                   <li><strong>${t('exp3Fluorescent')} (4000K) :</strong> ${currentLanguage === 'fr' ? 'Pics dans le vert, déficit dans certaines longueurs d\'onde' : 'Peaks in green, deficit in certain wavelengths'}</li>
               </ul>
           </div>
           
           <div style="margin-bottom: 20px;">
               <h5 style="color: #FFD700; margin: 0 0 8px 0;">${t('exp3AdaptationSubtitle')}</h5>
               <p style="margin: 0; line-height: 1.6; font-size: 15px;">
                   ${t('exp3AdaptationText')}
               </p>
           </div>
           
           <div style="padding: 15px; background: rgba(255, 215, 0, 0.1); border-radius: 8px; border-left: 3px solid #FFD700;">
               <p style="margin: 0; font-size: 14px; color: #FFD700;">
                   ${t('exp3Reference')}
               </p>
           </div>
       </div>
   `;

    // Propriétés d'éclairage physiquement correctes
    const lightingSources = {
        daylight: {
            r: 1.0, g: 1.0, b: 1.0,
            temp: "6500K",
            bg: "rgb(255, 255, 255)",
            overlay: "rgba(240, 248, 255, 0.1)"
        },
        tungsten: {
            r: 1.0, g: 0.6, b: 0.3,
            temp: "2700K",
            bg: "rgb(255, 220, 180)",
            overlay: "rgba(255, 200, 100, 0.15)"
        },
        fluorescent: {
            r: 0.9, g: 1.0, b: 0.85,
            temp: "4000K",
            bg: "rgb(240, 255, 245)",
            overlay: "rgba(150, 255, 150, 0.08)"
        }
    };

    // Fonction pour calculer la couleur réfléchie physiquement correcte
    function calculatePhysicalReflection(baseColor, lightColor) {
        const [r, g, b] = baseColor.split(',').map(Number);
        return {
            r: Math.round(r * lightColor.r),
            g: Math.round(g * lightColor.g),
            b: Math.round(b * lightColor.b)
        };
    }

    // Fonction pour changer l'éclairage progressivement
    function changeLighting(lightType, isInstant = false) {
        if (adaptationInProgress && !isInstant) return;

        adaptationInProgress = true;
        currentLighting = lightType;

        const light = lightingSources[lightType];
        const scene = document.getElementById('lighting-scene');
        const objects = container.querySelectorAll('.scene-object');
        const tempIndicator = document.getElementById('color-temp-indicator');
        const overlay = document.getElementById('adaptation-overlay');

        // Durée de transition (instantané ou lent)
        const duration = isInstant ? '0.5s' : '8s';

        // Mettre à jour les styles de transition
        scene.style.transition = `all ${duration} ease`;
        overlay.style.transition = `all ${duration} ease`;
        tempIndicator.style.transition = `all ${duration} ease`;

        objects.forEach(obj => {
            obj.style.transition = `all ${duration} ease`;
        });

        // Appliquer les changements
        scene.style.background = light.bg;
        overlay.style.background = light.overlay;
        tempIndicator.textContent = light.temp;

        // Calculer et appliquer les couleurs réfléchies pour chaque objet
        objects.forEach(obj => {
            const baseColor = obj.dataset.baseColor;
            const reflectedColor = calculatePhysicalReflection(baseColor, light);
            obj.style.background = `rgb(${reflectedColor.r}, ${reflectedColor.g}, ${reflectedColor.b})`;

            // Ajuster la couleur du texte pour la lisibilité
            const brightness = (reflectedColor.r + reflectedColor.g + reflectedColor.b) / 3;
            obj.style.color = brightness > 120 ? '#333' : '#fff';
        });

        // Mettre à jour les boutons
        const lightBtns = container.querySelectorAll('.light-btn');
        lightBtns.forEach(btn => {
            if (btn.dataset.light === lightType) {
                btn.style.transform = 'scale(1.1)';
                btn.style.border = '2px solid #4682B4';
            } else {
                btn.style.transform = 'scale(1)';
                btn.style.border = '2px solid transparent';
            }
        });

        // Réactiver après la transition
        setTimeout(() => {
            adaptationInProgress = false;
        }, isInstant ? 500 : 8000);
    }

    // Event listeners pour les boutons d'éclairage
    const lightBtns = container.querySelectorAll('.light-btn');
    lightBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            if (!adaptationInProgress) {
                changeLighting(this.dataset.light);

                // Message temporaire
                const message = document.createElement('div');
                message.style.cssText = `
                   position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                   background: rgba(0, 0, 0, 0.8); color: white; padding: 15px 25px;
                   border-radius: 25px; font-size: 16px; z-index: 1000;
                   border: 2px solid #FFD700;
               `;
                message.textContent = t('transitionInProgress', { light: this.textContent });
                document.body.appendChild(message);

                setTimeout(() => message.remove(), 8500);
            }
        });
    });

    // Démonstration d'adaptation automatique
    document.getElementById('demo-adaptation').addEventListener('click', function () {
        if (adaptationInProgress) return;

        this.disabled = true;
        this.textContent = t('adaptationDemo');

        const sequence = [
            { light: 'tungsten', message: currentLanguage === 'fr' ? 'Passage à l\'éclairage tungstène...' : 'Switching to tungsten lighting...', delay: 0 },
            { light: 'tungsten', message: currentLanguage === 'fr' ? 'Votre œil s\'adapte progressivement...' : 'Your eye is gradually adapting...', delay: 8000 },
            { light: 'daylight', message: currentLanguage === 'fr' ? 'Retour brutal à la lumière du jour !' : 'Brutal return to daylight!', delay: 12000 },
            { light: 'daylight', message: currentLanguage === 'fr' ? 'Remarquez la différence perçue !' : 'Notice the perceived difference!', delay: 13000 }
        ];

        sequence.forEach((step, index) => {
            setTimeout(() => {
                if (step.light !== currentLighting) {
                    changeLighting(step.light, index === 2); // Changement brutal pour le retour
                }

                // Afficher le message
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = `
                   position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
                   background: rgba(0, 0, 0, 0.9); color: white; padding: 20px 30px;
                   border-radius: 15px; font-size: 18px; z-index: 1001;
                   border: 2px solid #66D9EF; text-align: center;
               `;
                messageDiv.textContent = step.message;
                document.body.appendChild(messageDiv);

                setTimeout(() => messageDiv.remove(), index === sequence.length - 1 ? 3000 : 2000);
            }, step.delay);
        });

        // Réactiver le bouton
        setTimeout(() => {
            this.disabled = false;
            this.textContent = t('exp3DemoAdaptation');
        }, 18000);
    });

    // Changement brutal pour comparaison
    document.getElementById('compare-lighting').addEventListener('click', function () {
        if (adaptationInProgress) return;

        const otherLights = Object.keys(lightingSources).filter(l => l !== currentLighting);
        const randomLight = otherLights[Math.floor(Math.random() * otherLights.length)];

        changeLighting(randomLight, true); // Changement instantané

        const message = document.createElement('div');
        message.style.cssText = `
           position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
           background: rgba(255, 107, 107, 0.9); color: white; padding: 15px 25px;
           border-radius: 25px; font-size: 16px; z-index: 1000;
           border: 2px solid white;
       `;
        message.textContent = t('brutalChange', { temp: lightingSources[randomLight].temp });
        document.body.appendChild(message);

        setTimeout(() => message.remove(), 3000);
    });

    // Initialiser avec la lumière du jour
    changeLighting('daylight', true);
}

// EXPÉRIENCE 4 CORRIGÉE : Effet de Contexte avec gestion améliorée du glisser-déposer
function createImprovedContextEffectGame(container) {
    container.innerHTML = `
        <h2 style="text-align: center; margin-bottom: 30px;">${t('exp4GameTitle')}</h2>
        <p style="text-align: center; margin-bottom: 20px; font-size: 18px;">${t('exp4Question')}</p>
        
        <div id="context-demo" style="display: flex; justify-content: space-around; align-items: center; margin: 50px 0;">
            <div class="context-bg" style="width: 200px; height: 200px; background: linear-gradient(45deg, #D2527F, #E8A87C); display: flex; justify-content: center; align-items: center; border-radius: 15px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);">
                <div class="test-circle" data-original-bg="linear-gradient(45deg, #D2527F, #E8A87C)" style="width: 70px; height: 70px; background: #787878; border-radius: 50%; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);">
                    <span style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); color: white; font-weight: bold; font-size: 16px;">A</span>
                </div>
            </div>
            <div class="context-bg" style="width: 200px; height: 200px; background: linear-gradient(45deg, #4ECDC4, #44A08D); display: flex; justify-content: center; align-items: center; border-radius: 15px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);">
                <div class="test-circle" data-original-bg="linear-gradient(45deg, #4ECDC4, #44A08D)" style="width: 70px; height: 70px; background: #787878; border-radius: 50%; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);">
                    <span style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); color: white; font-weight: bold; font-size: 16px;">B</span>
                </div>
            </div>
            <div class="context-bg" style="width: 200px; height: 200px; background: linear-gradient(45deg, #A8B5E6, #7B68EE); display: flex; justify-content: center; align-items: center; border-radius: 15px; box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);">
                <div class="test-circle" data-original-bg="linear-gradient(45deg, #A8B5E6, #7B68EE)" style="width: 70px; height: 70px; background: #787878; border-radius: 50%; box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);">
                    <span style="position: absolute; top: -25px; left: 50%; transform: translateX(-50%); color: white; font-weight: bold; font-size: 16px;">C</span>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0;">
            <p style="font-size: 16px; margin-bottom: 20px; color: #FFD700;">${t('exp4DragInstruction')}</p>
            <div id="ranking-area" style="
                display: flex; 
                justify-content: center; 
                gap: 20px; 
                padding: 20px; 
                background: rgba(255, 255, 255, 0.1); 
                border-radius: 15px; 
                margin: 20px auto;
                max-width: 600px;
            ">
                <div class="rank-slot" data-rank="1" style="
                    width: 100px; height: 100px; 
                    border: 3px dashed rgba(255, 255, 255, 0.5); 
                    border-radius: 50%; 
                    display: flex; align-items: center; justify-content: center;
                    font-size: 18px; font-weight: bold; color: #FFD700;
                    position: relative;
                ">${t('exp4Rank1')}</div>
                <div class="rank-slot" data-rank="2" style="
                    width: 100px; height: 100px; 
                    border: 3px dashed rgba(255, 255, 255, 0.5); 
                    border-radius: 50%; 
                    display: flex; align-items: center; justify-content: center;
                    font-size: 18px; font-weight: bold; color: #FFD700;
                    position: relative;
                ">${t('exp4Rank2')}</div>
                <div class="rank-slot" data-rank="3" style="
                    width: 100px; height: 100px; 
                    border: 3px dashed rgba(255, 255, 255, 0.5); 
                    border-radius: 50%; 
                    display: flex; align-items: center; justify-content: center;
                    font-size: 18px; font-weight: bold; color: #FFD700;
                    position: relative;
                ">${t('exp4Rank3')}</div>
            </div>
            <button id="check-ranking" style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border: none; border-radius: 25px; padding: 15px 30px;
                color: white; font-size: 16px; font-weight: bold; cursor: pointer;
                margin-top: 20px; opacity: 0.5; pointer-events: none;
                transition: all 0.3s ease;
            ">${t('exp4ValidateAnswer')}</button>
        </div>
        
        <div style="text-align: center; margin: 30px 0; display: flex; justify-content: center; gap: 15px; flex-wrap: wrap;">
            <button id="isolation-btn" style="
                background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
                border: none; border-radius: 25px; padding: 12px 25px;
                color: white; font-size: 16px; cursor: pointer; transition: all 0.3s ease;
            ">${t('exp4IsolateCircles')}</button>
            
            <button id="reveal-btn" style="
                background: linear-gradient(135deg, #00BFFF 0%, #1E90FF 100%);
                border: none; border-radius: 25px; padding: 12px 25px;
                color: white; font-size: 16px; cursor: pointer; transition: all 0.3s ease;
            ">${t('exp4RevealTruth')}</button>
        </div>
        
        <div id="context-explanation" style="
            display: none; margin-top: 30px; padding: 25px; 
            background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 193, 7, 0.05)); 
            border-radius: 15px; border: 1px solid rgba(255, 215, 0, 0.3);
        ">
            <h3 style="color: #FFD700; margin: 0 0 15px 0;">${t('exp4RevelationTitle')}</h3>
            <p id="user-ranking-display" style="font-size: 16px; margin-bottom: 15px;"></p>
            <p style="font-size: 18px; margin-bottom: 15px;"><strong>${t('exp4TruthText')}</strong></p>
            <p style="line-height: 1.6; margin-bottom: 15px;">${t('exp4WhyTitle')}</p>
            <div style="padding: 15px; background: rgba(255, 255, 255, 0.1); border-radius: 8px; margin-top: 15px;">
                <p style="margin: 0; font-size: 14px; color: #66D9EF;">
                    ${t('exp4Reference')}
                </p>
            </div>
        </div>
    `;

    // Initialisation des variables
    let userRanking = [null, null, null]; // Utilisons un tableau avec les emplacements déjà définis
    let draggedElement = null;
    let draggedCircleId = null;

    // Rendre les cercles déplaçables avec des positions initiales
    const circles = container.querySelectorAll('.test-circle');
    circles.forEach((circle, index) => {
        // Identifier le cercle
        circle.id = `circle-${index}`;
        circle.dataset.circleId = index;
        circle.style.position = 'relative';
        circle.style.cursor = 'grab';

        // Ajouter les attributs pour le glisser-déposer
        circle.setAttribute('draggable', 'true');

        // Événements de glisser-déposer
        circle.addEventListener('dragstart', (e) => {
            draggedElement = circle;
            draggedCircleId = index;
            e.dataTransfer.setData('text/plain', index);
            circle.style.opacity = '0.5';
            setTimeout(() => {
                circle.style.display = 'none';
            }, 0);
        });

        circle.addEventListener('dragend', (e) => {
            circle.style.opacity = '1';
            circle.style.display = 'block';
            draggedElement = null;
        });
    });

    // Gestion des zones de dépôt avec détection améliorée
    const rankSlots = container.querySelectorAll('.rank-slot');
    rankSlots.forEach(slot => {
        // État initial
        slot.dataset.filled = 'false';

        // Événements de glisser-déposer
        slot.addEventListener('dragover', (e) => {
            e.preventDefault();
            slot.style.background = 'rgba(255, 215, 0, 0.2)';
            slot.style.borderStyle = 'solid';
        });

        slot.addEventListener('dragleave', () => {
            slot.style.background = 'transparent';
            slot.style.borderStyle = 'dashed';
        });

        slot.addEventListener('drop', (e) => {
            e.preventDefault();
            slot.style.background = 'transparent';
            slot.style.borderStyle = 'dashed';

            const circleId = parseInt(e.dataTransfer.getData('text/plain'));
            const rank = parseInt(slot.dataset.rank);

            // Si le slot est déjà occupé par un autre cercle, libérer ce cercle
            if (slot.dataset.filled === 'true' && slot.dataset.circleId !== String(circleId)) {
                const oldCircleId = parseInt(slot.dataset.circleId);
                const oldCircle = document.getElementById(`circle-${oldCircleId}`);
                if (oldCircle) {
                    // Retirer le cercle du classement
                    const oldRankIndex = userRanking.indexOf(oldCircleId);
                    if (oldRankIndex !== -1) {
                        userRanking[oldRankIndex] = null;
                    }

                    // Remettre le cercle à sa position d'origine
                    const originalContext = document.querySelector(`.context-bg:nth-child(${oldCircleId + 1})`);
                    originalContext.appendChild(oldCircle);
                }
            }

            // Si le cercle était déjà dans un autre slot, le retirer
            const oldRankIndex = userRanking.indexOf(circleId);
            if (oldRankIndex !== -1) {
                // Trouver l'ancien slot et le réinitialiser
                const oldSlot = document.querySelector(`.rank-slot[data-rank="${oldRankIndex + 1}"]`);
                if (oldSlot) {
                    oldSlot.innerHTML = t(`exp4Rank${oldRankIndex + 1}`);
                    oldSlot.dataset.filled = 'false';
                    delete oldSlot.dataset.circleId;
                }
                userRanking[oldRankIndex] = null;
            }

            // Placer le cercle dans le nouveau slot
            const circle = document.getElementById(`circle-${circleId}`);
            if (circle) {
                // Créer une copie du cercle pour le slot
                const clone = circle.cloneNode(true);
                clone.style.width = '60px';
                clone.style.height = '60px';
                clone.style.cursor = 'default';
                clone.removeAttribute('draggable');

                // Vider le slot et ajouter le clone
                slot.innerHTML = '';
                slot.appendChild(clone);
                slot.dataset.filled = 'true';
                slot.dataset.circleId = circleId;

                // Mettre à jour le classement
                userRanking[rank - 1] = circleId;

                // Vérifier si tous les slots sont remplis
                checkRankingComplete();
            }
        });
    });

    // Fonction pour vérifier si le classement est complet
    function checkRankingComplete() {
        const isComplete = userRanking.every(item => item !== null);
        const checkBtn = document.getElementById('check-ranking');

        if (isComplete) {
            checkBtn.style.opacity = '1';
            checkBtn.style.pointerEvents = 'auto';
            // Ajouter une animation d'encouragement
            checkBtn.classList.add('pulse-button');
            checkBtn.textContent = t('exp4ValidateComplete');
        } else {
            checkBtn.style.opacity = '0.5';
            checkBtn.style.pointerEvents = 'none';
            checkBtn.classList.remove('pulse-button');
            checkBtn.textContent = t('exp4ValidateProgress', { current: userRanking.filter(Boolean).length });
        }
    }

    // Bouton de vérification du classement
    document.getElementById('check-ranking').addEventListener('click', function () {
        const explanationDiv = document.getElementById('context-explanation');
        explanationDiv.style.display = 'block';

        // Afficher le classement de l'utilisateur
        const userRankingDisplay = document.getElementById('user-ranking-display');
        userRankingDisplay.innerHTML = `
            <strong>${t('exp4UserRanking')}</strong><br>
            ${rankingLabelFromIndex(userRanking[0])} → 
            ${rankingLabelFromIndex(userRanking[1])} → 
            ${rankingLabelFromIndex(userRanking[2])}<br>
            <span style="color: #FFD700; font-size: 14px;">${t('exp4RankingNote')}</span>
        `;

        this.style.display = 'none';

        if (window.gsap) {
            gsap.fromTo(explanationDiv,
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)', duration: 0.5, ease: "back.out(1.7)" }
            );
        }
    });

    // Fonction pour obtenir l'étiquette d'un cercle
    function rankingLabelFromIndex(index) {
        const labels = ['A', 'B', 'C'];
        return `${t('exp4CircleA').replace('A', labels[index])}`;
    }

    // Bouton d'isolation
    let isolationState = false;
    document.getElementById('isolation-btn').addEventListener('click', function () {
        const backgrounds = container.querySelectorAll('.context-bg');

        if (!isolationState) {
            // Isoler : mettre tous les fonds en gris neutre
            backgrounds.forEach(bg => {
                bg.style.background = '#555';
            });
            this.textContent = t('exp4RestoreContexts');
            this.style.background = 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';

            // Afficher un message
            showTemporaryMessage(t('backgroundsNeutralized'), 3000);

            isolationState = true;
        } else {
            // Remettre les contextes colorés
            backgrounds.forEach((bg, index) => {
                const circle = bg.querySelector('.test-circle');
                if (circle) {
                    bg.style.background = circle.dataset.originalBg;
                }
            });
            this.textContent = t('exp4IsolateCircles');
            this.style.background = 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)';

            // Afficher un message
            showTemporaryMessage(t('contextsRestored'), 3000);

            isolationState = false;
        }
    });

    // Bouton de révélation de la vérité
    document.getElementById('reveal-btn').addEventListener('click', function () {
        const explanationDiv = document.getElementById('context-explanation');
        explanationDiv.style.display = 'block';

        // Si l'utilisateur n'a pas encore classé les cercles
        if (!userRanking.every(item => item !== null)) {
            const userRankingDisplay = document.getElementById('user-ranking-display');
            userRankingDisplay.innerHTML = `
                <span style="color: #FFD700; font-size: 16px;">${t('exp4RankingNote')}</span>
            `;
        }

        if (window.gsap) {
            gsap.fromTo(explanationDiv,
                { opacity: 0, transform: 'translateY(20px)' },
                { opacity: 1, transform: 'translateY(0)', duration: 0.5, ease: "back.out(1.7)" }
            );
        }

        // Animation de révélation
        const circles = container.querySelectorAll('.test-circle');
        circles.forEach(circle => {
            if (window.gsap) {
                gsap.to(circle, {
                    scale: 1.1,
                    boxShadow: '0 0 20px rgba(255,255,255,0.7)',
                    border: '2px solid #fff',
                    duration: 0.5,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    });

    // Fonction pour afficher un message temporaire
    function showTemporaryMessage(message, duration = 3000) {
        const messageDiv = document.createElement('div');
        messageDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 20px 30px;
            border-radius: 15px;
            font-size: 18px;
            z-index: 1001;
            text-align: center;
            border: 2px solid #66D9EF;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        messageDiv.innerHTML = message;
        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.remove();
            }, 300);
        }, duration);
    }

    // Ajouter une classe d'animation pour le bouton de validation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse-button {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
        .pulse-button {
            animation: pulse-button 1.5s infinite;
            box-shadow: 0 0 15px rgba(102, 126, 234, 0.5);
        }
    `;
    document.head.appendChild(style);
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
            dot.style.display = 'none';
        }
    });

    prevBtn.disabled = currentCheckpoint === 0;
    nextBtn.disabled = currentCheckpoint === totalCheckpoints - 1;

    const checkpoint = checkpoints[currentCheckpoint];
    checkpointTitle.textContent = t(checkpoint.titleKey);
    checkpointDescription.textContent = t(checkpoint.descKey);
    startGameBtn.textContent = t('startGame');
}

// Afficher le panneau d'information
function showInfoPanel() {
    infoPanel.classList.add('visible');
    setTimeout(() => {
        infoPanel.classList.remove('visible');
    }, 120000);
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
    overlay.innerHTML = t('returningToMenu');
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

startGameBtn.addEventListener('click', () => {
    const checkpoint = checkpoints[currentCheckpoint];
    showDetailedExplanation(checkpoint);
    infoPanel.classList.remove('visible');
});

// Navigation au clavier améliorée
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

    switch (event.key) {
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
    console.log('🎨 Galerie Interactive - Perception des Couleurs (Version Multilingue)');
    console.log('📍 Navigation: Flèches ← → ou clic sur les points');
    console.log('🎮 Interactions: Espace pour les explications, Échap pour sortir');
    console.log('🌐 Langues: Français/English disponibles');
    console.log('🔬 Mini-jeux: Expériences interactives scientifiquement correctes');

    // Charger la langue sauvegardée
    const savedLang = localStorage.getItem('colorPerceptionLang');
    if (savedLang && translations[savedLang]) {
        currentLanguage = savedLang;
        document.getElementById('language-select').value = savedLang;
    }

    updateUI();
    updateUILanguage();

    setTimeout(() => {
        showInfoPanel();
    }, 1500);

    animate();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}