window.onload = () => {
  
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
  
  //input event listeners
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  document.addEventListener("touchstart", touchStartHandler, false);
  document.addEventListener("touchmove", touchMoveHandler, { passive: false });
  document.addEventListener("touchend", touchEndHandler, false);
  document.getElementById("resButton").addEventListener("click", utils.reset);
  
  var paddle = new Paddle((document.body.clientWidth - 75) / 2, 
                          window.innerHeight - (10 * 3), 
                          75, 10, 300);
  
  var bricks = new Bricks();
  bricks.init();
  
  var ball = new Ball(20, 20, 10, 150);
  ball.randomizeColor();
  ball.paddleReference = paddle;
  ball.bricksReference = bricks;
  
  var world = new World();
  world.addObject(paddle);
  world.addObject(ball);
  world.addObject(bricks);
  
  Headline.initialize();
  Headline.addFeed('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
  Headline.initialize();
  
  requestAnimationFrame(function(){world.loop();});
  
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
