const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cryptoJs = require('crypto-js');
const dotenv = require("dotenv");
dotenv.config()

const User = require('../models/User');


exports.signup = (req, res, next) => {
    const emailCryptoJs = cryptoJs.HmacSHA512(req.body.email, `${process.env.CRYOTOJS_ENCRYPTION_KEY_EMAIL}`).toString(); // chiffrement email

    bcrypt.hash(req.body.password, 10)
        .then(hash => {
            const user = new User({
                email: emailCryptoJs,
                password: hash
            });
            user.save()
            .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
            .catch(error => res.status(400).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
    const emailCryptoJs = cryptoJs.HmacSHA512(req.body.email, `${process.env.CRYOTOJS_ENCRYPTION_KEY_EMAIL}`).toString(); //déchiffrement email

    User.findOne({ email: emailCryptoJs })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !'});
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !'});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                        ) 
                    });
                })
                .catch(error => res.status(500).json({ error }))
        })
        .catch(error => res.status(500).json({ error }));
};