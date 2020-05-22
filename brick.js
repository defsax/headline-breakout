import * as utils from './utilities.js';
import PowerUP from './powerup.js';

export default function Brick(columns, position, gameWorld, powerUp, inv, hp, col){
  var gameWidth = gameWorld.getScreenDimensions().width;
  var gameHeight = gameWorld.getScreenDimensions().height;
  
  this.position = {
    x: position.x,
    y: position.y
  }
  
  this.w = gameWidth / columns;
  this.h = 20;
  
  this.color = col;//'#f5f5f0';
  
  this.deleted = false;
  this.special = powerUp;
  this.invincible = inv;
  this.health = hp;
  
  this.update = function(dt){
    for(let i = 0; i < gameWorld.balls.length; i++){
      if(utils.areColliding(gameWorld.balls[i], this)){
        gameWorld.balls[i].direction.y = -gameWorld.balls[i].direction.y;
        
        if(this.invincible === false){
          this.health -= 1;
          if(this.health === 2)
            this.color = '#79BAEC';
          if(this.health === 1)
            this.color = '#ADDFFF';
        }
        
        if(this.invincible === false && this.health < 1){
          gameWorld.score += 10;
          this.deleted = true;
        }
        
        console.log(this.health);
        
        if(this.special === true){
          //if new brick is special, it's a powerup brick:
            //create it in world so it can be updated
          gameWorld.addObject(new PowerUP(
            this.position.x + this.w / 2, 
            this.position.y + this.h / 2, 
            50, 
            gameWorld
          ));
        }        
      }
    }
    if(this.special === true){
      this.color = utils.randomizeColor();
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
    context.fillStyle = this.color;
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
  }
}
