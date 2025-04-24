const init = ()=>{
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
    })
        .then(data => {
            let responseData = data;
            let toggleTags = document.getElementById("listOfTasgs");
            if(toggleTags)
                for(let tag of responseData.data){
                    let tag_container = document.createElement("a"),
                        edit_tag_icon = document.createElement("i"),
                        tag_text = document.createElement("span")
                    tag_text.innerText = tag.name;
                    edit_tag_icon.style.marginLeft = '10%';
                    edit_tag_icon.style.color = 'green';
                    tag_container.classList.add("dropdown-item");
                    edit_tag_icon.classList.add('fa', 'fa-pen');
                    edit_tag_icon.addEventListener('click', () => {editTag(tag);});
                    tag_text.addEventListener('click', () => {window.location.href = local_url+'tasks.html';});
                    tag_container.append(tag_text);
                    tag_container.append(edit_tag_icon);
                    toggleTags.prepend(tag_container);
                }
        })
        .catch(error => {
            console.error('There was an error during the login process:', error);
        });
    let userNameHeading = document.getElementById("userNameWidget");
    if(userNameHeading)
        userNameHeading.innerText = JSON.parse(sessionStorage.getItem("user")).name;
    readUserInfo();
    managePaginationForPendingTasks(1);
    managePaginationForCompletedTasks(1);
    populateTagsInFilterHomeView();
    populateTagsInFilter();
};

function toggleForms(){
    let form_login = document.getElementById('formLogin');
    form_register = document.getElementById('formRegister');
    if(form_register.style.display == 'none'){
        form_login.style.display = 'none';
        form_register.style.display = 'block';
    }
    else{
        form_login.style.display = 'block';
        form_register.style.display = 'none';
    }
}

function login(){
    event.preventDefault();
    let data = new FormData(event.target);
    fetch('/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(data.entries()))
    }).then(response =>{
        if(!response.ok) alert("Correo y/o contraseña incorrectos");
        return response.json();
    }).then(user => {
        sessionStorage.setItem('user',JSON.stringify(user));
        window.location.href = local_url+'home.html';
    }).catch(error => {
        console.error('Error en login:', error);
    })
}

function validateLogin(){
    if(!sessionStorage.user && window.location.href != local_url){
        alert("Favor de iniciar sesión");
        window.location.href = local_url;
    }
    if(sessionStorage.user && window.location.href == local_url){
        window.location.href = local_url+'home.html';
    }
}
validateLogin();

function logout(){
    sessionStorage.clear();
    window.location.href = local_url;
}

function register(){
    event.preventDefault();
    let data = new FormData(event.target);
    fetch('/users/', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(data.entries()))
    }).then(response =>{
        if(!response.ok){
            return response.json().then(errorData => {
                alert(`Error: ${errorData.ERROR || 'Registration failed'}`);
                return Promise.reject(errorData);
            })
        }
        return response.json();
    }).then(user => {
        sessionStorage.setItem('user',JSON.stringify(user));
        window.location.href = local_url+'home.html';
    }).catch(error => {
        console.error('Error en register:', error);
    });
}

function populateUserData(){
    let name = JSON.parse(sessionStorage.getItem('user')).name;
    let email = JSON.parse(sessionStorage.getItem('user')).email;
    let password = JSON.parse(sessionStorage.getItem('user')).password;
    let nameField = document.getElementById('userName');
    let emailField = document.getElementById('userEmail');
    let passwordField = document.getElementById('userPassword');
    nameField.value = name;
    emailField.value = email;
    passwordField.value = password;
}

function editUserInfo(){
    event.preventDefault();
    let data = new FormData(event.target);
    fetch(`/users/${JSON.parse(sessionStorage.getItem('user')).id}`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(Object.fromEntries(data.entries()))
    }).then(response => {
        if(!response.ok){
            return response.json().then(errorData => {
                alert(`Error: ${errorData.ERROR || 'Registration failed'}`);
                return Promise.reject(errorData);
            })
        }
        return response.json();
    }).then(user => {
        sessionStorage.setItem('user',JSON.stringify(user));
        window.location.href = local_url+'home.html';
    }).catch(error => {
        console.error('Error al editar usuario:', error);
    })
}

function deleteUserPermanently(){
    event.preventDefault();
    fetch(`/users/${JSON.parse(sessionStorage.getItem('user')).id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'}
    }).then(response => {
        if(!response.ok){
            return response.json().then(errorData => {
                alert(`Error: ${errorData.ERROR || 'Registration failed'}`);
                return Promise.reject(errorData);
            })
        }
        return response.json();
    }).then(user => {
        sessionStorage.clear();
        window.location.href = local_url;
    }).catch(error => {
        console.error('Error al editar usuario:', error);
    })
}