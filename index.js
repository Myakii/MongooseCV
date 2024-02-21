// Import des modules nécessaires
const express = require("express");
const mongoose = require("mongoose");
const pdf = require("express-pdf");
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");

// Import des contrôleurs et des composants
const userController = require("./src/controllers/controllersUser");
const connectDatabaseMongo = require("./src/components/connectDatabase");
const getUserByFirstName = require("./src/components/getUserByFirstName");

// Configuration des variables d'environnement
require("dotenv").config();

// Import du modèle User et des données utilisateur
const User = require("./src/models/modelsUser");
const userData = require("./src/components/AddBasicData");

// Création de l'application Express
const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à la base de données MongoDB
connectDatabaseMongo();

// Insertion des données utilisateur dans la base de données
User.insertMany(userData)
  .then((result) => {
    console.log('Données insérées avec succès :', result);
  })
  .catch((error) => {
    console.error('Erreur lors de l\'insertion des données :', error);
  });

// Configuration des middlewares
app.use(cors({ origin: "*" }));
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/api", require("./src/routes/routesUser"));

// Middleware de gestion des erreurs
app.use(function (err, req, res, next) {
  res.status(422).send({ error: err.message });
});

// Middleware d'utilisation du module PDF
app.use(pdf);

// Route pour la génération de PDF basée sur le prénom de l'utilisateur
app.use("/pdfCV/:first_name", async (req, res) => {
  try {
    const user = await getUserByFirstName(req.params.first_name);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Rendu du modèle HTML en PDF
    res.render(path.join(__dirname, "public", "templateData.ejs"), { user: user }, async (err, html) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Erreur lors du rendu du modèle" });
      }

      res.pdfFromHTML({
        filename: `${req.params.first_name}_CV.pdf`,
        htmlContent: html,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Une erreur est survenue lors de la génération du PDF" });
  }
});

// Configuration du moteur de vue EJS
app.set("view engine", "ejs");

// Routes GET
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/Choicetemplate.html");
});

app.get("/templateInput", (req, res) => {
  res.sendFile(__dirname + "/public/templateInput.html");
});

app.get("/submitForm", (req, res) => {
  // Envoyer le fichier HTML correspondant
  res.sendFile(__dirname + "/public/templateInput.html");
});

// Rendre le modèle HTML avec les données de l'utilisateur
app.get("/user/:first_name", async (req, res) => {
  try {
    const user = await getUserByFirstName(req.params.first_name);
    res.render(__dirname + "/public/templateData.ejs", { user: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message:
        "Une erreur est survenue lors de la récupération des données de l'utilisateur",
    });
  }
});

// Routes POST
app.post("/submitForm", userController.submitForm);

app.post("/No", (req, res) => {
  // Envoyer le fichier HTML correspondant
  res.sendFile(__dirname + "/public/templateInput.html");
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
