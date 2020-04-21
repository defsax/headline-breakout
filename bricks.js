//bricks
function Bricks(){
  this.rowCount = 3;
  this.colCount = 5;
  //this.w = 75;
  //this.h = 20;
  this.padding = 100;
  this.offsetTop = 60;
  this.offsetLeft = 60;
  this.bArray = [];
  
  this.init = function(context){
    for(let c = 0; c < this.colCount; c++){
      this.bArray[c] = [];
      for(let r = 0; r < this.rowCount; r++){
        this.bArray[c][r] = { 
          position : { x: 0, y: 0 },
          w: 75, 
          h: 20
        };
      }
    }
  }
  
  this.update = function(dt, canvas){
    //console.log("bricks update");
  }
  
  this.draw = function(context){
    for(let c = 0; c < this.colCount; c++){
      for(let r = 0; r < this.rowCount; r++){
        let brickX = (c * (this.bArray[c][r].w + this.padding)) + this.offsetLeft;
        let brickY = (r * (this.bArray[c][r].h + this.padding)) + this.offsetTop;
        this.bArray[c][r].position.x = brickX;
        this.bArray[c][r].position.y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, this.bArray[c][r].w, this.bArray[c][r].h);
        context.fillStyle = "blue";
        context.fill();
        context.closePath();
      }
    }
  }
}
