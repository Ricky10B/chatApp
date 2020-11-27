const routes = require('express').Router()

// Controllers
const { renderRegister, register } = require('../controllers/registerController')
const { renderLogin, login, logout } = require('../controllers/loginController')
const { authentication, authorization } = require('../libs/auth')

routes.get('/', renderRegister)
routes.post('/RegisterChat', register)
routes.get('/loginPage', renderLogin)
routes.post('/SignInPage', login)
routes.get('/logout', authentication, authorization, logout)

module.exports = routes