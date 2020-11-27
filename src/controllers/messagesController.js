const Message = require('../models/messages')
const jwt = require('jsonwebtoken')

exports.deleteMessages = async (req, res) =>{
    try {
        const { remitente, destinatario } = req.body
        const decoded = jwt.verify(remitente, process.env.JWTSECRET)
        await Message.deleteMany({ remitente: decoded.correo, destinatario })
    
        res.status(200).json({
            ok: true,
            message: 'Delete Messages'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        })
    }
}

exports.deleteMessage = async (req, res) =>{
    try {
        const { remitente, destinatario, mensaje } = req.body
        const decoded = jwt.verify(remitente, process.env.JWTSECRET)
        await Message.findOneAndRemove({ remitente: decoded.correo, destinatario, mensaje })
    
        res.status(200).json({
            ok: true,
            message: 'Delete Message'
        })
    } catch (error) {
        console.log(error)
        res.status(500).josn({
            ok: false,
            message: 'Unexpected Error'
        })
    }
}

// exports.ultimosMensajes = async (req, res) =>{}