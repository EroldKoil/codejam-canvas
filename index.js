const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const canvasWork = document.getElementById('canvasWork');
const contextWork = canvasWork.getContext('2d');
canvas.height = '512';
canvas.width = '512';
canvasWork.height = '512';
canvasWork.width = '512';

let matrix = [];
let changes = [];

class Changes{
    constructor(x, y , color){
        this.x = x;
        this.y = y;
        this.color = color;
        changes.push(this);
    }
    drawChange(){
        context
    }
}

class Painter {
    constructor(coef, colorLeft, colorRight, lineWidth) {
        this.coef = coef;
        this.colorLeft = colorLeft;
        this.colorRight = colorRight;
        this.lineWidth = lineWidth;
        this.selectedTool = 'pan';
    }
    changeTool(tool){
        this.selectedTool = tool;
    }
}

let painter = new Painter(4, '#000000', '#ffffff', 1);

changeMatrixSize(document.getElementById('matrixSize').value);




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
    if(value === '512x512'){
        matrix = [];
        let image = new Image();
        image.src = "src/512x512.png";
        image.onload = function() {
            context.drawImage(image, 0, 0 , 512 , 512);
            painter.coef = 512;
            for(let i = 0; i < 512; i++){
                matrix.push([]);
                for(let j = 0; j < 512; j++){
                    let color = [];
                    color = context.getImageData(i, j, 1, 1).data;
                    matrix[i].push ([color[0], color[1], color[2], 255 / color[3]]);
                }
            }
        };
    }
    else{
        matrix = getJson(value);
    }
    drawFromFile(matrix);
}

document.getElementById('lineWidth').addEventListener('change', function () {
    painter.lineWidth = this.value;
});


function drawFromFile() {
    if(matrix != undefined){
        let color = function (i, j) {
            return `rgba(${matrix[i][j][0]}, ${matrix[i][j][1]}, ${matrix[i][j][2]}, ${255 / matrix[i][j][3]})`;
        }
        for (let i = 0; i < matrix.length; i++){
            for (let j = 0; j < matrix[i].length; j++){
                let x = i * (512 / painter.coef);
                let y = j * (512 / painter.coef);
                context.fillStyle = color(i, j);
                context.fillRect(x, y, 512 / painter.coef, 512 / painter.coef);
                context.fill();
            }
        }
    }
}

function getJson(fileName) {
    let oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", `src/${fileName}.json`, false);
    oReq.send();
    function reqListener() {
        matrix = JSON.parse(this.responseText);
        painter.coef = matrix.length;
    }
    if(matrix[0][0].length == 3 || matrix[0][0].length == 6){
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                    let rGB = matrix[i][j].match(/.{2}/g);
                    matrix[i][j] = [parseInt(rGB[0], 16), parseInt(rGB[1], 16), parseInt(rGB[2], 16), 1];
            }
        }
    }
    else{
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                matrix[i][j] = [matrix[i][j][0], matrix[i][j][1], matrix[i][j][2], 255 / matrix[i][j][3]];
            }
        }
    }
    return matrix;
}



canvas.onmouseout = function(){
    canvas.onmousemove = null;
};

canvas.oncontextmenu = function (event) {
    event.preventDefault();
};

canvas.onmousedown = function (event) {
    let color = painter.colorLeft;
    let coef = painter.coef;
    console.log('color=' + color);
    let lineWidth = painter.lineWidth;



    if (event.button == 2) {
        color = painter.colorRight;
    }
    let x = event.offsetX;
    let y = event.offsetY;
    context.fillStyle = color;
    context.fill();

    switch (painter.selectedTool) {
        case 'pan':
            context.fillRect(Math.floor(x / (512 / coef)) * (512 / coef), Math.floor(y / (512 / coef)) * (512 / coef), 512 / coef * lineWidth, 512 / coef * lineWidth);
            canvas.onmousemove = function (event) {
                x = event.offsetX;
                y = event.offsetY;
                context.fillRect(Math.floor(x / (512 / coef)) * (512 / coef), Math.floor(y / (512 / coef)) * (512 / coef), 512 / coef * lineWidth, 512 / coef * lineWidth);
            };
            break;
        case 'line':
            break;
        default: break;
    }


    canvas.onmouseup = function () {
        canvas.onmousemove = null;
        return;
    };
}

function draw(matrix) {
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

