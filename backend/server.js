// Seperate the routes into seperate files and store the more tokens in your .env files 
// Also find a good way to hold and change the tokens
require("dotenv").config();
const express = require("express");
const authRouter = require('./routes/auth');
const playlistRouter = require('./routes/playlist');
var cors = require("cors");
const app = express();
const port = process.env.PORT

var cookieParser = require("cookie-parser");
app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.use('/', authRouter);
app.use('/playlist',playlistRouter)

app.listen(port, () => {
  console.log('listening on port ',port)
});
