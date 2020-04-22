//ball class
function Ball(x, y, r, speed){
  this.position = { x, y };
  this.radius = r;
  this.speed = speed;
  this.direction = { x : 0.1, y : -0.1 };
  this.attached = true;
  
  //a holder for reference to paddle and bricks, compound objects
  this.paddleReference;
  this.bricksReference;
  
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
    context.arc(this.position.x, this.position.y, this.radius, 0, Math.PI*2, false);
    context.fillStyle = this.colour;
    context.fill();
    context.lineWidth = 3;
    context.stokeStyle = "black"
    context.stroke();
    context.lineWidth = 1;
  }
  this.update = function(dt, canvas){
    if(this.attached === true){
      this.position.x = this.paddleReference.position.x + (this.paddleReference.w / 2);
      this.position.y = this.paddleReference.position.y - this.radius;
    }
    else{
      this.checkBoundaries(dt, this.paddleReference, this.bricksReference, canvas);
    }
  }
  
  this.checkBoundaries = function(dt, pad, brcks, canvas){
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
      //document.removeEventListener("touchstart", touchStartHandler, false);
      //document.removeEventListener("touchmove", touchMoveHandler, false);
      //document.removeEventListener("touchend", touchEndHandler, false);
      //reset function is attached to the button. loop technically continues until user presses restart
    }

    //check ball collision with paddle
    if(this.AABBcollision(pad)){
      this.calculateNewAngle(pad);
      this.randomizeColor();
      Headline.updateHeadline('title');
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
