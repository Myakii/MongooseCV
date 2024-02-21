// Import du modèle User
const User = require('../models/modelsUser');

// Fonction de gestion de la soumission du formulaire
exports.submitForm = async (req, res, next) => {
    try {
        // Extraction des données du corps de la requête
        const {
            first_name,
            last_name,
            title,
            hello_content,
            phone,
            email,
            city,
            zipcode,
            experience,
            skills,
            hobbies
        } = req.body;

        // Liste des éléments manquants dans la requête
        const missingElements = [];

        // Vérification de la présence des éléments requis
        if (!first_name) missingElements.push('first_name');
        if (!last_name) missingElements.push('last_name');
        if (!title) missingElements.push('title');
        if (!hello_content) missingElements.push('hello_content');
        if (!email) missingElements.push('email');
        if (!phone) missingElements.push('phone');
        if (!city) missingElements.push('city');
        if (!zipcode) missingElements.push('zipcode');
        if (!experience || !Array.isArray(experience) || experience.length === 0) missingElements.push('experience');
        if (!skills) missingElements.push('skills');
        if (!hobbies) missingElements.push('hobbies');

        // Si des éléments sont manquants, retourner une erreur 400
        if (missingElements.length > 0) {
            console.log(req.body);
            return res.status(400).json({ message: 'Elément(s) manquant(s)', missingElements: missingElements });
        }

        // Transformation des données d'expérience
        const experienceData = experience.map(exp => ({
            company: exp.company,
            poste: exp.poste,
            date: exp.date,
            description: exp.description,
        }));

        // Création d'une nouvelle instance de User avec les données fournies
        const newUser = new User({
            first_name,
            last_name,
            title,
            hello_content,
            phone,
            email,
            city,
            zipcode,
            experience: experienceData,
            skills,
            hobbies
        });

        // Sauvegarde de l'utilisateur dans la base de données
        await newUser.save();
        console.log("Utilisateur ajouté avec succès :", newUser);
        // Redirection vers la page dynamique /user/:first_name
        res.redirect(`/user/${first_name}`);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la création de l\'utilisateur' });
    }
};
