socket = io()

// socket.on('connect', () =>{
//     socket.emit('enLinea', 'En línea')
// })
// socket.on('disconnect', () =>{
//     socket.emit('enLinea', '')
// })

socket.on('EnLinea', data =>{
    document.querySelectorAll('#chatUnico').forEach((index)=>{
        let id = this.href.split('/')[3]
        if(data.usuario._id == id){
            document.querySelector('.lineaActivo')[index].style.display = 'block'
        }
    })
})

let mensaje = ''

socket.on('mensaje', data =>{
    mensaje = data
})

document.querySelectorAll('a.bg-light').forEach((elementA) =>{
    if(token === mensaje.remitente){
        if(elementA.href.split('/')[5] === mensaje.destinatario){
            this.children[1].lastElementChild.textContent = mensaje.mensaje
        }
    }
})