const io = require('../index')
const Message = require('../models/messages')
const Usuario = require('../models/Usuarios')
const jwt = require('jsonwebtoken')

io.on('connection', function(socket){
    try {
        socket.on('socketOnline', async function(data){
            let user = jwt.verify(data, process.env.JWTSECRET)
            await Usuario.findOneAndUpdate({correo: user.correo}, { socketId: socket.id })
        })
    
        socket.on('mensaje', async function(data){
            let dest = await Usuario.findById(data.destinatario)
            socket.broadcast.to(dest.socketId).emit('mensajeEnviar', {
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
    
        socket.on('escribiendo', async data =>{
            let user = await Usuario.findById(data.destinatario)
            socket.broadcast.to(user.socketId).emit('escribiendo', data.mensaje)
        })

        socket.on('enLinea', async data =>{
            let user = jwt.verify(data.dataUser, process.env.JWTSECRET)
            await Usuario.findOneAndUpdate({ correo: user.correo }, { linea: true })
        })

        socket.on('noLinea', async data =>{
            let user = jwt.verify(data.dataUser, process.env.JWTSECRET)
            await Usuario.findOneAndUpdate({ correo: user.correo }, { linea: false })
        })
    } catch (error) {
        console.log(error);
    }
})