function showPlaylist(browseId, navigation) {
    const playlistId = browseId.slice(0, 2) == "UC"
        ? browseId.slice(2)
        : browseId;
    
    navigation.push("Playlist", {list: playlistId});
}

function showArtist(browseId, navigation) {
    navigation.push("Artist", {channelId: browseId});
}

export function playLocal(localPlaylistId, navigation) {
    navigation.navigate("Music", {list: localPlaylistId});
}

export function handleMedia(media, navigation) {
    const { browseId, playlistId, videoId } = media;

    if (videoId != undefined && playlistId != undefined) {
        navigation.navigate("Music", {v: videoId, list: playlistId});
        return;
    } else if (videoId != undefined && browseId != undefined) {
        if (browseId.slice(0, 2) == "VL") {
            navigation.navigate("Music", {v: videoId, list: browseId.slice(2)});
            return;
        }

    } else if (videoId != undefined) {
        navigation.navigate("Music", {v: videoId});
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