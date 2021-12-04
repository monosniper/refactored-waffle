module.exports = class UserDto {
    id;
    username;
    first_name;
    last_name;
    middle_name;
    phone;
    email;
    birthday;
    balance;
    sex;
    isActivated;
    isAdmin;

    constructor(model) {
        this.id = model._id;
        this.username = model.username;
        this.first_name = model.first_name;
        this.last_name = model.last_name;
        this.middle_name = model.middle_name;
        this.phone = model.phone;
        this.email = model.email;
        this.birthday = model.birthday;
        this.balance = model.balance;
        this.sex = model.sex;
        this.isActivated = model.isActivated;
        this.isAdmin = model.isAdmin;
    }
}