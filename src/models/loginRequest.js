class LoginRequest{
    email;
    password;

    constructor(data) {
        this.email = data.email;
        this.password = data.password;
    }
}