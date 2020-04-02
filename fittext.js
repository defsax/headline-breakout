/*!	
* FitText.js 1.0 jQuery free version
*
* Copyright 2011, Dave Rupert http://daverupert.com 
* Released under the WTFPL license 
* http://sam.zoy.org/wtfpl/
* 
* forked from davatron5000/FitText.js
* Modified by Slawomir Kolodziej http://slawekk.info
* forked from slawekkolodziej/FitText.js
* Modified by Jeremy Keith https://adactio.com/
*
* Date: Tue Aug 09 2011 10:45:54 GMT+0200 (CEST)
*/

(function(){
  var addEvent = function(element, type, fn){
    if(element.addEventListener)
      element.addEventListener(type, fn, false);
    else
      element.attachEvent('on'+type, fn);
  };
  
  var extend = function(obj, ext){
    for(var key in ext){
      if(ext.hasOwnProperty(key))
        obj[key] = ext[key];
    }
    return obj;
  };
  
  window.fittext = function(element, comp, options){
    var settings = extend({
      'minFontSize' : -1/0,
      'maxFontSize' : 1/0
    }, options);
    
    var fit = function(element){
      var compressor = comp || 1;
      
      var resizer = function() {
        var fSize = Math.max(Math.min(element.clientWidth / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
        element.style.fontSize = Math.max(Math.min(element.clientWidth / (compressor * 10), parseFloat(settings.maxFontSize)), parseFloat(settings.minFontSize)) + 'px';
        console.log("font-size: " + fSize);
      };
      
      //call once to set
      resizer();
      
      //bind events
      addEvent(window, 'resize', resizer);
      addEvent(window, 'orientationchange', resizer);
    };
    
    if(element.length){
     for(let i = 0; i < element.length; i++)
       fit(element[i]);
    }else{
      fit(element);
    }
    
    //return set of elements
    return element;
    
  };
})();
