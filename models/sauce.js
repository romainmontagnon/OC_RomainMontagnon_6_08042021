const mongoose = require('mongoose');

const sauceSchema = mongoose.Schema({
    userId          : {type: String},
    name            : {type: String, required: true},
    manufacturer    : {type: String, required: true},
    description     : {type: String, required: true},
    mainPepper      : {type: String, required: true},
    imageUrl        : {type: String, required: true},
    heat            : {type: Number},
    likes           : {type: Number},
    usersLiked      : {type: String},
    usersDisLiked   : {type: String}
});

module.exports = mongoose.model('Sauce', sauceSchema);