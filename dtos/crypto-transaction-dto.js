const UserDto = require("./user-dto");
module.exports = class CryptoTransactionDto {
    id;
    user;
    amount;
    transaction_number;
    crypto;
    bonus;
    status;
    createdAt;

    constructor(model) {
        this.id = model._id;
        this.user = new UserDto(model.user);
        this.amount = model.amount;
        this.transaction_number = model.transaction_number;
        this.crypto = model.crypto;
        this.bonus = model.bonus;
        this.status = model.status;
        this.createdAt = model.createdAt;
    }
}