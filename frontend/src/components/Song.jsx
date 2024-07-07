import 'bootstrap/dist/css/bootstrap.min.css';

function Song(props){
    const { song_img, album_name, song_name, artist } = props;
    
    return(<>
        <div className= "card" style={{ width: '12rem'}}> 
                <img className="card-img-top" src = {song_img} alt="album cover"/>
            <div className = "card-body" style={{ backgroundColor: '#535353'}}>
                <p style={{ color: 'black'}}>{song_name}</p>
                <p style={{ color: 'black'}}>{album_name}</p>
                <p style={{ color: 'black'}}>{artist}</p>
            </div>
        </div>
    </>);
}

export default Song;