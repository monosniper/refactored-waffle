const UserDto = require("./user-dto");
const TransactionDto = require("./transaction-dto");

module.exports = class PullDto {
    id;
    // transaction;
    user;
    amount;
    cryptoNumber;
    crypto;
    createdAt;

    constructor(model) {
        this.id = model._id;
        // this.transaction = new TransactionDto(model.transaction);
        this.user = new UserDto(model.user);
        this.amount = model.amount;
        this.cryptoNumber = model.cryptoNumber;
        this.crypto = model.crypto;
        this.createdAt = model.createdAt;
    }
}