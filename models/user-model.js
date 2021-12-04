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
    balance: {type: Schema.Types.Number, default: 0},
    sex: {type: String, default: 'male'},
    waitingForVerify: {type: Boolean, default: false},
    isVerified: {type: Boolean, default: false},
    isAdmin: {type: Boolean, default: false},
    activationLink: {type: String},
}, {timestamps: true});

module.exports = model('User', UserSchema);