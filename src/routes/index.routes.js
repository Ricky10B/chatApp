const routes = require('express').Router()

const loginRegister = require('./loginRegister.routes')
const chatsRoutes = require('./chats.routes')
const messagesRoutes = require('./messages.routes')
const homeRoutes = require('./home.routes')
const user = require('./user.routes')

routes.use(loginRegister)
routes.use(chatsRoutes)
routes.use(messagesRoutes)
routes.use(homeRoutes)
routes.use(user)

module.exports = routes