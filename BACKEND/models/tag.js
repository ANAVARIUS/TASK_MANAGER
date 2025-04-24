//-----------IMPORTACIONES-----------//

const fs = require('fs');

//-----------LECTURA DE BASE DE DATOS-----------//

let tags = JSON.parse(fs.readFileSync('./database/tags.json', 'utf8'));

//-----------MODELO-----------//

function getNextTagID(){
    return tags.length+1;
}

class TagException{
    constructor(errorMessage){
        this.message = errorMessage;
    }
}

class Tag{
    #id;
    #name;
    #color;
    #id_user
    constructor(name, colorHex, id_user){
        let color = colorHex.slice(1, colorHex.length);
        if(!name || !color)
            throw new TagException("A name and color must be provided");
        this.#id = getNextTagID();
        this.name = name;
        this.color = color;
        this.id_user = id_user;
    }
    get id(){
        return this.#id;
    }
    set id(id){
        throw new TagException("ID's are auto generated");
    }
    get name(){
        return this.#name;
    }
    set name(name){
        this.#name = name;
    }
    get color(){
        return this.#color;
    }
    set color(color){
        if(isNaN(parseInt(color, 16)))
            throw new TagException("The color must be in hexadecimal format");
        this.#color = parseInt(color, 16);
    }
    get id_user(){
        return this.#id_user;
    }
    set id_user(id_user){
        this.#id_user = id_user;
    }
    toObj(){
        return {
            id: this.id,
            name: this.name,
            color: this.color,
            id_user: this.id_user
        }
    }
}

//-----------EXPORTACIONES-----------//

module.exports = {Tag, tags, TagException};