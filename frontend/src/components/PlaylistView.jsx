import { useParams } from "react-router-dom";
import Song from "./Song"; // Assuming Song is a component you've defined
import "../App.css";
import Loader from "./Loader";
import { useState, useEffect } from "react";

function PlaylistView() {
  const { timeframe } = useParams();
  const [songsJson, setSongsJson] = useState([]);
  const [songsLoaded, setSongsLoaded] = useState(false);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `http://localhost:5173/playlist/${timeframe}`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSongsJson(data);
        setSongsLoaded(true);
        
      } catch (error) {
        console.error("There was a problem fetching the data:", error);
      }
    };

    fetchData();
  }, [timeframe]);

  

  function loadSongs() {
    if(songsLoaded){
      return songsJson.map((song, index) => (
        <Song
          key={index}
          song_img={song.img}
          album_name={song.album_name}
          song_name={song.song_name}
          artist={song.artist}
        />
      ))
    }
    else{
      return <Loader/>
    }
  }

  return (
    <div style={{ backgroundColor: "#6b87b5" }}>
      <div className="centered-container">
        <p>Below are the songs in your playlist</p>
        <div className="scrollable-song-container">
          {loadSongs()}
        </div>
      </div>
    </div>
  );
}

export default PlaylistView;
