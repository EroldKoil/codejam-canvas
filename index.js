var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

canvas.height = '512';
canvas.width = '512';

changeMatrixSize('4x4');

var coef = 4;




document.getElementById('matrixSize').addEventListener('change', function () {
   changeMatrixSize(this.value);
});

function changeMatrixSize(value) {
    let matrix;
    if(value == '512x512'){
        matrix = new Image();
        matrix.onload = function() {
            context.drawImage(matrix, 0, 0 , 512 , 512);
            coef = 512;
        };
        matrix.src = "src/512x512.png";
    }
    else{
        matrix = getJson(value);
        drawFromFile(matrix);
    }
}



function drawFromFile(matrix) {
  if(matrix!=undefined){
      let colorDraw;
      let getColor;
      let i = 0;
      let j = 0;
      if(matrix[0][0].length == 4) {
          getColor = function () {
              return `rgba(${matrix[i][j][0]},${matrix[i][j][1]},${matrix[i][j][2]},${255 / matrix[i][j][3]})`;
          };
      }else{
          getColor = function () {
              return `#${matrix[i][j]}`;
          };
      }
      for (i=0; i<matrix.length; i++){
          for (j=0; j<matrix[i].length; j++){
              let x = i*(512/coef);
              let y = j*(512/coef);
              colorDraw = getColor();
              context.fillStyle = colorDraw;
              context.fillRect(x, y, 512/coef, 512/coef);
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
        coef = matrix.length;
    }
    return matrix;
}


