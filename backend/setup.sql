DROP DATABASE IF EXISTS `Spotity_App_Database`;
CREATE DATABASE `Spotity_App_Database`;
USE `Spotity_App_Database`;

-- Users Table
CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    display_name VARCHAR(255),
    user_uri VARCHAR(255)
);

-- Playlists Table
CREATE TABLE playlists (
    playlist_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    playlist_name VARCHAR(255),
    playlist_desc VARCHAR(255),
    is_public BOOLEAN DEFAULT FALSE,
    
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Songs Table
CREATE TABLE songs (
    song_id VARCHAR(255) PRIMARY KEY,
    song_name VARCHAR(255),
    artist VARCHAR(255),
    album_name VARCHAR(255),
    song_img VARCHAR(255),
    added_at varchar(255)
);

-- PlaylistSongs Table (Join Table)
CREATE TABLE playlist_songs (
    playlist_id VARCHAR(255),
    song_id VARCHAR(255),
    PRIMARY KEY (playlist_id, song_id),
    FOREIGN KEY (playlist_id) REFERENCES playlists(playlist_id),
    FOREIGN KEY (song_id) REFERENCES songs(song_id)
);

-- Insert a user
INSERT INTO users (user_id, email, display_name, user_uri) 
VALUES ('user123', 'john.doe@example.com', 'John Doe', 'uri:john_doe');

-- Insert a playlist for the user
INSERT INTO playlists (playlist_id, user_id, playlist_name, playlist_desc, is_public) 
VALUES ('playlist123', 'user123', 'My Favorite Songs','We did it joe',false);

-- Insert songs
INSERT INTO songs (song_id, song_name, artist, album_name, song_img,added_at) 
VALUES ('song1', 'Song One', 'Artist A', 'Album X', 'http://example.com/song1.jpg','2020'),
       ('song2', 'Song Two', 'Artist B', 'Album Y', 'http://example.com/song2.jpg','2021');

-- Associate songs with the playlist
INSERT INTO playlist_songs (playlist_id, song_id) 
VALUES ('playlist123', 'song1'),
       ('playlist123', 'song2');


