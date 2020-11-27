const io = require('../index')
const Message = require('../models/messages')
// const JWT = require('../models/session')
const jwt = require('jsonwebtoken')

io.on('connection', async socket =>{
    console.log('socket online')

    socket.on('mensaje', async (data) =>{
        socket.join(data.sala)
        socket.broadcast.emit('mensajeEnviar', {
            mensaje: data.mensaje,
            fecha: data.fecha
        })

        let dataUser = jwt.verify(data.remitente, process.env.JWTSECRET)

        let mensajeDB = {
            remitente: dataUser.correo,
            destinatario: data.destinatario,
            fecha: data.fecha,
            mensaje: data.mensaje
        }

        await Message.create(mensajeDB).catch(err => console.log('Error al guardar el mensaje', err))
    })

    socket.on('escribiendo', mensaje =>{
        socket.broadcast.emit('escribiendo', mensaje)
    })
})