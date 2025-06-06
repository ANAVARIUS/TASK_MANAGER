//-----------IMPORTACIONES-----------//
const express = require('express');
const path = require('path');
const routerUsers = require('./users');
const routerTasks = require('./tasks');
const routerTags = require('./tags');
const { createUser,
        getAllUsers,
        getUserById,
        updateUser,
        deleteUser,
        login} = require('../controllers/users_api_controller');
const routerApi = express.Router();
const app = express();

//-----------FUNCIONES UTILES-----------//



//-----------MIDDLEWARE-----------//

routerApi.use('/users', routerUsers);
routerApi.use('/tasks', routerTasks);
routerApi.use('/tags', routerTags);

//-----------RUTAS API-----------//
routerApi.post('/login', login);
routerApi.get('/', (req, res) => {
    let header = req.header('x-auth');
    if(header)
        res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/home.html"));
    else
        res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/login.html"));
    });
routerApi.get(
    '/home.html',
    (req, res) =>
        res.sendFile(path.resolve(__dirname+"/../../FRONTEND/views/home.html")));
routerApi.get(
    '/login.html',
    (req, res) =>
        res.sendFile(path.resolve(__dirname+"/../../FRONTEND/views/login.html")));
routerApi.get(
    '/tasks.html',
    (req, res) =>
        res.sendFile(path.resolve(__dirname+"/../../FRONTEND/views/tasks.html")));

//-----------EXPORTACIONES-----------//

module.exports = routerApi