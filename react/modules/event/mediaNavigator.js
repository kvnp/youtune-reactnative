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

export function handleMedia(media, navigation) {
    const {browseId, playlistId, videoId} = media;
    console.log({browseId, playlistId, videoId});
    
    if (videoId != undefined) {
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