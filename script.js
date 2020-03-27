window.onload = () => {
  //reference canvas
  var canvas = document.getElementById("myCanvas");
  //store rendering context
  var ctx = canvas.getContext("2d");
  
  //watch these...
  canvas.width = document.body.clientWidth;
  //canvas.height = document.body.clientHeight;
  canvas.height = window.innerHeight;
  console.log("canvas.width: " + canvas.width);
  
  ctx.imageSmoothingEnabled = false;
  
  //create starting position and offset variable per frame
  var x = 50;
  var y = canvas.height-30; 
  var ballRadius = 10;
  var ballCol = getRandomColor();
  var dx = 2;
  var dy = -2;
  
  var squX = 100;
  var squY = 100;
  var squW = 50;
  var squH = 50;
  var squDX = -2;
  var squDY = 2;

  function draw(){
    //refresh context
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    drawText("HELlo WorLD", 10, 50, "white", "stroke");
     
    //CIRCLE
    //check top/bottom boundaries
    if(y + dy < ballRadius || y + dy > canvas.height - ballRadius){
      dy = calcNewDir(dy);
      ballCol = getRandomColor();
    }
    //check left/right boundaries
    if(x + dx < ballRadius || x + dx > canvas.width - ballRadius){
      dx = calcNewDir(dx);
      ballCol = getRandomColor();
    }
    //update position
    x += dx;
    y += dy;
    drawCirc(x, y, ballRadius, ballCol);
    
    //SQUARE
    //check top/bottom boundaries
    if(squY + squDY < 0 || squY + squDY > canvas.height - squH){
      squDY = calcNewDir(squDY);
    }
    //check left/right boundaries
    if(squX + squDX < 0 || squX + squDX > canvas.width - squW){
      squDX = calcNewDir(squDX);
    }
    squX += squDX;
    squY += squDY;
    
    drawRect(squX, squY, squW, squH, "red", "fill");
    
    
  }
  setInterval(draw, 10);
  
  function drawCirc(xPos, yPos, r, color){
    ctx.beginPath();
    ctx.arc(xPos, yPos, r, 0, Math.PI*2, false);
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.closePath();
  }
  function drawRect(xPos, yPos, w, h, color, type){
    ctx.beginPath();
    ctx.rect(xPos, yPos, w, h);
    switch(type){
      case "stroke":
        ctx.strokeStyle = color;
        ctx.stroke();
        break;
      case "fill":
        ctx.fillStyle = color;
        ctx.strokeStyle = "black";
        ctx.fill();
        ctx.stroke();
        break;
      default:
        console.log("Unknown type.");
        break;
    }
    ctx.closePath();
  }
  function drawText(text, w, h, color, type){
    ctx.font = "30px Arial";
    switch(type){
      case "stroke":
        ctx.strokeStyle = color;
        ctx.strokeText(text, w, h);
        break;
      case "fill":
        ctx.fillStyle = color;
        ctx.fillText(text, w, h);
        break;
      default:
        console.log("Unknown type.");
        break;
    }
  }  
  
  function calcNewDir(dir){
    if(dir < 0){
      return (Math.floor(Math.random() * 2) + 1);
    } else {
      return -(Math.floor(Math.random() * 2) + 1);
    }
  }
  
  function getRandomColor(){
    var letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++){
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
}
