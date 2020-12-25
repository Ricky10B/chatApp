const Usuario = require('../models/Usuarios')
const Message = require('../models/messages')

exports.renderHomePage = async (req, res) =>{
    try {
        let usuarios = await Usuario.find()
    
        res.render('inicio', {
            pagina: 'All chats',
            titulo: 'All Chats',
            usuarios
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, message: 'Unexpected Error' })
    }
}

exports.renderChatPrivado = async (req, res) =>{
    try {
        let usuario = await Usuario.findById(req.params.id)
        let mensajes = await Message.find({ $or: [{ remitente: req.session.user.correo, destinatario: req.params.id }, { remitente: usuario.correo, destinatario: req.session.user.user_id } ]})
        let mensajesNoLeidos = await Message.find({ remitente: usuario.correo, destinatario: req.session.user.user_id, visto: false})

        res.render('chats/chatPrivado', {
            pagina: 'Chat',
            usuario,
            mensajes,
            mensajesNoLeidos
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({ ok: false, message: 'Unexpected Error' })
    }
}

exports.mensajesVistos = async (req, res) =>{
    try {
        let { dest } = req.body
        let userR = await Usuario.findById(dest)
        await Message.updateMany({ destinatario: req.session.user.user_id, remitente: userR.correo, visto: false }, { visto: true })
        res.status(200).json({ ok: true, message: 'views messages' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ ok: false, message: 'Unexpected Error' })
    }
}
