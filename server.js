const mongoose = require('mongoose')
const express = require('express')
const app = express()
const http = require('http').createServer(app)

const Msg = require('./models/messages')

const PORT = process.env.PORT || 3000

// Database connection
mongoose.connect('mongodb://localhost:27017/chatDB' , {useNewUrlParser:true});
const connection = mongoose.connection;
connection.once('open', () => {
    console.log('Database connected...');
});

http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname + '/public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

// Socket 
const io = require('socket.io')(http)

io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
                
        const message = new Msg({msg: msg.message})
        message.save().then(() => {
            socket.broadcast.emit('message', msg)
        })

        
    })

})