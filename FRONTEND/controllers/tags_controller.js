function createTag(){
    event.preventDefault();
    let data = new FormData(event.target);
    fetch('/tags/', {
        method: 'POST',
        headers: {  'Content-Type': 'application/json',
                    'x-auth': JSON.parse(sessionStorage.getItem('user')).password},
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
        window.location.href = window.location.href;
    }).catch(error => {
        console.error('Error en register:', error);
    });
}

function editTag(Tag){
    event.preventDefault();
    let edit_tag_modal = new bootstrap.Modal(document.getElementById('editTagModal'));
    edit_tag_modal.show();
    document.getElementById("nameTAG").placeholder = Tag.name;
    document.getElementById("nameTAG").value = Tag.name;
    document.getElementById("editTagForm").addEventListener("submit", ()=>{updateTag(Tag)});
    document.getElementById("deleteTagButton").addEventListener("click", ()=>{deleteTag(Tag)});
}

function updateTag(Tag){
    event.preventDefault();
    let data = new FormData(event.target);
    fetch(`/tags/${Tag.id}`, {
        method: 'PATCH',
        headers: {  'Content-Type': 'application/json',
            'x-auth': JSON.parse(sessionStorage.getItem('user')).password},
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
        window.location.href = window.location.href;
    }).catch(error => {
        console.error('Error en register:', error);
    });
}

function deleteTag(Tag){
    event.preventDefault();
    fetch(`/tags/${Tag.id}`, {
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