//<----------------------server/what i see in terminal-------------------------- -->

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);


//connecting code to index.html
app.get('/', function(req,res){
   res.sendFile(__dirname + '/index.html');

});

//on connection pass the function as a single parameter which is socket
//tell me when a user has connected to the server
io.on('connection', function(socket){
    console.log('user connected');
    socket.on('disconnect', function(){
        console.log('user has left');
    });
    socket.on('chat message', function(msg){
        console.log(msg);
        //emit the chat message passed in to allow it to show on client side
        socket.broadcast.emit('chat message', msg);
    });
});


// to cheack for errors 
http.listen(3000, function(){
    console.log("lstening on port 3000");
})