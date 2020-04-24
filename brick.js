import * as utils from './utilities.js';

export default function Brick(columns, position, gameWorld){
  var gameWidth = gameWorld.getScreenDimensions().width;
  var gameHeight = gameWorld.getScreenDimensions().height;
  
  this.position = {
    x: position.x,
    y: position.y
  }
  
  this.w = gameWidth / columns;
  this.h = 20;
  
  this.deleted = false;
  
  this.update = function(dt){
    //console.log("Brick update");
    if(utils.areColliding(gameWorld.ball, this)){
      gameWorld.ball.direction.y = -gameWorld.ball.direction.y;
      this.deleted = true;
    }
    
    /*
    //check ball collision with bricks
    for(let c = 0; c < brcks.colCount; c++){
      for(let r = 0; r < brcks.rowCount; r++){
        let b = brcks.bArray[c][r];
        if(utils.areColliding(this, b)){
          let top = b.position.y;
          let bottom = b.position.y + b.h;
          let left = b.position.x;
          let right = b.position.x + b.w;
          
          this.color = utils.randomizeColor();
          
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
    }
    */
    
  }
  
  this.draw = function(context){
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.w, this.h);
    context.fillStyle = "grey";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
  }
}
