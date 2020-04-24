import utils from './utilities.js';

//ball class
export default function Ball(gameWorld, x, y, r, speed){
  var canvasDimensions = { w: gameWorld.getScreenDimensions().width, h: gameWorld.getScreenDimensions().height };
  
  this.position = { x, y };
  this.radius = r;
  this.speed = speed;
  this.direction = { x : 0.1, y : -0.1 };
  this.attached = true;
  
  this.colour = 'black';
  this.randomizeColor = function(){
    var letters = '0123456789ABCDEF';
    let color = '#';
    for (var i = 0; i < 6; i++){
      color += letters[Math.floor(Math.random() * 16)];
    }
    this.colour = color;
  }
  
  this.draw = function(context){
    context.beginPath();
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
    context.fillStyle = this.colour;
    context.fill();
    context.lineWidth = 3;
    context.stokeStyle = "black"
    context.stroke();
    context.lineWidth = 1;
    context.closePath();
  }
  this.update = function(dt){
    if(this.attached === true){
      this.position.x = gameWorld.paddle.position.x + (gameWorld.paddle.w / 2);
      this.position.y = gameWorld.paddle.position.y - this.radius;
    }
    else{
      this.checkBoundaries(dt, gameWorld.paddle);
    }
  }
  
  this.checkBoundaries = function(dt, pad){
    //check left boundary
    if(this.position.x + this.direction.x < this.radius){
      this.direction.x = -this.direction.x;
      this.randomizeColor();
      
      //avoid getting stuck in wall
      this.position.x = this.radius;
    }
    //check right boundary
    if(this.position.x + this.direction.x > canvasDimensions.w - this.radius){
      this.direction.x = -this.direction.x;
      this.randomizeColor();
      
      //avoid getting stuck in wall
      this.position.x = canvasDimensions.w - this.radius;
    }
    //check top boundary
    if(this.position.y + this.direction.y < this.radius){
      this.direction.y = -this.direction.y;
      this.randomizeColor();
    }
    else if(this.position.y + this.direction.y > canvasDimensions.h - this.radius){
      //show button, set text to game over and disable link
      document.getElementById("resButton").style.display = "block";
      document.getElementById("title").innerHTML = "GAME OVER";
      document.getElementById("title").style.pointerEvents = "none"; 
      this.speed = 0;
      
      gameWorld.inputHandler.disable();
      gameWorld.gameOver = true;
    }

    //check ball collision with paddle
    if(this.AABBcollision(pad)){
      this.calculateNewAngle(pad);
      this.randomizeColor();
      Headline.updateHeadline('title');
      
      utils.adjustFontSize('title');
    }
    /*
    //check ball collision with bricks
    for(let c = 0; c < brcks.colCount; c++){
      for(let r = 0; r < brcks.rowCount; r++){
        let b = brcks.bArray[c][r];
        if(this.AABBcollision(b)){
          let top = b.position.y;
          let bottom = b.position.y + b.h;
          let left = b.position.x;
          let right = b.position.x + b.w;
          
          this.randomizeColor();
          
          if(this.position.x + this.radius < left){
            console.log("Left."); 
            this.direction.x = -this.direction.x;
            this.position.x = left - this.radius;
            break;
          }
          else if(this.position.x - this.radius > right){
            console.log("Right.");
            this.direction.x = -this.direction.x;
            this.position.x = right + this.radius;
            break;
          }
          else if(this.position.y - this.radius < top){
            console.log("Top.");
            this.position.y = top - this.radius;
            this.direction.y = -this.direction.y;
            break;
          }
          else if(this.position.y + this.radius > bottom){
            console.log("Bottom");
            this.position.y = bottom + this.radius;
            this.direction.y = -this.direction.y;
            break;
          }
          
          
          console.log("Collision: " + "\nTop: " + top + "\nBottom: " + bottom + "\nLeft: " + left + "\nRight: " + right);
        }
      }
    }*/
    
    //update position
    this.position.x += this.direction.x * dt * this.speed;
    this.position.y += this.direction.y * dt * this.speed;
  }
  
  this.checkLeftRight = function(obj){
    if(this.position.x + this.direction.x + this.radius > obj.position.x || 
      this.position.x + this.direction.x - this.radius < obj.position.x + obj.w)
      return true;
    else
      return false;
  }
  
  this.AABBcollision = function(obj){
    if(this.position.x - this.radius < obj.position.x + obj.w   &&
        this.position.x + this.radius > obj.position.x &&
        this.position.y - this.radius < obj.position.y + obj.h  &&
        this.position.y + this.radius > obj.position.y)
      return true;
    else
      return false;
  }
  
  this.calculateStartAngle = function(){
    var newBounceAngle = utils.getRndFloat(-1, 1) * (5*Math.PI/12);
  
    this.direction.x = Math.sin(newBounceAngle);
    this.direction.y = -Math.cos(newBounceAngle);
    this.direction.x = -this.direction.x;
  }
  
  this.calculateNewAngle = function(pad){
    var paddleCenter = pad.position.x + (pad.w / 2);
    var distanceFromCenter = (pad.position.x + (pad.w / 2)) - (this.position.x);
  
    var normalizeIntersect = distanceFromCenter / (pad.w / 2);
    var newBounceAngle = normalizeIntersect * (5*Math.PI/17); //12
    
    this.direction.x = Math.sin(newBounceAngle);
    this.direction.y = -Math.cos(newBounceAngle);
    this.direction.x = -this.direction.x;
  }
}
