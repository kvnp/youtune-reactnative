import { fetchBrowse } from "./API";
import { Linking } from "react-native";

function showPlaylist(id, navigation) {
    fetchBrowse(id).then((playlist) => {
        navigation.push("Playlist", playlist);
    });
}

function showArtist(browseId, navigation) {
    fetchBrowse(browseId).then((artist) => {
        navigation.push("Artist", artist)
    });
}

function startMedia(videoId, navigation) {
    Linking.openURL("https://music.youtube.com/watch?v=" + (videoId));
}

export function handleMedia({browseId, playlistId, videoId}, navigation) {
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

    if (videoId != undefined) {
        startMedia(videoId, navigation);
        return;
    }
}