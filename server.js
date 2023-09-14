const express = require('express');
const http = require('http');
const path = require('path');
const formatMessage = require('./messages.js')
const connectDB = require('./Database/db.js')

const app = express();
const server = http.createServer(app);

const io = require('socket.io')(server, {
    cors: {
       //origins:['https://dorm-chat-b3557aeb4f98.herokuapp.com/chat']
      origins:['https://localhost:4200/chat']
    }
});

connectDB();

app.use('/chat',require('./routes/chat.js'))

app.use(express.static(__dirname + '/dist/chat-app'));
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/chat-app/index.html'));
});

let Users = []

messages = {
    "General": [],
    "WeeklyEvents": [],
    "1-on-1": [],
    "Just for Fun": []
}

curr_room = "";


//When Client connects
io.on('connection', (socket) =>{
    console.log("User connectd")
    //Welcome current user
    socket.emit('message', formatMessage("ChatBot",'Welcome to ChatCord'));

    //Brodcast when a user connects
    socket.on('room',async (obj) =>{
        const room = obj[0]
        const username = obj[1]

        
        // if(io.sockets.adapter.rooms.get(room) ){
        //     if((io.sockets.adapter.rooms.get(room).size) === 2){
        //         console.log("hiii")
        //     }
            
        // }

        if(room === "1-on-1" && io.sockets.adapter.rooms.get(room) && (io.sockets.adapter.rooms.get(room).size) > 1 ){
            socket.emit("message","Full")
        }
        else{

            socket.join(room);
            curr_room = room

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

        }

        

        
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
        if(curr_room !== "1-on-1"){
            io.emit('message',formatMessage(name,"User has left the chat"));
        }
       
        
    })

})


const PORT = process.env.PORT || 5000;

server.listen(PORT,"0.0.0.0",() => console.log(`server running on port ${PORT}`));