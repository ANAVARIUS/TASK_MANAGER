//-----------IMPORTACIONES-----------//
const {Task, tasks} = require('../models/task.js');
const fs = require("fs");
const {User, Users} = require("../models/user");

//-----------FUNCIONES CONTROLADOR-----------//

function createTask(req, res) {
    try{
        let thisPassword = req.header('x-auth');
        let thisUser = Users.find(user=>user.password === thisPassword);
        let title = req.body.title;
        let id_user = parseInt(req.body.id_user);
        let due_date = req.body.due_date;
        let status = req.body.status;
        let tags = req.body.tags;
        let description = null;
        if(!title || !id_user){
            res.status(400).send("Missing title or id_user.");
        }
        else if(id_user !== thisUser.id){
            res.status(401).send("Unauthorized. Can't assign tasks to other users.");
        }
        else{
            let newTask = new Task(title, due_date, id_user, status, tags, description);
            tasks.push(newTask.toObj());
            fs.writeFileSync('./database/tasks.json', JSON.stringify(tasks, null, 2), 'utf8');
            res.status(200).send('Task saved successfully.');
        }
    }
    catch(err){
        res.status(400).send(err.errorMessage);
    }
}

function getTaskById(req, res) {
    let id = parseInt(req.params.id);
    let task = tasks.find(task => task.id === id);
    if(!task){
        res.status(404).send("404 - Task Not Found!");
    }
    res.status(200).json(task);
}

function searchTasks(attribute, value) {
    if (!Task.prototype.hasOwnProperty(attribute)) {
        throw new TaskException(`Invalid attribute`);
    }
    if (attribute === "due_date") {
        value = new Date(value);
        if (isNaN(value.getTime())) {
            throw new TaskException("Invalid date format");
        }
        return data.tasks.filter(task => task.due_date.toDateString() === value.toDateString());
    }
    return data.tasks.filter(task => {
        const attrValue = task[attribute];
        if (typeof attrValue === "string") {
            return attrValue.includes(value);
        }
        return false;
    });
}

function getAllTasks(req, res) {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const myUser = Users.find(user => user.password === req.header('x-auth'))
        const myId = myUser.id;
        const userTasks = tasks.filter(task => task.id_user === myId);
        if (page < 1 || limit < 1) {
            res.status(400).send("Invalid page or limit");
            return;
        }
        let Firsttask = (page - 1) * limit;
        res.status(200).json(
            {
                page: page,
                nextPage: page + 1,
                limit: limit,
                total: tasks.length,
                data: userTasks.slice(Firsttask, Firsttask + limit)
            }
        )
    }
    catch(err){
        res.set(401).send("The password presented does not match any user.");
    }
}

function updateTask(req, res) {
    let task = tasks.find(task => task.id === parseInt(req.params.id));
    let obj_new_info = req.body;
    let validAttributes = ["title", "due_date", "owner", "status", "tags"];
    let updated = false;
    for (let key in obj_new_info) {
        if (validAttributes.includes(key)) {
            task[key] = obj_new_info[key];
            updated = true;
        }
    }
    if (!updated) {
        res.status(400).send("No valid parameter was found.");
    }
    else {
        fs.writeFileSync('./BACKEND/database/tasks.json', JSON.stringify(tasks, null, 2), 'utf8');
        res.status(200).json({
            message: "Task updated!",
            task: task
        });
    }
}

function deleteTask(req, res) {
    const taskIndex = tasks.findIndex(task => task.id === parseInt(req.params.id));
    const taskToBeDeleted = tasks.at(taskIndex);
    tasks.splice(taskIndex, 1);
    fs.writeFileSync('./database/tasks.json', JSON.stringify(tasks, null, 2), 'utf8');
    res.status(200).json({
        message: `Task with id ${req.params.id} deleted!`,
        task: taskToBeDeleted
    })
}

function findTasksByTag(tagIds) {
    if (!Array.isArray(tagIds)) {
        throw new TaskException("Tags must be provided as an array of IDs.");
    }
    return data.tasks.filter(task =>
        tagIds.some(tagId => task.tags.includes(tagId))
    );
}

//-----------EXPORTACIONES-----------//

module.exports = {createTask, getAllTasks, getTaskById, updateTask, deleteTask}