export default function Brick(columns, position, gameWorld){
  var gameWidth = gameWorld.getScreenDimensions().width;
  var gameHeight = gameWorld.getScreenDimensions().height;
  
  this.position = {
    x: position.x,
    y: position.y
  }
  
  this.width = gameWidth / columns;
  this.height = 20;
  
  
  this.update = function(dt){
    //console.log("Brick update");
  }
  
  this.draw = function(context){
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.width, this.height);
    context.fillStyle = "grey";
    context.fill();
    context.strokeStyle = "black";
    context.stroke();
    context.closePath();
  }
}
