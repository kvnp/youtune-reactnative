import {NativeModules} from 'react-native';
const LinkBridge = NativeModules.LinkBridge;
const YOUTUBE_WATCH = "https://www.youtube.com/watch?v=";

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

    getUrl = () => LinkBridge.getString(YOUTUBE_WATCH + this.id,
                                        (url) => this.url = url);
}

//https://react-native-track-player.js.org/documentation/#track-object