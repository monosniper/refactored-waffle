const PullModel = require('../models/pull-model');
const TransactionModel = require('../models/transaction-model');
const UserModel = require("../models/user-model");

class CassaService {
    async getAllPulls() {
        const pulls = await PullModel.find();
        return pulls;
    }

    async fetchTransactions() {
        const transactions = await TransactionModel.find();
        return transactions;
    }

    async createPull(card, amount, user_id) {
        const transaction = await TransactionModel.create({
            user: user_id,
            type: 'pull',
            amount,
        });

        const pull = await PullModel.create({
            transaction: transaction._id,
            user: user_id,
            card,
            amount
        });

        return pull;
    }

    async getTransaction(id) {
        const transaction = await TransactionModel.findById(id);

        return transaction;
    }

    async updateTransaction(id, data) {

        function validated(data) {

            const validatedData = {};

            Object.entries(data).map(([key, value]) => {
                if([
                    'status',
                ].indexOf(key) !== -1) validatedData[key] = value;
            })

            return validatedData;
        }

        const transaction = await TransactionModel.findByIdAndUpdate(id, validated(data));

        return transaction;
    }

    async getPayHistory(id) {
        const transactions = await TransactionModel.find({user: id}).populate('user')
        ;
        return transactions;
    }

    async getAllFakePushs() {
        const fakePushs = await TransactionModel.find().populate('user');
        return fakePushs;
    }
}

module.exports = new CassaService()