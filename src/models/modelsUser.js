// Import du module mongoose
const mongoose = require('mongoose');

// Définition du schéma de l'utilisateur
const UserSchema = mongoose.Schema({
    first_name: { type: String},
    last_name: { type: String},
    title: { type: String},
    hello_content: { type: String},
    phone : { type: String},
    email: { type: String},
    city: { type: String},
    zipcode: { type: Number},
    experience: [{
        company: String,
        poste: String,
        date: String,
        description: String,
    }],
    skills: [{ type: String}],
    hobbies: [{ type: String}],
});

// Création du modèle User à partir du schéma
const User = mongoose.model('users', UserSchema);

// Export du modèle User
module.exports = User;