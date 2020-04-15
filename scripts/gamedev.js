/*
Declare some global variables to store some of the information we collect/use
 - apiIsOnline: if our tags enpoint throws an error this toggles to false and makes the game idea generator disappear in our html code
 - toggles: keeps track of all the lock toggles to lock in genres/tags we collect
 - currentGenres: keeps track of the genres/tags we collect
 - currentGames: keeps track of the games we collect based on our genres/tags
 - masupStartPossibilities: stores some sentences we can use to glue our currentGames together in the html
 - mashupEndPossibilities: stores some sentences we can use to glue our currentGames together in the html
 - popularityThreshold: this number keeps track of the treshhold we take into account when accepting/refusing genres/tags into our currentGenres
*/

var apiIsOnline = true;
var toggles = [false, false, false, false];
var currentGenres = ["", "", "", ""];
var currentGames = ["", "", "", ""];

var mashupStartPossibilities = ["So a combination between ", "So if ", "So like a ", "So a chemical experiment between "];
var mashupEndPossibilities = ["", "had a foursome baby", "mash potato salad", ""];

var popularityThreshold = 100;

//this function is called on the body's load or when the user wants to generate new genres/tags, so we check all toggles and if they are not enabled we assign a new genre to them
function assignNewGenres()
{
    for(var i = 0; i < toggles.length; i++)
    {
        if(toggles[i] == false)
        {
            getGenres(i);
        }
    }
}

/**
 * Here we get a random tag from all of our available tags and display it
 * @constructor
 * @param {int} cnt - takes in the amount of tags that are available in the api
 * @param {int} id - takes in the id of the genre/tag that we want to replace
 * */
function assignGenres(cnt, id)
{
    var genres = document.getElementsByClassName("genre");
    var requestingAtId = Math.floor(Math.random() * cnt);
    var requestGenre = new XMLHttpRequest();

    requestGenre.open('GET', 'https://api.rawg.io/api/tags/'.concat(requestingAtId));
    requestGenre.onload = function() {
      // Begin accessing JSON data here
      var data = JSON.parse(this.response);
    
      if (requestGenre.status >= 200 && requestGenre.status < 400) {
          //console.log(data);
      } else {
            //api sometimes throws random 404 because tags have been deleted or whatever so this is neccesary
            assignGenres(cnt, id);
            return;
      }

      //we match the amount of games made with this tag against our popularity threshold to avoid rubbish tags
      if(data.games_count > popularityThreshold)
      {
        currentGenres[id] = data.name;
        genres[id].innerHTML = currentGenres[id];
        assignGames(requestingAtId, id, false);
      }
      else
      {
          //if too few games have been made with this tag we display rubbish and try again
        genres[id].innerHTML = getRubbish(5);
        assignGenres(cnt, id);
        assignGames(requestingAtId, id, true);
      }
    }
    requestGenre.send();
}

/**
 * Here we get the most popular game from a tag, put it in currentgames and display it
 * @constructor
 * @param {string} tag - takes in the tag we need to find a game for
 * @param {int} id - takes in the id of the game we want to replace
 * @param {boolean} rubbish - takes in a boolean for if we want our html to display rubbish for this game or the actual game that we found
 * */
function assignGames(tag, id, rubbish)
{
    var games = document.getElementsByClassName("game");
    var links = document.getElementsByClassName("gamelink");

    if(rubbish)
    {
        games[id].innerHTML = getRubbish(5);
    }
    else
    {
        var requestGenre = new XMLHttpRequest();
    
        requestGenre.open('GET', 'https://api.rawg.io/api/games?tags='.concat(tag));
        requestGenre.onload = function() {
          // Begin accessing JSON data here
          var data = JSON.parse(this.response);
    
          //console.log(data.results[0]);

          games[id].innerHTML = data.results[0].name;
          links[id].href = "https://rawg.io/games/".concat(data.results[0].slug);
        }
        requestGenre.send();

        
        if(id == 0)
        {
            var pick = Math.floor(Math.random() * mashupStartPossibilities.length);
            document.getElementById("mashup-start").innerHTML = mashupStartPossibilities[pick];
            document.getElementById("mashup-end").innerHTML = mashupEndPossibilities[pick];
        }
    }
}

/**
 * Here we get all the tags available in our api
 * @constructor
 * @param {int} id - takes in the id of the genre/tag we want to replace
 * */
function getGenres(id)
{
    var requestCount = new XMLHttpRequest();

    //if you want to simulate the api being offline just add ?page=0, it throws an error
    requestCount.open('GET', 'https://api.rawg.io/api/tags');
    requestCount.onload = function() {

      var data = JSON.parse(this.response);

      if (requestCount.status >= 200 && requestCount.status < 400) {
            //console.log(data);
        } else {
            //if get error from this endpoint make the app unavailable
            console.log("Api is currently offline");
            apiIsOnline = false;
            var generator = document.getElementById("generator");
            generator.parentNode.removeChild(generator);
            document.getElementById("status").innerHTML = "The Game Idea Generator is unfortunately not available at this time, please check back later";
            return;
        }
    
        assignGenres(data.count, id);
    }
    requestCount.send();
}

/**
 * Here we toggle a button if so requested from the user
 * @constructor
 * @param {int} index - takes in the index of the toggle that's been pressed
 * */
function toggleButton(index) 
{
    var toggle = document.getElementsByClassName("toggle");

        if (toggle[index].classList.contains('off')) 
        {
            toggle[index].classList.remove('off');
            toggle[index].classList.add("on");
            toggle[index].innerHTML = "🔒";
        }
        else
        {
            toggle[index].classList.remove('on');
            toggle[index].classList.add("off");
            toggle[index].innerHTML = "🔓";
        }
        
    if(toggles[index] == false)
    {
        toggles[index] = true;
    }
    else
    {
        toggles[index] = false;
    }
}


/**
 * Returns a combination of characters upon request
 * @constructor
 * @param {int} length - takes in how long the returned string should be
 * */
function getRubbish(length) {
    var result           = '';
    var characters       = '@#$%^&*(){}_-+=?!';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }

//if the spacebar is pressed don't scroll the page and assign new genres
window.onkeydown = function(e) 
{
    if(e.keyCode == 32 && e.target == document.body) {
        e.preventDefault();
        assignNewGenres();
        return false;
    }
}