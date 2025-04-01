//-----------IMPORTACIONES-----------//
const express = require('express');
const path = require('path');
const routerUsers = require('./users');
const routerApi = express.Router();
const app = express();

//-----------FUNCIONES UTILES-----------//

const Header_validation = (req, res, next) =>
    (req.header('x-auth')? next() : res.status(401).send("Unauthorized: Authentication needed."));

//-----------MIDDLEWARE-----------//

routerApi.use('/users', routerUsers);

//-----------RUTAS API-----------//

routerApi.get('/', (req, res) => {
    let header = req.header('x-auth');
    if(header)
        res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/home.html"));
    else
        res.sendFile(path.resolve(__dirname + "/../../FRONTEND/views/login.html"));
    });
routerApi.get(
    '/home.html',
    Header_validation,
    (req, res) =>
        res.sendFile(path.resolve(__dirname+"/../../FRONTEND/views/home.html")));
routerApi.get(
    '/login.html',
    (req, res) =>
        res.sendFile(path.resolve(__dirname+"/../../FRONTEND/views/login.html")));
routerApi.get(
    '/tasks.html',
    Header_validation,
    (req, res) =>
        res.sendFile(path.resolve(__dirname+"/../../FRONTEND/views/tasks.html")));

//-----------EXPORTACIONES-----------//

module.exports = routerApi