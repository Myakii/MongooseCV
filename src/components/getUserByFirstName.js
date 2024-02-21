const mongoose = require('mongoose');
const User = require('../models/modelsUser');

// Définition de la fonction pour récupérer les données de l'utilisateur en fonction de son prénom (first_name)
async function getUserByFirstName(firstName) {
    try {
        // Recherche de l'utilisateur dans la base de données par son prénom
        const user = await User.findOne({ first_name: firstName });
        return user;
    } catch (error) {
        // Gestion des erreurs en cas de problème lors de la récupération de l'utilisateur
        console.error('Erreur lors de la récupération de l\'utilisateur :', error);
        throw error;
    }
}

module.exports = getUserByFirstName;
