const CassaService = require('../services/cassa-service');
const ApiError = require("../exceptions/api-error");
const {validationResult} = require('express-validator');

class CassaController {
    async getPulls(req, res, next) {
        try {
            const users = await CassaService.getAllPulls();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async createPull(req, res, next) {
        try {
            const {card, amount, user_id} = req.body;
            const response = await CassaService.createPull(card, amount, user_id);

            return res.json([response]);
        } catch (e) {
            next(e);
        }
    }

    async createCryptoTransaction(req, res, next) {
        try {
            const {transaction_number, amount, user_id} = req.body;
            const response = await CassaService.createCryptoTransaction(transaction_number, amount, user_id);

            return res.json([response]);
        } catch (e) {
            next(e);
        }
    }

    async getTransactions(req, res, next) {
        try {
            const transactions = await CassaService.fetchTransactions();

            return res.json([transactions]);
        } catch (e) {
            next(e);
        }
    }

    async getCryptoTransactions(req, res, next) {
        try {
            const transactions = await CassaService.fetchCryptoTransactions();

            return res.json([transactions]);
        } catch (e) {
            next(e);
        }
    }

    async getTransaction(req, res, next) {
        try {
            const transaction = await CassaService.getTransaction(req.params.id);

            return res.json([transaction]);
        } catch (e) {
            next(e);
        }
    }

    async getPayHistory(req, res, next) {
        try {
            const transactions = await CassaService.getPayHistory(req.user.id);
            return res.json(transactions);
        } catch (e) {
            next(e);
        }
    }

    async updateTransaction(req, res, next) {
        try {
            const response = await CassaService.updateTransaction(req.params.id, req.body.data);

            return res.json([response]);
        } catch (e) {
            next(e);
        }
    }

    async getAllFakePushs(req, res, next) {
        try {
            const pushs = await CassaService.getAllFakePushs();
            return res.json(pushs);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CassaController();