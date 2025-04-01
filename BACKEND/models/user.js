//-----------IMPORTACIONES-----------//
const fs = require('fs');

//-----------LECTURA DE BASE DE DATOS-----------//

let Users = JSON.parse(fs.readFileSync('./BACKEND/database/users.json', 'utf8'));

//-----------MODELO-----------//

function getNextUserID(){
    return Users.length+1;
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
        this.name = name;
        this.email = email;
        this.#id = getNextUserID();
        this.password = password;
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
        if (Users.some(user => user.email === email))
            throw new UserException("User with that email already exists");
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
    toObj(){
        return {
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            joined_at: this.joined_at
        }
    }
}

//-----------EXPORTACIONES-----------//

module.exports = {User, Users};