# Week 10 Homework: LIRI-App
##### by William Tan
##

##### Basic useful feature list:

 * Utilizes the Twitter API to get the 20 most recent tweets
 * Get a list of songs by searching from the Spotify Web API
 * Find a movie (using 'Request') from the OMDB API
 * Reads from a .txt File to run commands

##### Extra Features:

 * Uses npm package "table" to display the results
 * Uses npm package "inquirer" for user interaction with the console
 * Logs commands and errors into log.txt file.

##### Commands:

* Get a list (10 entries max) of tracks in Spotify Web API
   ```
   node liri spotify-this '<song-title>'
   ```
* Get movie details from OMDB API
   ```
   node liri movie-this '<movie-title>'
   ```
* Get Twitter Feed from a user (if 'twitter-id' is blank, it will display mine)
   ```
   node liri my-tweets '<twitter-id>'
   ```

##### Sample UI of the Node App :stuck_out_tongue_closed_eyes:
This is the main menu (use UP and DOWN arrow keys to navigate):

![Main Menu](https://i.gyazo.com/aa88d3afe4bdcd8ad4f4187ab74131c3.gif)

Results from Spotify API search:

![SPOTIFY Search](https://i.gyazo.com/c66cf43f3e3250eca61fd3237dc64d65.png)

Results from Twitter API search:

![Twitter Search](https://i.gyazo.com/31563e46486a2dd7788d2822ef0262f9.png)

Results from OMDB API Search:

![OMDB](https://i.gyazo.com/83debfdab4942b935076f6041fb2e616.png)

### Stuff used to make this:

 * [Request](https://www.npmjs.com/package/request) to get OMDB API
 * [Table](https://www.npmjs.com/package/table) to display results
 * [Spotify Web API](https://www.npmjs.com/package/spotify-web-api-node) to get Spotify Song Results
 * [Twitter API](https://www.npmjs.com/package/twitter) to get Twitter feed
 * [Inquirer](https://www.npmjs.com/package/inquirer) for user input in the console
 * [Emoji Strip](https://www.npmjs.com/package/emoji-strip) to remove all emoji characters from the Twitter feed that messes up the Table display
 * [Time-Ago](https://www.npmjs.com/package/node-time-ago) to display how long ago each Twitter feed is posted
 * [Moment](https://www.npmjs.com/package/moment) to calculate and display time variables.
 * [Underscore](https://www.npmjs.com/package/underscore) for basic manipulations of array/object
