const UserDto = require("./user-dto");
const TransactionDto = require("./transaction-dto");

module.exports = class PullDto {
    id;
    transaction;
    user;
    amount;
    card;
    createdAt;

    constructor(model) {
        this.id = model._id;
        // this.transaction = new TransactionDto(model.transaction);
        this.user = new UserDto(model.user);
        this.amount = model.amount;
        this.card = model.card;
        this.createdAt = model.createdAt;
    }
}