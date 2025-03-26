let numberOfUsers = 1;
function getNextUserID(){
    return numberOfUsers;
}
class UserException{
    constructor(errorMessage){
        this.errorMessage = errorMessage;
    }
}
class User{
    #id;
    #name;
    #email;
    #password;
    #joined_at;
    constructor(name, email, password){
        if(!name || !email || !password)
            throw new UserException("User must have a name, an email and a password");
        this.#name = name;
        if (data.users.some(user => user.email === email))
            throw new UserException("User with that email already exists");
        this.#email = email;
        this.#id = getNextUserID();
        this.#password = password;
        this.#joined_at = new Date();
    }
    get id(){
        return this.#id;
    }
    set id(id){
        throw new UserException("ID's are auto generated");
    }
    get name(){
        return this.#name;
    }
    get email(){
        return this.#email;
    }
    get password(){
        return this.#password;
    }
    get joined_at(){
        return this.#joined_at;
    }
    set name(name){
        if(name && (name.length > 0))
            this.#name = name;
        else throw new UserException("User must have a name");
    }
    set email(email){
        if(email && (email.length > 0))
            this.#email = email;
        else throw new UserException("User must have an email");
    }
    set password(password){
        if(password && (password.length > 7))
            this.#password = password;
        else throw new UserException("User must have a valid password");
    }
    set joined_at(joined_at){
        throw new UserException("Joined-at attribute can not be changed");
    }
}