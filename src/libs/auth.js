const { verifyToken } = require('../jwt/jwt')

exports.authentication = (req, res, next) =>{
    if(!req.session || !req.session.user){
        req.flash('error_msg', 'you must login to perform this action')
        return res.redirect('/loginPage')
    }
        
    next()
}

exports.authorization = (req, res, next) =>{
    const token = req.session.token

    verifyToken(token)
        .then(decoded =>{
            next()
        })
        .catch(err =>{
            req.flash('error_msg', err + 'you must login to perform this action')
            return res.redirect('/loginPage')
        })
}