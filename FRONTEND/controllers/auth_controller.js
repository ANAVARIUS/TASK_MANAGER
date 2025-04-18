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
document.getElementById("formLogin").addEventListener('submit', login)