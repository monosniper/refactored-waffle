const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    username: {type: String, unique: true, required: true},
    email: {type: String, unique: true, required: true},
    phone: {type: String, unique: true},
    first_name: {type: String},
    last_name: {type: String},
    middle_name: {type: String},
    password: {type: String, required: true},
    birthday: {type: Date},
    sex: {type: String, default: 'male'},
    isActivated: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    activationLink: {type: String},
});

module.exports = model('User', UserSchema);