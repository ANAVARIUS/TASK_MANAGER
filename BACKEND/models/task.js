//-----------IMPORTACIONES-----------//
const fs = require('fs');
const {User, Users} = require('./user');

//-----------LECTURA DE BASE DE DATOS-----------//

let tasks = JSON.parse(fs.readFileSync('./database/tasks.json', 'utf8'));

//-----------MODELO-----------//

function getNextTaskID(){
    return tasks.length+1;
}

class TaskException{
    constructor(errorMessage){
        this.errorMessage = errorMessage;
    }
}

class Task{
    #id;
    #title;
    #description;
    #due_date;
    #id_user;
    #status;
    #tags;
    constructor(title, due_date, id_user, status, tags , description) {
        this.#id = getNextTaskID();
        this.title = title;
        this.due_date = due_date;
        this.id_user = id_user;
        this.status = status;
        this.tags = tags;
        this.description = description;
    }
    get id(){
        return this.#id;
    }
    set id(id){
        throw new TaskException("ID's are auto generated");
    }
    get title(){
        return this.#title;
    }
    get due_date(){
        return this.#due_date;
    }
    get id_user(){
        return this.#id_user;
    }
    get status(){
        return this.#status;
    }
    get tags(){
        return this.#tags;
    }
    get description(){
        return this.#description;
    }
    set tags(tags){
        if(!tags){
            this.#tags = null;
            return;
        }
        if(!Array.isArray(tags))
            throw new TaskException("Tags must be provided as an Array");
        for (let id of tags) {
            if (!tags.some(tag => tag.id === id)) {
                throw new TagException(`Some tag id does not exist`);
            }
        }
        this.#tags = tags;
    }
    set status(status){
        if(status !== "A" && status !== "F" && status !== "C")
            this.#status = "C";
        else this.#status = status;
    }
    set id_user(id_user){
        if (!Users.some(user => user.id === id_user))
            throw new TagException("User does not exist");
        this.#id_user = id_user;
    }
    set due_date(due_date){
        if (due_date == null) {
            this.#due_date = null;
        }
        else {
            this.#due_date = new Date(due_date);
            if (isNaN(this.#due_date.getTime())) {
                throw new TaskException("Invalid Date");
            }
        }
    }
    set title(title){
        this.#title = title;
    }
    set description(description){
        this.#description = description;
    }
    toObj(){
        return {
            id: this.id,
            title: this.title,
            due_date: this.due_date,
            id_user: this.id_user,
            status: this.status,
            tags: this.tags,
            description: this.description,
        }
    }
}

//-----------EXPORTACIONES-----------//

module.exports = {Task, tasks}