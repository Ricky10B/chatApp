const routes = require('express').Router()

// Controllers
const { myAccount, editarData } = require('../controllers/userController')
const { authentication, authorization } = require('../libs/auth')

routes.get('/myAccount', authentication, authorization, myAccount)
routes.put('/edicionData/:id', authentication, authorization, editarData)

module.exports = routes