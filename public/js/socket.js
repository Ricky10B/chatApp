// Globals variables
const socket = io()
const form = document.querySelector('#envioMensajes')
const inputMensaje = document.getElementById('mensaje')
const btnForm = document.querySelector('.envioFormulario')
let mensajesChat = document.getElementById('mensajesUsuarios')
const iconoBajadaMensajes = document.querySelector('.icono-mensajes-nuevos')
const vaciarChat = document.getElementById('vaciarChat')
let MNL = document.getElementById('mensajesNoLeidos')
let cerrarNotificacion = document.querySelector('.cerrarNotificacion')
let escribiendoOLinea = document.querySelector('.escribiendoOLinea')

// Configuraciones iniciales
btnForm.setAttribute('disabled', "")

if(mensajesChat.firstElementChild){
    if(MNL){
        if(MNL.parentElement.previousElementSibling){
            if(MNL.parentElement.previousElementSibling.previousElementSibling){
                MNL.parentElement.previousElementSibling.previousElementSibling.scrollIntoView()
            }else{
                MNL.parentElement.previousElementSibling.scrollIntoView()
            }
        }else{
            MNL.parentElement.scrollIntoView()
        }
    }else{
        mensajesChat.lastElementChild.scrollIntoView()
    }
}

/**
 * Event Listeners
 */
// detección de cuando el usuario está escribiendo
inputMensaje.addEventListener('input', () =>{
    if(inputMensaje.value === ""){
        btnForm.setAttribute('disabled', "")
    }else{
        let timeout, data
        btnForm.removeAttribute('disabled')
        data = {
            mensaje: 'escribiendo',
            destinatario: window.location.pathname.split('/')[3]
        }

        inputMensaje.addEventListener('keydown', () =>{
            clearTimeout(timeout)
            timeout = setTimeout(() =>{
                data.mensaje = 'en linea'
                socket.emit('escribiendo', data)
                clearTimeout(timeout)
            }, 600)
        })
        
        socket.emit('escribiendo', data)
    }
})

// cuando se selecciona para escribir baja al ultumo mensaje
inputMensaje.addEventListener('focus', () =>{
    addEventListener('resize', () =>{
        mensajesChat.lastElementChild.scrollIntoView()
    })
})

// cerrar notificación
if(cerrarNotificacion){
    cerrarNotificacion.addEventListener('click', () =>{
        document.querySelector('.notification').style.display = 'none'
    })
}

// Enviar mensaje
form.addEventListener('submit', (e) =>{
    e.preventDefault()
    let mensaje = e.target.children[0].children[0].value

    let fechaActual = fechaMensaje()
    let destinatario = window.location.pathname.split('/')[3]

    let data = {
        remitente: JSON.parse(localStorage.getItem('token'))[0],
        mensaje,
        fecha: fechaActual,
        destinatario
    }

    fechaMensajes()

    let html = `<div class="my-1 d-flex justify-content-end mensajeChat">
        <div class="bg-primary p-2 mx-3 mensaje text-right">
            <div class="text-right">
                <small class="mb-0">
                    <b>${fechaActual}</b>
                </small>
                <div class="btn-group dropup d-inline">
                    <i class="fas fa-angle-up dropdown-toggle dropdown-toggle-split pl-2 pr-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            <span class="sr-only">Toggle Dropdown</span>
                    </i>
                    <div class="dropdown-menu">
                        <button class="dropdown-item" type="button" id="eliminarMensaje" onclick="eliminarMensajeUnico(this)">
                            Eliminar Mensaje
                        </button>
                    </div>
                </div>
            </div>
            <b class="mx-2">${mensaje}</b>
        </div>
    </div>`
    
    btnForm.setAttribute('disabled', "")
    inputMensaje.value = ''
    inputMensaje.focus()
    eliminarMensajesSinLeer()
    
    mensajesChat.insertAdjacentHTML('beforeend', html)
    mensajesChat.lastElementChild.scrollIntoView()

    socket.emit('mensaje', data)
    mensajesVistos()

})

// Detección de cuando baja completo la pantalla
let lastScroll = mensajesChat.scrollTop
mensajesChat.addEventListener('scroll', () =>{
    function callback(entries, observer){
        if(mensajesChat.firstChild){
            if(!entries[0].isIntersecting){
                if(mensajesChat.scrollTop < lastScroll){
                    iconoBajadaMensajes.style.display = 'block';
                }
            }else{
                iconoBajadaMensajes.style.display = 'none';
            }
            lastScroll = mensajesChat.scrollTop
        }
    }

    let observer = new IntersectionObserver(callback, { threshold: .01 })
    if(mensajesChat.firstChild){
        observer.observe(mensajesChat.lastElementChild)
    }
})

iconoBajadaMensajes.addEventListener('click', () =>{
    iconoBajadaMensajes.style.display = 'none'
    inputMensaje.focus()
    mensajesChat.lastElementChild.scrollIntoView()
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
    .catch(err => console.log(err))

    mensajesChat.innerHTML = ''

    iconoBajadaMensajes.style.display = 'none'
})

/**
 *  sockets
 */ 
socket.on('connect', () =>{
    let dataUser = JSON.parse(localStorage.getItem('token'))[0]
    socket.emit('socketOnline', dataUser)
    if(MNL){
        socket.emit('mensajesVistos', { rem: dataUser, dest: window.location.pathname.split('/')[3] })
    }
    socket.emit('linea', {mensaje: 'en linea', user: dataUser})
})

socket.on('disconnect', () =>{
    let dataUser = JSON.parse(localStorage.getItem('token'))[0]
    socket.emit('noLinea', dataUser)
})

socket.on('linea', mensaje =>{
    if(window.location.pathname.split('/')[3] == mensaje.user){
        escribiendoOLinea.textContent = mensaje.mensaje
    }
})
    
socket.on('noLinea', mensaje =>{
    if(window.location.pathname.split('/')[3] == mensaje.user){
        if(escribiendoOLinea.textContent === 'en linea'){
            escribiendoOLinea.textContent = ''
        }
    }
})

socket.on('escribiendo', mensaje =>{
    if(localStorage.getItem('token')){
        escribiendoOLinea.textContent = mensaje
    }
})

// notificacion de mensaje
socket.on('notificacion', data =>{
    if(window.location.pathname.split('/')[3] != data.idUserRem){
        let notificacion = document.querySelector('.notification')
        if(data.userRemImg != 'https://www.adl-logistica.org/wp-content/uploads/2019/07/imagen-perfil-sin-foto.png'){
            notificacion.firstChild.firstChild.src = `/assets/uploads/${data.userRemImg}`
        }
        notificacion.querySelector('.usuarioR').textContent = data.userRem
        notificacion.querySelector('.message').textContent = data.mensaje
        notificacion.querySelector('.fecha').textContent = data.fecha
        notificacion.style.display = 'block'
        notificacion.style.transform = "translate(0, 0)"
        setTimeout(() => {
            notificacion.style.transform = "translate(0, -100px)"
        }, 6000);
        setTimeout(() => {
            notificacion.style.display = 'none'
        }, 7000);

        notificacion.addEventListener('click', () =>{
            window.location = `/chat/privado/${data.idUserRem}`
        })
    }
})

socket.on('mensajeEnviar', function(data){
    if(data.userRem == window.location.pathname.split('/')[3]){
        fechaMensajes()
        let html = `<div class="my-1 d-flex mensajeChat">
                <div class="bg-secondary p-2 mx-3 mensaje text-left">
                    <div class="text-right">
                        <small class="mb-0">
                            <b>${data.fecha}</b>
                        </small>
                        <div class="btn-group dropup d-inline">
                            <i class="fas fa-angle-up dropdown-toggle dropdown-toggle-split pl-2 pr-0" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <span class="sr-only">Toggle Dropdown</span>
                            </i>
                            <div class="dropdown-menu">
                                <button class="dropdown-item" type="button" id="eliminarMensaje" onclick="eliminarMensajeUnico(this)">
                                    Eliminar Mensaje
                                </button>
                            </div>
                        </div>
                    </div>
                    <b class="mx-2">${data.mensaje}</b>
                </div>
            </div>`

        mensajesChat.insertAdjacentHTML('beforeend', html)

        if(MNL){
            MNL.parentElement.remove()
        }
        
        mensajesVistos()
        iconoBajadaMensajes.style.display = 'block'
    
        let audio = new Audio('/assets/iphone-notificacion.mp3')    
        audio.play()
    }

})

// funciones

// calcular fecha
function fechaMensaje(){
    let fecha = new Date().getTime()
    let fechaCreada = new Date(fecha)
    let horas = fechaCreada.getHours()
    let minutos = ''
    if(String(fechaCreada.getMinutes()).length === 1){
        minutos = '0' + fechaCreada.getMinutes()
    }else{
        minutos = fechaCreada.getMinutes()
    }

    return `${horas}:${minutos}`
}

// Eliminar mensaje único
async function eliminarMensajeUnico(e) {
    let mensajeEliminado = e.parentElement.parentElement.parentElement.parentElement
    mensajeEliminado.remove()

    let data = {
        remitente: JSON.parse(localStorage.getItem('token'))[0],
        destinatario: window.location.pathname.split('/')[3],
        mensaje: mensajeEliminado.lastElementChild.textContent
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
    .catch(err => console.log(err))
}

// detección de mensajes vistos
function mensajesVistos(){
    let Observer = new IntersectionObserver(llamarVuelta)
    Observer.observe(mensajesChat)
    
    async function llamarVuelta(entries, observer){
        if(entries[0].isIntersecting){
            let data = {
                dest: window.location.pathname.split('/')[3]
            }
            await fetch('/chat/mensajesVistos', {
                method: 'POST',
                cache: 'no-cache',
                mode: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(res => res.json())
            .catch(err => console.log(err))
        }
    }
}

// eliminar mensajes sin leer
function eliminarMensajesSinLeer(){
    let mensajesNoLeidos = document.getElementById('mensajesNoLeidos')
    if(mensajesNoLeidos){
        mensajesNoLeidos.parentElement.remove()
    }
}

// poner fecha de los mensajes
function fechaMensajes(){
    let cierto = false
    let fechaActual = new Date()
    if(document.querySelector('#fechaMensajes')){
        cierto = verificarFechaAnterior(fechaActual)
    }else{
        cierto = true
    }

    if(cierto){
        calculoFechaActual(fechaActual)
    }
}

// verificarFechaAnterior
function verificarFechaAnterior(fechaActual){
    let ciertoD = false
    let ciertoM = false
    let ciertoA = false
    let mens = document.querySelectorAll('#fechaMensajes')
    let fechaM = mens[mens.length -1]
    
    let fecha = fechaM.textContent.split(' ')
    let dia = fecha[0]
    let mes = fecha[2]
    let anio = fecha[4]
    
    if(fechaActual.getDate() == dia){
        ciertoD = true
    }

    switch (mes) {
        case 'Enero':
            if(fechaActual.getMonth() == 0){
                ciertoM = true
            }
            break;
        case 'Febrero':
            if(fechaActual.getMonth() == 1){
                ciertoM = true
            }
            break;
        case 'Marzo':
            if(fechaActual.getMonth() == 2){
                ciertoM = true
            }
            break;
        case 'Abril':
            if(fechaActual.getMonth() == 3){
                ciertoM = true
            }
            break;
        case 'Mayo':
            if(fechaActual.getMonth() == 4){
                ciertoM = true
            }
            break;
        case 'Junio':
            if(fechaActual.getMonth() == 5){
                ciertoM = true
            }
            break;
        case 'Julio':
            if(fechaActual.getMonth() == 6){
                ciertoM = true
            }
            break;
        case 'Agosto':
            if(fechaActual.getMonth() == 7){
                ciertoM = true
            }
            break;
        case 'Septiembre':
            if(fechaActual.getMonth() == 8){
                ciertoM = true
            }
            break;
        case 'Octubre':
            if(fechaActual.getMonth() == 9){
                ciertoM = true
            }
            break;
        case 'Noviembre':
            if(fechaActual.getMonth() == 10){
                ciertoM = true
            }
            break;
        case 'Diciembre':
            if(fechaActual.getMonth() == 11){
                ciertoM = true
            }
            break;
        default:
            console.log('Error de mes');
            break;
    }

    if(fechaActual.getFullYear() == anio){
        ciertoA = true
    }
    
    if(!ciertoD || !ciertoM || !ciertoA){
        return true
    }else{
        return false
    }
}

// calculoFechaActual
function calculoFechaActual(fechaActual){
    let div
    switch (fechaActual.getMonth()) {
        case 0:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Enero del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 1:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Febrero del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 2:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Marzo del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 3:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Abril del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 4:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Mayo del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 5:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Junio del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 6:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Julio del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 7:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Agosto del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 8:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Septiembre del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 9:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Octubre del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 10:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Noviembre del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        case 11:
            div = `<div class="text-center mt-1 py-1">
                        <span id="fechaMensajes" class="rounded-pill">${fechaActual.getDate()} de Diciembre del ${fechaActual.getFullYear()}</span>
                    </div>`
            mensajesChat.insertAdjacentHTML('beforeend', div)
            break;
        default:
            console.log('fallo en el registro de la fecha');
            break;
    }
}