const Usuario = require('../models/Usuarios')

exports.renderRegister = (req, res) =>{
    if(req.session.user){
        return res.redirect('/home')
    }else{
        res.render('Register/inicioChat', {
            pagina: 'Register'
        })
    }
}

exports.register = async (req, res) =>{
    try {
        const { nombre, apellido, edad, correo, password } = req.body
        if(!nombre || !apellido || !edad || !correo || !password){
            return res.render('Register/inicioChat', {
                pagina: 'Register',
                nombre, apellido, edad, correo,
                message: 'All fields is required'
            })
        }

        if(password.length < 6){
            return res.render('Register/inicioChat', {
                pagina: 'Register',
                nombre, apellido, edad, correo,
                message: 'The password must be at least 6 characters'
            })
        }

        const userFound = await Usuario.findOne({correo})
        if(userFound) {
            return res.render('Register/inicioChat', {
                pagina: 'Register',
                nombre, apellido, edad, correo,
                message: 'The email already exist'
            })
        }

        let verify = /^[\w!"#%&/'?´*~+={}|.-]{3,}@[\w-]{3,}\.[\w-]+$/.test(correo)
        if(!verify){
            return res.render('Register/inicioChat', {
                pagina: 'Register',
                nombre, apellido, edad, correo,
                message: 'The format email is incorrect'
            })
        }

        await Usuario.create({
            nombre,
            apellido,
            edad,
            correo,
            password
        }).catch(err => {
            console.log(err)
            return res.render('Register/inicioChat', {
                pagina: 'Register',
                nombre, apellido, edad, correo,
                message: 'the user could not be created'
            })
        })

        return res.redirect('/loginPage')
    } catch (error) {
        console.log(error)
        return res.render('Register/inicioChat', {
            pagina: 'Register',
            nombre, apellido, edad, correo,
            message: 'the user could not be created, Unexpected error'
        })
    }

}