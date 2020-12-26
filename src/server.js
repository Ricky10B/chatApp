const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const routes = require('./routes/index.routes')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const fileUpload = require('express-fileupload')
const morgan = require('morgan')

// initializations
const app = express()
dotenv.config()
require('./database')

// Settings
app.set('port', process.env.PORT || 3000)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('trust proxy', 1)

// middlewares
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(methodOverride('_method'))
app.use(session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
        secure: true,
        maxAge: 60 * 120 * 1000 
    }
}))
app.use(flash())
app.use(morgan('dev'))
app.use(fileUpload())

// seguridad para la app
app.disabled('x-powered-by')

// Global variables
app.use((req, res, next) =>{
    res.locals.error = req.flash('error_msg')
    res.locals.success = req.flash('success_msg')
    res.locals.user = req.session.user
    res.locals.token = req.session.token || null
    res.locals.path = req.path.substring(0, 13)
    next()
})

// routes
app.use('/', routes)

// static files
app.use(express.static('public'))

module.exports = app