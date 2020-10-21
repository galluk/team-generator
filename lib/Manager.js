const Employee = require("./Employee");

class Manager extends Employee {
    constructor(name, id, email, officenum) {
        super(name, id, email);
        this.officeNumber = officenum;
    }

    getOfficeNumber() {
        return this.officeNumber;
    }

    getRole() {
        return "Manager";
    }
}

module.exports = Manager;