//Liri takes the following arguments
// my-tweets
// spotify-this-song
// movie-this
// do-what-it-says


//twitter api keys imported from secure file (keys.js)
	var keys = require("./keys.js");

//modules
	var fs = require("fs"); //file system
	var Twitter = require("twitter");
	var spotify = require("spotify");
	var rp = require("request-promise");

// Take two arguments 
	var action = process.argv[2];
	var value = process.argv[3];
	var logData = "";

// switch-case statement to get function run
switch(action){
    case "my-tweets":
        getTweets();
        break;

     case "post-tweet":
        postTwitter();
        break;

    case "spotify-this-song":
        getSong();
        break;

    case "movie-this":
        searchMovieName();
        break;

    case "do-what-it-says":
        doIt();
        break;

    default:
      console.log("LIRI doesn\'t know that");
	}


//############### TWITTER ###############//
	function getTweets() {

	//pulling in keys for request
	    var twitterKeys = new Twitter({
	        consumer_key: keys.twitterKeys.consumer_key,
		    consumer_secret: keys.twitterKeys.consumer_secret,
		    access_token_key: keys.twitterKeys.access_token_key,
		    access_token_secret: keys.twitterKeys.access_token_secret
	    });
    	
	    var params = {
	  	    screen_name: "monroe_park",
	  	    //"potus",
	  	    count: 20
	  	};

	    twitterKeys.get('statuses/user_timeline', params, function(error, tweets, response) {
	     	if (error) {
	            console.log(error);
	            return;
            }
                console.log("*******************" + "MY 20 TWEETS!" + "********************");	
	        for(var i = 0; i < tweets.length; i++){
				console.log("\n" + (i + 1) + " - " +  tweets[i].text.replace('@_', ' '));
				console.log("******************************************************");
			    logData = [tweets[i].text.replace('@_', ' ')];
		        writeLog();
	        }
	     });
	}//end of getTweets


//############# POSTING ON TWITTER ###############// not working yet
	function postTwitter() {
		var params = {
			status: process.argv[3]
		};
		var promise = twitterKeys.post('statuses/update', params);

            promise.then(function (data) {
                   console.log("Tweet Posted!");
            })
            .catch(function (error) {
            	console.log("Error")
            });
     }// end of postTwitter


//############### MOVIE-THIS ###############//
function searchMovieName() {
    if (process.argv.length < 4){
     	value = "Mr. Nobody";
     	getMovieData();
     } else {
     	value = process.argv[3];
     	getMovieData();
     }       

}//end of searchMovieName

function getMovieData() {
  rp({
	    url: "http://www.omdbapi.com/?t=" + value + "&y=&plot=short&r=json",
	    json: true // Automatically parses the JSON string in the response
	})
	    .then(function (data) {
	    	console.log("*********************" + "OMDB Result" + "********************");	
	        console.log("Movie Title: " + data.Title);
	        console.log("Year: " + data.Year);
	        console.log("IMDB Rating: " + data.imdbRating);
	        console.log("Country: " + data.Country);
	        console.log("Language: " + data.Language);
	        console.log("Plot: " + data.Plot);
	        console.log("Actors: " + data.Actors);
	        console.log("Rotten Tomatoes Rating: " + data.Ratings[1].Value);
	        console.log("******************************************************");
		    logData = {
		    	Title: data.Title, 
    	        Year: data.Year, 
    	        ImdbRating: data.imdbRating, 
    	        Country: data.Country, 
    	        Language: data.Language, 
    	        Plot: data.Plot, 
    	        Actors: data.Actors, 
    	        rottenTomatoesRating: data.Ratings[1].Value
	    	 };
			writeLog();
	    })
	    .catch(function (err) {
	        // API call failed...
	    });

} //end of getMovieData
	

//############### SPOTIFY-THIS-SONG ###############//
function getSong() {
     if (process.argv.length < 4){
     	value = "Ace of Base - The Sign";
     	playSong();
     } else {
     	value = process.argv[3];
     	playSong();
     }
}//end of getSong

function playSong() {
  spotify.search({type: 'track', query: value}, function(err, data) {
     if (!err) {
    	console.log("********************" + "Spotify Result" + "********************");	
    	console.log("Song Title: " + data.tracks.items[0].name);
        console.log("Album: " + data.tracks.items[0].album.name);
    	console.log("Artist(s): " + data.tracks.items[0].artists[0].name)
        console.log("Preview Link: " + data.tracks.items[0].preview_url);
        console.log("******************************************************");
        logData = {
        	songName: data.tracks.items[0].name,
            Album: data.tracks.items[0].album.name,
        	Artists: data.tracks.items[0].artists[0].name, 
        	previewLink: data.tracks.items[0].preview_url
        };
		writeLog();
     }
  }); //end of spotify.search
}//end of playSong



//############### DO-WHAT-IT-SAYS ###############//
function doIt() {
	fs.readFile("random.txt", "utf8", function(error, data){
		var myArr = data.split(",")
		value = myArr[1] 
		playSong();
	})
}//end of doit


//############### WRITE DATA TO LOG.TXT ###############//
function writeLog() {
	 fs.appendFile("log.txt", JSON.stringify(logData, null, "\t"), (err) => {
		if ( err ) {
	        return console.log(err);
	    }
	    console.log("log.txt was updated!");
     })
     

    // fs.appendFile("log.txt", '\r\n\r\n');

    // fs.appendFile("log.txt", JSON.stringify(data), function(err) {
    // if (err) {
    //   return console.log(err);
    // }

    // console.log("log.txt was updated!");
  
}//end of writeLog





















