const express = require('express');
const http = require('http');
const path = require('path');
const formatMessage = require('./messages.js')
const connectDB = require('./Database/db.js')

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
      origins:['https://localhost:4200/chat']
    }
});

connectDB();

app.use('/chat',require('./routes/chat.js'))

let Users = []

messages = {
    "General": [],
    "WeeklyEvents": [],
    "1-on-1": [],
    "Just for Fun": []
}

//When Client connects
io.on('connection', socket =>{
    console.log("User connectd")
    //Welcome current user
    socket.emit('message', formatMessage("ChatBot",'Welcome to ChatCord'));

    //Brodcast when a user connects
    socket.on('room',(obj) =>{
        const room = obj[0]
        const username = obj[1]

        console.log(io.sockets.adapter.rooms)
        if(io.sockets.adapter.rooms.get(room) && (io.sockets.adapter.rooms.get(room).size) > 1 ){
            socket.emit("message","Full")
        }

        socket.join(room);

        if(messages[room]){
            for(i = 0; i < messages[room].length; i++){
                socket.emit("message", messages[room][i]);
            }
        }

        io.to(room).emit("message",
        formatMessage(username,username + " joined room"));
        const user = {
            username: username,
            id: socket.id
        }
        Users.push(user);
        io.to(room).emit("users",Users);  

        
        
    })

    //Recieving a message
    socket.on('message',(Obj)=>{

        formated_output = formatMessage(Obj.user,Obj.message)

        io.to(Obj.room).emit("message",formated_output);
        if(messages[Obj.room]){
            messages[Obj.room].push(formated_output)
        }
        
        
    })

    //Private message
    // socket.on('private message',(toId,cb)=>{
    //     message_toSend = []
    //     console.log(private_message)
    //     console.log(socket.id)
    //     console.log(toId)
    //     for(i = 0; i < private_message.length;i++){
    //         if(toId == private_message[i][1] && socket.id == private_message[i][0]){
    //             message_toSend.push(private_message[i][2])
    //         }
    //     }
    //     console.log(message_toSend)
    //     //socket.join(socket.id);
    //     socket.emit('private message', message_toSend);
    // })

    socket.on('before disconnect',(room)=>{
        if(io.sockets.adapter.rooms.get(room) && (io.sockets.adapter.rooms.get(room).size - 1) === 0){
            if(messages[room]){
                messages[room] = []
            }
        }
    })

    //Runs when client disconnects
    socket.on('disconnect',()=>{
        console.log('user disconnected')
        let name = ""
        const user = Users.find(u => {
            if(u.id == socket.id){
                name = u.username
            };
        })
        Users = Users.filter(u => u.id !== socket.id);
        io.emit("users",Users);
        io.emit('message',formatMessage(name,"User has left the chat"));
    })
})


const PORT = 5000 || process.env.PORT;

server.listen(PORT, () => console.log(`server running on port ${PORT}`));