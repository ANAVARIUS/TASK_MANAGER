//-----------IMPORTACIONES-----------//
const {User, Users} = require('../models/user.js');
const {Task, tasks} = require('../models/task.js');
const {Tag, tags} = require('../models/tag.js');
const fs = require('fs');

//-----------FUNCIONES CONTROLADOR-----------//

function createUser(req, res) {
    try {
        let name = req.body.name;
        let email = req.body.email;
        let password = req.body.password;
        let confirmPassword = req.body.confirm_password;

        if(password === confirmPassword){
            let newUser = new User(name, email, password);
            Users.push(newUser.toObj());
            fs.writeFileSync('./BACKEND/database/users.json', JSON.stringify(Users, null, 2), 'utf8');
            res.status(200).send("Guardado!" +
                "")
        }
        else {
            throw new Error("Error 400: Passwords don't match");
        }
    } catch(err){
        console.log(err)
        res.status(400).send(err.errorMessage);
    }
}


function getUserById(req, res){
    const id = parseInt(req.params.id);
    let user = Users.find(user => user.id === id);
    if(!user){
        res.status(404).send("404 - User Not Found!");
    }
    res.status(200).json(user);
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


function getAllUsers(req, res) {
    if (req.header('x-auth') !== 'admin_auth') res.status(401).send('Not authorized');
    else {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        if (page < 1 || limit < 1) {
            res.status(400).send("Invalid page or limit");
            return;
        }
        let Firstuser = (page-1) * limit;
        res.status(200).json(
            {
                page: page,
                nextPage: page+1,
                limit: limit,
                total:Users.length,
                data:Users.slice(Firstuser, Firstuser+limit)
            }
        )
    }
}


function updateUser(req, res) {
    let user = Users.find(user => user.id === parseInt(req.params.id));
    let obj_new_info = req.body;
    let validAttributes = ["name", "email", "password"];
    let updated = false;
    for (let key in obj_new_info) {
        if (validAttributes.includes(key)) {
            user[key] = obj_new_info[key];
            updated = true;
        }
    }
    if (!updated) {
        res.status(400).send("No valid parameter was found.");
    }
    else res.status(200).json({
        message: "User updated!",
        user: user
    })
}


function deleteUser(req, res) {
    const userIndex = Users.findIndex(user => user.id === parseInt(req.params.id));
    const userToBeDeleted = Users.find(user => user.id === parseInt(req.params.id));
    for (let task of tasks) {
        if (task.id_user === id) {
            res.status(403).send("The user has active tasks.");
        }
    }
    Users.splice(userIndex, 1);
    fs.writeFileSync('./BACKEND/database/users.json', JSON.stringify(Users, null, 2), 'utf8');
    res.status(200).json({
        message: `User with id ${req.params.id} deleted!`,
        user: userToBeDeleted
    })
}

//-----------EXPORTACIONES-----------//

module.exports = {createUser, getAllUsers, getUserById, updateUser, deleteUser};