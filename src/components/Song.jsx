import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function Song(props){
    const { song_img, album_name, song_name, artist } = props;
    
    return(<>
        <div class= "card" style={{ width: '15rem'}}> 
                <img class="card-img-top" src = {song_img} alt="album cover"/>
            <div class = "card-body">
                <p>{song_name}</p>
                <p>{album_name}</p>
                <p>{artist}</p>
            </div>
        </div>
    </>);
}

export default Song;