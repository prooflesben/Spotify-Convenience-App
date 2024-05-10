// Seperate the routes into seperate files and store the more tokens in your .env files 
// Also find a good way to hold and change the tokens
require("dotenv").config();
const express = require("express");
var crypto = require("crypto");
var request = require("request");
var cors = require("cors");
var axios = require("axios");
var qs = require("qs");
var querystring = require("querystring");
const dayjs = require("dayjs");

var cookieParser = require("cookie-parser");

const client_id = "a5185fbaa08944e1a95c9c21909355f7";
const client_secret = process.env.REACT_APP_CLIENT_SECRET;
const redirect_uri = "http://localhost:5173/callback";
var access_token = null;
var user_id = null;
const generateRandomString = (length) => {
  return crypto.randomBytes(60).toString("hex").slice(0, length);
};

var stateKey = "spotify_auth_state";

const app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope =
    "playlist-modify-private playlist-modify-public user-library-read ugc-image-upload";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      qs.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});


async function generatePlaylist(months,songs) {
  updateId();
  let playlistName = "";

  if(months === 1){
    playlistName = "1 Month Throwback Playlist";
  }
  else if(months === 3 ){
    playlistName = "3 Month Throwback Playlist";
  }
  else if(months === 12){
    playlistName = "1 Year Throwback Playlist";
  }

  // make the post request to create the playlist (another fucntion)

  // make the post request to add the songs
}

async function updateId() {
  if(user_id !== null) return;

  var url = "https://api.spotify.com/v1/me"; 
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`
    },
  };


  try{
    const profile = await axios.get(url,config);
    user_id = profile.data.id;
  }
  catch(err){

  }
}
async 

app.get("/playlist/:months", async (req, res) => {
  // You need handle the case of where the token hasn't been generated, the token has expired
  // send back status codes so you know whats wrong
  let songs = await getSongs(req.params.months);
  generatePlaylist()

  res.send(convertItem(songs));
});

async function getSongs(months) {
  const numFetch = 50;
  let numOffset = 0;
  let songs = [];
  let total = -1;


  while (!playlistComplete(songs, months, total)) {
    console.log("in the loop");
    const url =
      "https://api.spotify.com/v1/me/tracks?" +
      qs.stringify({
        limit: numFetch,
        offset: numOffset,
      });

    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
    };

    try {
      const response = await axios.get(url, config);
      
      songs = songs.concat(response.data.items);
      total = response.data.total;
      numOffset += numFetch;
    } catch (err) {
      // You need to handle errors corectly
      console.log(err);
    }
  }

  const currentTime = dayjs();
  songs = songs.filter((song) => 
    Math.abs(currentTime.diff(dayjs(song.added_at), 'month') < months)
 )

 return songs;
}

// takes item and converts it to custom song json so less info is sent to the client side
function convertItem(item){
  const song = {
    img : item.track.album.images[0].url,
    album_name : item.track.album.name,
    song_name : item.track.name,
    artist : item.track.artists[0].name
  };

  return song;
}
// Function to determine if the playlist has all the songs from a certain period and back
function playlistComplete(songs, months, total) {
  console.log("complete called");
  if(songs.length == 0 || total === -1){
    console.log("false defult");
    return false;
  }

  const currentTime = dayjs();
  const lastSongTime = dayjs(songs[songs.length - 1].added_at);
  if(Math.abs(currentTime.diff(lastSongTime, 'month') >= months)){
    console.log("true time diff");
    console.log(Math.abs(currentTime.diff(lastSongTime, 'month')));
    return true;
  }

  if(songs.length >= total ){
    console.log("true length of songs");
    return true;
  }
  console.log("false where we havent met either condition");
  return false;
}



app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        qs.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " +
          new Buffer.from(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        (access_token = body.access_token),
          (refresh_token = body.refresh_token);

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          // console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "http://localhost:3000/select"

          // '/#' +
          // qs.stringify({
          //   access_token: access_token,
          //   refresh_token: refresh_token
          // })
        );
      } else {
        res.redirect(
          "/#" +
            querystringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

app.get("/refresh_token", function (req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      "content-type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer.from(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token,
        refresh_token = body.refresh_token;
      res.send({
        access_token: access_token,
        refresh_token: refresh_token,
      });
    }
  });
});

app.listen(5173);
