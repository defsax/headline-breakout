(function(){
  const api = 'https://api.rss2json.com/v1/api.json?rss_url=';
  var postArray = [];
  var post = {
    title: " ",
    url: " "
  };
    
  function getNewsXHR(item){
    console.log(item);
    var xhr = new XMLHttpRequest();

    xhr.onreadystatechange = function(){
      if(xhr.readyState==4 && xhr.status==200){
        var data = JSON.parse(xhr.responseText);
        if(data.status == 'ok'){
          let t = data.items.length;
          for(let i = 0; i < t; i++){
            post.title = data.items[i].title;
            post.url = data.items[i].link;
            postArray.push({"title": data.items[i].title, "link": data.items[i].link});
          }
        }
        else{
          console.log("data status not okay.");
          return;
        }
      }
    };
    xhr.onerror = function(e){
      console.error(xhr.statusText);
    }
    xhr.open('GET', api + item, true);
    xhr.send();
  }
  
  //hardcoded nytimes rss fetch method
  function getNewsFETCH(){
    const DOMPARSER = new DOMParser();

    fetch('https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml')
    .then((response) => {
      //fetch doesn't reject on http errors, so check that it's okay
      if(response.ok){
        response.text().then((xmlTEXT) =>{
          console.log(xmlTEXT);
          try{
            
            let doc = DOMPARSER.parseFromString(xmlTEXT, "text/xml");
            console.log(doc);
            doc.querySelectorAll('item').forEach((item) => {
              //for each item returned by the parser, assign then i as another queryselector searching for title and link
              //let i = item.querySelector.bind(item);
              //var title = !!i('title') ? i('title').textContent : '-';
              //var link = !!i('link') ? i('link').textContent: '-';
              
              var title = item.querySelector('title').textContent;
              var link = item.querySelector('link').textContent;
              
              //filter out nytimes non-headlines
              if(title === 'Try Tiles' ||
                title === 'The Crossword, Vertex and More' ||
                title === 'Try Spelling Bee' ||
                title === '' ||
                title === "null")
                return;
              else
                postArray.push({"title": title, "link": link});
            })
          }catch(e){ console.error("Error in parsing feed."); }
        })
      }else{ console.error("HTTP error. Unable to fetch resource."); }
    })
  }
  
  
  
  window.fetchnews = function(urls){
    for(let i = 0; i < urls.length; i++)
      urls[i] = encodeURIComponent(urls[i])
    
    urls.forEach(getNewsXHR);
    getNewsFETCH();
    
    return postArray;
  };
})();
