const Sauce = require ('../models/sauce.js');
const fs = require('fs');

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces);
        })
        .catch((error) => {
            res.status(400).json({error: error})
        });
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then((sauce) => {
            res.status(200).json(sauce);
        })
        .catch((error) => {
            res.status(404).json({error: error});
        });
};

exports.createSauce = (req, res, next) => {
    const sauce = new Sauce({
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        usersLiked: '',
        usersDisLiked: ''
    });
    sauce.save()
            .then(() => {
                res.status(200).json({message: 'Sauce enregistrée'});
            })
            .catch((error) => {
                res.status(400).json({error});
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
            res.status(200).json({ message: 'Objet modifié !'})
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
                        res.status(200).json({ message: 'Objet supprimé !'})
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
        .then((_id) => {
            let object          = _id._doc;
            let usersLiked      = _id._doc.usersLiked;
            let usersDisLiked   = _id._doc.usersDisLiked;

            let userId  = req.body.userId;
            let like    = req.body.like;

            //Verifier si le userId est présent dans usersLiked ou dans usersDisLiked
            //puis en fonction ajouter un non 1

            switch (like) {
                case 1 :
                    console.log(`User ${userId} set LIKE to 1 for object ${object.name}`);
                    break;
                case -1 :
                    console.log(`User ${userId} set LIKE to -1 for object ${object.name}`);
                    break;
                case 0 :
                    console.log(`User ${userId} set LIKE to 0 for object ${object.name}`);
                    break;
                default:
                res.status(400);
            };
        })
        .catch(error => {
            res.status(400).json({ error })
        });
};