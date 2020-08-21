import { fetchBrowse } from "../remote/API";

function showPlaylist(id, navigation) {
    fetchBrowse(id).then((playlist) => 
        navigation.push("Playlist", playlist)
    );
}

function showArtist(browseId, navigation) {
    fetchBrowse(browseId).then((artist) => 
        navigation.push("Artist", artist)
    );
}

export function handleMedia(media, navigation, index, playlist) {
    if (media == null) {
        navigation.navigate("Music", playlist);
        return;
    }

    const { browseId, playlistId, videoId } = media;
    
    if (videoId != undefined) {
        media.index = index;
        navigation.navigate("Music", media);
        return;
    }

    if (browseId != undefined) {
        if (browseId.slice(0, 2) == "UC") {
            showArtist(browseId, navigation);
            return;
        } else {
            showPlaylist(browseId, navigation);
            return;
        }
    }

    if (playlistId != undefined) {
        showPlaylist(playlistId, navigation);
        return;
    }
}