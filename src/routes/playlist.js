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

router.get("/:months", async (req, res) => {
  // You need handle the case of where the token hasn't been generated, the token has expired
  // send back status codes so you know whats wrong
  let months = req.params.months;
  console.log(`The playlist should be ${months}`)
  let songs = await getSongs(months);
  // await generatePlaylist(
  //   months,
  //   songs.map((song) => song.track.uri)
  // );
  console.log(songs.length);
  

  res.send(songs.map((song) => convertItem(song)));
});

async function generatePlaylist(months, songs) {
  updateToken();
  await updateId();
  var playlistName;

  if (months == 1) {
    playlistName = "1 Month Throwback Playlist";
  } else if (months == 3) {
    playlistName = "3 Month Throwback Playlist";
  } else if (months == 12) {
    playlistName = "1 Year Throwback Playlist";
  }
  console.log(months);

  // make the post request to create the playlist (another fucntion)
  try {
    const playlistResponse = await postPlayist(playlistName);
    let playlistId = playlistResponse.data.id;
    console.log(await addSongs(playlistId, songs));
  } catch (error) {
    console.log(error);
  }
}

async function addSongs(playlistId, songs) {
  updateToken();
  let songArray = [];
  for(let i = 0; i < Math.ceil(songs.length/100); i++){
    let curArray = [];
    for(let j = 0; j < 100; j++){
      let idx = (i * 100) + j;
      if(idx >= songs.length) break;
      
      curArray.push(songs[idx]);
    }
    songArray.push(curArray);
  }


  const url = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };

  for(let i = 0; i < songArray.length; i++){
    let data ={
      uris: songArray[i],
      position: 0,
    }
  
    try {
      const addResponse = await axios.post(url, data, config);
      if (addResponse.status === 201 || addResponse.status === 200) {
        console.log(`sucess adding ${(i * 100) + 100} songs`);
      } else if (addResponse.status === 401) {
        await fetch("http://localhost:5173/refresh_token");
        i-=1;
        continue;
      } 
      else {
        console.log("Other error in adding songs");
        console.log(addResponse);
        break;
      }
    } catch (err) {
      throw err;
    }
  }
}

async function postPlayist(name) {
  updateToken();
  const url = `https://api.spotify.com/v1/users/${user_id}/playlists`;
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
      'Content-Type': 'application/json'
    }
  };
  const data = {
    name: name,
    description: `This is your ${name} created by the Ben's Spotify App`,
    public: false,
  };

  try {
    let response = await axios.post(url, data, config);

    if (response.status === 201) {
      console.log("success creating playlist");
      return response;
    } else if (response.status === 401) {
      await fetch("http://localhost:5173/refresh_token");
      // postPlayist(name);
    } else {
      console.log("Other error in creating songs");
      console.log(response.status);
      console.log(response.error.message);
    }
  } catch (err) {
    throw err;
  }
}
async function updateId() {
  updateToken();

  var url = "https://api.spotify.com/v1/me";
  const config = {
    headers: {
      Authorization: `Bearer ${access_token}`,
    },
  };

  try {
    const profile = await axios.get(url, config);

    if (profile.status === 200) {
      console.log("user id fetched correctly");
      user_id = profile.data.id;
      return;
    } else if (profile.status === 401) {
      await fetch("http://localhost:5173/refresh_token");
      updateId();
    } else {
      console.log("Other error in fetching user id");
      console.log(profile.status);
      console.log(profile.error.message);
    }
  } catch (err) {
    throw err;
  }
}

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
      if (response.status === 200) {
        songs = songs.concat(response.data.items);
        total = response.data.total;
        numOffset += numFetch;
      } else if (response.status === 401) {
        await fetch("http://localhost:5173/refresh_token");
        continue;
      } else {
        console.log(response.status + " : error in fethcing songs");
      }
    } catch (err) {
      // You need to handle errors corectly
      //console.log(access_token);
      throw err;
      break;
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
