const {Schema, model} = require('mongoose');

const PushSchema = new Schema({
    transaction: {type: Schema.Types.ObjectId, ref: 'Transaction'},
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    card: {type: String},
    amount: {type: Number, required: true},
    confirmed: {type: Boolean, default: false},
}, {timestamps: true});

module.exports = model('Push', PushSchema);