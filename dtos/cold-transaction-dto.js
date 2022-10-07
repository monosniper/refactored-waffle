const UserDto = require("./user-dto");
module.exports = class ColdTransactionDto {
    id;
    user;
    amount;
    wallet;
    seed;
    createdAt;

    constructor(model) {
        this.id = model._id;
        this.user = new UserDto(model.user);
        this.amount = model.amount;
        this.wallet = model.wallet;
        this.seed = model.seed;
        this.createdAt = model.createdAt;
    }
}