const Usuario = require('../models/Usuarios')
const Session = require('../models/session')
const { crearToken } = require('../jwt/jwt')

exports.renderLogin = (req, res) =>{
    if(req.session.user){
        return res.redirect('/home')
    }
    res.render('Login/inicioChat', {
        pagina: 'Login'
    })
}

exports.login = async (req, res) =>{
    try {
        const { correo, password } = req.body
    
        if(!correo || !password){
            return res.render('Login/inicioChat', {
                pagina: 'Login',
                correo,
                message: 'All fields is required'
            })
        }

        const userFound = await Usuario.findOne({correo})
    
        if(!userFound){
            return res.render('Login/inicioChat', {
                pagina: 'Login',
                correo,
                message: 'Username does not exist'
            })
        }

        const match = userFound.comparePassword(password)

        if(!match){
            return res.render('Login/inicioChat', {
                pagina: 'Login',
                correo,
                message: 'password is incorrect'
            })
        }

        const payload = {
            nombre: userFound.nombre,
            apellido: userFound.apellido,
            edad: userFound.edad,
            correo: userFound.correo,
            role: userFound.role,
            user_id: userFound._id
        }
        
        crearToken(payload)
            .then( async (token) =>{
                userFound.linea = true
                await userFound.save()
                req.session.user = {
                    nombre: userFound.nombre,
                    apellido: userFound.apellido,
                    correo,
                    user_id: userFound._id
                }
                req.session.token = token
                res.redirect('/home')
            })
            .catch(err =>{
                return res.render('Login/inicioChat', {
                    pagina: 'Login',
                    correo,
                    message: err
                })
            })
    
    } catch (error) {
        console.log(error)
        return res.render('Login/inicioChat', {
            pagina: 'Login',
            correo,
            message: 'Unexpected error, try again later'
        })
    }
}

exports.logout = async (req, res) =>{
    try {
        if(req.session.user){
            await Session.findOneAndRemove({ correo: req.session.user.correo })
        }
        await Usuario.findOneAndUpdate({ correo: req.session.user.correo }, { linea: false })
        req.session.destroy()
    } catch (error) {
        console.log(error)
        res.render('Login/inicioChat', {
            pagina: 'Login'
        })
    }
}