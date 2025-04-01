const express = require('express');
const usersController = require('../controllers/users_api_controller.js');
const routerUsers = express.Router();

routerUsers.post('/', usersController);

module.exports = routerUsers;