function createUser(name, email, password){
    numberOfUsers++;
    let newUser = new User(name, email, password);
    data.users.push(newUser);
}
function getUserById(id){
    let user = data.users.find(user => user.id === id);
    if(!user){
        throw new UserException("404 - User Not Found!");
    }
    return user;
}
function searchUsers(attribute, value) {
    if (!User.prototype.hasOwnProperty(attribute)) {
        throw new UserException(`Invalid attribute`);
    }
    if (attribute === "joined_at") {
        value = new Date(value);
        if (isNaN(value.getTime())) {
            throw new UserException("Invalid date format");
        }
        return data.users.filter(user => user.joined_at.toDateString() === value.toDateString());
    }

    return data.users.filter(user => {
        const attrValue = user[attribute];
        return attrValue.includes(value);
    });
}
function getAllUsers() {
    return data.users;
}
function updateUser(id, obj_new_info) {
    let user = data.users.find(user => user.id === id);
    if (!user) {
        throw new UserException(`User with ID not found.`);
    }
    let validAttributes = ["name", "email", "password"];
    let updated = false;
    for (let key in obj_new_info) {
        if (validAttributes.includes(key)) {
            user[key] = obj_new_info[key];
            updated = true;
        }
    }
    if (!updated) {
        throw new UserException("No valid attributes were provided");
    }
    return true;
}
function deleteUser(id) {
    const userIndex = data.users.findIndex(user => user.id === id);
    if (userIndex === -1) {
        throw new UserException(`User not found.`);
    }
    for (let task of data.tasks) {
        if (task.owner === id) {
            throw new UserException("The user has running tasks");
        }
    }
    data.users.splice(userIndex, 1);
    return true;
}