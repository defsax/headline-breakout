export default function InputHandler(paddle, ball){
  
  this.initialize = function(){
    //input event listeners
    document.addEventListener("keydown", keyDownHandler, false);
    
    document.addEventListener("keyup", keyUpHandler, false);
    document.addEventListener("touchstart", touchStartHandler, false);
    document.addEventListener("touchmove", touchMoveHandler, { passive: false });
    document.addEventListener("touchend", touchEndHandler, false);
    document.getElementById("resButton").addEventListener("click", utils.reset);
  }
  
   //INPUT CONTROLS
  
  //KEYBOARD CONTROLS
  var keyDownHandler = function(e){
    if(e.key == "Right" || e.key == "ArrowRight")
      paddle.rightPressed = true;
    else if(e.key == "Left" || e.key == "ArrowLeft")
      paddle.leftPressed = true;
    else if(e.keyCode == 32 && ball.attached === true){
      console.log("Space pressed.");
      ball.calculateStartAngle();
      ball.attached = false;
      document.getElementById('title').innerHTML = " ";
    }
  }
  var keyUpHandler = function(e){
    if(e.key == "Right" || e.key == "ArrowRight")
      paddle.rightPressed = false;
    else if(e.key == "Left" || e.key == "ArrowLeft")
      paddle.leftPressed = false;
    else if(e.keyCode == 32)
      console.log("Space released.");
  }
  
  //TOUCH CONTROLS
  var touchStartHandler = function(e){
    e.preventDefault();
    paddle.position.x = e.touches[0].clientX - paddle.w / 2;
  }
  var touchMoveHandler = function(e){
    e.preventDefault();
    paddle.position.x = e.touches[0].clientX - paddle.w / 2;
    if(paddle.position.x + paddle.w > document.body.clientWidth)
        paddle.position.x = document.body.clientWidth - paddle.w;
    else if(paddle.position.x < 0)
        paddle.position.x = 0;
  }
  var touchEndHandler = function(e){
    if(ball.attached === true){
      ball.calculateStartAngle();
      ball.attached = false;
      document.getElementById('title').innerHTML = " ";
    }
    e.preventDefault();
  }
}
