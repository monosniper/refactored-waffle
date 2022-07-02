const {Schema, model} = require('mongoose');

const PullSchema = new Schema({
    transaction: {type: Schema.Types.ObjectId, ref: 'Transaction'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    cryptoNumber: {type: String, required: true},
    crypto: {type: String, required: true},
    amount: {type: Number, required: true},
}, {timestamps: true});

module.exports = model('Pull', PullSchema);