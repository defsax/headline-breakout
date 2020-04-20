function World() {
  //private
  var objects = [];
  var canvas2 = document.getElementById("myCanvas");
  var ctx = canvas2.getContext("2d");
  
  //private method
  var update = function(){
    console.log("Update func. Called method from inside World class");
  }
  var draw = function(){
    for(let i = 0; i < objects.length; i++){
      ctx.beginPath();
      objects[i].draw(ctx);
      ctx.closePath();
      console.log("Draw func");
    }
  }
  
  //canvas reference
  //var canvas2 = document.getElementById("myCanvas2");
  //store rendering context
  //var ctx = canvas2.getContext("2d");
  this.addObject = function(obj){
    objects.push(obj);
  };
  
  this.draw = function(){
    for(let i = 0; i < objects.length; i++){
      ctx.beginPath();
      objects[i].draw(ctx);
      ctx.closePath();
      console.log("Draw func");
      update();
    }
  };
  this.run = function(){
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
