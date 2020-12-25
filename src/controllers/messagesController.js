const Message = require('../models/messages')
const Usuario = require('../models/Usuarios')
const jwt = require('jsonwebtoken')

exports.deleteMessages = async (req, res) =>{
    try {
        const { remitente, destinatario } = req.body
        const decoded = jwt.verify(remitente, process.env.JWTSECRET)

        await Message.updateMany({ remitente: decoded.correo, destinatario }, { visibleMio: false })
        let userDest = await Usuario.findById(destinatario)
        await Message.updateMany({ remitente: userDest.correo, destinatario: req.session.user.user_id }, { visibleOtro: false })

        await Message.deleteMany({$and: [{ visibleMio: false}, {visibleOtro: false }]})
    
        return res.status(200).json({
            ok: true,
            message: 'Delete Messages'
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
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

        let userDest = await Usuario.findById(destinatario)

        await Message.findOneAndUpdate({ remitente: userDest.correo, destinatario: req.session.user.user_id, mensaje }, { visibleOtro: false })

        await Message.updateMany({ $and: [{ remitente: decoded.correo, destinatario, mensaje, visibleMio: false, visibleOtro: false }]})
    
        res.status(200).json({
            ok: true,
            message: 'Delete Message'
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'Unexpected Error'
        })
    }
}