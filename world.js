import Ball from './ball.js';
import Paddle from './paddle.js';
import { buildLevel, level1 } from './levels.js';
import InputHandler from './input.js';
import HeadlineHandler from './headline.js';
import * as utils from './utilities.js';

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
    //load headlines
    this.headlines = new HeadlineHandler();
    //rss feeds
    //nytimes, huffpo, bbc, cbc, hackernews
    this.headlines.addFeed('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
    this.headlines.addFeed('http://feeds.bbci.co.uk/news/rss.xml');
    this.headlines.addFeed('https://www.huffpost.com/section/front-page/feed?x=1');
    this.headlines.addFeed('https://www.cbc.ca/cmlink/rss-topstories');
    this.headlines.addFeed('https://hnrss.org/frontpage');
    this.headlines.initialize();
    
    //instantiate objects
    this.ball = new Ball(this, 20, 20, 10, 150);
    this.ball.color = utils.randomizeColor();
    this.paddle = new Paddle(this, 75, 10, 300);
    let bricks = new buildLevel(this, level1);
    
    //add objects to array
    objects.push(this.ball);
    objects.push(this.paddle);
    objects.push(...bricks); //spread operator
    
    //initialize input handler
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
