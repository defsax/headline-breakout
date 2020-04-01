const api = 'https://api.rss2json.com/v1/api.json?rss_url=';

var feedURLS = [
  'http%3A%2F%2Ffeeds.bbci.co.uk%2Fnews%2Frss.xml',
  'https%3A%2F%2Fwww.huffpost.com%2Fsection%2Ffront-page%2Ffeed%3Fx%3D1',
  'https%3A%2F%2Fwww.yahoo.com%2Fnews%2Frss'
  ];

var post = {
  title: "blank",
  url: "www.blank.com"
};
var postArray = [];
  
function getNews(item){
  console.log(item);
  var xhr = new XMLHttpRequest();

  xhr.onreadystatechange = function(){
    if(xhr.readyState==4 && xhr.status==200){
      var data = JSON.parse(xhr.responseText);
      console.log(data);
      if(data.status == 'ok'){
        let t = data.items.length;
        for(let i = 0; i < t; i++){
          console.log(data.items[i].title);
          console.log(data.items[i].link);
          post.title = data.items[i].title;
          post.url = data.items[i].link;
          postArray.push({"title": data.items[i].title, "link": data.items[i].link});
        }
      }
      else{console.log("data status not okay.");}
    }
  };
  xhr.open('GET', api + item, true);
  xhr.send();
    
}

feedURLS.forEach(getNews);
