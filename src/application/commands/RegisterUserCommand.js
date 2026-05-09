export class RegisterUserCommand {
    constructor({ email, name, phone, password, role }) {
        this.email = email;
        this.name = name;
        this.phone = phone;
        this.password = password;
        this.role = role || 'CUSTOMER';
    }
}