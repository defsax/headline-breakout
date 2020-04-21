//paddle class
function Paddle(x, y, w, h, speed){
  this.position = { x, y };
  this.w = w;
  this.h = h;
  this.speed = speed;
  this.rightPressed = false;
  this.leftPressed = false;
  
  this.draw = function(context){
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.w, this.h);
    context.fillStyle = "black";
    context.strokeStyle = "black";
    context.fill();
    context.stroke();
    context.closePath();
  }
  
  this.update = function(dt, canvas){
    this.input(dt, canvas);
  }
  
  //PADDLE MOVEMENT/CHECKING
  this.input = function(dt, canvas){
    if(this.rightPressed){
      this.position.x += dt * this.speed;
      if(this.position.x + this.w > canvas.width)
        this.position.x = canvas.width - this.w;
    }
    else if(this.leftPressed){
      this.position.x -= dt * this.speed;
      if(this.position.x < 0)
        this.position.x = 0;
    }
  }
}
