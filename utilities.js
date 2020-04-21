var utils = {
  add: function(a, b){
    return a + b;
  },
  getRndFloat: function(min, max) {
    return Math.random() * (max - min) + min;
  },
  timeStamp: function(){
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  }
}
