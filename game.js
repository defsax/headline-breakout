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
  //nytimes, huffpo, bbc, cbc, hackernews
  var feedURLS = [
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
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
  document.addEventListener("touchmove", touchMoveHandler, { passive: false });
  document.addEventListener("touchend", touchEndHandler, false);
  document.getElementById("resButton").addEventListener("click", reset);
  
  function GameObject(x, y){
    this.position = { x, y };
  }
  GameObject.prototype.greeting = function(){
    alert("HI, I\'m a " + this.constructor.name + " at position (x: " + this.position.x + " y: " + this.position.y + ")");
  }
  
  //paddle class
  function Paddle(x, y, w, h, speed){
    GameObject.call(this, x, y);
    this.w = w;
    this.h = h;
    this.speed = speed;
    
    this.draw = function(context){
      context.beginPath();
      context.rect(this.position.x, this.position.y, this.w, this.h);
      context.fillStyle = "black";
      context.strokeStyle = "black";
      context.fill();
      context.stroke();
      context.closePath();
    }
    //PADDLE MOVEMENT/CHECKING
    this.input = function(dt){
      if(rightPressed){
        this.position.x += 1 * dt * this.speed;
        if(this.position.x + this.w > canvas.width)
          this.position.x = canvas.width - this.w;
      }
      else if(leftPressed){
        this.position.x -= 1 * dt * this.speed;
        if(this.position.x < 0)
          this.position.x = 0;
      }
    }
  }
  Paddle.prototype = Object.create(GameObject.prototype);
  Object.defineProperty(Paddle.prototype, 'constructor', {
    value: Paddle,
    enumerable: false, 
    writable: true
  });
  
  //ball class
  function Ball(x, y, r, speed){
    GameObject.call(this, x, y);
    this.radius = r;
    this.speed = speed;
    this.direction = { x : 0.1, y : -0.1 };
    
    this.colour = 'black';
    this.randomizeColor = function(){
      var letters = '0123456789ABCDEF';
      let color = '#';
      for (var i = 0; i < 6; i++){
        color += letters[Math.floor(Math.random() * 16)];
      }
      this.colour = color;
    }
    
    this.draw = function(context, type){
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
      switch(type){
        case "stroke":
          ctx.strokeStyle = this.colour;
          ctx.stroke();
          break;
        case "fill":
          ctx.fillStyle = this.colour;
          ctx.stokeStyle = "black"
          ctx.fill();
          ctx.lineWidth = 3;
          ctx.stroke();
          ctx.lineWidth = 1;
          break;
        default:
          break;
      }
      ctx.closePath();
    }
    
    this.checkBoundaries = function(dt, pad){
      //check left/right boundaries
      if(this.position.x + this.direction.x < this.radius || this.position.x + this.direction.x > canvas.width - this.radius){
        this.direction.x = -this.direction.x;
        this.randomizeColor();
      }
      //check top boundaries
      if(this.position.y + this.direction.y < this.radius){
        this.direction.y = -this.direction.y;
        this.randomizeColor();
      } 
      else if(this.position.y + this.direction.y > canvas.height - this.radius){
        //show button, set text to game over and disable link
        document.getElementById("resButton").style.display = "block";
        document.getElementById("title").innerHTML = "GAME OVER";
        document.getElementById("title").style.pointerEvents = "none"; 
        this.speed = 0;
        document.removeEventListener("touchstart", touchStartHandler, false);
        document.removeEventListener("touchmove", touchMoveHandler, false);
        document.removeEventListener("touchend", touchEndHandler, false);
        //reset function is attached to the button. loop technically continues until user presses restart
      }

      //check ball collision with paddle
      if(this.AABBcollision(pad)){
        this.calculateNewAngle(pad);
        this.randomizeColor();
        updateHeadline();
      }
      
      //update position
      this.position.x += this.direction.x * dt * this.speed;
      this.position.y += this.direction.y * dt * this.speed;
    }
    
    this.AABBcollision = function(obj){
      if(this.position.x < obj.position.x + obj.w   &&
          this.position.x + this.radius > obj.position.x &&
          this.position.y < obj.position.y + obj.h  &&
          this.position.y + this.radius > obj.position.y)
        return true;
      else
        return false;
    }
    
    this.calculateStartAngle = function(){
      var newBounceAngle = getRndFloat(-1, 1) * (5*Math.PI/12);
    
      this.direction.x = Math.sin(newBounceAngle);
      this.direction.y = -Math.cos(newBounceAngle);
      this.direction.x = -this.direction.x;
    }
    
    this.calculateNewAngle = function(pad){
      var paddleCenter = pad.position.x + (pad.w / 2);
      var distanceFromCenter = (pad.position.x + (pad.w / 2)) - (this.position.x);
    
      var normalizeIntersect = distanceFromCenter / (pad.w / 2);
      var newBounceAngle = normalizeIntersect * (5*Math.PI/12);
      
      this.direction.x = Math.sin(newBounceAngle);
      this.direction.y = -Math.cos(newBounceAngle);
      this.direction.x = -this.direction.x;
    }
  }
  Ball.prototype = Object.create(GameObject.prototype);
  Object.defineProperty(Ball.prototype, 'constructor', {
    value: Ball,
    enumerable: false, 
    writable: true
  });
  
  
  var paddle = new Paddle((canvas.width - 75) / 2, canvas.height - (10 * 3), 75, 10, 0.3);
  var ball = new Ball(20, 20, 10, 0.3);
  ball.randomizeColor();

  function refresh(){
    //refresh context
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //round ball vars to nearest hundredth
    //var xRounded = ball.x.toFixed(2);
    //var yRounded = ball.y.toFixed(2);
    //drawText("Ball speed: " + ball.speed.toString(), 10, 25, "black", "fill");
    //drawText("Interval speed: " + intervalSpeed, 10, 50, "black", "fill");
    //drawText("Articles left: " + postArray.length.toString(), 10, 75, "black", "fill");
    //drawText("Font Size: " + fontSize + "px", 10, 100, "black", "fill");
    
    if(ballAttached === true){
      ball.position.x = paddle.position.x + (paddle.w / 2);
      ball.position.y = paddle.position.y - ball.radius;
      ball.draw(ctx, "fill");
    }
    else{
      ball.checkBoundaries(intervalSpeed, paddle);
      ball.draw(ctx, "fill");
    }
    
    paddle.input(intervalSpeed);
    paddle.draw(ctx);
  }
  var interval = setInterval(refresh, intervalSpeed);
  
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

  function getRndFloat(min, max) {
    return Math.random() * (max - min) + min;
  }
  function reset(){
    document.location.reload();
    clearInterval(interval); //needed for chrome
  } 
  
  function adjustFontSize(){    
    //scale font to fit screen on paddle hit
    let headline = document.getElementById('title');
    headline.style.fontSize = '250px';
    let hlFontSize = window.getComputedStyle(headline, null).getPropertyValue('font-size');
    
    //adjust font to available canvas height
    while(headline.clientHeight > canvas.height){
      hlFontSize = window.getComputedStyle(headline, null).getPropertyValue('font-size');
      fontSize = parseInt(hlFontSize);
      headline.style.fontSize = (fontSize - 10) + 'px';
    }
    //adjust font to available canvas width (for mobile or vertical)
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
      ball.calculateStartAngle();
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
    paddle.position.x = e.touches[0].clientX - paddle.w / 2;
  }
  function touchMoveHandler(e){
    e.preventDefault();
    paddle.position.x = e.touches[0].clientX - paddle.w / 2;
    if(paddle.position.x + paddle.w > canvas.width)
        paddle.position.x = canvas.width - paddle.w;
    else if(paddle.position.x < 0)
        paddle.position.x = 0;
  }
  function touchEndHandler(e){
    if(ballAttached === true){
      ball.calculateStartAngle();
      ballAttached = false;
    }
    e.preventDefault();
  }
}
