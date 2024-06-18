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
    
    socket.emit('config', {
      'window': {
        'x_min': -1,
        'x_max': 1,
        'y_min': -1,
        'y_max': 1,
      },
      'unit': 'time (seconds)',
      'step': 0.1,
    });

    socket.on('test', (data)=>{
      var i = 0;
      const e = 2.7182818284590452353602874713526624977572;
      const inte = setInterval(()=>{

        socket.emit('point', {y: (1 / (1 + Math.E**i))});
        i += 0.1;

        if(i >= 1)
          clearInterval(inte);
      }, 500);
    })
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
