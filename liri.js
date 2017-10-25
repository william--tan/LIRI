//MODULES
var keys = require('./keys');
var fs = require('fs');
var table = require('table');
var spotify = require('spotify-web-api-node');
var twitter = require('twitter');
var request = require ('request');
var inquirer = require('inquirer');
var _ = require('underscore');
var moment = require('moment');
var timeAgo = require('node-time-ago');
var emojiStrip = require('emoji-strip');

//NODE INIT
function init(input1, input2){
	switch (input1)
	{
		case 'my-tweets':
			getTwitterFeed(input2);
		break;
		case 'spotify-this-song':
			getTrack(input2);
		break;
		case 'movie-this':
			getMovie(input2);
		break;
		case 'do-what-it-says':
			getCommands(input2)
		break;
		default: //GOES TO INQUIRER
			inquirer.prompt([
				{
					type: 'list',
					message: 'What do you want to do?',
					choices: ['Show Tweets', 'Search Song from Spotify', 'Search for a Movie', 'Read Commands from a .txt File', 'Exit'],
					name: 'choice'
				}
			]).then(r => {
				switch(r.choice)
				{
					case 'Show Tweets':
						inquirer.prompt([{
							type: 'input',
							message: 'Whose tweets? (Press Enter for my tweets)',
							name: 'userid'
						}]).then(a => getTwitterFeed(a.userid));
					break;
					case 'Search Song from Spotify':
						inquirer.prompt([{
							type: 'input',
							message: `What Song? (Press Enter for 'The Sign' by Ace of Base)`,
							name: 'track_title'
						}]).then(a => {
							if (a.track_title == '') {return getTrack()}
							getTrack(a.track_title)});
					break;
					case 'Search for a Movie':
						inquirer.prompt([{
							type: 'input',
							message: "Name of the Movie? (Press Enter for 'Inception')",
							name: 'movie_name'
						}]).then(a => {
							if (a.movie_name == '') {return getMovie()}
							getMovie(a.movie_name)})
					break;
					case 'Read Commands from a .txt File':
						inquirer.prompt([{
							type: 'input',
							message: "Name of the text file? (Press enter for 'random.txt')",
							name: 'txtfile'
						}]).then(a => {
							if (a.txtfile == '') {return getCommands()}
							getCommands(a.txtfile)})
					break;
					case 'Exit':
						console.log("Goodbye")
						return;
					break;
				}	
			})
		break;
	}
}
init(process.argv[2], process.argv[3]);

//MOVIE (OMDB)
function getMovie(movie_title = 'Inception')
{
	var time1 = moment();
	request(`http://www.omdbapi.com/?apikey=40e9cece&t=${movie_title}&tomatoes=true&r=json`, (err, res, data) => {
		if (err) return console.log(err);

		var movie = JSON.parse(data);
		//console.log(movie);
		let tabledata = [
			['TITLE', movie.Title],
			['YEAR', movie.Year],
			['IMDB RATING', movie.imdbRating],
			['COUNTRY', movie.Country],
			['LANGUAGE', movie.Language],
			['PLOT', movie.Plot],
			['ACTORS', movie.Actors],
			['ROTTEN TOMATOES RATING', movie.tomatoRating],
			['ROTTEN TOMATOES URL', movie.tomatoURL]
		];

		let config = {columns: {0:{width: 15, wrapWord: true},
								1:{width: 30, wrapWord: true}}};
		let output = table.table(tabledata, config);
		console.log(output);
		var log = `COMMAND: < movie-this "${movie_title}" > | executed at ${moment(time1).format("HH:mm:ssA on MM-DD-YYYY")} for ${moment().diff(time1, 'milliseconds')/1000} seconds\r\n`
			fs.appendFile("log.txt", log, err => {if (err) return console.log(err)})
	})
}

//SPOTIFY
function getTrack(track = 'The Sign Ace of Base'){
	var time1 = moment();
	var s = new spotify(keys.spotify);
	//Get Access to Spotify Web API
	s.clientCredentialsGrant().then(res => {
		//console.log(res);
		s.setAccessToken(res.body['access_token']);
		var tracks = [];        
		//SEARCH TRACK
		s.searchTracks(track).then(track_data => {
			//console.log(track_data)
			//GET SEARCH RESULTS AND APPEND TO 'tracks' ARRAY
			track_data.body.tracks.items.forEach(v => {
				tracks.push({
					title: v.name,
					album: v.album.name,
					//GET ALL ARTISTS ASSOCIATED TO THE SONG
					artist: (() => {
						var artists = [];
						v.artists.forEach(a => {artists.push(a.name)});
						return artists.join(', ')
					})(),
					//CONVERT DURATION FROM MILLISECONDS TO MINUTES:SECONDS
					duration: (() => {
						let minutes = Math.floor(v.duration_ms/60000);
						let seconds = Math.floor((v.duration_ms%60000)/1000);
						if (seconds < 10) seconds = "0"+seconds;
						return `${minutes}:${seconds}`
					})(),
					url: v.external_urls.spotify
				})
			})

			//DISPLAY RESULTS ON A TABLE
			let data = [];
			let config = {
				columns: {
					1: {
						width: 20,
						wrapWord: true
					},
					2: {
						width: 20,
						wrapWord: true
					},
					3: {
						width: 20,
						wrapWord: true
					},
					5: {
						width: 15
					},
				}
			}
			
			let count = 1; //SONG COUNT
			tracks.forEach(v => {
				//CONVERT TO ARRAY
				data.push([count ,..._.values(v)])
				count++;
			});

			if (data.length > 10) data.splice(10, tracks.length);
			//TABLE HEADINGS
			data.unshift(["#", "TRACK TITLE", "ALBUM", "ARTIST(S)", "DURATION", "LINK"]);
			let output = table.table(data, config); //CREATE TABLE USING NPM PACKAGE 'table'
			console.log(output); //SHOW THE TABLE OUTPUT


			//LOG
			var log = `COMMAND: < spotify-this-song "${track}" > | executed at ${moment(time1).format("HH:mm:ssA on MM-DD-YYYY")} for ${moment().diff(time1, 'milliseconds')/1000} seconds\r\n`
			fs.appendFile("log.txt", log, err => {if (err) return console.log(err)});

		}, err => {
			console.log(err);
			var log = `ERROR: ${err} at ${moment(time1).format("HH:mm:ssA on MM-DD-YYYY")}\r\n`
			fs.appendFile("log.txt", log, err => {if (err) return console.log(err)});
		})
	}, err => {console.log(err); 
		var log = `ERROR: ${err} at ${moment(time1).format("HH:mm:ssA on MM-DD-YYYY")}\r\n`
		fs.appendFile("log.txt", log, err => {if (err) return console.log(err)});})
}

//TWITTER
function getTwitterFeed(twitterid = ''){
	var t = new twitter(keys.twitter);
	var time1 = moment();
	t.get(`statuses/user_timeline/${twitterid}`, {count: 20}, function(error, tweets, response){
		if (error) console.log(error);
		//ARRAY FOR TWITTER FEED
		var tweet_data = [];
		//PUSH TWEETS TO ARRAY
		tweets.forEach(v => {
			tweet_data.push({
				tweet: v.text, 
				date: v.created_at,
			})});
		
		//DISPLAY IN TABLE
		let data = [];
		let config = {
			columns:{
				1: {
					width: 50,
					wrapWord: true
				},
				2: {
					width: 15,
					wrapWord: true
				}
			}
		};
		let count = 1;
		tweet_data.forEach(v => {
			data.push([count, emojiStrip(v.tweet).replace(/[\x00-\x1F\x7F-\x9F]/g, ""), moment(new Date(v.date)).format("h:mm A,  MMMM Do, YYYY"), timeAgo(new Date(v.date))])
			count++;
		})
		//TABLE HEADINGS
		if (twitterid == '') twitterid = "weirdummy";
		data.unshift(["#", `TWEETS BY @${twitterid}`, "DATE CREATED", "TIME AGO"]);
		
		//SHOW TABLE
		let output = table.table(data, config);
		console.log(output);
		var log = `COMMAND: < my-tweets ${twitterid} > | executed at ${moment(time1).format("HH:mm:ssA on MM-DD-YYYY")} for ${moment().diff(time1, 'milliseconds')/1000} seconds\r\n`
			fs.appendFile("log.txt", log, err => {if (err) return console.log(err)})

	})
}

//GET LIRI COMMAND FROM FILE
function getCommands(file = 'random.txt'){
	fs.readFile(file, "utf8", function(error, data) {
	  // If the code experiences any errors it will log the error to the console.
	  if (error) {
	    return console.log(error);
	  }
	  var commands = data.split(',');
	  init(commands[0], commands[1]);
});
}
