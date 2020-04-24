import * as utils from './utilities.js';

export default function PowerUP(x, y, s, gameWorld){
  var speed = s;
  var color;
  var canvasHeight = gameWorld.getScreenDimensions().height;
  
  this.w = 10;
  this.h = 10;
  
  this.position = { x: x, y: y };
  this.direction = { x: 0, y: 1 };
  this.deleted = false;
  
  this.update = function(dt){
    color = utils.randomizeColor();
    this.position.x += this.direction.x * dt * speed;
    this.position.y += this.direction.y * dt * speed;
    
    if(this.position.y > canvasHeight){
      this.deleted = true;
      console.log("Missed powerup.");
    }
  }
  this.draw = function(context){
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.w, this.h);
    context.fillStyle = color;
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
  }
}
