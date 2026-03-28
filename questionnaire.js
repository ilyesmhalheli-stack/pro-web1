// JavaScript pour la page questionnaire.html
// Auteur: Étudiants ENSI
// Projet: StudyFlow - Partie 3

// =============================================
// REMPLACE CES 3 VALEURS PAR LES TIENNES
// =============================================
const EMAILJS_PUBLIC_KEY  = "dAiqpEnz3fEzBY32t";   // Account → API Keys
const EMAILJS_SERVICE_ID  = "service_kw4c92p";       // Email Services
const EMAILJS_TEMPLATE_ID = "template_9f1i81o";      // Email Templates
const EMAIL_DESTINATAIRE = "studyflow@gmail.com";// =============================================

// Initialiser EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// Fonction de validation du formulaire
function validateForm(event) {
    event.preventDefault();

    let isValid = true;
    hideAllErrors();

    // Validation du nom complet
    const nom = document.getElementById('nomComplet').value.trim();
    if (nom.length < 2) {
        showError('nomError');
        isValid = false;
    }

    // Validation de l'email
    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('emailError');
        isValid = false;
    }

    // Validation du type d'utilisateur
    const typeUtilisateur = document.querySelector('input[name="typeUtilisateur"]:checked');
    if (!typeUtilisateur) {
        showError('typeError');
        isValid = false;
    }

    // Validation de la fréquence
    const frequence = document.getElementById('frequence').value;
    if (frequence === '') {
        showError('frequenceError');
        isValid = false;
    }

    // Validation de la satisfaction
    const satisfaction = document.getElementById('satisfaction').value;
    if (satisfaction === '') {
        showError('satisfactionError');
        isValid = false;
    }

    // Si valide → envoyer l'email
    if (isValid) {
        // Récupérer les fonctionnalités cochées
        const fonctionnalites = [];
        document.querySelectorAll('input[name="fonctionnalites"]:checked').forEach(cb => {
            fonctionnalites.push(cb.value);
        });

        const params = {
            to_email:        EMAIL_DESTINATAIRE,
            nom:             nom,
            email:           email,
            type_utilisateur: typeUtilisateur.value,
            frequence:       frequence,
            satisfaction:    satisfaction,
            fonctionnalites: fonctionnalites.length > 0 ? fonctionnalites.join(', ') : 'Aucune sélectionnée',
            commentaires:    document.getElementById('commentaires').value.trim() || 'Aucun commentaire'
        };

        // Désactiver le bouton pendant l'envoi
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Envoi...';
        document.getElementById('loadingMessage').style.display = 'block';

        // Envoyer via EmailJS
        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, params)
            .then(function () {
                document.getElementById('loadingMessage').style.display = 'none';
                showSuccessMessage();
                document.getElementById('questionnaireForm').reset();
                submitBtn.disabled = false;
                submitBtn.textContent = 'Soumettre le questionnaire';

                setTimeout(() => {
                    hideSuccessMessage();
                }, 5000);
            })
            .catch(function (error) {
                document.getElementById('loadingMessage').style.display = 'none';
                alert("❌ Erreur lors de l'envoi : " + JSON.stringify(error));
                submitBtn.disabled = false;
                submitBtn.textContent = 'Soumettre le questionnaire';
            });
    }

    return false;
}

// Afficher un message d'erreur
function showError(errorId) {
    document.getElementById(errorId).style.display = 'block';
}

// Masquer tous les messages d'erreur
function hideAllErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
    });
}

// Afficher le message de succès
function showSuccessMessage() {
    document.getElementById('successMessage').style.display = 'block';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Masquer le message de succès
function hideSuccessMessage() {
    document.getElementById('successMessage').style.display = 'none';
}

// Validation en temps réel
document.addEventListener('DOMContentLoaded', function () {

    document.getElementById('nomComplet').addEventListener('blur', function () {
        if (this.value.trim().length >= 2) {
            document.getElementById('nomError').style.display = 'none';
        }
    });

    document.getElementById('email').addEventListener('blur', function () {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value.trim())) {
            document.getElementById('emailError').style.display = 'none';
        }
    });

    document.getElementById('frequence').addEventListener('change', function () {
        if (this.value !== '') {
            document.getElementById('frequenceError').style.display = 'none';
        }
    });

    document.getElementById('satisfaction').addEventListener('change', function () {
        if (this.value !== '') {
            document.getElementById('satisfactionError').style.display = 'none';
        }
    });

    document.querySelectorAll('input[name="typeUtilisateur"]').forEach(radio => {
        radio.addEventListener('change', function () {
            document.getElementById('typeError').style.display = 'none';
        });
    });
});