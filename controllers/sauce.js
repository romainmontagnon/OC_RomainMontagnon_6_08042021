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
        imageUrl        : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes           : 0,
        usersLiked      : [],
        usersDisLiked   : []
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
            let userId  = req.body.userId;
            //let userId  = 'z';
            let like    = req.body.like;

            let object          = _id._doc;
            // let usersLiked      = _id._doc.usersLiked;
            // let usersDisLiked   = _id._doc.usersDisLiked;

            // Verifier si le userId est présent dans usersLiked ou dans usersDisLiked
            //index(userId) nous renverra -1 si userId n'existe pas ou le numero d'index du userId du tableau
            let isUsersLiked    = _id._doc.usersLiked.indexOf(userId);
            let isUsersDisLiked = _id._doc.usersDisLiked.indexOf(userId);

            // puis en fonction ajouter un non 1
            if ((isUsersLiked === -1) && (isUsersDisLiked === -1)){
                //CONDITION 1
                switch (like) {
                    case 1 :
                        console.log(`User ${userId} set LIKE to 1 for object ${object.name}`);
                        // ajouter userId dans usersLiked
                        _id._doc.usersLiked.push(userId);                      
                        break;
                    case -1 :                  
                        console.log(`User ${userId} set LIKE to -1 for object ${object.name}`);
                        // ajouter userId dans usersDisLiked
                        _id._doc.usersDisLiked.push(userId);
                        break;
                    case 0 :
                        console.log(`User ${userId} set LIKE to 0 for object ${object.name}`);
                        res.status(400).json({ message: 'Valeur de like impossible !'});
                        break;
                    default:
                    res.status(400);
                };              
            } else if ((isUsersLiked !== -1) && (isUsersDisLiked === -1)){
                //CONDTION 2
                // usersLiked existe mais pas usersDisLiked
                switch (like) {
                    case 1 :
                        console.log(`User ${userId} set LIKE to 1 for object ${object.name}`);
                        // si usersLiked ET like = 1, operation impossible
                        res.status(400).json({ message: 'Valeur de like impossible !'});                     
                        break;
                    case -1 :                  
                        console.log(`User ${userId} set LIKE to -1 for object ${object.name}`);
                        // ajouter userId dans usersDisLiked
                        // enlever userId de usersLiked
                        break;
                    case 0 :
                        console.log(`User ${userId} set LIKE to 0 for object ${object.name}`);
                        // userId annule son like
                        break;
                    default:
                    res.status(400);
                };
            } else if ((isUsersLiked === -1) && (isUsersDisLiked !== -1)){
                //CONDITION 3
                // usersDisLiked existe mais pas usersLiked
                switch (like) {
                    case 1 :
                        console.log(`User ${userId} set LIKE to 1 for object ${object.name}`);
                        // ajouter userId dans usersLiked
                        // enlever userId de usersDisLiked                     
                        break;
                    case -1 :                  
                        console.log(`User ${userId} set LIKE to -1 for object ${object.name}`);
                        // si usersDisLiked ET like = -1, operation imossible
                        res.status(400).json({ message: 'Valeur de like impossible !'});
                        break;
                    case 0 :
                        console.log(`User ${userId} set LIKE to 0 for object ${object.name}`);
                        // userId annule son like
                        break;
                    default:
                    res.status(400);
                };
            };

        })
        .catch(error => {
            res.status(400).json({ error })
        });
};