const routes = require('express').Router()

// controllers
const { renderChatPrivado, renderHomePage, mensajesVistos } = require('../controllers/chatController')
const { authentication, authorization } = require('../libs/auth')

routes.get('/allChats', authentication, authorization, renderHomePage)
routes.get('/chat/privado/:id', authentication, authorization, renderChatPrivado)
routes.post('/chat/mensajesVistos', authentication, authorization, mensajesVistos)

module.exports = routes