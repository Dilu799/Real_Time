const express = require('express');
const http = require('http');
const path = require('path');
const app = express();
const socketio = require('socket.io')
const server = http.createServer(app);
const io = socketio(server);
const formatMessage = require('./utils/messages')
const {userJoin, getCurrentUser, userLeave, getRoomUsers} = require('./utils/users')


const PORT = 3002 || process.env.PORT;

app.use(express.static(path.join(__dirname,'public')))

const botName = 'reaLBot';


io.on('connection', socket =>{

    socket.on('joinroom',({username,room})=>{

        const user = userJoin(socket.id, username, room);

        socket.join(user.room)

        socket.emit('message',formatMessage(botName,'Welcome to realTime'))
    
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`));

        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })
    })


    
    socket.on('chatmsg',(message)=>{
        const user = getCurrentUser(socket.id)
        io.to(user.room).emit('message',formatMessage(user.username,message));
    })
    
    
    socket.on('disconnect',()=>{
        const user = userLeave(socket.id);
        if(user){
            io.to(user.room).emit('message',formatMessage(botName,`${user.username} has left the chat`));
            io.to(user.room).emit('roomUsers',{
                room:user.room,
                users:getRoomUsers(user.room)
            })
        }
    })
})


server.listen(PORT, ()=> console.log(`server running on port ${PORT}`))