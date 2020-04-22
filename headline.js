var Headline = (function(){
  var feeds = [];
  var feedURLS = [
    'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml',
    'http://feeds.bbci.co.uk/news/rss.xml',
    'https://www.huffpost.com/section/front-page/feed?x=1',
    'https://www.cbc.ca/cmlink/rss-topstories',
    'https://hnrss.org/frontpage'
  ];
  var postArray = window.fetchnews(feedURLS);
  
  
  return {
    initialize: function(){
      if(feeds){
        console.log("Feeds.");
      }
      else{
        console.log("No feeds.");
      }
    },
    addFeed: function(feedURL){
      feeds.push(feedURL);
    },
    updateHeadline: function(){
      let headline = document.getElementById('title');
      //if news headlines are present in array
      if(postArray.length != 0){
        let randPost = Math.floor(Math.random() * postArray.length);
        headline.innerHTML = postArray[randPost].title;
        headline.href = postArray[randPost].link;
        
        console.log(postArray);
        adjustFontSize();

        postArray.splice(randPost, 1);
      }
      else{
        //otherwise don't draw
        document.getElementById('title').innerHTML = "";
        document.getElementById('title').href = "";
      }
    }
  }
})();
