const routes = require('express').Router()

// controllers
const { deleteMessages, deleteMessage } = require('../controllers/messagesController')
const { authentication, authorization } = require('../libs/auth')

routes.post('/deleteMessages', authentication, authorization, deleteMessages)
routes.post('/deleteMessage', authentication, authorization, deleteMessage)

module.exports = routes