const {Schema, model} = require('mongoose');

const CryptoTransactionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    amount: {type: Number, required: true},
    transaction_number: {type: String, required: true},
}, {timestamps: true});

module.exports = model('CryptoTransaction', CryptoTransactionSchema);