//-----------IMPORTACIONES-----------//
const express = require('express');
const {
    createTask,
    getAllTasks,
    getTaskById,
    updateTask,
    deleteTask} = require('../controllers/tasks_api_controller.js');
const {Task, tasks} = require('../models/task.js');
const {User, Users} = require('../models/user.js');

//-----------CONFIGURACIONES-----------//

const routerTasks = express.Router();

//-----------FUNCIONES UTILES-----------//

const CheckMasterCredentials = (req, res, next) =>
    (req.header('x-auth')? next() : res.status(401).send("Unauthorized: Authentication needed."));

const ValidateUser = (req, res, next) => {
    const id = parseInt(req.params.id);
    let Auth = req.header('x-auth');
    let thisTask = tasks.find((task) => task.id === id);
    if(!thisTask) {
        res.status(404).send("Task not found!");
        return;
    }
    let id_user = thisTask.id_user;
    if(Auth && Users.some(user => ((user.password === Auth) && user.id === id_user))){
        next();
    }
    else res.status(401).send("Unauthorized: Authentication needed.");
}

//-----------RUTAS-----------//

routerTasks.post('/', createTask);
routerTasks.get('/', CheckMasterCredentials, getAllTasks);
routerTasks.get('/:id', ValidateUser, getTaskById);
routerTasks.patch('/:id', ValidateUser, updateTask);
routerTasks.delete('/:id', ValidateUser, deleteTask);

//-----------EXPORTACIONES-----------//

module.exports = routerTasks;