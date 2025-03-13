let canvas;
let ctx;
let redrawTimerId = -1;

const FPS = 10;
let WIDTH = 640;
let HEIGHT = 640;
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
    window.onkeydown = keyHandler;

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
const shift = 0.5;
function keyHandler(ev) {
    if (ev.key == "ArrowUp") {
        ro.z += shift;
    } else if (ev.key == "ArrowDown") {
        ro.z -= shift;
    } else if (ev.key == "ArrowRight") {
        ro.x += shift;
    } else if (ev.key == "ArrowLeft") {
        ro.x -= shift;
    } else if (ev.key == "w") {
        ro.y += shift;
    } else if (ev.key == "s") {
        ro.y -= shift;
    }
    console.log(ro);
    redraw();
}

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
    if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) {
        return;
    }
    const ind = 4 * (x + y * WIDTH);
    buffer.data[ind] = (color >> 16) & 0xFF;
    buffer.data[ind + 1] = (color >> 8) & 0xFF;
    buffer.data[ind + 2] = (color) & 0xFF;
    buffer.data[ind + 3] = 255;
}

function pline(p1, p2, color) {
    // setXY(p1.x, p1.y, BLUE);
    // setXY(p2.x, p2.y, BLUE);
    line(p1.x, p1.y, p2.x, p2.y, color);
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
    vector(0, 1, 0),
    vector(1, 1, 0),
    vector(1, 0, 0),
    vector(0, 0, 1),
    vector(0, 1, 1),
    vector(1, 1, 1),
    vector(1, 0, 1),
];

let ro = vector(-1, 0.5, -3);

function redraw() {
    fill(BLACK);

    let cube = [];
    
    vertexes.forEach((p) => {
        p.add(vector(0.5, 0.5, 1));
        let v = p.subtract(ro).normalize();
        v = v.multiply(-ro.z / v.z);
        v = ro.add(v);
        // if (v.x < 0 || v.x > 1 || v.y < 0 || v.y > 1) {
            // return;
        // }
        cube.push({x: toInt(v.x * (W-1)), y: toInt(v.y * (H - 1))});    
    });

    pline(cube[0], cube[1], BLUE);
    pline(cube[1], cube[2], BLUE);
    pline(cube[2], cube[3], BLUE);
    pline(cube[3], cube[0], BLUE);

    pline(cube[4], cube[5], BLUE);
    pline(cube[5], cube[6], BLUE);
    pline(cube[6], cube[7], BLUE);
    pline(cube[7], cube[4], BLUE);

    pline(cube[0], cube[4], BLUE);
    pline(cube[1], cube[5], BLUE);
    pline(cube[2], cube[6], BLUE);
    pline(cube[3], cube[7], BLUE);

    // clearInterval(redrawTimerId);
    ctx.putImageData(buffer, 0, 0);
}
