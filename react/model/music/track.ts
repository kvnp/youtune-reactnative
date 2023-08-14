import HTTP from "../../services/api/HTTP";
import Device from "../../services/device/Device";

export default class Track {
    videoId: string;
    channelId: string | null;
    playlistId: string | null;
    title: string;
    url: string = "";
    artist: string;
    artwork: string;
    duration: number;
    isLiked: boolean;
    isDisliked: boolean;

    constructor(videoId: string = "", channelId: string | null = "", playlistId: string | null = "", title: string = "", artist: string = "", artwork: string = "", duration: string | number = 0) {
        if (typeof duration == "string") {
            duration = Number.parseInt(duration);
        }

        if (artwork != "" && Device.Platform == "web" && new URL(artwork).hostname == "i.ytimg.com") {
            artwork = HTTP.getProxyUrl(artwork);
        }

        this.videoId = videoId;
        this.channelId = channelId;
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