const {Schema, model} = require('mongoose');

const GameSchema = new Schema({
    name: {type: String, required: true},
    slug: {type: String, required: true, unique: true},
    image: {type: String, required: true},
}, {timestamps: true});

module.exports = model('Game', GameSchema);