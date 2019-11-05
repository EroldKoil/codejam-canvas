class Painter {
    constructor(coef, colorLeft, colorRight, lineWidth ){
        this.coef = coef;
        this.colorLeft = colorLeft;
        this.colorRight = colorRight;
        this.lineWidth = lineWidth;
    }
}

const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

canvas.height = '512';
canvas.width = '512';

const painter = new Painter(4, '#000', '#fff', 1);

changeMatrixSize('4x4');

const colorInputLeft = document.getElementById("colorLeft");
const colorInputRight = document.getElementById("colorRight");
painter.colorLeft = colorInputLeft.value;
painter.colorRight = colorInputRight.value;

colorInputLeft.addEventListener("input", function() {
    painter.colorLeft = colorInputLeft.value;
}, false);
colorInputRight.addEventListener("input", function() {
    painter.colorRight = colorInputRight.value;
}, false);

document.getElementById('matrixSize').addEventListener('change', function () {
    changeMatrixSize(this.value);
});

function changeMatrixSize(value) {
    let matrix;
    if(value === '512x512'){
        matrix = new Image();
        matrix.onload = function() {
            context.drawImage(matrix, 0, 0 , 512 , 512);
            painter.coef = 512;
        };
        matrix.src = "src/512x512.png";
    }
    else{
        matrix = getJson(value);
        drawFromFile(matrix);
    }
}

document.getElementById('lineWidth').addEventListener('change', function () {
    painter.lineWidth = this.value;
});


function drawFromFile(matrix) {
    if(matrix != undefined){
        let colorDraw;
        let getColor;

        if(matrix[0][0].length == 4) {
            getColor = function (i, j) {
                return `rgba(${matrix[i][j][0]}, ${matrix[i][j][1]}, ${matrix[i][j][2]}, ${255 / matrix[i][j][3]})`;
            };
        }else{
            getColor = function (i, j) {
                return `#${matrix[i][j]}`;
            };
        }
        for (let i = 0; i < matrix.length; i++){
            for (let j = 0; j < matrix[i].length; j++){
                let x = i * (512 / painter.coef);
                let y = j * (512 / painter.coef);
                colorDraw = getColor(i, j);
                context.fillStyle = colorDraw;
                context.fillRect(x, y, 512 / painter.coef, 512 / painter.coef);
                context.fill();
            }
        }
    }
}

function getJson(fileName) {
    let matrix;
    let oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", `src/${fileName}.json`, false);
    oReq.send();
    function reqListener() {
        matrix = JSON.parse(this.responseText);
        painter.coef = matrix.length;
    }
    return matrix;
}


canvas.onmousedown = function (event) {
    let color = painter.colorLeft;

    if(event.button == 2){
        color = painter.colorRight;
    }
    let x = event.offsetX;
    let y = event.offsetY;
    context.fillStyle = color;
    context.fill();
    context.fillRect(Math.floor(x / (512 / painter.coef)) * (512 / painter.coef), Math.floor(y / (512 / painter.coef)) * (512 / painter.coef), 512 / painter.coef * painter.lineWidth, 512 / painter.coef * painter.lineWidth);

    canvas.onmousemove = function (event) {
        let x = event.offsetX;
        let y = event.offsetY;
        context.fillStyle = color;
        context.fill();
        context.fillRect(Math.floor(x / (512 / painter.coef)) * (512 / painter.coef), Math.floor(y / (512 / painter.coef))*(512 / painter.coef), 512 / painter.coef * painter.lineWidth, 512 / painter.coef * painter.lineWidth);

    };
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
        return;
    };
};

canvas.onmouseout = function(){
    canvas.onmousemove = null;
};

canvas.oncontextmenu = function (event) {
    event.preventDefault();
};


