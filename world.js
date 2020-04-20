function World() {
  //private
  var objects = [];
  //canvas reference
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  canvas.width = document.body.clientWidth;
  canvas.height = window.innerHeight;
  
  //private methods
  var update = function(){
    console.log("Update func. Called method from inside World class");
  }
  var draw = function(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < objects.length; i++){
      ctx.beginPath();
      objects[i].draw(ctx);
      ctx.closePath();
      console.log("Draw func");
    }
  }
  
  //public methods
  this.addObject = function(obj){
    objects.push(obj);
  };
  this.loop = function(){
    draw();
    update();
  };
  this.listObjects = function(){
    if(objects){
      for(let i = 0; i < objects.length; i++){
        console.log(objects[i]);
      }
    }
  };  
}
