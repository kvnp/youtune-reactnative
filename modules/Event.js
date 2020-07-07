import { fetchBrowse, fetchVideo } from "./API";
import { Linking } from "react-native";

function showPlaylist(id, navigation) {
    fetchBrowse(id).then((artist) =>
        navigation.push("Playlist", artist)
    );
}

function showArtist(browseId, navigation) {
    fetchBrowse(browseId).then((artist) =>
        navigation.push("Artist", artist)
    );
}

function startMedia(videoId, navigation) {
    Linking.openURL("https://music.youtube.com/watch?v=" + (videoId));

    /*fetchVideo(videoId).then((data) => {
        for (let i = 0; i < data.length; i++) {
            console.log(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
            new Player(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
        }
    });*/
}

export function handleMedia({browseId, playlistId, videoId, navigation}) {
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