const routes = require('express').Router()

// controllers
const { renderChatPrivado, renderHomePage } = require('../controllers/chatController')
const { authentication, authorization } = require('../libs/auth')

routes.get('/allChats', authentication, authorization, renderHomePage)
routes.get('/chat/privado/:id', authentication, authorization, renderChatPrivado)

module.exports = routes