const routes = require('express').Router()

// controllers
const { deleteMessages, deleteMessage } = require('../controllers/messagesController')

routes.post('/deleteMessages', deleteMessages)
routes.post('/deleteMessage', deleteMessage)
// routes.post('/ultimoMensaje', ultimosMensajes)

module.exports = routes