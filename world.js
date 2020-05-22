import Ball from './ball.js';
import Paddle from './paddle.js';
import { buildLevel, level1, level2 } from './levels.js';
import InputHandler from './input.js';
import HeadlineHandler from './headline.js';
import * as utils from './utilities.js';

export default function World(w, h) {
  //private properties
  var objects = [];
  var screenDimensions = { width: w, height: h }; //canvas reference
  var powerUpQueue = [];
  var currentPower;
  
  const GAMESTATE = {
    PAUSED: 0,
    RUNNING: 1, 
    MENU: 2,
    GAMEOVER: 3
  };
  
  //public properties
  //this.numberOfBalls = 0;
  this.balls = [];
  this.bricks = [];
  this.message = " ";
  this.score = 0;
  this.paddleWidth = 75;
  this.ballSpeed = 200;
  this.gameOver = false; //accessible from main.js
  this.powerUpActive = false;
  this.elapsed = 0;
  this.duration = 10;
  
  //public methods
  this.start = function(){
    
    //starting gamestate
    this.GAMESTATE = GAMESTATE.RUNNING;
    
    //load headlines
    this.headlines = new HeadlineHandler();
    
    /*
     * rss feeds
     * nytimes, huffpo, bbc, cbc, hackernews
    */
    
    this.headlines.addFeed('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
    this.headlines.addFeed('http://feeds.bbci.co.uk/news/rss.xml');
    this.headlines.addFeed('https://www.huffpost.com/section/front-page/feed?x=1');
    this.headlines.addFeed('https://www.cbc.ca/cmlink/rss-topstories');
    this.headlines.addFeed('https://hnrss.org/frontpage');
    this.headlines.initialize();
    
    //instantiate objects
    this.ball = new Ball(this, 20, 20, 10, this.ballSpeed);
    this.ball.color = utils.randomizeColor();
    this.balls.push(this.ball);
    //this.numberOfBalls += 1;
    this.paddle = new Paddle(this, this.paddleWidth, 10, 300);
    this.bricks = new buildLevel(this, level2);
    
    //add objects to array
    //objects = objects.concat(this.balls);
    //objects.push(...this.balls);
    objects.push(this.paddle);
    //objects.push(...bricks); //spread operator
    
    //initialize input handler
    this.inputHandler = new InputHandler(this);
    this.inputHandler.initialize();
    
    this.initMenu();
  };
  this.update = function(dt){
    //skip rest of function if gamestate is paused.
    if(this.GAMESTATE === GAMESTATE.PAUSED) return;
    
    //update objects
    //objects.forEach(object => object.update(dt));
    [...objects, ...this.balls, ...this.bricks].forEach(object => object.update(dt));
    
    //delete objects
    objects = objects.filter(object => !object.deleted);
    this.balls = this.balls.filter(b => !b.deleted);
    this.bricks = this.bricks.filter(brick => !brick.deleted);
    //let objs = [...objects, ...this.balls, ...this.bricks];
    //objs = objs.filter(obj => !obj.deleted);
    
    //update powerup timer
    if(this.powerUpActive){
      this.elapsed += dt;
    }
    
    //if powerup time is up
    if(this.elapsed >= this.duration){
      console.log("Powerup time up.");
      //reset timer
      this.elapsed = 0;
      this.powerUpActive = false;
      currentPower.stop();
      currentPower = undefined;
    }
  };
  
  this.draw = function(ctx){
    //objects.forEach(object => object.draw(ctx));
    [...objects, ...this.balls, ...this.bricks].forEach(object => object.draw(ctx));
    
    //display current power up
    utils.drawText(this.message, screenDimensions.width - 5, 50, "black", "fill", "20px Arial", "right", ctx);
    
    //display score
    utils.drawText("Score: " + this.score, screenDimensions.width - 5, 25, "black", "fill", "20px Arial", "right", ctx);
    
    if(this.GAMESTATE === GAMESTATE.PAUSED){
      this.pauseOverlay(ctx);
    }
  };
  
  this.addObject = function(obj){
    objects.push(obj);
  };
  this.setPowerUp = function(obj){
    if(currentPower === undefined && obj !== undefined){
      currentPower = obj;
      currentPower.start();
      this.powerUpActive = true;
    }
    else
      console.log("Powerup already active.");
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
  this.paused = function(){
    if(this.GAMESTATE === GAMESTATE.RUNNING){
      this.GAMESTATE = GAMESTATE.PAUSED;
      console.log("GAME PAUSE");
      document.getElementById("title").style.display = "none";
      document.getElementById("opener").style.display = "none";
      document.getElementById("nav-bar").style.display = "block";
      //openNav();
    }
    else{
      this.GAMESTATE = GAMESTATE.RUNNING;
      document.getElementById("title").style.display = "block";
      //closeNav();
      document.getElementById("opener").style.display = "block";
      document.getElementById("nav-bar").style.display = "none";
    }
  };
  this.pauseOverlay = function(ctx){
    ctx.beginPath();
    ctx.rect(0, 0, screenDimensions.width, screenDimensions.height);
    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();
    ctx.closePath();
    
    utils.drawText("PAUSED", 
                   screenDimensions.width / 2, 
                   screenDimensions.height / 2, 
                   "white", 
                   "fill", 
                   "100px Arial",
                   "center",
                   ctx);
  };
  this.initMenu = function(){
    //code for accordion
    var acc = document.getElementsByClassName("accordo");
    var i;

    for(let i = 0; i < acc.length; i++){
      acc[i].addEventListener("click", function(){
        /*togel between adding and removing the active class, to highlight the button that controls the panel*/
        this.classList.toggle("active");
        
        /*toggel between hiding and showing the active panel*/
        var panel = this.nextElementSibling;
        if(panel.style.display === "block"){
          panel.style.display = "none";
        } else {
          panel.style.display = "block";
        }
      });
    }
  };
}
