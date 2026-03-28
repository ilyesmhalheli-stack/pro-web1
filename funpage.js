// JavaScript pour la page funpage.html
// Auteur: Étudiants ENSI
// Projet: StudyFlow - Partie 3

// Variables globales pour le jeu de mémoire
const emojis = ['📚', '✏️', '🎓', '📖', '💡', '🏆', '📝', '⏰'];
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameTimer = null;
let seconds = 0;
let canFlip = true;

// Variables pour la démonstration d'événements
let stopPropagation = false;

// Initialisation du jeu au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    initializeMemoryGame();
    setupEventPropagationDemo();
});

// Fonction pour initialiser le jeu de mémoire
function initializeMemoryGame() {
    // Créer les paires de cartes
    cards = [...emojis, ...emojis];
    shuffleArray(cards);
    
    // Générer le HTML des cartes
    const gameContainer = document.getElementById('memoryGame');
    gameContainer.innerHTML = '';
    
    cards.forEach((emoji, index) => {
        const card = createMemoryCard(emoji, index);
        gameContainer.appendChild(card);
    });
    
    // Réinitialiser les statistiques
    resetStats();
}

// Fonction pour créer une carte de mémoire
function createMemoryCard(emoji, index) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.emoji = emoji;
    card.dataset.index = index;
    
    card.innerHTML = `
        <div class="card-front">?</div>
        <div class="card-back">${emoji}</div>
    `;
    
    // Ajouter l'événement de clic
    card.addEventListener('click', function() {
        flipCard(this);
    });
    
    return card;
}

// Fonction pour retourner une carte
function flipCard(card) {
    // Vérifier si on peut retourner la carte
    if (!canFlip || card.classList.contains('flipped') || card.classList.contains('matched')) {
        return;
    }
    
    // Retourner la carte
    card.classList.add('flipped');
    flippedCards.push(card);
    
    // Si on a retourné 2 cartes, vérifier si elles correspondent
    if (flippedCards.length === 2) {
        canFlip = false;
        moves++;
        updateMoves();
        checkForMatch();
    }
}

// Fonction pour vérifier si les cartes retournées correspondent
function checkForMatch() {
    const [card1, card2] = flippedCards;
    const match = card1.dataset.emoji === card2.dataset.emoji;
    
    if (match) {
        // Les cartes correspondent
        setTimeout(() => {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            updateMatches();
            flippedCards = [];
            canFlip = true;
            
            // Vérifier si le jeu est terminé
            if (matchedPairs === emojis.length) {
                endGame();
            }
        }, 600);
    } else {
        // Les cartes ne correspondent pas
        setTimeout(() => {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            flippedCards = [];
            canFlip = true;
        }, 1000);
    }
}

// Fonction pour mélanger un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Fonction pour réinitialiser le jeu
function resetGame() {
    // Arrêter le timer
    if (gameTimer) {
        clearInterval(gameTimer);
    }
    
    // Réinitialiser les variables
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    canFlip = true;
    
    // Réinitialiser l'affichage
    resetStats();
    initializeMemoryGame();
    startTimer();
}

// Fonction pour démarrer le timer
function startTimer() {
    gameTimer = setInterval(() => {
        seconds++;
        updateTimer();
    }, 1000);
}

// Fonction pour mettre à jour l'affichage du timer
function updateTimer() {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Fonction pour mettre à jour le nombre de coups
function updateMoves() {
    document.getElementById('moves').textContent = moves;
}

// Fonction pour mettre à jour le nombre de paires trouvées
function updateMatches() {
    document.getElementById('matches').textContent = matchedPairs;
}

// Fonction pour réinitialiser les statistiques
function resetStats() {
    document.getElementById('moves').textContent = '0';
    document.getElementById('matches').textContent = '0';
    document.getElementById('timer').textContent = '00:00';
}

// Fonction pour terminer le jeu
function endGame() {
    clearInterval(gameTimer);
    
    // Afficher les statistiques finales
    document.getElementById('finalMoves').textContent = moves;
    document.getElementById('finalTime').textContent = document.getElementById('timer').textContent;
    
    // Afficher le message de victoire
    setTimeout(() => {
        document.getElementById('overlay').classList.add('show');
        document.getElementById('winMessage').classList.add('show');
    }, 500);
}

// Fonction pour fermer le message de victoire
function closeWinMessage() {
    document.getElementById('overlay').classList.remove('show');
    document.getElementById('winMessage').classList.remove('show');
    resetGame();
}

// Fonction pour donner un indice
function showHint() {
    // Trouver deux cartes non assorties qui correspondent
    const unmatchedCards = document.querySelectorAll('.memory-card:not(.matched)');
    const cardGroups = {};
    
    // Grouper les cartes par emoji
    unmatchedCards.forEach(card => {
        const emoji = card.dataset.emoji;
        if (!cardGroups[emoji]) {
            cardGroups[emoji] = [];
        }
        cardGroups[emoji].push(card);
    });
    
    // Trouver un groupe avec au moins 2 cartes
    for (const emoji in cardGroups) {
        if (cardGroups[emoji].length >= 2) {
            // Faire clignoter les deux cartes
            const [card1, card2] = cardGroups[emoji];
            card1.style.animation = 'matchPulse 1s ease 2';
            card2.style.animation = 'matchPulse 1s ease 2';
            
            setTimeout(() => {
                card1.style.animation = '';
                card2.style.animation = '';
            }, 2000);
            
            break;
        }
    }
}

// Configuration de la démonstration de propagation d'événements
function setupEventPropagationDemo() {
    const outerDiv = document.getElementById('outerDiv');
    const middleDiv = document.getElementById('middleDiv');
    const innerDiv = document.getElementById('innerDiv');
    const stopBtn = document.getElementById('stopPropagationBtn');
    const eventLog = document.getElementById('eventLog');
    
    // Ajouter les écouteurs d'événements pour la démonstration
    outerDiv.addEventListener('click', function(event) {
        logEvent('Élément externe (rouge) cliqué', event);
        highlightElement(this, 'rgba(255, 0, 0, 0.6)');
    });
    
    middleDiv.addEventListener('click', function(event) {
        logEvent('Élément moyen (vert) cliqué', event);
        highlightElement(this, 'rgba(0, 255, 0, 0.6)');
    });
    
    innerDiv.addEventListener('click', function(event) {
        logEvent('Élément interne (bleu) cliqué', event);
        highlightElement(this, 'rgba(0, 0, 255, 0.6)');
        
        // Utiliser stopPropagation si activé
        if (stopPropagation) {
            event.stopPropagation();
            logEvent('🛑 stopPropagation() activé - propagation arrêtée !', event);
        }
    });
    
    // Gérer le bouton pour activer/désactiver stopPropagation
    stopBtn.addEventListener('click', function() {
        stopPropagation = !stopPropagation;
        this.textContent = stopPropagation ? 
            '✅ stopPropagation() ACTIVÉ' : 
            '🛑 Activer/Désactiver stopPropagation()';
        this.style.background = stopPropagation ? '#28a745' : '#dc3545';
        
        logEvent(`stopPropagation() ${stopPropagation ? 'activé' : 'désactivé'}`, event);
    });
}

// Fonction pour logger les événements
function logEvent(message, event) {
    const eventLog = document.getElementById('eventLog');
    const timestamp = new Date().toLocaleTimeString('fr-FR');
    const logEntry = document.createElement('div');
    logEntry.textContent = `[${timestamp}] ${message}`;
    eventLog.appendChild(logEntry);
    eventLog.scrollTop = eventLog.scrollHeight;
    
    // Limiter le nombre de messages dans le log
    while (eventLog.children.length > 10) {
        eventLog.removeChild(eventLog.firstChild);
    }
}

// Fonction pour mettre en surbrillance un élément
function highlightElement(element, color) {
    const originalBackground = element.style.background;
    element.style.background = color;
    element.style.transform = 'scale(1.05)';
    
    setTimeout(() => {
        element.style.background = originalBackground;
        element.style.transform = 'scale(1)';
    }, 300);
}

// Démarrer le timer lors du premier clic
let firstClick = true;
document.getElementById('memoryGame').addEventListener('click', function() {
    if (firstClick && !gameTimer) {
        startTimer();
        firstClick = false;
    }
}, { once: true });