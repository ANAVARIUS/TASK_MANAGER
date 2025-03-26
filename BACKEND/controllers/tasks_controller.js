function createTask(title, due_date, owner, status, tags, description) {
    tasksIDs++;
    let newTask = new Task(title, due_date, owner, status, tags, description);
    data.tasks.push(newTask);
    return newTask;
}
function getTaskById(id) {
    let task = data.tasks.find(task => task.id === id);
    if (!task) {
        throw new TaskException("404 - Task Not Found!");
    }
    return task;
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
function getAllTasks() {
    return data.tasks;
}
function updateTask(id, obj_new_info) {
    let task = data.tasks.find(task => task.id === id);
    if (!task) {
        throw new TaskException(`Task with ID not found.`);
    }
    let validAttributes = ["title", "due_date", "owner", "status", "tags", "description"];
    let updated = false;
    for (let key in obj_new_info) {
        if (validAttributes.includes(key)) {
            if (key === "due_date") {
                let newDate = new Date(obj_new_info[key]);
                if (isNaN(newDate.getTime())) {
                    throw new TaskException("Invalid Date Format");
                }
                task.due_date = newDate;
            } else if (key === "tags" && !Array.isArray(obj_new_info[key])) {
                throw new TaskException("Tags must be an array");
            } else {
                task[key] = obj_new_info[key];
            }
            updated = true;
        }
    }
    if (!updated) {
        throw new TaskException("No valid attributes were provided");
    }
    return true;
}
function deleteTask(id) {
    const taskIndex = data.tasks.findIndex(task => task.id === id);
    if (taskIndex === -1) {
        throw new TaskException(`Task not found.`);
    }
    data.tasks.splice(taskIndex, 1);
    return true;
}
function findTasksByTag(tagIds) {
    if (!Array.isArray(tagIds)) {
        throw new TaskException("Tags must be provided as an array of IDs.");
    }
    return data.tasks.filter(task =>
        tagIds.some(tagId => task.tags.includes(tagId))
    );
}

