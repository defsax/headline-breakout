function World() {
  //private
  var objects = [];
  //canvas reference
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  canvas.width = document.body.clientWidth;
  canvas.height = window.innerHeight;
  var cvs = { width: canvas.width, height: canvas.height };
  
  //timing vars
  var now;
  var dt = 0;
  last = utils.timeStamp();
  
  //private methods
  var update = function(dt){
    if(objects){
      for(let i = 0; i < objects.length; i++){
        objects[i].update(dt, cvs);
      }
    }
  }
  var draw = function(dt){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < objects.length; i++){
      ctx.beginPath();
      objects[i].draw(ctx);
      ctx.closePath();
    }
  }
  
  var drawText = function(text, w, h, color, type){
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
  this.loop = function(){
    now = utils.timeStamp();
    dt = (now - last) / 500; 
    drawText(dt, 1000, 100, "black", "fill");
    
    update(dt);
    draw(dt);
    
    last = now;
    
    var loopBind = this.loop.bind(this);
    requestAnimationFrame(loopBind);
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
}
