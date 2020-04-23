import Ball from './ball.js';
import Paddle from './paddle.js';
import Bricks from './bricks.js';
import InputHandler from './input.js';

export default function World(w, h) {
  //private variables
  var objects = [];
  //canvas reference
  var screenDimensions = { width: w, height: h };
  
  this.gameOver = false;
  
  this.drawText = function(text, w, h, color, type, ctx){
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
  
  //public methods
  this.start = function(){
    this.ball = new Ball(this, 20, 20, 10, 150);
    this.ball.randomizeColor();
    
    this.paddle = new Paddle(this, 75, 10, 300);
    
    this.bricks = new Bricks(this);
    this.bricks.init();
    
    objects.push(this.ball);
    objects.push(this.paddle);
    objects.push(this.bricks);
    
    this.inputHandler = new InputHandler(this);
    this.inputHandler.initialize();
  };
  this.update = function(dt){
    objects.forEach(object => object.update(dt));
  };
  this.draw = function(ctx){
    objects.forEach(object => object.draw(ctx));
  };
  
  this.addObject = function(obj){
    objects.push(obj);
  };
  this.listObjects = function(){
    if(objects){
      for(let i = 0; i < objects.length; i++){
        console.log(objects[i]);
      }
    }
  };  
  this.getScreenDimensions = function(){ 
    return screenDimensions; 
  };
}
