// JavaScript pour la page contact.html

// Variables pour la galerie d'images
const images = [
    'https://images.unsplash.com/photo-1513258496099-48168024aec0',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b',
    'https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=600&h=400&fit=crop',
    'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b',
    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40'
];

let currentImageIndex = 0;                                                                                            //On commence par la première image (position 0 dans le tableau)
let galleryInterval;                                                                                                  //Variable pour stocker le timer (setInterval) et Permet de contrôler le défilement automatique

// Fonction pour afficher l'image suivante
function nextImage() { 
    currentImageIndex = (currentImageIndex + 1) % images.length;                                                     // (% images.length)  Ça permet de revenir à 0 quand on arrive à la fin
    document.getElementById('galleryImage').src = images[currentImageIndex];                                         //Change l’image affichée dans le HTML
    resetGalleryInterval();                                                                                          //Réinitialise le timer (important quand tu cliques)
}

// Fonction pour afficher l'image précédente
function previousImage() {
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;                                     // (+ images.length) Évite les nombres négatifs
    document.getElementById('galleryImage').src = images[currentImageIndex];
    resetGalleryInterval();
}

// Fonction pour réinitialiser l'intervalle de la galerie
function resetGalleryInterval() {
    clearInterval(galleryInterval);                                                                                  //Arrête l’ancien timer
    galleryInterval = setInterval(nextImage, 3000);                                                                  //Lance un nouveau timer et change l’image chaque 3 secondesPour éviter que le slider bug quand je cliques sur next/previous
}

// Démarrer la rotation automatique des images
galleryInterval = setInterval(nextImage, 3000);                                                                      // Lance le slider automatiquement

//mettre à jour le texte de la bannière
function updateBanner() {
    const banner = document.getElementById('bannerText');

    function getMessages()                                                                                           //Elle sert à générer les messages dynamiques
    {
        const now = new Date();                                                                                      //Crée un objet contenant : date + heure actuelles
        const dateStr = now.toLocaleDateString('fr-FR');                                                             //Convertit la date en format français --/--/----
        const timeStr = now.toLocaleTimeString('fr-FR');                                                             //Convertit l’heure --:--:--

        return [
            `Bienvenue sur le site StudyFlow! Aujourd'hui est le ${dateStr}, et l'heure actuelle est ${timeStr}`,    // ${} pour insérer des variables
            `StudyFlow - Votre compagnon d'études! Date: ${dateStr}, Heure: ${timeStr}`,
            `Gérez votre temps avec StudyFlow! Le ${dateStr} à ${timeStr}`,
            `Efficacité académique avec StudyFlow! ${dateStr} - ${timeStr}`
        ];
    }

    let messageIndex = 0;                                                                                            //Il permet de savoir quel message afficher
    let charIndex = 0;                                                                                               //Il sert à afficher le texte lettre par lettre
    let isDeleting = false;                                                                                          //false = on est en train d’écrire / true = on est en train d’effacer
//Fonction qui va / ecrire le text / effacer / passer au message suivant
    
    function typeWriter() 
    {
        const messages = getMessages();                                                                              // récupère les messages avec date + heure mises à jour
        const fullMessage = messages[messageIndex];                                                                  //On sélectionne le message actuel grâce à messageIndex

        if (isDeleting)                                                                                              //Si isDeleting = true on supprime une lettre Sinon on ajoute une lettre
            { 
            charIndex--;
        } else {
            charIndex++;
        }

        banner.textContent = fullMessage.substring(0, charIndex);                                                    // prend une partie du texte effet lettre par lettre

        let speed = isDeleting ? 40 : 80;                                                                            // Vitesse d’animation Si suppression : plus rapide (40ms) Si écriture : plus lent (80ms)

        if (!isDeleting && charIndex === fullMessage.length)                                                         // Quand tout le texte est affiché : pause de 2 secondes puis commence à supprimer
            {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0)                                                                   // Quand le texte est vide : passe au message suivant recommence à écrire
            {
            isDeleting = false;
            messageIndex = (messageIndex + 1) % messages.length;
            speed = 500;
        }

        setTimeout(typeWriter, speed);                                                                              // crée une boucle infinie
    }

    typeWriter();
}

// Appel UNE SEULE FOIS
updateBanner();
