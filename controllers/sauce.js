const Sauce = require('../models/sauce.js');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({ error: error })
        });
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({ error: error });
        });
};

exports.createSauce = (req, res, next) => {
    const sauce = new Sauce({
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => {
            res.status(200).json({ message: 'Sauce enregistrée' });
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.modifySauce = (req, res, next) => {
    const sauce = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauce, _id: req.params.id })
        .then(() => {
            res.status(200).json({ message: 'Objet modifié !' })
        })
        .catch(error => {
            res.status(400).json({ error })
        });
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({ _id: req.params.id })
                    .then(() => {
                        res.status(200).json({ message: 'Objet supprimé !' })
                    })
                    .catch(error => {
                        res.status(400).json({ error })
                    });
            });
        })
        .catch(error => {
            res.status(500).json({ error })
        });
};

exports.likedSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            let like = req.body.like;
            switch (like) {
                case 1:
                    console.log(`User ${req.body.userId} set LIKE to 1 for object ${sauce.name}`);
                    // ajouter userId dans usersLiked
                    sauce.usersLiked.push(req.body.userId);
                    sauce.likes++;
                    break;
                case -1:
                    console.log(`User ${req.body.userId} set LIKE to -1 for object ${sauce.name}`);
                    // ajouter userId dans usersDisliked
                    sauce.usersDisliked.push(req.body.userId);
                    sauce.dislikes++;
                    break;
                case 0:
                    console.log(`User ${req.body.userId} set LIKE to 0 for object ${sauce.name}`);
                    if (sauce.usersLiked.some(userId => userId == req.body.userId)) {
                        sauce.likes--;
                        sauce.usersLiked = sauce.usersLiked.filter(userId => userId != req.body.userId);
                        // filter() garde tous les elements sauf celui vise, retourne un nouveau tableau 'filtrer'
                    } else if (sauce.usersDisliked.some(userId => userId == req.body.userId)) {
                        sauce.dislikes--;
                        sauce.usersDisliked = sauce.usersDisliked.filter(userId => userId != req.body.userId);
                        // filter() garde tous les elements sauf celui vise, retourne un nouveau tableau 'filtrer'
                    }
                    break;
                default:
                    res.status(400);
            }
            sauce.save()
                .then(() => res.status(201).json({message: 'like prit en compte'}))
                .catch(error => {
                    res.status(400).json({ error })
                });
        })
        .catch(error => {
            res.status(400).json({ error })
        });
};