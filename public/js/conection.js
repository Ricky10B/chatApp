const socket = io()

socket.on('connect', ()=>{
    console.log('online socket general')
    socket.emit('enLinea', { online: 'En Linea', usuario: JSON.parse(localStorage.getItem('token')) })
})

socket.on('disconnect', ()=>{
    console.log('offline socket general')
    socket.emit('enLinea', {online: ''})
})