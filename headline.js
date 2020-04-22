var Headline = (function(){
  var feeds = [];
  /*
  var feedURLS = [
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://www.huffpost.com/section/front-page/feed?x=1',
    'https://www.cbc.ca/cmlink/rss-topstories',
    'https://hnrss.org/frontpage'
  ];
  var postArray = window.fetchnews(feedURLS);
*/
  var headlineList = [];
  
  return {
    initialize: function(){
      if(feeds.length > 0){
        console.log("Feeds.");
        headlineList = window.fetchnews(feeds);
        console.log(headlineList);
      }
      else{
        console.log("No feeds.");
      }
    },
    addFeed: function(feedURL){
      feeds.push(feedURL);
    },
    updateHeadline: function(element){
      let headline = document.getElementById(element);
      //if news headlines are present in array
      if(headlineList.length != 0){
        let randPost = Math.floor(Math.random() * headlineList.length);
        headline.innerHTML = headlineList[randPost].title;
        headline.href = headlineList[randPost].link;
        
        console.log(headlineList);
        utils.adjustFontSize(element);

        headlineList.splice(randPost, 1);
      }
      else{
        //otherwise don't draw
        document.getElementById('title').innerHTML = "";
        document.getElementById('title').href = "";
      }
    }
  }
})();
