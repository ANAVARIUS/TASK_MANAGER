//-----------IMPORTACIONES-----------//
const {Tag, tags} = require('../models/tag.js');
const fs = require("fs");
const {User, Users} = require("../models/user");
const {Task, tasks} = require('../models/task.js');

//-----------FUNCIONES CONTROLADOR-----------//

function createTag(req, res) {
    try {
        let id_user = Users.find(user => user.password === req.header('x-auth'));
        let name = req.body.name;
        let color = req.body.color;
        let newTag = new Tag(name, color, id_user.id);
        tags.push(newTag.toObj());
        fs.writeFileSync('./database/tags.json', JSON.stringify(tags, null, 2), 'utf8');
        res.status(200).send('Tag saved successfully.');
    }
    catch(err){
        res.status(400).send(err.errorMessage);
    }
}

function getTagById(req, res) {
    let id = parseInt(req.params.id);
    let tag = tags.find(tag => tag.id === id);
    if(!tag){
        res.status(404).send("404 - Tag Not Found!");
    }
    res.status(200).json(tag);
}

function searchTags(attribute, value) {
    if (!Tag.prototype.hasOwnProperty(attribute)) {
        throw new TagException(`Invalid attribute`);
    }
    return tags.filter(tag => {
        const attrValue = tag[attribute];
        if (typeof attrValue === "string") {
            return attrValue.includes(value);
        }
        return false;
    });
}

function getAllTags(req, res) {
    try {
        const page = parseInt(req.query.page);
        const limit = parseInt(req.query.limit);
        const myUser = Users.find(user => user.password === req.header('x-auth'))
        const myId = myUser.id;
        const userTags = tags.filter(tag => tag.id_user === myId);
        if (page < 1 || limit < 1) {
            res.status(400).send("Invalid page or limit");
            return;
        }
        let Firsttag = (page - 1) * limit;
        res.status(200).json(
            {
                page: page,
                nextPage: page + 1,
                limit: limit,
                total: tasks.length,
                data: userTags.slice(Firsttag, Firsttag + limit)
            }
        )
    }
    catch(err){
        res.status(401).send("The password presented does not match any user.");
    }
}

function updateTag(req, res) {
    let id = parseInt(req.params.id);
    let tag = tags.find(tag => tag.id === id);
    if (!tag) {
        req.status(404).send("404 - Tag Not Found!");
        return;
    }
    let obj_new_info = req.body;
    let validAttributes = ["name", "color"];
    let updated = false;

    for (let key in obj_new_info) {
        if (validAttributes.includes(key)) {
            if (key === "color" && isNaN(parseInt(obj_new_info[key], 16))) {
                req.status(400).send("Tag color must be in hexadecimal format.");
                return;
            }
            tag[key] = obj_new_info[key];
            updated = true;
        }
    }
    if (!updated) {
        req.status(400).send("No valid attributes were provided.");
        return;
    }
    fs.writeFileSync('./database/tags.json', JSON.stringify(tags, null, 2), 'utf8');
    res.status(200).json({
        message: "Tag updated!",
        tag: tag
    })
}

function deleteTag(req, res) {
    const tagIndex = tags.findIndex(tag => tag.id === parseInt(req.params.id));
    if(tagIndex === -1){
        res.status(404).send("Tag Not Found!");
        return;
    }
    const tagToBeDeleted = tags.at(tagIndex);

    for (let task of tasks) {
        if (task.tags && task.tags.includes(parseInt(req.params.id))) {
            res.status(401).send("Tag is being used by other tasks.");
        }
    }
    tags.splice(tagIndex, 1);
    fs.writeFileSync('./BACKEND/database/tags.json', JSON.stringify(tags, null, 2), 'utf8');
    res.status(200).json({
        message: `Tag with id ${req.params.id} deleted!`,
        tag: tagToBeDeleted
    })
}

//-----------EXPORTACIONES-----------//

module.exports = {createTag, getAllTags, getTagById, updateTag, deleteTag}