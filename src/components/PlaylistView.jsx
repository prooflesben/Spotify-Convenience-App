import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Song from './Song'; // Assuming Song is a component you've defined
import '../App.css';

function PlaylistView() {
  const { timeframe } = useParams();
  const [songsJson, setSongsJson] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5173/playlist/${timeframe}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setSongsJson(data);
      } catch (error) {
        console.error('There was a problem fetching the data:', error);
      }
    };

     await fetchData();
  }, [timeframe]);

  return (<div className="centered-container">
    <p>Below is your playlist</p>
    <div className="scrollable-song-container">
      {songsJson.map((song, index) => (
        <Song
          key={index}
          song_img={song.img}
          album_name={song.album_name}
          song_name={song.song_name}
          artist={song.artist}
        />
      ))}
    </div>
    </div>
  );
}

export default PlaylistView;