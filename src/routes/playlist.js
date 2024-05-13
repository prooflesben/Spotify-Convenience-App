require("dotenv").config();
const express = require("express");
const router = express.Router();
const dayjs = require("dayjs");
var crypto = require("crypto");
var request = require("request");
var cors = require("cors");
var axios = require("axios");
var qs = require("qs");
var querystring = require("querystring");
var access_token = null;
var user_id = null;

function updateToken() {
    access_token = process.env.ACCESS_TOKEN;
}

async function generatePlaylist(months, songs) {
  updateToken();
  updateId();
  let playlistName = "";

  if (months === 1) {
    playlistName = "1 Month Throwback Playlist";
  } else if (months === 3) {
    playlistName = "3 Month Throwback Playlist";
  } else if (months === 12) {
    playlistName = "1 Year Throwback Playlist";
  }

  // make the post request to create the playlist (another fucntion)

  // make the post request to add the songs
}

async function updateId() {
  updateToken();
  if (user_id !== null) return;

  var url = "https://api.spotify.com/v1/me";
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  try {
    const profile = await axios.get(url, config);
    user_id = profile.data.id;
  } catch (err) {}
}

router.get("/:months", async (req, res) => {
  // You need handle the case of where the token hasn't been generated, the token has expired
  // send back status codes so you know whats wrong
  let songs = await getSongs(req.params.months);
  generatePlaylist();

  res.send(songs.map((song) => convertItem(song)));
});

async function getSongs(months) {
  const numFetch = 50;
  let numOffset = 0;
  let songs = [];
  let total = -1;

  while (!playlistComplete(songs, months, total)) {
    updateToken();
    console.log("in the loop");
    const url =
      "https://api.spotify.com/v1/me/tracks?" +
      qs.stringify({
        limit: numFetch,
        offset: numOffset,
      });

    const config = {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    };

    try {
      const response = await axios.get(url, config);

      songs = songs.concat(response.data.items);
      total = response.data.total;
      numOffset += numFetch;
    } catch (err) {
      // You need to handle errors corectly
        console.log(access_token)
       console.log("err");
    }
  }

  const currentTime = dayjs();
  songs = songs.filter((song) =>
    Math.abs(currentTime.diff(dayjs(song.added_at), "month") < months)
  );

  return songs;
}

// takes item and converts it to custom song json so less info is sent to the client side
function convertItem(item) {
  const song = {
    img: item.track.album.images[0].url,
    album_name: item.track.album.name,
    song_name: item.track.name,
    artist: item.track.artists[0].name,
  };

  return song;
}
// Function to determine if the playlist has all the songs from a certain period and back
function playlistComplete(songs, months, total) {
  console.log("complete called");
  if (songs.length == 0 || total === -1) {
    console.log("false defult");
    return false;
  }

  const currentTime = dayjs();
  const lastSongTime = dayjs(songs[songs.length - 1].added_at);
  if (Math.abs(currentTime.diff(lastSongTime, "month") >= months)) {
    console.log("true time diff");
    console.log(Math.abs(currentTime.diff(lastSongTime, "month")));
    return true;
  }

  if (songs.length >= total) {
    console.log("true length of songs");
    return true;
  }
  console.log("false where we havent met either condition");
  return false;
}

module.exports = router;
