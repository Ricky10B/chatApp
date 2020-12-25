const Usuario = require('../models/Usuarios')
const bcrypt = require('bcrypt')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

exports.myAccount = async (req, res) =>{
    try {
        const IUser = await Usuario.findById(req.session.user.user_id)
        return res.render('miCuenta', {
            pagina: 'My Account',
            titulo: 'My Account',
            IUser
        })
    } catch (error) {
        console.log(error);
        req.flash('error_msg', 'Unexpected error, try again')
        return res.redirect('/home', 500)
    }
}

exports.editarData = async (req, res) =>{
    try {
        let userId = req.params.id
        const IUser = await Usuario.findById(req.session.user.user_id)
        if(userId != IUser._id){
            return res.json({
                user: false,
                message: 'Unauthorized'
            })
        }else{
            const { name, lastName, age, email, password } = req.body
            if(!name || !lastName || !age || !email){
                return res.json({
                    user: false,
                    message: 'All fields is required'
                })
            }else{
                let nombreU = name == '' ? IUser.nombre : name
                let apellidoU = lastName == '' ? IUser.apellido : lastName
                let edadU = age == '' ? IUser.edad : age
                let correoU = email == '' ? IUser.correo : email
                let passwordU = password == '' ? IUser.password : bcrypt.hashSync(password, 10)

                let newUser = {
                    nombre: nombreU,
                    apellido: apellidoU,
                    edad: edadU,
                    correo: correoU,
                    password: passwordU,
                    imagen: ''
                }

                if(!req.files || Object.keys(req.files).length == 0){
                    newUser.imagen = IUser.imagen
                    let userUpdated = await Usuario.findByIdAndUpdate(userId, newUser)
                    .catch( (err) =>{
                        console.log(err);
                        return res.json({
                            user: false,
                            message: 'Error updating user'
                        })
                    })

                    return res.json({
                        user: userUpdated,
                        message: 'User updated successfully'
                    })
                }else{
                    let imagenPerfilU = req.files
                    if(fs.existsSync(path.join('public', 'assets', 'uploads', IUser.imagen))){
                        fs.unlinkSync(path.join('public', 'assets', 'uploads', IUser.imagen))
                    }

                    img = `${uuidv4()}${path.extname(imagenPerfilU.image.name)}`
                    imagenPerfilU.image.mv(path.join('public', 'assets', 'uploads', img), async function(err){
                        if(err){
                            console.log(err);
                            return res.json({
                                user: false,
                                message: 'Error updating your data'
                            })
                        }
                        newUser.imagen = img
                        let userUpdated = await Usuario.findByIdAndUpdate(userId, newUser, { new: true })
                            .catch( (err) =>{
                                console.log(err);
                                return res.json({
                                    user: false,
                                    message: 'Error updating user'
                                })
                            })

                        res.json({
                            user: userUpdated,
                            message: 'User updated successfully'
                        })
                    })
                }
            }
        }
    } catch (error) {
        console.log(error)
        res.json({
            user: false,
            message: 'Unexpected Error'
        })
    }
}