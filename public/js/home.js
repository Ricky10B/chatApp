addEventListener('DOMContentLoaded', () =>{
    try {
        // token del remitente
        let token = JSON.parse(localStorage.getItem('token'))[0]
        document.querySelectorAll('#chatUnico').forEach(elementA =>{
            // id del destinatario
            let idD = elementA.href.split('/')[5]

            let data = {
                remitente: token,
                destinatario: idD
            }
    
            socket.emit('messageUser', data)
            socket.on('ultimoMensaje', data =>{
                if(data.idU == idD){
                    if(data.mensaje[0]){
                        elementA.children[1].lastElementChild.textContent = data.mensaje[0].mensaje
                    }
                }
            })

            // mostrar cuantos mensajes nuevos hay 
            socket.emit('mensajesSinLeer', data)
            socket.on('mensajesSinLeer', data =>{
                if(data.rem == idD){
                    elementA.insertAdjacentHTML('beforeend',`
                        <div class="ml-auto my-auto">
                            <div>
                                <span class="text-white">${data.mNoLeidos}</span>
                            </div>
                        </div>
                    `)
                    elementA.lastElementChild.firstElementChild.style.backgroundColor = 'currentColor'
                    elementA.lastElementChild.firstElementChild.style.borderRadius = '100%'
                    elementA.lastElementChild.firstElementChild.style.padding = '1px 7px'
                    elementA.lastElementChild.firstElementChild.firstElementChild.style.fontWeight = '600'
                }
            })
        })
    } catch (error) {
        console.log(error);
    }
})