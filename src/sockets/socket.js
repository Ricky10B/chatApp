const io = require('../index')
const Message = require('../models/messages')
const Usuario = require('../models/Usuarios')
const jwt = require('jsonwebtoken')

io.on('connect', async function(socket){
    try {
        // Detección de entrada y salida del usuario
        socket.on('enLinea', async data =>{
            let decoded = jwt.decode(data)
            if(decoded){
                let user = await Usuario.findOneAndUpdate({ correo: decoded.correo }, { linea: true, socketId: socket.id }, { new: true }).catch(err => console.log(err))
                socket.broadcast.emit('linea', {mensaje: 'en linea', user: user._id})
            }
        })

        socket.on('linea', async mensaje =>{
            let decoded = jwt.decode(mensaje.user)
            if(decoded){
                let user = await Usuario.findOneAndUpdate({ correo: decoded.correo }, { linea: true }, { new: true }).catch(err => console.log(err))
                socket.broadcast.emit('linea', {mensaje: mensaje.mensaje, user: user._id})
            }
        })

        socket.on('noLinea', async data =>{
            let decoded = jwt.decode(data)
            if(decoded){
                let user = await Usuario.findOneAndUpdate({ correo: decoded.correo }, { linea: false }, { new: true }).catch(err => console.log(err))
                socket.broadcast.emit('noLinea', { mensaje: '', user: user._id })
            }
        })

        socket.on('disconnect', async () =>{
            let user = await Usuario.findOneAndUpdate({ socketId: socket.id }, { linea: false }, { new: true }).catch(err => console.log(err))
            if(user){
                socket.broadcast.emit('noLinea', { mensaje: '', user: user._id })
            }
        })

        // Detección de escritura del usuario
        socket.on('escribiendo', async data =>{
            let user = await Usuario.findById(data.destinatario).catch(err => console.log(err))
            socket.broadcast.to(user.socketId).emit('escribiendo', data.mensaje)
        })

        // Guardado de id del socket del usuario en la BD
        socket.on('socketOnline', async (data) =>{
            let decoded = jwt.decode(data)
            await Usuario.findOneAndUpdate({correo: decoded.correo}, { socketId: socket.id, linea: true }).catch(err => console.log(err))
        })

        /*
        * MENSAJES
        */

        // Actualizar mensajes a vistos
        socket.on('mensajesVistos', async (data) =>{
            let decoded = jwt.decode(data.rem)
            let userD = await Usuario.findOne({ correo: decoded.correo }).catch(err => console.log(err))
            let userR = await Usuario.findById(data.dest).catch(err => console.log(err))
            await Message.updateMany({ remitente: userR.correo, destinatario: userD._id, visto: false }, { visto: true }).catch(err => console.log(err))
        })
    
        // Enviar mensaje
        socket.on('mensaje', async function(data){
            let dest = await Usuario.findById(data.destinatario).catch(err => console.log(err))
            let decoded = jwt.decode(data.remitente)
            let userRem = await Usuario.findOne({correo: decoded.correo}).catch(err => console.log(err))
            socket.broadcast.to(dest.socketId).emit('mensajeEnviar', {
                mensaje: data.mensaje,
                fecha: data.fecha,
                userRem: userRem._id
            })

            socket.broadcast.to(dest.socketId).emit('notificacion', {
                mensaje: data.mensaje,
                fecha: data.fecha,
                userRem: `${userRem.nombre} ${userRem.apellido}`,
                idUserRem: userRem._id,
                userRemImg: userRem.imagen
            })
    
            let mensajeDB = {
                remitente: decoded.correo,
                destinatario: data.destinatario,
                fecha: data.fecha,
                mensaje: data.mensaje
            }
    
            await Message.create(mensajeDB).catch(err => console.log('Error al guardar el mensaje', err))
        })
    
        // Revisión de los mensajes sin leer
        socket.on('mensajesSinLeer', async data =>{
            let decoded = jwt.decode(data.remitente)
            let userD = await Usuario.findOne({ correo: decoded.correo })
            let userR = await Usuario.findById(data.destinatario)
            let mNoLeidos = await Message.find({ destinatario: userD._id, remitente: userR.correo, visto: false }).countDocuments()
            if(mNoLeidos > 0){
                let datos = {
                    mNoLeidos,
                    rem: data.destinatario
                }
                socket.emit('mensajesSinLeer', datos)
            }
        })

        // Tomar el último mensaje enviado a un usuario en específico
        socket.on('messageUser', async data =>{
            let decoded = jwt.decode(data.remitente)
            let userD = await Usuario.findOne({ correo: decoded.correo }).catch(err => console.log(err))
            let userR = await Usuario.findById(data.destinatario).catch(err => console.log(err))
            let mensaje = await Message.find({ $or: [{ remitente: decoded.correo, destinatario: data.destinatario }, { remitente: userR.correo, destinatario: userD._id }], visibleMio: true, visibleOtro: true }).sort({ createdAt: -1 }).limit(1).catch(err => console.log(err))
            socket.emit('ultimoMensaje', {mensaje, idU: userR._id})
        })
    } catch (error) {
        console.log(error);
    }
})