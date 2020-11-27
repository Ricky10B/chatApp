const { Schema, model, Types } = require('mongoose')

const sessionSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    edad: {
        type: Number,
        required: true,
        trim: true
    },
    correo: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        required: true,
        trim: true
    },
    user_id: {
        type: Types.ObjectId,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        required: true,
        expires: 60 * 120,
        default: Date.now()
        // expires: new Date().getTime() + (60 * 120 * 1000)
    }
},{
    timestamps: true
})

module.exports = model('JWT', sessionSchema)