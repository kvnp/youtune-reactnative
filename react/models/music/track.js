export default class Track {
    constructor(videoId, playlistId, title, artist, artwork, duration) {
        this.id = videoId;
        this.playlistId = playlistId;
        this.title = title;
        this.url;
        this.artist = artist;
        this.artwork = artwork;
        this.duration = duration;

        this.isLiked = false;
        this.isDisliked = false;
    }
}

//https://react-native-track-player.js.org/documentation/#track-object