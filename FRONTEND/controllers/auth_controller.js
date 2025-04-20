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
                console.error("Registration failed:", errorData);
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