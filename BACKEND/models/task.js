let tasksIDs = 0
function getNextTaskID(){
    return tasksIDs;
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
    #owner;
    #status;
    #tags;
    constructor(title, due_date, owner, status, tags , description) {
        if(!title || !due_date || !owner || !status || !tags)
            throw new TaskException("All Title, due date, owner, status and tags must be provided");
        if(status != "A" && status != "F" && status != "C")
            throw new TaskException("Invalid Status Code");
        if(!Array.isArray(tags))
            throw new TaskException("Tags must be provided as an Array");
        if (!data.users.some(user => user.id === owner))
            throw new UserException("User does not exist");
        for (let id of tags) {
            if (!data.tags.some(tag => tag.id === id)) {
                throw new TagException(`Some tag id does not exist`);
            }
        }
        this.#id = getNextTaskID();
        this.#title = title;
        this.#due_date = new Date(due_date);
        if (isNaN(this.#due_date.getTime())) {
            throw new TaskException("Invalid Date");
        }
        this.#owner = owner;
        this.#status = status;
        this.#tags = tags;
        this.#description = description;
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
    get owner(){
        return this.#owner;
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
        if(!Array.isArray(tags))
            throw new TaskException("Tags must be provided as an Array");
        for (let id of tags) {
            if (!data.tags.some(tag => tag.id === id)) {
                throw new TagException(`Some tag id does not exist`);
            }
        }
        this.#tags = tags;
    }
    set status(status){
        if(status != "A" && status != "F" && status != "C")
            throw new TaskException("Invalid Status Code");
        this.#status = status;
    }
    set owner(owner){
        if (!data.users.some(user => user.id === owner))
            throw new UserException("User does not exist");
        this.#owner = owner;
    }
    set due_date(due_date){
        this.#due_date = new Date(due_date);
        if (isNaN(this.#due_date.getTime())) {
            throw new TaskException("Invalid Date");
        }
    }
    set title(title){
        this.#title = title;
    }
    set description(description){
        this.#description = description;
    }
}