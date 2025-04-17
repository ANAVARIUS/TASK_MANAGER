//-----------IMPORTACIONES-----------//
const express = require('express');
const {
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser} = require('../controllers/users_api_controller.js');
const {User, Users} = require('../models/user.js');

//-----------CONFIGURACIONES-----------//

const routerUsers = express.Router();

//-----------FUNCIONES UTILES-----------//

const CheckMasterCredentials = (req, res, next) =>
    (req.header('x-auth')? next() : res.status(401).send("Unauthorized: Authentication needed."));
const ValidateUser = (req, res, next) => {
        const id = parseInt(req.params.id);
        let Auth = req.header('x-auth');
        if(Auth && Users.some(user => (user.password === Auth) && user.id === id)){
            if(!Users.some(user => user.id === id))
                res.status(404).send("User not found by ID.");
            else next();
        }
        else res.status(401).send("Unauthorized: Authentication needed.");
    }

//-----------RUTAS-----------//

routerUsers.post('/', createUser);
routerUsers.get('/', CheckMasterCredentials, getAllUsers);
routerUsers.get('/:id', ValidateUser, getUserById);
routerUsers.patch('/:id', ValidateUser, updateUser);
routerUsers.delete('/:id', ValidateUser, deleteUser);

//-----------EXPORTACIONES-----------//

module.exports = routerUsers;