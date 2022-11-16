const UserService = require('../services/user-service');
const ApiError = require("../exceptions/api-error");
const {validationResult} = require('express-validator');
const fs = require("fs");
const axios = require("axios");

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

    async getCheckout(req, res, next) {
        try {
            const data = await axios.post('https://vilpay.net/payment/process', new URLSearchParams({
                currency_code: 'RUB',
                amount: req.body.amount,
                cancel_url: 'https://www.makao777.com',
                success_url: 'https://www.makao777.com/success',
                ourform: 1,
                merchant: process.env.VILLPAY_MERCHANT_KEY,
            }), {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }).then((rs) => {
                return rs.data.url
            }).catch(err => {
                console.log(err)
            });

            return res.send(data)
        } catch (e) {
            next(e)
        }
    }

}

module.exports = new UserController();