//paddle class
function Paddle(x, y, w, h, speed){
  this.position = { x, y };
  this.w = w;
  this.h = h;
  this.speed = speed;
  
  this.draw = function(context){
    context.beginPath();
    context.rect(this.position.x, this.position.y, this.w, this.h);
    context.fillStyle = "black";
    context.strokeStyle = "black";
    context.fill();
    context.stroke();
    context.closePath();
  }
  //PADDLE MOVEMENT/CHECKING
  this.input = function(dt){
    if(rightPressed){
      this.position.x += 1 * dt * this.speed;
      if(this.position.x + this.w > canvas.width)
        this.position.x = canvas.width - this.w;
    }
    else if(leftPressed){
      this.position.x -= 1 * dt * this.speed;
      if(this.position.x < 0)
        this.position.x = 0;
    }
  }
}
