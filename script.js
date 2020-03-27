window.onload = () => {
  //reference canvas
  var canvas = document.getElementById("myCanvas");
  //store rendering context
  var ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  
  //input vars
  var rightPressed = false;
  var leftPressed = false;
  
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
  
  var paddle = {
    w : 75, 
    h : 10,
    x : (canvas.width-75) / 2,
    y : canvas.height - (10 * 3)
  };

  function refresh(){
    //refresh context
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    drawText("HELlo WorLD", 10, 50, "white", "stroke");
     
    checkBoundaries(ball);
    drawCirc(ball, ball.col, "fill");
    
    checkBoundaries(square);    
    drawRect(square, "red", "fill");
    
    paddleInput();
    drawPaddle(paddle);
  }
  var interval = setInterval(refresh, 50);
  
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
    ctx.fill();
    ctx.closePath();
  }
  
  function paddleInput(){
    if(rightPressed){
      paddle.x += 7;
      if(paddle.x + paddle.w > canvas.width)
        paddle.x = canvas.width - paddle.w;
    }
    else if(leftPressed){
      paddle.x -= 7;
      if(paddle.x < 0)
        paddle.x = 0;
    }
  }
  
  function checkBoundaries(obj){
    //check top/bottom boundaries
    if(obj.y + obj.dy < obj.v1){
      obj.dy = calcNewDir(obj.dy);
      if(obj.getObject() === "ball")
        obj.col = getRandomColor();
    } 
    else if(obj.y + obj.dy > canvas.height - obj.v2){
      alert("GAME OVER");
      document.location.reload();
      clearInterval(interval); //needed for chrome
    }
    //check left/right boundaries
    if(obj.x + obj.dx < obj.v1 || obj.x + obj.dx > canvas.width - obj.v2){
      obj.dx = calcNewDir(obj.dx);
      if(obj.getObject() === "ball")
        obj.col = getRandomColor();
    }
    /*
    //check if object hit paddle
    if(obj.y + obj.dy + obj.v2 > paddle.y && obj.x + obj.dx < paddle.x + paddle.w && obj.x + obj.dx > paddle.x) //paddle right collision
      obj.dx = calcNewDir(obj.dx);
    if(obj.y + obj.dy + obj.v2 > paddle.y && obj.x + obj.dx + obj.v2 > paddle.x && obj.x + obj.dx + obj.v2 < paddle.x + paddle.w) //paddle left collision
      obj.dx = calcNewDir(obj.dx);
    if ( (obj.x > paddle.x && obj.x < paddle.x + paddle.w) || ((obj.x + obj.w) > paddle.x && (obj.x < paddle.x + paddle.w) &&
      obj.y + obj.dy + obj.v2 > paddle.y))
    {
      obj.dy = calcNewDir(obj.dy);
      console.log("paddle collision");
    }
    */
    checkPaddleCollision(obj);
    
    
    //update position
    obj.x += obj.dx;
    obj.y += obj.dy;
  }
  
  function checkPaddleCollision(obj){
    if(obj.x < paddle.x + paddle.w &&
        obj.x + obj.v2 > paddle.x    &&
        obj.y < paddle.y + paddle.h  &&
        obj.y + obj.v2 > paddle.y){
        
        if(obj.x < paddle.x + paddle.w && 
          obj.x + obj.v2 > paddle.x + paddle.w &&
          obj.y + obj.v2 > paddle.y + 3){
          if(rightPressed)
            paddle.x -= 10;
          console.log("paddle right collision");
          //obj.x = paddle.x + paddle.w + 1;
          obj.dx = calcNewDir(obj.dx);
          return;
        }
        
        if(obj.x + obj.v2 > paddle.x && 
          obj.x < paddle.x && 
          obj.y + obj.v2 > paddle.y + 3){
            if(leftPressed)
              paddle.x += 10;
            console.log("paddle left collision");
            //obj.x = paddle.x - obj.v2 - 1;
            obj.dx = calcNewDir(obj.dx);
            return;
          }
        
        if(obj.y < paddle.y + paddle.h)
          console.log("paddle bottom collision");
        
        if(obj.y + obj.v2 > paddle.y){
          console.log("paddle top collision");
          obj.y = paddle.y - obj.v2 -1;
          obj.dy = calcNewDir(obj.dy);
          return;
        }
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
