import Track from "./track";

export default class Playlist {
    list: Array<Track> = [];
    index: Number = 0;

    constructor() {
        this.list = [];
        this.index = 0;
    }
}