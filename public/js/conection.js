const socket = io()

document.addEventListener('DOMContentLoaded', () =>{
    let dataUser = JSON.parse(localStorage.getItem('token'))[0]

    socket.on('connect', ()=>{
        socket.emit('enLinea', dataUser)
    })

    socket.on('disconnect', () =>{
        socket.emit('noLinea', dataUser)
    })

    // notificacion de mensaje
    socket.on('notificacion', data =>{
        if(window.location.pathname.split('/')[3] != data.idUserRem){
            let notificacion = document.querySelector('.notification')
            let cerrarNotificacion = document.querySelector('.cerrarNotificacion')
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

            notificacion.addEventListener('click', (e) =>{
                e.stopPropagation()
                window.location = `/chat/privado/${data.idUserRem}`
            })

            cerrarNotificacion.addEventListener('click', () =>{
                document.querySelector('.notification').style.display = 'none'
            })
        }
    })
    
})