let tagsIds = 0
function getNextTagID(){
    return tagsIds;
}
class TagException{
    constructor(errorMessage){
        this.errorMessage = errorMessage;
    }
}
class Tag{
    #id;
    #name;
    #color;
    constructor(name, color){
        if(!name || !color)
            throw new TaskException("A name and color must be provided");
        if(isNaN(parseInt(color, 16)))
            throw new TaskException("The color must be in hexadecimal format");
        this.#id = getNextTagID();
        this.#name = name;
        this.#color = parseInt(color, 16);
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
            throw new TaskException("The color must be in hexadecimal format");
        this.#color = parseInt(color, 16);
    }
}