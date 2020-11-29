socket = io()

// Globals variables
const form = document.querySelector('#envioMensajes')
const inputMensaje = document.getElementById('mensaje')
const btnForm = document.querySelector('.envioFormulario')
let mensajesChat = document.getElementById('mensajesUsuarios')
const iconoBajadaMensajes = document.querySelector('.icono-mensajes-nuevos')
const vaciarChat = document.getElementById('vaciarChat')
let mensajeUnico = document.querySelector('.mensajeChat')

btnForm.setAttribute('disabled', "")

inputMensaje.addEventListener('input', () =>{
    if(inputMensaje.value === ""){
        btnForm.setAttribute('disabled', "")
    }else{
        btnForm.removeAttribute('disabled')
        data = {
            mensaje: 'escribiendo',
            destinatario: window.location.pathname.split('/')[3]
        }
        socket.emit('escribiendo', data)
    }
})

socket.on('escribiendo', mensaje =>{
    document.querySelector('.escribiendoOLinea').textContent = mensaje
    setTimeout(() =>{
        document.querySelector('.escribiendoOLinea').textContent = 'en Línea'
    }, 900)
})

// Detección de cuando baja completo la pantalla
mensajesChat.addEventListener('scroll', () =>{
    function callback(entries, observer){
        if(mensajesChat.firstChild){
            if(!entries[0].isIntersecting){
                iconoBajadaMensajes.style.display = 'block';
            }else{
                iconoBajadaMensajes.style.display = 'none';
            }
        }else{
            iconoBajadaMensajes.style.display = 'none';
        }
    }

    let observer = new IntersectionObserver(callback, { rootMargin: '0px', threshold: .01 })
    observer.observe(mensajesChat.lastElementChild)
})

iconoBajadaMensajes.addEventListener('click', () =>{
    iconoBajadaMensajes.style.display = 'none'
    mensajesChat.lastElementChild.scrollIntoView()
    inputMensaje.focus()
})

vaciarChat.addEventListener('click', async () =>{

    let data = {
        remitente: JSON.parse(localStorage.getItem('token'))[0],
        destinatario: window.location.pathname.split('/')[3]
    }

    await fetch('/deleteMessages', {
        method: 'POST',
        mode: 'same-origin',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(response => console.log(response))
    .catch(err => console.log(err))

    mensajesChat.innerHTML = ''
    // while(mensajesChat.firstChild){
    //     mensajesChat.removeChild(mensajesChat.firstChild)
    // }

    // iconoBajadaMensajes.style.display = 'none'
})

form.addEventListener('submit', (e) =>{
    e.preventDefault()
    let mensaje = e.target.children[0].children[0].value
    let fecha = new Date().getTime()
    let fechaCreada = new Date(fecha)
    let horas = fechaCreada.getHours()
    let minutos = ''
    if(String(fechaCreada.getMinutes()).length === 1){
        minutos = '0' + fechaCreada.getMinutes()
    }else{
        minutos = fechaCreada.getMinutes()
    }

    let fechaActual = `${horas}:${minutos}`
    let destinatario = window.location.pathname.split('/')[3]

    data = {
        remitente: JSON.parse(localStorage.getItem('token'))[0],
        mensaje,
        fecha: fechaActual,
        destinatario
    }

    let html = `<div class="mx-2 my-3 d-flex justify-content-end mensajeChat">
        <div class="bg-primary p-2 mx-3 mensaje text-right">
            <div>
                <small class="mb-0 text-right">
                    <b>${fechaActual}</b>
                </small>
                <div class="btn-group dropup d-inline">
                    <i class="fas fa-angle-up dropdown-toggle dropdown-toggle-split pl-2 pr-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="sr-only">Toggle Dropdown</span>
                    </i>
                    <div class="dropdown-menu">
                        <button class="dropdown-item" type="button">Eliminar Mensaje</button>
                        <button class="dropdown-item" type="button">Action</button>
                        <button class="dropdown-item" type="button">Action</button>
                    </div>
                </div>
            </div>
            <b class="mx-2">${mensaje}</b>
        </div>
    </div>`
    
    socket.emit('mensaje', data)

    mensajesChat.innerHTML += html
    mensajesChat.lastElementChild.scrollIntoView()
    
    btnForm.setAttribute('disabled', "")
    inputMensaje.value = ''
    inputMensaje.focus()

    // let audio = new Audio('/assets/iphone-notificacion.mp3')
    // audio.play()
})

socket.on('connect', ()=>{
    socket.emit('socketOnline', JSON.parse(localStorage.getItem('token'))[0])
})

socket.on('mensajeEnviar', function(data){
    console.log(data);

    let html = `<div class="mx-2 my-3 d-flex mensajeChat">
            <div class="bg-secondary p-2 mx-3 mensaje text-right">
                <div>
                    <small class="mb-0 text-right">
                        <b>${data.fecha}</b>
                    </small>
                    <div class="btn-group dropup d-inline">
                        <i class="fas fa-angle-up dropdown-toggle dropdown-toggle-split pl-2 pr-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                        </i>
                        <div class="dropdown-menu">
                            <button class="dropdown-item" type="button">Eliminar Mensaje</button>
                            <button class="dropdown-item" type="button">Action</button>
                            <button class="dropdown-item" type="button">Action</button>
                        </div>
                    </div>
                </div>
                <b class="mx-2">${data.mensaje}</b>
            </div>
        </div>`

    inputMensaje.value = ''
    
    mensajesChat.innerHTML += html

    // let audio = new Audio('/assets/Silbido-corto-de-alerta.mp3')
    // audio.play()
})

// Eliminar mensaje único
async function eliminarMensajeUnico(e) {
    let mensajeEliminado = e.parentElement.parentElement.parentElement.parentElement
    mensajeEliminado.remove()

    let data = {
        remitente: JSON.parse(localStorage.getItem('token'))[0],
        destinatario: window.location.pathname.split('/')[3],
        mensaje: mensajeEliminado.firstElementChild.lastElementChild.textContent
    }

    await fetch('/deleteMessage', {
        method: 'POST',
        mode: 'same-origin',
        cache: "no-cache",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => res.json())
    .then(response => console.log(response))
    .catch(err => console.log(err))
}
