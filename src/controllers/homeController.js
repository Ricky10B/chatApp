const Like = require('../models/like')
const Usuario = require('../models/Usuarios')
const jwt = require('jsonwebtoken')

exports.renderHome = async (req, res) =>{
    try {
        let likes = await Like.find({ like: true }).countDocuments()
        let likesUsers = await Like.find()
    
        res.render('home', {
            pagina: 'Home',
            titulo: 'Home Page',
            user: req.session.user,
            likes,
            likesUsers
        })
    } catch (error) {
        console.error(error);
        req.flash('Unexpected Error')
        res.redirect('/loginPage')
    }
}

exports.likeDislike = async (req, res) =>{
    try {
        let token = req.body.token
        let decoded = jwt.verify(token, process.env.JWTSECRET)
        let userFound = await Usuario.findOne({ correo: decoded.correo })
        let like = await Like.findOne({ usuarioLike: userFound._id })
        if(!like){
            await Like.create({
                like: true,
                usuarioLike: userFound._id
            })
            let count = await Like.find({ like: 'true' }).countDocuments()
            res.json({
                ok: true,
                message: count
            })
        }else{
            like.like = !like.like
            await like.save()
            let count = await Like.find({ like: 'true' }).countDocuments()
            res.json({
                ok: true,
                message: count
            })
        }
    } catch (error) {
        console.error(error);
        res.json({
            ok: false,
            message: 'Unexpected error'
        })
    }
}