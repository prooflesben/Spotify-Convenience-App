import React from "react";

function Song(){
    const img = props.img;
    const album_name = pops.album_name;
    const song_name = props.song_name;
    const artsit = props.artist;
    
    <>
        <div class= "row" >
            <div>
                <img src = {img} />
            </div>
            <div class = "col">
                <p1>{song_name}</p1>
                <p1>{album_name}</p1>
                <p1>{artist}</p1>
            </div>
        </div>
    </>
}

export default Song;