export default class Playlist {
    constructor() {
        this.list = [];
        this.index = 0;
    }

    getList = () => {
        return this.list;
    }

    getIndex = () => {
        return this.index;
    }
}