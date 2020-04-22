var utils = {
  add: function(a, b){
    return a + b;
  },
  getRndFloat: function(min, max) {
    return Math.random() * (max - min) + min;
  },
  timeStamp: function(){
    return window.performance && window.performance.now ? window.performance.now() : new Date().getTime();
  },
  reset: function(){
    document.location.reload();
  },
  adjustFontSize: function(element){
    //scale font to fit screen on paddle hit
    let headline = document.getElementById(element);
    headline.style.fontSize = '250px';
    let hlFontSize = window.getComputedStyle(headline, null).getPropertyValue('font-size');
    
    //adjust font to available canvas height
    while(headline.clientHeight > window.innerHeight){
      hlFontSize = window.getComputedStyle(headline, null).getPropertyValue('font-size');
      let fontSize = parseInt(hlFontSize);
      headline.style.fontSize = (fontSize - 10) + 'px';
    }
    //adjust font to available canvas width (for mobile or vertical)
    while(headline.clientWidth > document.body.clientWidth){
      hlFontSize = window.getComputedStyle(headline, null).getPropertyValue('font-size');
      let fontSize = parseInt(hlFontSize);
      headline.style.fontSize = (fontSize - 10) + 'px';
    }
  }
}
