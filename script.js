var headlines = [];



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
  
  //document.addEventListener("DOMContentLoaded", processHeadlines, false);
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
  
    function processHeadlines(){
    for(let i = 0; i < headlines.length; i++){
      console.log(headlines[i]);
    }
  }
  
  //watch these...
  canvas.width = document.body.clientWidth;
  //canvas.height = document.body.clientHeight;
  canvas.height = window.innerHeight;
  console.log("canvas.width: " + canvas.width);
  
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
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //round ball vars to nearest hundredth
    var xRounded = ball.x.toFixed(2);
    var yRounded = ball.y.toFixed(2);
    drawText(xRounded.toString(), 10, 25, "black", "fill");
    drawText(yRounded.toString(), 10, 50, "black", "fill");
    
    if(ballAttached === true){
      ball.x = paddle.x + (paddle.w / 2);
      ball.y = paddle.y - ball.r;
      drawCirc(ball, ball.col, "fill");
    }
    else{
      checkBoundaries(ball, intervalSpeed);
      ball.col = getRandomColor(); //random color every frame
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

    //check ball collision with paddle
    if(AABBcollision(obj, paddle)){
      calculateNewAngle(obj);
      obj.col = getRandomColor();
      document.getElementById('title').innerHTML = headlines[Math.floor(Math.random() * headlines.length)];
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
}

  const DOMPARSER = new DOMParser();//.parseFromString.bind(new DOMParser());
  var frag = document.createDocumentFragment();


fetch('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml').then((response) => {
  response.text().then((xmlTEXT) =>{
    console.log(xmlTEXT);
    try{
      let doc = DOMPARSER.parseFromString(xmlTEXT, "text/xml");
      console.log(doc);
      doc.querySelectorAll('item').forEach((item) => {
        let temp = document.importNode(document.querySelector('template').content, true);
        let i = item.querySelector.bind(item);
        let t = temp.querySelector.bind(temp);
        t('h2').textContent = !!i('title') ? i('title').textContent : '-';
        var title = !!i('title') ? i('title').textContent : '-';
        //document.getElementById('title').innerHTML = title;
        console.log(title);
        console.log(headlines.length);
        headlines.push(title);
        frag.appendChild(temp);
      })
    }catch(e){
      console.error("Error in parsing feed.");
    }
  })
})
    /*
      fetch('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml').then((res) => {
        res.text().then((xmlTxt) => {
          var domParser = new DOMParser(),
          let doc = domParser.parseFromString(xmlTxt, 'text/html'),
          var feedUrl = doc.querySelector('link[type="application/rss+xml"]').href
        })
      }.catch(() => console.error('Error in fetching the website.'))
      */                                                                   
      
/*
    // Fetch URLs from JSON
    fetch('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml').then((res) => {
      res.text().then((data) => {
        var frag = document.createDocumentFragment()
        var hasBegun = true
        
        
        JSON.parse(data).urls.forEach((u) => {
          try {
            var url = new URL(u)
          }
          catch (e) {
            console.error('URL invalid');
            return
          }
          fetch(url).then((res) => {
            res.text().then((htmlTxt) => {
              // Extract the RSS Feed URL from the website 
              try {
                let doc = DOMPARSER(htmlTxt, 'text/html')
                var feedUrl = doc.querySelector('link[type="application/rss+xml"]').href
              } catch (e) {
                console.error('Error in parsing the website');
                return
              }
              // Fetch the RSS Feed
              fetch(feedUrl).then((res) => {
                res.text().then((xmlTxt) => {
                  // Parse the RSS Feed and display the content
                  try {
                    let doc = DOMPARSER(xmlTxt, "text/xml")
                    let heading = document.createElement('h1')
                    heading.textContent = url.hostname
                    frag.appendChild(heading)
                    doc.querySelectorAll('item').forEach((item) => {
                      let temp = document.importNode(document.querySelector('template').content, true);
                      let i = item.querySelector.bind(item)
                      let t = temp.querySelector.bind(temp)
                      t('h2').textContent = !!i('title') ? i('title').textContent : '-'
                      t('a').textContent = t('a').href = !!i('link') ? i('link').textContent : '#'
                      t('p').innerHTML = !!i('description') ? i('description').textContent : '-'
                      t('h3').textContent = url.hostname
                      frag.appendChild(temp)
                    })
                  } catch (e) {
                    console.error('Error in parsing the feed')
                  }
                  if(hasBegun) {
                    document.querySelector('output').textContent = ''; 
                    hasBegun = false;
                  }
                  document.querySelector('output').appendChild(frag)
                })
              }).catch(() => console.error('Error in fetching the RSS feed'))
            })
          }).catch(() => console.error('Error in fetching the website'))
        })
      })
    }).catch(() => console.error('Error in fetching the URLs json'))
*/
