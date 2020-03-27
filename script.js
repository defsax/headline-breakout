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
  
  var ball = {
    x : 50,
    y : canvas.height-30,
    r : 10,
    v1 : 10, v2 : 10,
    dx : 2,
    dy : -2,
    col : getRandomColor(),
    getObject : function(){
      return "ball";
    }
  };
  
  var square = {
    x : 100,
    y : 100,
    w : 50,
    h : 50,
    v1 : 0, v2 : 50,
    dx : -2,
    dy : 2,
    getObject : function(){
      return "square";
    }
  };

  function draw(){
    //refresh context
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    drawText("HELlo WorLD", 10, 50, "white", "stroke");
     
    checkBoundaries(ball);
    drawCirc(ball, ball.col, "fill");
    
    checkBoundaries(square);    
    drawRect(square, "red", "fill");
  }
  setInterval(draw, 10);
  
  function drawCirc(obj, color, type){
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, obj.r, 0, Math.PI*2, false);
    switch(type){
      case "stroke":
        ctx.strokeStyle = color;
        ctx.stroke();
        break;
      case "fill":
        ctx.fillStyle = color;
        ctx.fill();
        break;
      default:
        break;
    }
    ctx.closePath();
  }
  function drawRect(obj, color, type){
    ctx.beginPath();
    ctx.rect(obj.x, obj.y, obj.w, obj.h);
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
  
  function checkBoundaries(obj){
    //check top/bottom boundaries
    if(obj.y + obj.dy < obj.v1 || obj.y + obj.dy > canvas.height - obj.v2){
      obj.dy = calcNewDir(obj.dy);
      if(obj.getObject() === "ball")
        obj.col = getRandomColor();
    }
    //check left/right boundaries
    if(obj.x + obj.dx < obj.v1 || obj.x + obj.dx > canvas.width - obj.v2){
      obj.dx = calcNewDir(obj.dx);
      if(obj.getObject() === "ball")
        obj.col = getRandomColor();
    }
    
    //update position
    obj.x += obj.dx;
    obj.y += obj.dy;
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
