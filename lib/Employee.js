class Employee {
    constructor(...args) {
        if (args.length > 0) {
            this.name = args[0];
        }
        if (args.length > 1) {
            this.id = args[1];
        }
        if (args.length > 2) {
            this.email = args[2];
        }
    }

    getName() {
        return this.name;
    }

    getId() {
        return this.id;
    }

    getEmail() {
        return this.email;
    }

    getRole() {
        return "Employee";
    }
}

