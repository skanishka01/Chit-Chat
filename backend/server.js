const express = require("express");//import express
const dotenv=require("dotenv");
// const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes=require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const aiChatRoutes = require('./routes/aiChatRoutes');
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");
const path = require('path')

const app=express();//instance of this express variable
dotenv.config();
connectDB()

app.use(express.json());//to accept json data

// app.get('/',(req,res) => {
//     res.send("API is running successfully  ");
// });

app.use('/api/user',userRoutes)
app.use('/api/chat',chatRoutes)
app.use('/api/message',messageRoutes)
app.use('/api/ai-chat', aiChatRoutes);
 

//deployement

const _dirname1 = path.resolve();
if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname1,"/frontend/build")));

    app.get('*',(req,res)=>{
        res.sendFile(path.resolve(_dirname1,"frontend","build","index.html"));
    })
}else{
    app.get('/',(req,res) => {
        res.send("API is running successfully  ");
    });
}


//


app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 5000
//start our own server
const server = app.listen(5000,console.log(`server started on port ${PORT}`));

const io = require("socket.io")(server,{
    pingTimeout : 60000,
    cors:{
        origin : "http://localhost:3000",
    }
});

io.on("connection" , (socket) =>{
    // console.log("connected to socket.io");

    socket.on("setup", (userData)=>{
        socket.join(userData._id);
        // console.log(userData._id);
        socket.emit("connected");
    })
    socket.on("join chat", (room) =>{
        socket.join(room);
        console.log("User Joined Room " + room);
    })

    socket.on("typing",(room) => socket.in(room).emit("typing"));
    socket.on("stop typing",(room) => socket.in(room).emit("stop typing"));

    socket.on("new message", (newMessageReceived) => {
        var chat = newMessageReceived.chat;

        if(!chat.users) return console.log("chat users not defined");

        chat.users.forEach((user) => {
            if(user._id == newMessageReceived.sender._id)   return;
            
            socket.in(user._id).emit("message received",newMessageReceived);

        });
    });

    socket.off("setup",()=>{
        console.log("USER DISCONNECTED");
        socket.leave(userData._id);
    });
});