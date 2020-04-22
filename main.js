import InputHandler from "./input.js";

//fit initial message to screen size
utils.adjustFontSize('title');

var paddle = new Paddle((document.body.clientWidth - 75) / 2, 
                        window.innerHeight - (10 * 3), 
                        75, 10, 300);

var bricks = new Bricks();
bricks.init(document.body.clientWidth, window.innerHeight);

var ball = new Ball(20, 20, 10, 150);
ball.randomizeColor();
ball.paddleReference = paddle;
ball.bricksReference = bricks;

var world = new World();
world.addObject(paddle);
world.addObject(ball);
world.addObject(bricks);

var inputHandler = new InputHandler(paddle, ball);
inputHandler.initialize();

//rss feeds
//nytimes, huffpo, bbc, cbc, hackernews
Headline.addFeed('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml');
Headline.addFeed('http://feeds.bbci.co.uk/news/rss.xml');
Headline.addFeed('https://www.huffpost.com/section/front-page/feed?x=1');
Headline.addFeed('https://www.cbc.ca/cmlink/rss-topstories');
Headline.addFeed('https://hnrss.org/frontpage');
Headline.initialize();

requestAnimationFrame(function(){world.loop();});

