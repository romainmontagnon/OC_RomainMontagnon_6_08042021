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
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
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
            let like = req.body.like;
            //test si user(dis)Liked existant si oui 
            switch (like) {
                case 1 :
                    console.log("Like = 1");
                    break;
                case -1 :
                    console.log("Like = -1");
                    break;
                case 0 :
                    console.log("Like = 0");
                    break;
                default:
                res.status(400);
            };
        })
        .catch(error => {
            res.status(400).json({ error })
        });
};