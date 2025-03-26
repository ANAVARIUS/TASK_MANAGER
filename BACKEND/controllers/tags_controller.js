function createTag(name, color) {
    tagsIds++;
    let newTag = new Tag(name, color);
    data.tags.push(newTag);
    return newTag;
}
function getTagById(id) {
    let tag = data.tags.find(tag => tag.id === id);
    if (!tag) {
        throw new TagException("404 - Tag Not Found!");
    }
    return tag;
}
function searchTags(attribute, value) {
    if (!Tag.prototype.hasOwnProperty(attribute)) {
        throw new TagException(`Invalid attribute`);
    }
    return data.tags.filter(tag => {
        const attrValue = tag[attribute];
        if (typeof attrValue === "string") {
            return attrValue.includes(value);
        }
        return false;
    });
}
function getAllTags() {
    return data.tags;
}
function updateTag(id, obj_new_info) {
    let tag = data.tags.find(tag => tag.id === id);
    if (!tag) {
        throw new TagException(`Tag with ID not found.`);
    }

    let validAttributes = ["name", "color"];
    let updated = false;

    for (let key in obj_new_info) {
        if (validAttributes.includes(key)) {
            if (key === "color" && isNaN(parseInt(obj_new_info[key], 16))) {
                throw new TagException("The color must be in hexadecimal format");
            }
            tag[key] = obj_new_info[key];
            updated = true;
        }
    }
    if (!updated) {
        throw new TagException("No valid attributes were provided");
    }
    return true;
}
function deleteTag(id) {
    const tagIndex = data.tags.findIndex(tag => tag.id === id);
    if (tagIndex === -1) {
        throw new TagException(`Tag not found.`);
    }
    for (let task of data.tasks) {
        if (task.tags.includes(id)) {
            throw new TagException("Cannot delete tag because it is assigned to tasks");
        }
    }
    data.tags.splice(tagIndex, 1);
    return true;
}