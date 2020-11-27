const routes = require('express').Router()

// controllers
const { renderHome, likeDislike } = require('../controllers/homeController')
const { authentication, authorization } = require('../libs/auth')

routes.get('/home', authentication, authorization, renderHome)
routes.post('/like', authentication, authorization, likeDislike)

module.exports = routes