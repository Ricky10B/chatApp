const Usuario = require('../models/Usuarios')
const Message = require('../models/messages')

exports.renderHomePage = async (req, res) =>{
    let usuarios = await Usuario.find()
    let mensaje = await Message.find({ remitente: req.session.user.correo, destinatario: req.session.user.user_id }, { _id: 0, mensaje: 1, remitente: 1, destinatario: 1 })

    // if(mensaje.destinatario){}

    // let ultimosMensajes = []

    res.render('inicio', {
        pagina: 'All chats',
        titulo: 'All Chats',
        usuarios,
        mensaje
    })
}

exports.renderChatPrivado = async (req, res) =>{
    let usuario = await Usuario.findById(req.params.id)
    let mensajes = await Message.find({ $or: [{remitente: req.session.user.correo }, { destinatario: req.session.user.user_id }]})

    res.render('chats/chatPrivado', {
        pagina: 'Chat',
        usuario,
        mensajes
    })
}
