const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const lyricsFinder = require("lyrics-finder");
const SpotifyWebApi = require("spotify-web-api-node");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/login',(req,res) => {
    const code = req.body.code;

    const spotifyApi  = new SpotifyWebApi({
        redirectUri : "http://localhost:3000/",
        clientId: "dcbb76ddcd6940c1b97d9a420c251216",
        clientSecret : "1b17194921b8481e8da34a8cf5fdabff"
    })

    spotifyApi.authorizationCodeGrant(code).then(data => {
        res.json({
            accessToken: data.body.access_token,
            refreshToken: data.body.refresh_token,
            expiresIn: data.body.expires_in
        })
    })
    .catch(err => {
        console.log(err);
        res.sendStatus(400);
    })
    
})

app.post("/refresh", (req, res) => {
    const refreshToken = req.body.refreshToken;
    console.log(refreshToken + "\n\n");
    const spotifyApi  = new SpotifyWebApi({
        redirectUri : "http://localhost:3000/",
        clientId: "dcbb76ddcd6940c1b97d9a420c251216",
        clientSecret : "1b17194921b8481e8da34a8cf5fdabff",
        refreshToken
    })

    spotifyApi.refreshAccessToken().then(
        (data) => {
          console.log('The access token has been refreshed!');
          spotifyApi.setAccessToken(data.body['access_token']);
        console.log(data);
        })
        .catch((err) => {
          console.log('Could not refresh access token', err);
          res.sendStatus(400);
        }
      );
})

app.get("/lyrics", async (req, res) => {
    const lyrics = await lyricsFinder(req.query.artist, req.query.track) || "No lyrics found"; 
    res.json({lyrics});
})

app.listen(3001);