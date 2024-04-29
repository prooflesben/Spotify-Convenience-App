require("dotenv").config();
const express = require("express");
var crypto = require("crypto");
var request = require("request");
var cors = require("cors");
var axios = require("axios");
var querystring = require("querystring");

var cookieParser = require("cookie-parser");

const client_id = "a5185fbaa08944e1a95c9c21909355f7";
const client_secret = "44d110280cc0456597cc274e2d6be3e3";
const redirect_uri = "http://localhost:5173/callback";
var access_token = null;
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
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/playlist", function (req, res) {
  const url = "https://api.spotify.com/v1/me/playlists?limit=10&offset=0";
  const config = {
    headers: {
      Authorization: "Bearer ${access_token}",
    },
  };
  axios
    .get(url, config)
    .then((response) => {
      console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });

  res.redirect("http://localhost:3000");
});
app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
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
          // querystring.stringify({
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
