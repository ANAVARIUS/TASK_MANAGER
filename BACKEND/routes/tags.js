//-----------IMPORTACIONES-----------//
const express = require('express');
const {
    createTag,
    getAllTags,
    getTagById,
    updateTag,
    deleteTag} = require('../controllers/tags_api_controller.js');
const {Tag, tags} = require('../models/tag.js');
const {User, Users} = require('../models/user.js');

//-----------CONFIGURACIONES-----------//

const routerTags = express.Router();

//-----------FUNCIONES UTILES-----------//

const CheckMasterCredentials = (req, res, next) =>
    (req.header('x-auth')? next() : res.status(401).send("Unauthorized: Authentication needed."));

const ValidateUser = (req, res, next) => {
    const id = parseInt(req.params.id);
    let Auth = req.header('x-auth');
    let thisTag = tags.find((tag) => tag.id === id);
    if (!thisTag) {
        res.status(404).send("Tag Not Found!");
        return;
    }
    let id_user = thisTag.id_user;
    if(Auth && Users.some(user => (user.password === Auth) && user.id === id_user)){
        next();
    }
    else res.status(401).send("Unauthorized: Authentication needed.");
}

//-----------RUTAS-----------//

routerTags.post('/', createTag);
routerTags.get('/', CheckMasterCredentials, getAllTags);
routerTags.get('/:id', ValidateUser, getTagById);
routerTags.patch('/:id', ValidateUser, updateTag);
routerTags.delete('/:id', ValidateUser, deleteTag);

//-----------EXPORTACIONES-----------//

module.exports = routerTags;