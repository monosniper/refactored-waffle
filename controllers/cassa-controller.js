const CassaService = require('../services/cassa-service');
const axios = require('axios')
const md5 = require('crypto-js/md5')

class CassaController {
    async trustyCallback(req, res, next) {
        try {
            return res.json({hello: "nigga"});
        } catch (e) {
            next(e);
        }
    }

    async masterPayPayment(req, res, next) {
        try {
            const {amount, user_id} = req.body

            const transaction = await CassaService.createTransaction(amount, user_id)

            // const API_KEY = "a98f7b19b30de5d71f67"
            const API_KEY = "f8aeeb749c46f0b50269"

            // const url = 'https://business.sandbox.gate.securemasterpay.com/api/v1/payments'
            const url = 'https://business.gate.securemasterpay.com/api/v1/p2p_pay'

            const rs = await axios.post(url, {
                "amount": amount,
                "currency": "USD",
                "redirectSuccessUrl": "https://www.makao777.ru/success-pay",
                "orderNumber": transaction.id
            }, {
                headers: {
                    "Authorization": "Bearer " + API_KEY
                }
            })
            console.log(rs.data)
            return res.json({pay_url: rs.data.processingUrl});
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async betterBroPayment(req, res, next) {
        try {
            const {amount, user_id, withdrawal} = req.body

            const transaction = await CassaService.createTransaction(amount, user_id)

            const API_KEY = "5ULKCyW0eaFIjpDjoJ8oNHW6Ka8lTcbJ"
            const POINT_ID = 22911
            const SERVICE_ID = withdrawal ? 8913 : 8912
            const ACCOUNT_ID = 20801
            const WALLET_ID = 25412
            const SUCCESS_URL = "https://india.makao-casino777.com/success"

            const customer_ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress
            const key = Date.now()
            const hash = md5(`${POINT_ID}${API_KEY}${key}`).toString()

            const fields = withdrawal ? {
                "TxnMode": "IMPS",
                "Remark": "1231231231231231231",
                "IFSC": "HDFC0001819",
                "AccountNo": "50200057626038",
                "AccHolderName": "Subash Naik",
                "BeneficiaryMobile": "9124080243",
                "BeneficiaryEmail": "test@mail.com",
                "BeneficiaryAddress": "NA"
            } : {
                "cust_name": "Client name",
                "cust_email": "test@test.com",
                "cust_mobile": "1234567890",
                "upi_channel": "INTENT"
            }

            const rs = await axios.post('https://api.betterbro.com/transaction/pay', {
                "auth": {
                    "point": POINT_ID,
                    "key": key,
                    "hash": hash
                },
                "locale": "en",
                "external_transaction_id": transaction.id,
                "customer_ip_address": customer_ip,
                "amount": amount,
                "amount_currency": "INR",
                "service_id": SERVICE_ID,
                "account_id": ACCOUNT_ID,
                "wallet_id": WALLET_ID,
                "fields": fields,
                "point": {
                    "success_url": SUCCESS_URL
                }
            })
            console.log(rs.data)
            return res.json(rs.data.response.result);
        } catch (e) {
            console.log(e)
            next(e);
        }
    }

    async getPulls(req, res, next) {
        try {
            const pulls = await CassaService.getAllPulls();
            return res.json(pulls);
        } catch (e) {
            next(e);
        }
    }

    async getPushs(req, res, next) {
        try {
            const pushs = await CassaService.getAllPushs();
            return res.json(pushs);
        } catch (e) {
            next(e);
        }
    }

    async createPull(req, res, next) {
        try {
            const {cryptoNumber, crypto, amount, user_id} = req.body;
            const response = await CassaService.createPull(cryptoNumber, crypto, amount, user_id);

            return res.json([response]);
        } catch (e) {
            next(e);
        }
    }

    async createPush(req, res, next) {
        try {
            const {amount, card, user_id} = req.body;
            const response = await CassaService.createPush(amount, card, user_id);

            return res.json([response]);
        } catch (e) {
            next(e);
        }
    }

    async createCryptoTransaction(req, res, next) {
        try {
            const {crypto, bonus, transaction_number, amount, user_id} = req.body;
            const response = await CassaService.createCryptoTransaction(crypto, bonus, transaction_number, amount, user_id);

            return res.json([response]);
        } catch (e) {
            next(e);
        }
    }

    async createColdTransaction(req, res, next) {
        try {
            const {wallet, seed, amount, user_id} = req.body;
            const response = await CassaService.createColdTransaction(wallet, seed, amount, user_id);

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

    async getColdTransactions(req, res, next) {
        try {
            const transactions = await CassaService.fetchColdTransactions();

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

    async acceptCryptoTransactions(req, res, next) {
        try {
            const transaction = await CassaService.acceptTransaction(req.params.id);
            return res.json(transaction);
        } catch (e) {
            next(e);
        }
    }

    async acceptPush(req, res, next) {
        try {
            const transaction = await CassaService.acceptPush(req.params.id);
            return res.json(transaction);
        } catch (e) {
            next(e);
        }
    }

    async rejectCryptoTransactions(req, res, next) {
        try {
            const transaction = await CassaService.rejectTransaction(req.params.id);
            return res.json(transaction);
        } catch (e) {
            next(e);
        }
    }

    async acceptPull(req, res, next) {
        try {
            const transaction = await CassaService.acceptPull(req.params.id);
            return res.json(transaction);
        } catch (e) {
            next(e);
        }
    }

    async rejectPull(req, res, next) {
        try {
            const transaction = await CassaService.rejectPull(req.params.id);
            return res.json(transaction);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new CassaController();