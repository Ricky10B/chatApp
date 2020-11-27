const { Schema, model } = require('mongoose')

const messagesSchema = new Schema({
    remitente: {
        type: String,
        required: true,
        trim: true,
    },
    destinatario: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        trim: true,
    },
    fecha: {
        type: String,
        required: true,
        trim: true,
    },
    mensaje: {
        type: String,
        required: true,
        trim: true,
    }
},{
    timestamps: true
})

module.exports = model(`Message`, messagesSchema)