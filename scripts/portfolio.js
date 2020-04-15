function loadArticles(articles){
  var newHtml = "";
  
  for(var art = 0; art < articles.length; art++)
  {
    var newArticle =
    '<div class="container">' + '<div class="content">' + '<h2>' + articles[art].title + " (" + articles[art].date + ') </h2>' + articles[art].summary;
    if(articles[art].linktext != "")
    {
      console.log(articles[art].linktext);
      newArticle += '<br>' + '<span class="highlight">' + '<a target="_blank" href="' + articles[art].link + '">' + articles[art].linktext + '</a>' + '</span>';
    }
    newArticle += '</div>' + '</div>';

    newHtml += newArticle;
  }

  document.getElementsByClassName("timeline")[0].innerHTML = newHtml;
}

  function getArticlesFromJson()
  {
    var requestArticles = new XMLHttpRequest();

    requestArticles.open('GET', 'scripts/portfolioarticles.json');
    requestArticles.onload = function() {
    
      var data = JSON.parse(this.response);
    
      if (requestArticles.status >= 200 && requestArticles.status < 400) {
            loadArticles(data);
        } else {
            return;
        }
    }
    requestArticles.send();
  }
