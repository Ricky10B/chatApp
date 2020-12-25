const Usuario = require('../models/Usuarios')
const Session = require('../models/session')
const { crearToken } = require('../jwt/jwt')

exports.renderLogin = (req, res) =>{
    if(req.session.user){
        return res.redirect('/home')
    }else{
        res.render('Login/inicioChat', {
            pagina: 'Login'
        })
    }
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

        const userFound = await Usuario.findOne({correo}).catch(err => {
            console.log(err)
            return res.render('Login/inicioChat', {
                pagina: 'Login',
                correo,
                message: 'Username does not exist'
            })
        })
    
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
            .then((token) =>{
                Usuario.findOneAndUpdate({correo: userFound.correo}, { linea: true }, { new: true })
                    .then(() =>{
                        req.session.user = {
                            nombre: userFound.nombre,
                            apellido: userFound.apellido,
                            correo,
                            user_id: userFound._id
                        }
                        req.session.token = token
                        return res.redirect('/home')
                    })
                    .catch(err => {
                        console.log(err)
                        return res.redirect('/loginPage')
                    })
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
        res.redirect('/loginPage')
    } catch (error) {
        console.log(error)
        res.render('Login/inicioChat', {
            pagina: 'Login'
        })
    }
}