require("dotenv").config();
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var moment = require('moment');
var Spotify = require("node-spotify-api");

// accept third command line argument for WHICH function we want to perform
const liriAction = process.argv[2];

switch (liriAction) {
  case "my-tweets":
    GetTweets();
    break; // with no break, all cases will be ran until we meet a break.
  case "spotify-this-song":
    GetSong();
    break;
  case "movie-this":
    GetOMDB();
    break;
  case "do-what-it-says":
    DoWhatItSays();
    break;
  default:
    text = "broken";
}

function GetTweets() {
  var twitterKeys = keys.twitterKeys;

  var twitterClient = new Twitter({
    consumer_key: twitterKeys.consumer_key,
    consumer_secret: twitterKeys.consumer_secret,
    access_token_key: twitterKeys.access_token_key,
    access_token_secret: twitterKeys.access_token_secret
  })

  // we are getting the tweets of user 'tom'....http://www.twitter.com/tom
  var params = {
    screen_name: 'tom'
  };

  twitterClient.get('statuses/user_timeline', params, function(error, tweets, response) {
    console.log("--------------------------");
    console.log("TWITTER FEED (" + params.screen_name + ")");
    console.log("--------------------------");

    // if there is no error, list tweets numerically and creation date.
    if (!error) {
      for (var i = 0; i < 6; i++) {
        console.log((i + 1) + ": " + tweets[i].text + " (Posted: " + tweets[i].created_at + ")");
      }
    }
    console.log("--------------------------");
  })
}

function GetSong(songName) {
  // song name we are searching for is equal to 4th argument if it is not empty
  if (process.argv[3] != null) {
    songName = process.argv[3];
  }

  // if it is songName hasn't been declared because of no 4th argument, it is set to default
  else if (songName === undefined) {
    songName = "ace sign";
  }

  var spotifyKeys = keys.spotifyKeys;

  var spotify = new Spotify({
    id: spotifyKeys.id,
    secret: spotifyKeys.secret
  });

  spotify

    // returning 3 tracks querying 4th argument input
    .search({
      type: 'track',
      query: songName,
      limit: 3
    })
    .then(function(response) {
      console.log("--------------------------");
      console.log("SPOTIFY RESULTS");
      for (var i = 0; i < (response.tracks.items.length); i++) {
        console.log("--------------------------");
        for (var j = 0; j < response.tracks.items[i].artists.length; j++) {
          if (j === 0) {
            var artistList = response.tracks.items[i].artists[j].name;
          } else {
            artistList += ", " + response.tracks.items[i].artists[j].name;
          }
        }
        console.log("Artist(s): " + artistList);
        console.log("Song Name: " + response.tracks.items[i].name);
        console.log("Album Name: " + response.tracks.items[i].album.name);
        console.log("Preview Link: " + response.tracks.items[i].preview_url);
      }
    })
    .catch(function(err) {
      console.log(err);
    });
}

function GetOMDB() {
  // if there was no 4th argument default to "Mr Nobody"
  if (process.argv[3] === undefined) {
    movieName = "Mr. Nobody";
  }

  // if there is a 4th argument we pass that query into queryURL for OMDB Api
  else {
    var movieName = process.argv[3];
  }

  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=TRILOGY";

  request(queryUrl, function(error, response, body) {
    // if no error found or exception raised from non-200 HTTP status code
    if (!error && response.statusCode === 200) {
      console.log("--------------------------");
      console.log("MOVIE SEARCH RESULTS");
      console.log("--------------------------");
      // use parse to get the value of described by key
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Year: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      // use Rotten Tomatoes Rating
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
      // use Metacritic Rating
      console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value);
      console.log("Country: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("--------------------------");
    }
  })
}

function DoWhatItSays() {

  fs.readFile("random.txt", "utf8", function(error, data) {
    // console.log(data);
    var dataArr = data.split(",");
    var commandInternal = dataArr[0];
    var songName = dataArr[1];

    GetSong(songName);
  })
}

function CommandInstructions() {
  console.log("");
};
