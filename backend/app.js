const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect( process.env.MONGODB_URI , {
    dbName: process.env.DB_NAME,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

//const sauceRoute = require('./models/Sauce');
const userRoutes = require('./routes/user');
//const Sauce = require('./models/Sauce');
const stuffRoutes = require('./routes/sauce')

const app = express();


app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.urlencoded({   
  extended: true
}));
app.use(bodyParser.json())

app.use('/images', express.static(path.join(__dirname, 'images')))
app.use(helmet()); // attention bien placer helmet sinon erreur 
app.use('/api/sauces', stuffRoutes)
app.use('/api/auth', userRoutes)
 
module.exports = app;