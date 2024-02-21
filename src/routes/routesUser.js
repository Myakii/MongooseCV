// Import du module express et création d'un routeur
const express = require('express');
const router = express.Router();

// Import du contrôleur UserController
const UserController = require('../controllers/controllersUser');

// Route POST pour soumettre un formulaire utilisateur
router.post("/user", UserController.submitForm);

// Export du routeur
module.exports = router;
