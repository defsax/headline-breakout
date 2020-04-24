//bricks
export default function Bricks(gameWorld){
  var gameWidth = gameWorld.getScreenDimensions().width;
  var gameHeight = gameWorld.getScreenDimensions().height;
  this.rowCount = 3;
  this.colCount = 5;
  //this.w = 75;
  //this.h = 20;
  this.padding = 40;
  this.offsetTop = 10;
  this.offsetLeft = 10;
  this.offsetRight = 10;
  this.bArray = [];
  
  this.init = function(){
    for(let c = 0; c < this.colCount; c++){
      this.bArray[c] = [];
      for(let r = 0; r < this.rowCount; r++){
        this.bArray[c][r] = { 
          position : { x: 0, y: 0 },
          w: gameWidth / this.colCount, 
          h: 20
        };
      }
    }
  }
  
  this.update = function(dt){
    //console.log("bricks update");
  }
  
  this.draw = function(context){
    for(let c = 0; c < this.colCount; c++){
      for(let r = 0; r < this.rowCount; r++){
        let brickX = gameWidth / this.colCount * c;
        let brickY = 50 + 20 * r;
        //let brickX = (c * (this.bArray[c][r].w + this.padding)) + this.padding /2;// + this.offsetLeft;
        //let brickY = (r * (this.bArray[c][r].h + this.padding)) + this.padding / 3;
        this.bArray[c][r].position.x = brickX;
        this.bArray[c][r].position.y = brickY;
        
        context.beginPath();
        context.rect(brickX, brickY, this.bArray[c][r].w, this.bArray[c][r].h);
        context.fillStyle = "grey";
        context.fill();
        context.strokeStyle = "black";
        context.stroke();
        context.closePath();
      }
    }
    //console.log("Bricks draw.");
  }
}
