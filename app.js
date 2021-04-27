const express = require('express');
const mongoose = require('mongoose');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const helmet = require('helmet');

const path = require('path');
require('dotenv').config();
const app = express();

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');
const { join } = require('path');

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin&replicaSet=atlas-6bscut-shard-0&readPreference=primary&appname=${process.env.DB_APP_NAME}&ssl=true`,
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(
  helmet({
    crossOriginEmbedderPolicy: true,
    crossOriginOpenerPolicy: true,
  })
);

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    // res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    next();
});



//Body parser, lit les data du body dans req.body
app.use(express.json());
//chemin d'enregistrement des photos
app.use('/images', express.static(path.join(__dirname, 'images')));

//validation des données contre injection SQL
app.use(mongoSanitize());

//Validation des données contre faille XSS
app.use(xss());

//route d'authentification
app.use('/api/auth', userRoutes);

//route pour les sauces
app.use('/api/sauces', sauceRoutes);

module.exports = app;