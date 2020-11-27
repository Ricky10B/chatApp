const { Schema, model } = require('mongoose')
const bcrypt = require('bcrypt')

const usersSchema = new Schema({
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
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    role: {
        type: String,
        enum: ['Normal', 'Admin'],
        default: 'Normal'
    },
    imagen: {
        type: String,
        default: 'https://www.adl-logistica.org/wp-content/uploads/2019/07/imagen-perfil-sin-foto.png'
    },
    linea: {
        type: Boolean,
        default: false
    }
},{
    timestamps: true
})

usersSchema.pre('save', function(next){
    if(this.isModified('password')){
        try {
            this.password = bcrypt.hashSync(this.password, 10)
            next()
        } catch (error) {
            console.log(error)
            next(error)
        }
    }else{
        next()
    }
})

usersSchema.methods.comparePassword = function(password){
    try {
        return bcrypt.compareSync(password, this.password)
    } catch (error) {
        console.log(error)
    }
}

module.exports = model('User', usersSchema)