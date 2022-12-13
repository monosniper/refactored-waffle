const UserDto = require("./user-dto");

module.exports = class PullDto {
    id;
    // transaction;
    user;
    amount;
    card;
    createdAt;
    confirmed;

    constructor(model) {
        this.id = model._id;
        // this.transaction = new TransactionDto(model.transaction);
        this.user = new UserDto(model.user);
        this.amount = model.amount;
        this.card = model.card;
        this.confirmed = model.confirmed;
        this.createdAt = model.createdAt;
    }
}