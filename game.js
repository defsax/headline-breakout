window.onload = () => {
  //reference canvas
  var canvas = document.getElementById("myCanvas");
  //store rendering context
  var ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  
  //input vars
  var rightPressed = false;
  var leftPressed = false;
  
  //timing var
  var intervalSpeed = 10;
  
  //game active bool
  var ballAttached = true; 
  
  //style
  var fontSize = 0;
  
  //rss feeds
  /*
  * nytimes
  * breitbart
  * huffpo
  * bbc
  * cbc
  * hackernews
  */                                                    

  var feedURLS = [
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://www.huffpost.com/section/front-page/feed?x=1',
    'https://www.cbc.ca/cmlink/rss-topstories',
    'https://hnrss.org/frontpage'
  ];
  var postArray = window.fetchnews(feedURLS);
  
  //watch these...
  canvas.width = document.body.clientWidth;
  //canvas.height = document.body.clientHeight;
  canvas.height = window.innerHeight;
  console.log("canvas.width: " + canvas.width);
  console.log("canvas.height: " + canvas.height);
  
  //document.addEventListener("DOMContentLoaded", processHeadlines, false);
  
  //input event listeners
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("touchstart", touchStartHandler, false);
  document.addEventListener("touchmove", touchMoveHandler, false);
  document.addEventListener("touchend", touchEndHandler, false);
  document.getElementById("resButton").addEventListener("click", reset);
  
  var paddle = {
    w : 75, 
    h : 10,
    x : (canvas.width-75) / 2,
    y : canvas.height - (10 * 3),
    speed : 0.3
  };
  
  var ball = {
    x : paddle.x + paddle.w / 2,
    y : paddle.y - 10,
    r : 10,
    dx : 0.1,
    dy : -0.1,
    speed : 0.3,
    col : getRandomColor(),
    getObject : function(){
      return "ball";
    }
  };

  function refresh(){
    //refresh context
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //round ball vars to nearest hundredth
    var xRounded = ball.x.toFixed(2);
    var yRounded = ball.y.toFixed(2);
    //drawText(xRounded.toString(), 10, 25, "black", "fill");
    //drawText(yRounded.toString(), 10, 50, "black", "fill");
    //drawText("Articles left: " + postArray.length.toString(), 10, 75, "black", "fill");
    //drawText("Font Size: " + fontSize + "px", 10, 100, "black", "fill");
    
    if(ballAttached === true){
      ball.x = paddle.x + (paddle.w / 2);
      ball.y = paddle.y - ball.r;
      drawCirc(ball, ball.col, "fill");
    }
    else{
      checkBoundaries(ball, intervalSpeed);
      //ball.col = getRandomColor(); //random color every frame
      drawCirc(ball, ball.col, "fill");
    }
    
    paddleInput(intervalSpeed);
    drawPaddle(paddle);
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
  
  function checkBoundaries(obj, dt){
    //check left/right boundaries
    if(obj.x + obj.dx < obj.r || obj.x + obj.dx > canvas.width - obj.r){
      obj.dx = -obj.dx;
      if(obj.getObject() === "ball")
        obj.col = getRandomColor();
    }
    //check top boundaries
    if(obj.y + obj.dy < obj.r){
      obj.dy = -obj.dy;
      
      if(obj.getObject() === "ball")
        obj.col = getRandomColor();
    } 
    else if(obj.y + obj.dy > canvas.height - obj.r){
      //show button, set text to game over and disable link
      document.getElementById("resButton").style.display = "block";
      //document.getElementById("title").innerHTML = "GAME OVER";
      document.getElementById("title").style.pointerEvents = "none"; 
      obj.speed = 0;
      document.removeEventListener("touchstart", touchStartHandler, false);
      document.removeEventListener("touchmove", touchMoveHandler, false);
      document.removeEventListener("touchend", touchEndHandler, false);
      //reset function is attached to the button. loop technically continues until user presses restart
    }

    //check ball collision with paddle
    if(AABBcollision(obj, paddle)){
      calculateNewAngle(obj);
      obj.col = getRandomColor();
      updateHeadline();
    }
    
    //update position
    obj.x += obj.dx * dt * obj.speed;
    obj.y += obj.dy * dt * obj.speed;
  }
  
  function calculateNewAngle(obj){

    var paddleCenter = paddle.x + (paddle.w / 2);
    var distanceFromCenter = (paddle.x + (paddle.w / 2)) - (obj.x);
  
    var normalizeIntersect = distanceFromCenter / (paddle.w / 2);
    var newBounceAngle = normalizeIntersect * (5*Math.PI/12);
    
    obj.dx = Math.sin(newBounceAngle);
    obj.dy = -Math.cos(newBounceAngle);
    obj.dx= -obj.dx;
  }
  
  function calculateStartAngle(obj){
    var newBounceAngle = getRndFloat(-1, 1) * (5*Math.PI/12);
    
    obj.dx = Math.sin(newBounceAngle);
    obj.dy = -Math.cos(newBounceAngle);
    obj.dx= -obj.dx;
  }
  
  function getRndFloat(min, max) {
    return Math.random() * (max - min) + min;
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
  
  function reset(){
    document.location.reload();
    clearInterval(interval); //needed for chrome
  }
  
  function getRandomColor(){
    var letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++){
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function adjustFontSize(){    
    let headline = document.getElementById('title');
    headline.style.fontSize = '250px';
    let hlFontSize = window.getComputedStyle(headline, null).getPropertyValue('font-size');
    
    //adjust font to available canvas height
    while(headline.clientHeight > canvas.height){
      hlFontSize = window.getComputedStyle(headline, null).getPropertyValue('font-size');
      fontSize = parseInt(hlFontSize);
      headline.style.fontSize = (fontSize - 10) + 'px';
    }
    //adjust font to available canvas width (for mobile)
    while(headline.clientWidth > canvas.width){
      hlFontSize = window.getComputedStyle(headline, null).getPropertyValue('font-size');
      fontSize = parseInt(hlFontSize);
      headline.style.fontSize = (fontSize - 10) + 'px';
    }
  }
  
  function updateHeadline(){
    let headline = document.getElementById('title');
    //if news headlines are present in array
    if(postArray.length != 0){
      let randPost = Math.floor(Math.random() * postArray.length);
      headline.innerHTML = postArray[randPost].title;
      headline.href = postArray[randPost].link;
      
      console.log(postArray);
      adjustFontSize();

      postArray.splice(randPost, 1);
    }
    else{
      //otherwise don't draw
      document.getElementById('title').innerHTML = "";
      document.getElementById('title').href = "";
    }
  }
  
  //INPUT CONTROLS
  
  //PADDLE MOVEMENT/CHECKING
  function paddleInput(dt){
    if(rightPressed){
      paddle.x += 1 * dt * paddle.speed;
      if(paddle.x + paddle.w > canvas.width)
        paddle.x = canvas.width - paddle.w;
    }
    else if(leftPressed){
      paddle.x -= 1 * dt * paddle.speed;
      if(paddle.x < 0)
        paddle.x = 0;
    }
  }
  
  //KEYBOARD CONTROLS
  function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight")
      rightPressed = true;
    else if(e.key == "Left" || e.key == "ArrowLeft")
      leftPressed = true;
    else if(e.keyCode == 32 && ballAttached === true){
      console.log("Space pressed.");
      calculateStartAngle(ball);
      ballAttached = false;
    }
  }
  function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight")
      rightPressed = false;
    else if(e.key == "Left" || e.key == "ArrowLeft")
      leftPressed = false;
    else if(e.keyCode == 32)
      console.log("Space released.");
  }
  
  //TOUCH CONTROLS
  function touchStartHandler(e){
    e.preventDefault();
    paddle.x = e.touches[0].clientX - paddle.w / 2;
  }
  function touchMoveHandler(e){
    e.preventDefault();
    paddle.x = e.touches[0].clientX - paddle.w / 2;
    if(paddle.x + paddle.w > canvas.width)
        paddle.x = canvas.width - paddle.w;
    else if(paddle.x < 0)
        paddle.x = 0;
  }
  function touchEndHandler(e){
    if(ballAttached === true){
      calculateStartAngle(ball);
      ballAttached = false;
    }
    e.preventDefault();
  }
}
