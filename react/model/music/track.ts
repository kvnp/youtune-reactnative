export default class Track {
    id: string;
    playlistId: string;
    title: string;
    url: string = "";
    artist: string;
    artwork: string;
    duration: any;
    isLiked: boolean;
    isDisliked: boolean;

    constructor(videoId: string, playlistId: string, title: string, artist: string, artwork: string, duration: string) {
        this.id = videoId;
        this.playlistId = playlistId;
        this.title = title;
        this.artist = artist;
        this.artwork = artwork;
        this.duration = duration;

        this.isLiked = false;
        this.isDisliked = false;
    }

    
}

//https://react-native-track-player.js.org/documentation/#track-object