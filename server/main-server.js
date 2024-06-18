const express = require('express');
const app = express();
const port = 5147;
const path = require('path');

const io = require('socket.io')(9014, {
    cors: {
      origin: "*",
    }
});


app.use(express.static('./public'));

app.listen(port, ()=>{
    console.log('Server running at http://localhost:'+port);
});

io.on('connection', (socket) => {
    console.log('Connected to socket.');
    
    socket.on('first_cord', (data) => {
        console.log(data);
        var i = 0;
        setInterval(()=>{
            socket.emit("first_cord", {y: Math.floor(Math.random()*50)});
            i += 1;
            if(i == 100){
                clearInterval(this);
            }
        }, 500)
        for(var i = 0; i < 100; i++){
            
        }        
    })

    app.get('/first_cord', (req, res) => {
        for(var i = 0; i < 100; i + 10){
            socket.emit("y", {y: i});
        }
    });
})

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/js', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.js'));
});

app.get('/ajaxHandler', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'AjaxHandler.js'));
});

app.get('/getSocket', (req, res) => {
  res.sendFile(path.join(__dirname, 'node_modules\\socket.io\\client-dist\\socket.io.js'));
});
