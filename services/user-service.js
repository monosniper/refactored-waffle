const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
require('dotenv').config();
const uuid = require('uuid');
const MailService = require('./mail-service');
const TokenService = require('./token-service');
const UserDto = require('../dtos/user-dto');
const ApiError = require('../exceptions/api-error');

class UserService {
    async register(username, email, password) {
        if (await UserModel.findOne({email})) {
            throw ApiError.BadRequest('Пользователь с данным E-mail уже существует');
        }

        const hashPassword = await bcrypt.hash(password, 1);
        const activationLink = await uuid.v4();
        console.log(username, email, password)
        const user = await UserModel.create({username, email, password: hashPassword, activationLink});

        // Send verification emails
        await MailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens, user: userDto
        };
    }

    async login(username, password) {
        const user = await UserModel.findOne({username});

        if (!user) {
            throw ApiError.BadRequest('Пользователя с таким логином не существует');
        }

        const isPassEquals = await bcrypt.compare(password, user.password);

        if (!isPassEquals) {
            throw ApiError.BadRequest('Данные для входа не верны');
        }

        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens, user: userDto
        };
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});

        if (!user) {
            throw ApiError.BadRequest('Ссылка верификации некорректна или устарела!');
        }

        user.isActivated = true;
        await user.save();
    }

    async logout(refreshToken) {
        const token = await TokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }

        const userData = TokenService.validateRefreshToken(refreshToken);
        const tokenData = TokenService.findToken(refreshToken);

        if (!userData || !tokenData) {
            throw ApiError.UnauthorizedError();
        }

        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = await TokenService.generateTokens({...userDto});

        await TokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens, user: userDto
        };
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async updateUser(id, data) {
        console.log(data);

        function validated(data) {

            const validatedData = {};

            Object.entries(data).map(([key, value]) => {
                if([
                    'first_name',
                    'last_name',
                    'middle_name',
                    'username',
                    'email',
                    'phone',
                    'birthday',
                    'sex',
                ].indexOf(key)) validatedData[key] = value;
            })

            return validatedData;
        }

        const user = await UserModel.findOneAndUpdate({_id: id}, validated(data));

        return new UserDto(user);
    }
}


module.exports = new UserService();