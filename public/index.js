$(()=>{
    const request_url = 'http://localhost:5147/';
    const socket_url = 'http://localhost:9014';

    const ajax = new AjaxHandler();

    const c = document.getElementById('myCanvas');
    c.width = 800;
    c.height = 800;
    const ctx = c.getContext("2d");

    const socket = io.connect(socket_url);

    const x_vect = [[0, (c.height / 2)], [c.width, (c.height / 2)]];
    const y_vect = [[(c.width / 2), 0], [(c.width / 2), c.height]];

    ctx.fillStyle = "#000";

    var points = [];
    var current_step = 0;
    var config = {
        'window': {},
        'unit': '',
        'step': 0
    }

    socket.on('connect', ()=>{
        console.log('Connected!');
        socket.on('config', (data) => {
            console.log(data);

            config.window = data.window;
            config.unit = data.unit;
            config.step = data.step;

            prep_config();
        });

        socket.emit('test');

        socket.on('point', (data) => {
            console.log(data);

            points.push(data.y);

            if(points.length > 1){
                drawLine();
            }else
                ctx.fillRect(c.height / 2,data.y,1,1);
        })

    });

    function drawLine(){
        var step_width = (c.width / 2) / (config.window.x_max / config.step + 1);
        var step_height = (c.height / 2) / (config.window.y_max / config.step + 1);
        console.log(current_step, points[points.length-2], (current_step + config.step), points[points.length-1], points);
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.moveTo(y_vect[1][0] + step_width * current_step, x_vect[0][1] - step_height * points[points.length-2]);
        current_step += 1;
        ctx.lineTo(y_vect[1][0] + step_width * current_step, x_vect[0][1] - step_height * points[points.length-1]);
        ctx.stroke();
        ctx.closePath();
        ctx.fillRect(y_vect[1][0] + step_width * current_step - 2, x_vect[0][1] - step_height * points[points.length-1],5,5);
    }

    function prep_canvas(){
        ctx.beginPath();
        ctx.moveTo(x_vect[0][0], x_vect[0][1]);
        ctx.lineTo(x_vect[1][0], x_vect[1][1]);
        ctx.moveTo(y_vect[0][0], y_vect[0][1]);
        ctx.lineTo(y_vect[1][0], y_vect[1][1]);
        ctx.strokeStyle = "#000";
        ctx.stroke();
        ctx.closePath();
    }

    function prep_config(){
        ctx.clearRect(0, 0, c.width, c.height); // Clear the canvas before redrawing
        prep_canvas(); // Redraw the axes
        drawXAxisMarks();
        drawYAxisMarks();
    }

    function drawYAxisMarks(){
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";

        const y_min = config.window.y_min;
        const y_max = config.window.y_max;
        const step = config.step;
        
        // Divide the y-axis into two hemispheres
        const positive_range = y_max;
        const negative_range = Math.abs(y_min);
        const center_y = c.height / 2;

        // Calculate step heights
        const positive_step_height = center_y / (positive_range / step + 1);
        const negative_step_height = center_y / (negative_range / step + 1);

        // Draw positive y-axis marks and labels
        for(let i = step; i <= y_max; i += step){
            const y = center_y - (i * positive_step_height / step);
            ctx.moveTo((c.width / 2) - 10, y);
            ctx.lineTo((c.width / 2) + 10, y);
            ctx.stroke();
            ctx.fillText(i, (c.width / 2) - 25, y + 3);
        }

        // Draw negative y-axis marks and labels
        for(let i = -step; i >= y_min; i -= step){
            const y = center_y - (i * negative_step_height / step);
            ctx.moveTo((c.width / 2) - 10, y);
            ctx.lineTo((c.width / 2) + 10, y);
            ctx.stroke();
            ctx.fillText(i, (c.width / 2) - 30, y + 3);
        }

        ctx.closePath();
    }

    function drawXAxisMarks(){
        ctx.beginPath();
        ctx.strokeStyle = "#000";
        ctx.fillStyle = "#000";
        ctx.font = "12px Arial";

        const x_max = config.window.x_max;
        const x_min = config.window.x_min;
        const step = config.step;

        // Divide the x-axis into two hemispheres
        const positive_range = x_max;
        const negative_range = Math.abs(x_min);
        const center_x = c.width / 2;

        // Calculate step widths
        const positive_step_width = center_x / (positive_range / step + 1);
        const negative_step_width = center_x / (negative_range / step + 1);

        // Draw positive x-axis marks and labels
        for(let i = step; i <= x_max; i += step){
            const x = center_x + (i * positive_step_width / step);
            ctx.moveTo(x, (c.height / 2) - 10);
            ctx.lineTo(x, (c.height / 2) + 10);
            ctx.stroke();
            ctx.fillText(i, x - 2, (c.height / 2) + 20);
        }

        // Draw negative x-axis marks and labels
        for(let i = -step; i >= x_min; i -= step){
            const x = center_x + (i * negative_step_width / step);
            ctx.moveTo(x, (c.height / 2) - 10);
            ctx.lineTo(x, (c.height / 2) + 10);
            ctx.stroke();
            ctx.fillText(i, x - 8, (c.height / 2) + 20);
        }

        ctx.closePath();
    }
});
