const PullModel = require('../models/pull-model');
const UserModel = require('../models/user-model');
const TransactionModel = require('../models/transaction-model');
const CryptoTransactionModel = require('../models/crypto-transaction-model');
const UserDto = require("../dtos/user-dto");
const CryptoTransactionDto = require("../dtos/crypto-transaction-dto");
const TransactionDto = require("../dtos/transaction-dto");
const PullDto = require("../dtos/pull-dto");

class CassaService {
    async getAllPulls() {
        const pulls = await PullModel.find().populate('user');
        return pulls.map(pull => new PullDto(pull));
    }

    async fetchTransactions() {
        const transactions = await TransactionModel.find();
        return transactions;
    }

    async fetchCryptoTransactions() {
        const transactions = await CryptoTransactionModel.find().populate('user');
        return transactions.map(transaction => new CryptoTransactionDto(transaction));
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

    async createCryptoTransaction(transaction_number, amount, user_id) {
        const transaction = await CryptoTransactionModel.create({
            user: user_id,
            transaction_number,
            amount,
        });

        const transaction_with_user = await CryptoTransactionModel.findById(transaction._id).populate('user');

        return new CryptoTransactionDto(transaction_with_user);
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
        const transactions = await TransactionModel.find({user: id}).populate('user');
        return transactions.map(transaction => new TransactionDto(transaction));
    }

    async getAllFakePushs() {
        const fakePushs = await TransactionModel.find().populate('user');
        return fakePushs.map(transaction => new TransactionDto(transaction));
    }
}

module.exports = new CassaService()