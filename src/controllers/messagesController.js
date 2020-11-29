const Message = require('../models/messages')
const jwt = require('jsonwebtoken')

exports.deleteMessages = async (req, res) =>{
    try {

        // logica db para mostrar mensajes
        // remitente && mio deben ser visibleMio
        // ||
        // destinatario && otro deben ser el visibleOtro

        const { remitente, destinatario } = req.body
        const decoded = jwt.verify(remitente, process.env.JWTSECRET)

        await Message.updateMany({ remitente: decoded.correo }, { visibleMio: false })
        await Message.updateMany({ destinatario }, { visibleOtro: false })

        await Message.deleteMany({$and: [{ visibleMio: false}, {visibleOtro: false }]})
    
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
        await Message.findOneAndUpdate({ remitente: decoded.correo, destinatario, mensaje }, { visibleMio: false })

        await Message.findOneAndRemove({ $and: [{ remitente: decoded.correo, destinatario, mensaje, visibleMio: false, visibleOtro: false }]})
    
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