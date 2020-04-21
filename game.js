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
  
  var paddle = new Paddle((canvas.width - 75) / 2, 
                          canvas.height - (10 * 3), 
                          75, 10, 150);
  
  var bricks = new Bricks();
  bricks.init(ctx);
  
  var ball = new Ball(20, 20, 10, 50);
  ball.randomizeColor();
  ball.paddleReference = paddle;
  ball.bricksReference = bricks;
  
  var world = new World();
  world.addObject(paddle);
  world.addObject(ball);
  world.addObject(bricks);
  
  
  /*
  function refresh(){
    world.loop();
    paddle.input(intervalSpeed);
    requestAnimationFrame(refresh);
  }*/
  
  requestAnimationFrame(function(){world.loop();});
  //var interval = setInterval(refresh, intervalSpeed);
  
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
  
  //KEYBOARD CONTROLS
  function keyDownHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight")
      paddle.rightPressed = true;
    else if(e.key == "Left" || e.key == "ArrowLeft")
      paddle.leftPressed = true;
    else if(e.keyCode == 32 && ball.attached === true){
      console.log("Space pressed.");
      ball.calculateStartAngle();
      ball.attached = false;
    }
  }
  function keyUpHandler(e){
    if(e.key == "Right" || e.key == "ArrowRight")
      paddle.rightPressed = false;
    else if(e.key == "Left" || e.key == "ArrowLeft")
      paddle.leftPressed = false;
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
    if(ball.attached === true){
      ball.calculateStartAngle();
      ball.attached = false;
    }
    e.preventDefault();
  }
}
