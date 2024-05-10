import React from "react";

function Song(props){
    const { song_img, album_name, song_name, artist } = props;
    
    return(<>
        <div class= "row" >
            <div>
                <img src = {song_img} />
            </div>
            <div class = "col">
                <p1>{song_name}</p1>
                <p1>{album_name}</p1>
                <p1>{artist}</p1>
            </div>
        </div>
    </>);
}

export default Song;