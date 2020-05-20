export default function HeadlineHandler(){
  var feeds = [];
  var headlineList = [];
  
  this.initialize = function(){
    if(feeds.length > 0){
      headlineList = window.fetchnews(feeds);
      //while(headlineList.length === 0)
        //console.log("Headlines not ready.");
      
      //headlineList.forEach(this.addListItem);
      
    }
    else{
      console.log("No feeds. Use addFeed method to add one.");
    }
  }
  this.addFeed = function(feedURL){
    feeds.push(feedURL);
  }
  this.updateHeadline = function(element){
    let headline = document.getElementById(element);
    //if news headlines are present in array
    if(headlineList.length != 0){
      let randPost = Math.floor(Math.random() * headlineList.length);
      headline.innerHTML = headlineList[randPost].title;
      headline.href = headlineList[randPost].link;

      headlineList.splice(randPost, 1);
    }
    else{
      //otherwise don't draw
      document.getElementById('title').innerHTML = "";
      document.getElementById('title').href = "";
    }
  }
  this.createList = function(){
    console.log("Create list");
    for(let i = 0; i < headlineList.length; i++){
      var container = document.getElementById("hlines");
      var newTitle = document.createElement('a');
      
      newTitle.innerHTML = headlineList[i].title + "<br>";
      newTitle.href = headlineList[i].link;
      newTitle.target = "_blank";
      
      container.appendChild(newTitle);
    }
  }
}
