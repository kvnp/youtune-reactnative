function showPlaylist(browseId, navigation) {
    const playlistId = browseId.slice(2);
    navigation.push("Playlist", {list: playlistId});
}

function showArtist(browseId, navigation) {
    navigation.push("Artist", {channelId: browseId})
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