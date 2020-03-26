window.onload = () => {
  //reference canvas
  var canvas = document.getElementById("myCanvas");
  //store rendering context
  var ctx = canvas.getContext("2d");
  
  //create starting position and offset variable per frame
  var x = 10;
  var y = canvas.height-30; 
  var dx = 2;
  var dy = -2;
  

  function draw(){
    //refresh context
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    //draw circle
    drawCirc(x, y, 30, "yellow");
    drawRect(100, 100, 50, 50, "red", "stroke");
    drawText("HELlo WorLD", 10, 50, "green", "stroke");
    
    //update position
    x += dx;
    y += dy;
  }
  setInterval(draw, 10);
  
  function drawCirc(xPos, yPos, r, color){
    ctx.beginPath();
    ctx.arc(xPos, yPos, r, 0, Math.PI*2, false);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
  }
  function drawRect(xPos, yPos, w, h, color, type){
    ctx.beginPath();
    ctx.rect(xPos, yPos, w, h);
    switch(type){
      case "stroke":
        ctx.strokeStyle = color;
        ctx.stroke();
        break;
      case "fill":
        ctx.fillStyle = color;
        ctx.fill();
        break;
      default:
        console.log("Unknown type.");
        break;
    }
    ctx.closePath();
  }
  function drawText(text, w, h, color, type){
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
}
