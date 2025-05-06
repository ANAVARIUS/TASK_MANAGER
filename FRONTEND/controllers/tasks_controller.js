var tagList = [];
var taskList = [];

let isSameDay = (date1str, date2str) =>{
    const date1 = new Date(date1str);
    const date2 = new Date(date2str);

    return date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate();
}
let getDateInGMTMinus6 = (date = new Date()) => {
    // Convert UTC milliseconds to offset milliseconds (-6 hours)
    const utc = date.getTime();
    const offset = -6 * 60; // -6 hours in minutes
    const local = new Date(utc + offset * 60 * 1000);
    return local.toISOString().slice(0, 10); // Get YYYY-MM-DD
}

function createTask() {
    event.preventDefault();
    let data = new FormData(event.target);
    let tagFound = tagList.find(thetag => thetag.name === Object.fromEntries(data.entries()).tags);
    let tagID = tagFound ? [tagFound.id] : null;
    fetch('/tasks/', {
        method: 'POST',
        headers: {  'Content-Type': 'application/json',
            'x-auth': JSON.parse(sessionStorage.getItem('user')).password},
        body: JSON.stringify({ title: Object.fromEntries(data.entries()).title,
                due_date: Object.fromEntries(data.entries()).due_date,
                tags: tagID})
    }).then(response =>{
        if(!response.ok){
            return response.json().then(errorData => {
                alert(`Error: ${errorData.ERROR || 'Registration failed'}`);
                return Promise.reject(errorData);
            })
        }
        return response.json();
    }).then(task => {
        window.location.href = window.location.href;
    }).catch(error => {
        console.error('Error en register:', error);
    });
}

function populateTagToggle(){
    fetch('/tags?page=1&limit=200', {
        method: 'GET',
        headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
    }).then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
            });
        }
        return res.json();
    }).then(data => {
        tagList = data.data;
        let toggleTags = document.getElementById("tagSelect");
        if(toggleTags)
            for(let tag of data.data){
                let tag_container = document.createElement("option");
                tag_container.innerText = tag.name;
                toggleTags.append(tag_container);
            }
        let toggleTags2 = document.getElementById("tagSelect2");
        if(toggleTags2)
            for(let tag of data.data){
                let tag_container = document.createElement("option");
                tag_container.innerText = tag.name;
                toggleTags2.append(tag_container);
            }
    })
    .catch(error => {
        console.error('There was an error during the login process:', error);
    });
}

function readUserInfo(){
    fetch('/tasks?page=1&limit=200', {
        method: 'GET',
        headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
    }).then(res => {
        if(!res.ok){
            return res.json().then(errorData => {
                alert(`Error: ${errorData.ERROR || 'Registration failed'}`);
                return Promise.reject(errorData);
            })
        }
        return res.json();
    }).then(data => {
        taskList = data.data;
        let finishedTasks = data.data.filter(task => task.status === "C" && isSameDay(task.due_date, getDateInGMTMinus6() + "T00:00:00.000Z"));
        let pendingTasks = data.data.filter(task => task.status === "A" && isSameDay(task.due_date, getDateInGMTMinus6() + "T00:00:00.000Z"));
        let tareasTerminadas = document.getElementById("tareasTerminadas");
        let tareasPendientes = document.getElementById("tareasPendientes");
        let aa = (pendingTasks.length+finishedTasks.length) ? Math.floor((finishedTasks.length/(pendingTasks.length+finishedTasks.length))*100) : 0;
        let AIResume = document.getElementById("AIResume");
        if (tareasTerminadas)
            tareasTerminadas.innerHTML = `<b>Tareas terminadas hoy:</b> ${finishedTasks.length} tareas`;
        if(tareasPendientes)
            tareasPendientes.innerHTML = `<b>Tareas pendientes de hoy:</b> ${pendingTasks.length} tareas`;
        if(AIResume)
            AIResume.innerText = `${JSON.parse(sessionStorage.getItem("user")).name} es un usuario que ha terminado ${finishedTasks.length} tareas hoy. Aún tiene ${pendingTasks.length} pendientes para el día, por lo que lleva un total de ${aa}% de trabajo terminado`;
        })
        .catch(error => {
            console.error('There was an error during the login process:', error);
        });
}

function managePaginationForPendingTasks(page){
    fetch(`/tasks?page=${page}&limit=3&status=A`, {
        method: 'GET',
        headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
    }).then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
            });
        }
        return res.json();
    }).then(tasks => {
        fetch('/tags?page=1&limit=200', {
            method: 'GET',
            headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
                });
            }
            return res.json();
        }).then(tags => {
            const pagination = document.getElementById("pagination1");
            if(pagination) {
                let listOfTotalTasks = taskList.filter(task => task.status === "A" && isSameDay(task.due_date, getDateInGMTMinus6() + "T00:00:00.000Z"));
                let totalOfTasks = tasks.data.filter(task => task.status === "A" && isSameDay(task.due_date, getDateInGMTMinus6() + "T00:00:00.000Z"));
                const pageCount = Math.ceil(listOfTotalTasks.length / 3);
                let table = document.getElementById("tableTodayTasks");
                table.innerHTML = "";
                if (pageCount > 1) {
                    pagination.innerHTML = ""; // Clear previous buttons
                    for (let i = 1; i <= pageCount; i++) {
                        const li = document.createElement("li");
                        li.className = "page-item";
                        li.innerHTML = `<button class="page-link">${i}</button>`;
                        li.addEventListener("click", () => {
                            managePaginationForPendingTasks(i);
                        });
                        pagination.appendChild(li);
                    }
                }
                for (let task of totalOfTasks) {
                    let element = document.createElement("tr");
                    let tagName = task.tags ? tags.data.find(tag => tag.id === task.tags[0]).name : "Sin etiqueta";
                    let tagColor = task.tags ? (tags.data.find(tag => tag.id === task.tags[0]).color) : "#000000";
                    element.innerHTML = `<td scope="row"><input type="checkbox" id="checkbox${task.id}"></td>
                                     <td>${task.title}</td>
                                     <td><span class="badge" style="background-color:${tagColor}">${tagName}</span></td>
                                     <td>${task.due_date.slice(8, 10)}/${task.due_date.slice(5, 7)}/${task.due_date.slice(0, 4)}</td>`;
                    table.append(element);
                    document.getElementById(`checkbox${task.id}`).addEventListener('click', () => {checkTask(task);});
                }
                if (totalOfTasks.length === 0)
                    document.getElementById("todaytasksdiv").innerHTML = '<h1>NO HAY TAREAS POR MOSTRAR</h1>>';
            }
        }).catch(error => {
                console.error('There was an error during the login process:', error);
            });
    }).catch(error => {
        console.error('There was an error during the login process:', error);
    });
}

function managePaginationForCompletedTasks(page){
    fetch(`/tasks?page=${page}&limit=3&status=C`, {
        method: 'GET',
        headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
    }).then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
            });
        }
        return res.json();
    }).then(tasks => {
        fetch('/tags?page=1&limit=200', {
            method: 'GET',
            headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
                });
            }
            return res.json();
        }).then(tags => {
            const pagination = document.getElementById("pagination2");
            if(pagination) {
                let listOfTotalTasks = taskList.filter(task => task.status === "C" && isSameDay(task.due_date, getDateInGMTMinus6() + "T00:00:00.000Z"));
                let totalOfTasks = tasks.data.filter(task => task.status === "C" && isSameDay(task.due_date, getDateInGMTMinus6() + "T00:00:00.000Z"));
                const pageCount = Math.ceil(listOfTotalTasks.length / 3);
                let table = document.getElementById("tableFinishedTodayTasks");
                table.innerHTML = "";
                if (pageCount > 1) {
                    pagination.innerHTML = ""; // Clear previous buttons
                    for (let i = 1; i <= pageCount; i++) {
                        const li = document.createElement("li");
                        li.className = "page-item";
                        li.innerHTML = `<button class="page-link">${i}</button>`;
                        li.addEventListener("click", () => {
                            managePaginationForPendingTasks(i);
                        });
                        pagination.appendChild(li);
                    }
                }
                for (let task of totalOfTasks) {
                    let element = document.createElement("tr");
                    let tagName = task.tags ? tags.data.find(tag => tag.id === task.tags[0]).name : "Sin etiqueta";
                    let tagColor = task.tags ? (tags.data.find(tag => tag.id === task.tags[0]).color) : "#000000";
                    element.innerHTML = `<td scope="row"><input type="checkbox" checked id="checkedCheckBox${task.id}"></td>
                                     <td><del>${task.title}</del></td>
                                     <td><span class="badge" style="background-color:${tagColor}">${tagName}</span></td>
                                     <td>${task.due_date.slice(8, 10)}/${task.due_date.slice(5, 7)}/${task.due_date.slice(0, 4)}</td>`;
                    table.append(element);
                    document.getElementById(`checkedCheckBox${task.id}`).addEventListener('click', ()=>{checkTask(task);})
                }
                if (totalOfTasks.length === 0)
                    document.getElementById("todayfinishedtasksdiv").innerHTML = '<h1>NO HAY TAREAS POR MOSTRAR</h1>>';
            }
        }).catch(error => {
            console.error('There was an error during the login process:', error);
        });
    }).catch(error => {
        console.error('There was an error during the login process:', error);
    });
}

function populateTagsInFilterHomeView(){
    fetch('/tags?page=1&limit=200', {
        method: 'GET',
        headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
    }).then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
            });
        }
        return res.json();
    }).then(data => {
        let tagDisplay = document.getElementById("tagDisplay");
        let flag = true;
        if(tagDisplay){
            for(let tag of data.data){
                let tagWrapper = document.createElement("button");
                let tagHTML = document.createElement("span");
                tagHTML.className = "badge";
                tagHTML.id = tag.name;
                tagHTML.style.backgroundColor = tag.color;
                tagHTML.innerText = tag.name;
                tagWrapper.style.backgroundColor = 'inherit';
                tagWrapper.style.border = 'none';
                tagWrapper.append(tagHTML);
                tagWrapper.onclick = () => {
                    for(let tag of data.data) document.getElementById(tag.name).style.opacity = 0.5;
                    managePaginationTasksByTags(1, tag.name);
                }
                if(!flag){
                    tagHTML.style.opacity = 0.5;
                }
                flag = false;
                tagDisplay.append(tagWrapper);
            }
        }
        if(data.data && data.data.length > 0)
            managePaginationTasksByTags(1, data.data[0].name)
    })
        .catch(error => {
            console.error('There was an error during the login process:', error);
        });
}

function managePaginationTasksByTags(page, passedTags){
    fetch(`/tasks?page=${page}&limit=3&tag=${passedTags}&status=A`, {
        method: 'GET',
        headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
    }).then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
            });
        }
        return res.json();
    }).then(tasks => {
        fetch('/tags?page=1&limit=200', {
            method: 'GET',
            headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
                });
            }
            return res.json();
        }).then(tags => {
            const pagination = document.getElementById("pagination3");
            if(pagination) {
                document.getElementById(passedTags).style.opacity = 1;
                let listOfTotalTasks = taskList.filter(task => task.status === "A" && isSameDay(task.due_date, getDateInGMTMinus6() + "T00:00:00.000Z") && (task.tags ? task.tags[0]: null) === tags.data.find(tag=> tag.name = passedTags).id );
                let totalOfTasks = tasks.data.filter(task => task.status === "A" && isSameDay(task.due_date, getDateInGMTMinus6() + "T00:00:00.000Z"));
                const pageCount = Math.ceil(listOfTotalTasks.length / 3);
                let table = document.getElementById("tableTasksByTag");
                table.innerHTML = "";
                if (pageCount > 1) {
                    pagination.innerHTML = ""; // Clear previous buttons
                    for (let i = 1; i <= pageCount; i++) {
                        const li = document.createElement("li");
                        li.className = "page-item";
                        li.innerHTML = `<button class="page-link">${i}</button>`;
                        li.addEventListener("click", () => {
                            managePaginationTasksByTags(i, passedTags);
                        });
                        pagination.appendChild(li);
                    }
                }
                for (let task of totalOfTasks) {
                    let element = document.createElement("tr");
                    let tagName = task.tags ? tags.data.find(tag => tag.id === task.tags[0]).name : "Sin etiqueta";
                    let tagColor = task.tags ? (tags.data.find(tag => tag.id === task.tags[0]).color) : "#000000";
                    element.innerHTML = `<td scope="row"><input type="checkbox" id="filteredCheckbox${task.title}"></td>
                                        <td>${task.title}</td>
                                        <td><span class="badge" style="background-color: ${tagColor}; !important">${tagName}</span></td>
                                     <td>${task.due_date.slice(8, 10)}/${task.due_date.slice(5, 7)}/${task.due_date.slice(0, 4)}</td>`;
                    table.append(element);
                    document.getElementById(`filteredCheckbox${task.title}`).addEventListener("click", () => {checkTask(task);});
                }
                if (totalOfTasks.length === 0)
                    document.getElementById("tableTasksByTag").innerHTML = '<td><h1>NO HAY TAREAS POR MOSTRAR</h1></td>';
            }
        }).catch(error => {
            console.error('There was an error during the login process:', error);
        });
    }).catch(error => {
        console.error('There was an error during the login process:', error);
    });
}


function checkTask(checkedTask){
    event.preventDefault();
    fetch(`/tasks/${checkedTask.id}`, {
        method: 'PATCH',
        headers: {  'Content-Type': 'application/json',
                    'x-auth': JSON.parse(sessionStorage.getItem('user')).password},
        body: JSON.stringify({
            status : (checkedTask.status === "A"? "C" : "A")
        })
    }).then(res => {
        if(!res.ok){
            return res.json().then(errorData => {
                alert(`Error: ${errorData.ERROR || 'Update tag failed'}`);
                return Promise.reject(errorData);
            })
        }
        return res.json();
    }).then(tasks => {
        window.location.href = window.location.href;
    }).catch(error => {
        console.error('There was an error during the checking tag process:', error);
    });
}


function managePaginationTasksView(page, passedTags){
    fetch(`/tasks?page=${page}&limit=10&tag=${passedTags}`, {
        method: 'GET',
        headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
    }).then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
            });
        }
        return res.json();
    }).then(tasks => {
        fetch('/tags?page=1&limit=200', {
            method: 'GET',
            headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
        }).then(res => {
            if (!res.ok) {
                return res.text().then(text => {
                    throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
                });
            }
            return res.json();
        }).then(tags => {
            const pagination = document.getElementById("paginationTaskView");
            if(pagination) {
                document.getElementById(`${passedTags}_TaskView`).style.opacity = 1;
                let listOfTotalTasks = taskList;
                let totalOfTasks = tasks.data;
                const pageCount = Math.ceil(listOfTotalTasks.length / 10);
                let table = document.getElementById("tableTasksView");
                table.innerHTML = "";
                if (pageCount > 1) {
                    pagination.innerHTML = ""; // Clear previous buttons
                    for (let i = 1; i <= pageCount; i++) {
                        const li = document.createElement("li");
                        li.className = "page-item";
                        li.innerHTML = `<button class="page-link">${i}</button>`;
                        li.addEventListener("click", () => {
                            managePaginationTasksView(i, passedTags);
                        });
                        pagination.appendChild(li);
                    }
                }
                for (let task of totalOfTasks) {
                    let element = document.createElement("tr");
                    let tagName = task.tags ? tags.data.find(tag => tag.id === task.tags[0]).name : "Sin etiqueta";
                    let tagColor = task.tags ? (tags.data.find(tag => tag.id === task.tags[0]).color) : "#000000";
                    if(task.status === "A")
                        element.innerHTML = `<td scope="row"><input type="checkbox" id="filteredCheckbox${task.title}TaskView"></td>
                                            <td>${task.title}</td>
                                            <td><span class="badge" style="background-color: ${tagColor}">${tagName}</span></td>
                                            <td>${task.due_date.slice(8, 10)}/${task.due_date.slice(5, 7)}/${task.due_date.slice(0, 4)}</td>
                                            <td>
                                                <i class='fas fa-pen' style='color: blue; margin: 2%' id="${task.title}Edit"></i>
                                                <i class='fas fa-trash' style='color: red; margin: 2%' id="${task.title}Delete"></i>
                                            </td>`;
                    else
                        element.innerHTML = `<td scope="row"><input type="checkbox" id="filteredCheckbox${task.title}TaskView" checked></td>
                                            <td><del>${task.title}</del></td>
                                            <td><span class="badge" style="background-color: ${tagColor}">${tagName}</span></td>
                                            <td>${task.due_date.slice(8, 10)}/${task.due_date.slice(5, 7)}/${task.due_date.slice(0, 4)}</td>
                                            <td>
                                                <i class='fas fa-pen' style='color: blue; margin: 2%' id="${task.title}Edit"></i>
                                                <i class='fas fa-trash' style='color: red; margin: 2%' id="${task.title}Delete"></i>
                                            </td>`;
                    table.append(element);
                    document.getElementById(`filteredCheckbox${task.title}TaskView`).addEventListener("click", () => {checkTask(task);});
                    document.getElementById(`${task.title}Edit`).addEventListener("click", () => {
                        populateTaskInfo(task);
                        let edit_tag_modal = new bootstrap.Modal(document.getElementById('edittaskModal'));
                        edit_tag_modal.show();
                        document.getElementById("formEditTask").onsubmit = ()=> {
                            updateTask(task.id);
                        };
                    });
                    document.getElementById(`${task.title}Delete`).addEventListener("click", () => {
                        let delete_tag_modal = new bootstrap.Modal(document.getElementById('deleteTaskModal'));
                        delete_tag_modal.show();
                        document.getElementById("deleteTaskButton").onclick = () => {deleteTask(task.id)};
                    });
                }
                if (totalOfTasks.length === 0)
                    document.getElementById("tableTasksView").innerHTML = '<td><h1>NO HAY TAREAS POR MOSTRAR</h1></td>';
            }
        }).catch(error => {
            console.error('There was an error during the login process:', error);
        });
    }).catch(error => {
        console.error('There was an error during the login process:', error);
    });
}

function populateTagsInFilter(){
    fetch('/tags?page=1&limit=200', {
        method: 'GET',
        headers: {'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
    }).then(res => {
        if (!res.ok) {
            return res.text().then(text => {
                throw new Error(`HTTP error! status: ${res.status}, body: ${text}`);
            });
        }
        return res.json();
    }).then(data => {
        let tagDisplay = document.getElementById("tagDisplayTaskView");
        let flag = true;
        if(tagDisplay){
            for(let tag of data.data){
                let tagWrapper = document.createElement("button");
                let tagHTML = document.createElement("span");
                tagHTML.className = "badge";
                tagHTML.id = `${tag.name}_TaskView`;
                tagHTML.style.backgroundColor = tag.color;
                tagHTML.innerText = tag.name;
                tagWrapper.style.backgroundColor = 'inherit';
                tagWrapper.style.border = 'none';
                tagWrapper.append(tagHTML);
                tagWrapper.onclick = () => {
                    for(let tag of data.data) document.getElementById(`${tag.name}_TaskView`).style.opacity = 0.5;
                    managePaginationTasksView(1, tag.name);
                }
                if(!flag){
                    tagHTML.style.opacity = 0.5;
                }
                flag = false;
                tagDisplay.append(tagWrapper);
            }
        }
        if(data.data && data.data.length > 0)
            managePaginationTasksView(1, data.data[0].name)
    })
        .catch(error => {
            console.error('There was an error during the login process:', error);
        });
}

function updateTask(taskID){
    event.preventDefault();
    let data = new FormData(event.target);
    let tagFound = tagList.find(thetag => thetag.name === Object.fromEntries(data.entries()).tags);
    let tagID = tagFound ? [tagFound.id] : null;
    fetch(`/tasks/${taskID}`, {
        method: 'PATCH',
        headers: {  'Content-Type': 'application/json',
            'x-auth': JSON.parse(sessionStorage.getItem('user')).password},
        body: JSON.stringify({ title: Object.fromEntries(data.entries()).title,
            due_date: Object.fromEntries(data.entries()).due_date,
            tags: tagID})
    }).then(response => {
        if(!response.ok){
            return response.json().then(errorData => {
                alert(`Error: ${errorData.ERROR || 'Registration failed'}`);
                return Promise.reject(errorData);
            })
        }
        return response.json();
    }).then(user => {
        window.location.href = window.location.href;
    }).catch(error => {
        console.error('Error al editar tarea:', error);
    })
}

function deleteTask(taskID){
    event.preventDefault();
    fetch(`/tasks/${taskID}`, {
        method: 'DELETE',
        headers: {  'Content-Type': 'application/json',
            'x-auth': JSON.parse(sessionStorage.getItem('user')).password}
    }).then(response =>{
        if(!response.ok){
            return response.json().then(errorData => {
                console.error("Registration failed:", errorData);
                alert(`Error: ${errorData.ERROR || 'Registration failed'}`);
                return Promise.reject(errorData);
            })
        }
        return response.json();
    }).then(user => {
        window.location.href = window.location.href;
    }).catch(error => {
        console.error('Error en register:', error);
    });
}

function populateTaskInfo(task){
    document.getElementById("editname").value = task.title;
    document.getElementById("editdate").value = `${task.due_date.slice(0, 4)}-${task.due_date.slice(5, 7)}-${task.due_date.slice(8, 10)}`;
}