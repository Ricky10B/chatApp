const mongoose = require('mongoose')

mongoose.connect(process.env.MONGOURI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
}).then(db => console.log('Connected to DB'))
    .catch(err => console.error('Error to connected to DB', err))