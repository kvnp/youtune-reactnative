import { View } from "react-native";
import { setTransitionTrack } from "../../views/full/PlayView";

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
        setTransitionTrack({
            id: videoId,
            playlistId: playlistId,
            title: media.title,
            artist: media.subtitle.includes("•")
                ? media.subtitle.split("•")[1].trim()
                : media.subtitle,
            artwork: media.thumbnail
        });

        navigation.navigate("Music", {v: videoId, list: playlistId});
        return;
    } else if (videoId != undefined && browseId != undefined) {
        if (browseId.slice(0, 2) == "VL") {
            setTransitionTrack({
                id: videoId,
                playlistId: browseId.slice(2),
                title: media.title,
                artist: media.subtitle.includes("•")
                    ? media.subtitle.split("•")[1].trim()
                    : media.subtitle,
                artwork: media.thumbnail
            });

            navigation.navigate("Music", {v: videoId, list: browseId.slice(2)});
            return;
        }

    } else if (videoId != undefined) {
        setTransitionTrack({
            id: videoId,
            playlistId: undefined,
            title: media.title,
            artist: media.subtitle.includes("•")
                ? media.subtitle.split("•")[1].trim()
                : media.subtitle,
            artwork: media.thumbnail
        });

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