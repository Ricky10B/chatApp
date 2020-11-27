const app = require('./server')

const server = app.listen(app.get('port'), () => console.log(`Server running on port ${app.get('port')}`))

const io = require('socket.io')(server)

module.exports = io
require('./sockets/socket')