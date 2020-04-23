import World from './world.js';

//canvas reference
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.width = document.body.clientWidth;
canvas.height = window.innerHeight;

//fit initial message to screen size
utils.adjustFontSize('title');

//rss feeds
//nytimes, huffpo, bbc, cbc, hackernews
Headline.addFeed('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
Headline.addFeed('http://feeds.bbci.co.uk/news/rss.xml');
Headline.addFeed('https://www.huffpost.com/section/front-page/feed?x=1');
Headline.addFeed('https://www.cbc.ca/cmlink/rss-topstories');
Headline.addFeed('https://hnrss.org/frontpage');
Headline.initialize();


var world = new World(canvas.width, canvas.height);
world.start();


//timing vars
var now;
var dt = 0;
var last = utils.timeStamp();

function gameLoop(){
  now = utils.timeStamp();
  dt = (now - last) / 1000;
  
  if(!world.gameOver){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    world.update(dt);
    world.draw(ctx);
    
    //visualize deltatime
    world.drawText(dt.toString(), 10, 25, "black", "fill", ctx);
    
    last = now;
    
    requestAnimationFrame(gameLoop);
  }
};
requestAnimationFrame(gameLoop);

