let canvas;
let ctx;
let redrawTimerId = -1;

const FPS = 10;
let WIDTH = 720;
let HEIGHT = 720;
const K = 8;
// const RATIO = 16/9;
const W = toInt(WIDTH / K);
const H = toInt(HEIGHT / K);

const
    RED = 0xFF0000,
    GREEN = 0x00FF00,
    BLUE = 0x0000FF,
    YELLOW = 0xFFFF00,
    PURPLE = 0xFF00FF,
    CYAN = 0x00FFFF,
    BLACK = 0x000000,
    WHITE = 0xFFFFFF;

let buffer = new ImageData(WIDTH, HEIGHT);  

let campos;

function init() {
    canvas = document.getElementById('mycanvas');
    // window.onkeydown = function(ev) {
    //     if (redrawTimerId == -1) {
    //         redrawTimerId = setInterval(redraw, 1000 / FPS);
    //     } else {
    //         clearInterval(redrawTimerId);
    //         redrawTimerId = -1;
    //     }
    // }

    // canvas.onmousedown = mouseDown;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    campos = document.getElementById('camera_shower');
    
    ctx = canvas.getContext('2d');
    redrawTimerId = setInterval(redraw, 1000 / FPS);
    fill(BLACK)
}

// let flag = false;
// function mouseDown(ev) {
//     console.log(ev)
//     let x = toInt(ev.offsetX / K), y = toInt(ev.offsetY / K);
//     setXY(x, y, GREEN);
//     if (!flag) {
//         xa = x;
//         ya = y;
//         flag = true;
//         console.log('First cords:', xa, ya);
//         setXY(xa, ya, RED);
//     } else {
//         xb = x;
//         yb = y;
//         console.log('Second cords:', xb, yb);
//         line(xa, ya, xb, yb, BLUE);
//         setXY(xb, yb, YELLOW);
//         setXY(xa, ya, RED);
//         flag = false;
//     }
// }

function setXY(x, y, color) {
    for (let _a = 0; _a < K; _a++) {
        for (let _b = 0; _b < K; _b++) {
            _setXY(x * K + _a, y * K + _b, color);
        }
    }
}

function fill(color) {
    for (let x = 0; x < W; ++x) {
        for (let y = 0; y < H; ++y) {
            setXY(x, y, color)
        }
    }
}

function _setXY(x, y, color) {
    const ind = 4 * (x + y * WIDTH);
    buffer.data[ind] = (color >> 16) & 0xFF;
    buffer.data[ind + 1] = (color >> 8) & 0xFF;
    buffer.data[ind + 2] = (color) & 0xFF;
    buffer.data[ind + 3] = 255;
}

function line(x0, y0, x1, y1, color) {
    x0 = toInt(x0); x1 = toInt(x1); y0 = toInt(y0); y1 = toInt(y1);
    if (x0 == x1) {
        for (let i = min(y0, y1); i < max(y0, y1); i++) {
            setXY(x0, i, color);
        }
        return;
    }
    if (y0 == y1) {
        for (let i = min(x0, x1); i < max(x0, x1); i++) {
            setXY(i, y0, color);
        }
        return;
    }
    // Stolen from GyverGFX
    let sx = toInt((x0 < x1) ? 1 : -1);
    let sy = toInt((y0 < y1) ? 1 : -1);
    let dx = abs(x1 - x0);
    let dy = abs(y1 - y0);
    let err = dx - dy;
    let e2 = 0;
    for (;;) {
        setXY(x0, y0, color);
        if (x0 == x1 && y0 == y1) return;
        e2 = err << 1;
        if (e2 > -dy) {
            err -= dy;
            x0 += sx;
        }
        if (e2 < dx) {
            err += dx;
            y0 += sy;
        }
    }
}


class Point3 {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

// const dist = (p1, p2) => Math.sqrt((p2.x - p1.x) * (p2.x - p1.x) + (p2.y - p1.y) * (p2.y - p1.y) + (p1.z - p2.z) * (p1.z - p2.z));

const point3 = (x, y, z) => new Point3(x, y, z);

let vertexes = [
    vector(0, 0, 0),
    vector(1, 0, 0),
    vector(0, 1, 0),
    vector(1, 1, 0),
    vector(0, 0, 1),
    vector(1, 0, 1),
    vector(0, 1, 1),
    vector(1, 1, 1),
];

let ro = vector(-1, 0.5, -3);

function redraw() {
    vertexes.forEach((p) => {
        // p = p.add(vector(1, 1, 1));
        let v = p.subtract(ro).normalize();
        v = v.multiply(-ro.z / v.z);
        v = ro.add(v);
        let [x, y] = [v.x, v.y];
        console.log(x, y);
        setXY(toInt((W - 1) * x), toInt((H - 1) * y), BLUE);
    });
    clearInterval(redrawTimerId);
    ctx.putImageData(buffer, 0, 0);
}
