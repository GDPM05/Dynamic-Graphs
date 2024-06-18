$(()=>{
    const reques_url = 'http://localhost:5147/';
    const socket_url = 'http://localhost:9014';
    const ajax = new AjaxHandler();
    const c = document.getElementById('myCanvas');
    const ctx = c.getContext("2d");
    const socket = io.connect(socket_url);
    var x = 0;

    ctx.moveTo(0,0);
    ctx.lineTo(x, 0);
    ctx.stokeStyle = "#000";

    socket.on('connect', ()=>{
        socket.emit('first_cord', {t: true});
        socket.on('first_cord', (data) => {
            console.log(data);
            newPoint(data.y);
        })
    });

    function newPoint(y){
        x += 10;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

})