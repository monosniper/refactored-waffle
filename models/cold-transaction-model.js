const {Schema, model} = require('mongoose');

const ColdTransactionSchema = new Schema({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    amount: {type: Number, required: true},
    wallet: {type: String, required: true},
    seed: {type: String, required: true},
}, {timestamps: true});

module.exports = model('ColdTransaction', ColdTransactionSchema);