const { Types } = require('mongoose')
const jwt = require('jsonwebtoken')
const Session = require('../models/session')

exports.crearToken = (payload) =>{
    return new Promise( async (resolve, reject) =>{
        try {
            if(!payload) return reject('Unauthorized')
    
            if(![payload._id].every(Types.ObjectId)) return reject('Unauthorized')
    
            const token = jwt.sign({ nombre: payload.nombre, apellido: payload.apellido, edad: payload.edad, correo: payload.correo, role: payload.role }, process.env.JWTSECRET, { expiresIn: 60 * 120 })
    
            await Session.create({
                nombre: payload.nombre,
                apellido: payload.apellido,
                edad: payload.edad,
                correo: payload.correo,
                role: payload.role,
                user_id: payload.user_id
            }).catch(err => {
                console.log(err)
                return reject('Unexpected Error')
            })
    
            return resolve(token)
        } catch (error) {
            console.log(error)
            return reject('Unexpected Error')
        }
    })
}

exports.verifyToken = (token) =>{
    return new Promise((resolve, reject) =>{
        try {
            if(!token) return reject('Unauthorized')
    
            const decoded = jwt.verify(token, process.env.JWTSECRET)
    
            Session.findOne({
                correo: decoded.correo
            }).then(session =>{
                if(!session){
                    return reject('Unauthorized')
                }else{
                    return resolve(decoded)
                }
            })
            .catch(err =>{
                console.log(err)
                return reject('Unauthorized')
            })

        } catch (error) {
            console.log(error)
            return reject('Unexpected error')
        }
    })
}