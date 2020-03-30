window.onload = () => {
  //reference canvas
  var canvas = document.getElementById("myCanvas");
  //store rendering context
  var ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  
  //input vars
  var rightPressed = false;
  var leftPressed = false;
  
  //timing vars
  var deltaTime = 0.0;
  var lastFrame = 0.0;
  var intervalSpeed = 10;
  
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  
  //watch these...
  canvas.width = document.body.clientWidth;
  //canvas.height = document.body.clientHeight;
  canvas.height = window.innerHeight;
  console.log("canvas.width: " + canvas.width);
  
  var ball = {
    x : 50,
    y : canvas.height-30,
    r : 10,
    dx : 0.1,
    dy : -0.1,
    speed : 0.3,
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
    dx : -0.1,
    dy : 0.1,
    getObject : function(){
      return "square";
    }
  };
  
  var paddle = {
    w : 75, 
    h : 10,
    x : (canvas.width-75) / 2,
    y : canvas.height - (10 * 3)
  };

  function refresh(){
    //var currFrame = new Date();
    //deltaTime = currFrame - lastFrame;
    //lastFrame = currFrame;
    
    //refresh context
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawText(ball.x.toString(), 10, 25, "black", "fill");
    drawText(ball.y.toString(), 10, 50, "black", "fill");
    
    checkBoundaries(ball, intervalSpeed);
    ball.col = getRandomColor();
    drawCirc(ball, ball.col, "fill");
    //checkBoundaries(square, deltaTime);    
    //drawRect(square, "red", "fill");
    
    paddleInput(intervalSpeed);
    drawPaddle(paddle);

    //document.getElementById("title").innerHTML = "deltaTime: " + deltaTime;
    //console.log(currTime.getTime());
    
  }
  var interval = setInterval(refresh, intervalSpeed);
  
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
  function drawPaddle(obj){
    ctx.beginPath();
    ctx.rect(obj.x, obj.y, obj.w, obj.h);
    ctx.fillStyle = "black";
    ctx.strokeStyle = "white";
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }
  
  function paddleInput(dt){
    if(rightPressed){
      paddle.x += 0.7 * dt;
      if(paddle.x + paddle.w > canvas.width)
        paddle.x = canvas.width - paddle.w;
    }
    else if(leftPressed){
      paddle.x -= 0.7 * dt;
      if(paddle.x < 0)
        paddle.x = 0;
    }
  }
  
  function checkBoundaries(obj, dt){
    //check top/bottom boundaries
    if(obj.y + obj.dy < obj.r){
      obj.dy = -obj.dy;
      
      if(obj.getObject() === "ball")
        obj.col = getRandomColor();
    } 
    else if(obj.y + obj.dy > canvas.height - obj.r){
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval); //needed for chrome
    }
    //check left/right boundaries
    if(obj.x + obj.dx < obj.r || obj.x + obj.dx > canvas.width - obj.r){
      obj.dx = -obj.dx;
      if(obj.getObject() === "ball")
        obj.col = getRandomColor();
    }

    if(AABBcollision(obj, paddle)){
      calculateNewAngle(obj);
      obj.col = getRandomColor();
    }
    
    //update position
    obj.x += obj.dx * dt * obj.speed;
    obj.y += obj.dy * dt * obj.speed;
  }
  
  function calculateNewAngle(obj){

    var paddleCenter = paddle.x + (paddle.w / 2);
    var centerDist = (paddle.x + (paddle.w / 2)) - (obj.x);
  
    var normalizeIntersect = centerDist / (paddle.w / 2);
    var newBounceAngle = normalizeIntersect * (5*Math.PI/12);
    
    obj.dx = Math.sin(newBounceAngle);
    obj.dy = -Math.cos(newBounceAngle);
    obj.dx= -obj.dx;
  }
  
  function AABBcollision(obj1, obj2){
    if(obj1.x < obj2.x + obj2.w   &&
        obj1.x + obj1.r > obj2.x &&
        obj1.y < obj2.y + obj2.h  &&
        obj1.y + obj1.r > obj2.y)
      return true;
    else
      return false;
  }
  
  function normalize(val, max, min){
    return (val - min) / (max - min);
  }
  
  function getRandomColor(){
    var letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++){
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight")
      rightPressed = true;
    
    else if(e.key == "Left" || e.key == "ArrowLeft")
      leftPressed = true;
  }
  function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight")
      rightPressed = false;
    else if(e.key == "Left" || e.key == "ArrowLeft")
      leftPressed = false;
  }
}
