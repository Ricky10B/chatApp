const iconoOjo = document.querySelector('.ojoIcono'),
      inputPass = document.querySelector('.inputPass'),
      btnEditar = document.getElementById('Editar')
      btnCancelar = document.getElementById('Cancelar'),
      iconImage = document.querySelector('.fa-images'),
      image = document.getElementById('fileImage');

let name = document.getElementById('name'),
    lastName = document.getElementById('lastName'),
    age = document.getElementById('age'),
    email = document.getElementById('email'),
    passw = document.getElementById('passw'),
    userId = document.getElementById('user'),
    fileImage = document.getElementById('fileImage'),
    mensajeAlerta = document.querySelector('.mensajeAlerta')
  
eventListeners()

function eventListeners(){
    btnEditar.addEventListener('click', ActivarEditarDatosUsuario)
    iconoOjo.addEventListener('click', cambiarIconoOjo)
    btnCancelar.addEventListener('click', cancelarEdicion)
}

function cambiarIconoOjo(){
    if(inputPass.lastElementChild.firstElementChild.classList.contains('fa-eye-slash')){
        inputPass.lastElementChild.innerHTML = '<i class="far fa-eye ojoIcono"></i>'
        inputPass.firstElementChild.type = 'text'
        document.querySelector('.ojoIcono').addEventListener('click', cambiarIconoOjo)
    }else{
        inputPass.lastElementChild.innerHTML = '<i class="far fa-eye-slash ojoIcono"></i>'
        document.querySelector('.ojoIcono').addEventListener('click', cambiarIconoOjo)
        inputPass.firstElementChild.type = 'password'
    }
}

function ActivarEditarDatosUsuario(e){
    e.preventDefault()
    btnEditar.value = 'Enviar'
    document.querySelectorAll('input[type=text]').forEach((inputText) =>{
        inputText.removeAttribute('readonly')
    })
    document.querySelector('input[type=number]').removeAttribute('readonly')
    document.querySelector('input[type=password]').removeAttribute('readonly')
    validationForm()
    btnEditar.removeEventListener('click', ActivarEditarDatosUsuario)
    btnEditar.addEventListener('click', editarDatosUsuario)
    btnCancelar.classList.remove('d-none')
    iconImage.addEventListener('click', click)
}

async function editarDatosUsuario(e){
    e.preventDefault()
    let formData = new FormData()
    formData.append("name", name.value)
    formData.append("lastName", lastName.value)
    formData.append("age", age.value)
    formData.append("email", email.value)
    formData.append("password", passw.value)
    formData.append("image", fileImage.files[0])

    await fetch(`/edicionData/${userId.value}`, {
        method: 'PUT',
        mode: 'same-origin',
        cache: "no-cache",
        body: formData
    })
        .then(response => response.json())
        .then(res =>{
            if(res.message == 'User updated successfully'){
                mensajeAlerta.innerHTML = `
                <div class="alert alert-success alert-dismissible show fade m-3" role="alert">
                    ${res.message}
                    <button class="close" type="button" data-dismiss="alert">
                        <span aria-hidden="true">
                            &times;
                        </span>
                    </button>
                </div>`
                name.value = res.user.nombre
                lastName.value = res.user.apellido
                age.value = res.user.edad
                email.value = res.user.correo
                if(res.user.imagen != 'https://www.adl-logistica.org/wp-content/uploads/2019/07/imagen-perfil-sin-foto.png'){
                    document.querySelector('.imgPerfil').src = `/assets/uploads/${res.user.imagen}`
                }else{
                    document.querySelector('.imgPerfil').src = 'https://www.adl-logistica.org/wp-content/uploads/2019/07/imagen-perfil-sin-foto.png'
                }

            }else{
                mensajeAlerta.innerHTML = `
                <div class="alert alert-danger alert-dismissible show fade m-3" role="alert">
                    ${res.message}
                    <button class="close" type="button" data-dismiss="alert">
                        <span aria-hidden="true">
                            &times;
                        </span>
                    </button>
                </div>`
            }
        })
        .catch(err =>{
            console.log(err)
            mensajeAlerta.innerHTML = `
            <div class=" alert alert-danger alert-dismissible show fade m-3" role="alert">
                ${res.message}
                <button class="close" type="button" data-dismiss="alert">
                    <span aria-hidden="true">
                        &times;
                    </span>
                </button>
            </div>`
        })
}

function click(){
    image.click()
}

function cancelarEdicion(){
    btnEditar.value = 'Editar'
    document.querySelectorAll('input[type=text]').forEach((inputText) =>{
        inputText.setAttribute('readonly', 'readonly')
    })
    document.querySelector('input[type=number]').setAttribute('readonly', 'readonly')
    document.querySelector('input[type=password]').setAttribute('readonly', 'readonly')
    btnEditar.removeEventListener('click', editarDatosUsuario)
    btnEditar.addEventListener('click', ActivarEditarDatosUsuario)
    iconImage.removeEventListener('click', click)
    btnCancelar.classList.add('d-none')
}

function validationForm(){
    name.addEventListener('input', cambioInfo)
    lastName.addEventListener('input', cambioInfo)
    age.addEventListener('input', cambioInfo)
    email.addEventListener('input', cambioInfo)
    passw.addEventListener('input', cambioInfo)
}

function cambioInfo(){
    if(!name || !lastName || !age || !email || !passw){
        btnEditar.setAttribute('disabled', 'true')
    }else{
        btnEditar.removeAttribute('disabled')
    }
}