import * as utils from './utilities.js';
import Ball from './ball.js';

export default function PowerUP(x, y, s, gameWorld){
  var speed = s;
  var color;
  var canvasHeight = gameWorld.getScreenDimensions().height;
  var duration = 0;
  var expiration = 1000;
  var drawPhase = true;
  
  var activate = function(dt){
    duration += dt;
    console.log("Duration: " + duration);
    
    if(duration >= 1)
      this.deleted = true;
  }
  
  this.shortPad = function(){
    var x = 0;
    
    console.log("Short paddle.");
    gameWorld.paddle.w = 40;
    
    this.stop = function(){
      console.log("Stopping short paddle.");
      gameWorld.paddle.w = gameWorld.paddleWidth;
    }
  }
  
  this.w = 10;
  this.h = 10;
  
  this.position = { x: x, y: y };
  this.direction = { x: 0, y: 1 };
  this.deleted = false;
  this.draw = true;
  
  this.update = function(dt){
    color = utils.randomizeColor();
    this.position.y += this.direction.y * dt * speed;
    
    //if you catch the powerup, start a timer for a random power up.
    if(utils.rectCollision(this, gameWorld.paddle)){
      this.deleted = true;
      console.log("Caught powerup.");
      gameWorld.addPowerUp(this.shortPad);
    }
    
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

function Modi(gameWorld, x){
  console.log("Modifier.");
  var powerUpDuration = 0;
  var maxDuration = 10;
  this.deleted = false;
  
  var short = function(){
    console.log("Short paddle.");
    gameWorld.paddle.w = 40;
  }
  
  switch(x){
    case 0:{
      gameWorld.message = "Short paddle.";
      console.log("Short paddle.");
      gameWorld.paddle.w = 40;
      //Modifier.setCurrentPower(short);
      break;
    }
    case 1:{
      gameWorld.message = "Long paddle.";
      console.log("Long paddle.");
      gameWorld.paddle.w = 150;
      break;
    }
    case 2:{
      gameWorld.message = "Slowball.";
      console.log("Slowball.");
      for(let i = 0; i < gameWorld.balls.length; i++)
        gameWorld.balls[i].speed = 100;
      break;
    }
    case 3:{
      gameWorld.message = "Fastball.";
      console.log("Fastball.");
      for(let i = 0; i < gameWorld.balls.length; i++)
        gameWorld.balls[i].speed = 400;
      break;
    }
    case 4:{
      gameWorld.message = "Multiball.";
      console.log("Multiball.");
      var newBall = new Ball(gameWorld, gameWorld.paddle.position.x + gameWorld.paddle.w / 2, gameWorld.paddle.position.y - 10, 10, gameWorld.ballSpeed);
      newBall.color = utils.randomizeColor();
      newBall.attached = false;
      newBall.calculateStartAngle();
      newBall.deleted = false;
      gameWorld.balls.push(newBall); //register with ball array
      gameWorld.addObject(newBall); //add to object array
      gameWorld.numberOfBalls += 1;
      gameWorld.listObjects();
      break;
    }
  }
  
  this.update = function(dt){
    powerUpDuration += dt;
    //console.log(powerUpDuration);
    
    
    if(powerUpDuration >= maxDuration){
      this.deleted = true;

      //set defaults
      gameWorld.paddle.w = gameWorld.paddleWidth;
      
      for(let i = 0; i < gameWorld.balls.length; i++)
        gameWorld.balls[i].speed = gameWorld.ballSpeed;
    }
  };
  this.draw = function(context){
    
  };
}
