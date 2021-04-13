const Sauce = require ('../models/sauce.js');
const bodyParser = require('body-parser');

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(
            (sauces) => {
                res.status(200).json(sauces);
            }
        )
        .catch(
            (error) => {
                res.status(400).json({error: error})
            }
        );
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then(
            (sauce) => {
                res.status(200).json(sauce);
            }
        )
        .catch(
            (error) => {
                res.status(404).json({error: error});
            }
        )
};

exports.createSauce = (req, res, next) => {
//    delete req.body._id;
    const sauce = new Sauce({
        ...req.body
    });
    console.log(sauce);
    sauce.save()
        .then(
            () => {
                res.status(200).json({message: 'Sauce enregistrée'});
            }
        )
        .catch(
            (error) => {
                res.status(400).json({error});
            }
        )
    ;
};

exports.modifySauce = (req, res, next) => {

};

exports.deleteSauce = (req, res, next) => {

};

exports.likedSauce = (req, res, next) => {

};