import Music from "../music/Music";

export default class Navigation {
    static transitionPlaylist = {};

    static #navigate(goal, params, navigation) {
        if (goal == "Artist" || goal == "Playlist")
            navigation.push(goal, params);
        else
            navigation.navigate(goal, params);
    }

    static #showPlaylist(browseId, navigation) {
        const playlistId = browseId.slice(0, 2) == "UC"
            ? browseId.slice(2)
            : browseId;
        
        this.#navigate("Playlist", {list: playlistId}, navigation);
    }

    static #showArtist(browseId, navigation) {
        this.#navigate("Artist", {channelId: browseId}, navigation);
    }

    static handleMedia(media, navigation) {
        const { browseId, playlistId, videoId } = media;
    
        if (videoId != undefined && playlistId != undefined) {
            Music.setTransitionTrack({
                id: videoId,
                playlistId: playlistId,
                title: media.title,
                artist: media.subtitle?.includes("•")
                    ? media.subtitle?.split("•")[1].trim()
                    : media.subtitle,
                artwork: media.thumbnail
            });
    
            this.#navigate("Music", {v: videoId, list: playlistId}, navigation);
            return;
        } else if (videoId != undefined && browseId != undefined) {
            if (browseId.slice(0, 2) == "VL") {
                Music.setTransitionTrack({
                    id: videoId,
                    playlistId: browseId.slice(2),
                    title: media.title,
                    artist: media.subtitle.includes("•")
                        ? media.subtitle.split("•")[1].trim()
                        : media.subtitle,
                    artwork: media.thumbnail
                });
    
                this.#navigate("Music", {v: videoId, list: browseId.slice(2)}, navigation);
                return;
            }
    
        } else if (videoId != undefined) {
            Music.setTransitionTrack({
                id: videoId,
                playlistId: undefined,
                title: media.title,
                artist: media.subtitle.includes("•")
                    ? media.subtitle.split("•")[1].trim()
                    : media.subtitle,
                artwork: media.thumbnail
            });
    
            this.#navigate("Music", {v: videoId}, navigation);
            return;
        }
    
        if (browseId != undefined) {
            if (browseId.slice(0, 2) == "UC") {
                this.#showArtist(browseId, navigation);
                return;
            } else {
                this.#showPlaylist(browseId, navigation);
                return;
            }
        }
    
        if (playlistId != undefined) {
            this.#showPlaylist(playlistId, navigation);
            return;
        }
    }

    static playLocal(localPlaylistId) {
        this.navigate("Music", {list: localPlaylistId});
    }
}