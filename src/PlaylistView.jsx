import React from "react";
import { useParams } from 'react-router-dom';

async function PlaylistView() {
    const { timeframe } = useParams();
    // make sure you got the corrrect status code
    const songComponents = await fetch('http://localhost:5173/playlist/${timeframe}');


}

export default PlaylistView;
