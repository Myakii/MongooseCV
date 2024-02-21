const mongoose = require('mongoose');

// Définition de la fonction pour se connecter à la base de données MongoDB
async function connectDatabase() {
    try {
        // Connexion à la base de données MongoDB en utilisant l'URI fourni dans les variables d'environnement
        await mongoose.connect(process.env.DB_URI);
        console.log('Connecté à la base de données MongoDB');
    } catch (error) {
        // Gestion des erreurs en cas d'échec de la connexion à la base de données
        console.error('Erreur de connexion à la base de données MongoDB :', error);
        process.exit(1); // Quittez le processus Node avec un code d'erreur
    }
}

module.exports = connectDatabase;
