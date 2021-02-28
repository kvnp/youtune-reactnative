import AsyncStorage from '@react-native-async-storage/async-storage';

export var MediaStorage = {
    songs: {},
    playlists: {},
    artists: {},
};

async function loadMedia() {
    try {
        const value = await AsyncStorage.getItem('@storage_Media');

        if(value !== null)
            return JSON.parse(value);
        else
            return null;
    
    } catch(e) {
        alert("Loading likes failed");
        return null;
    }
}

async function storeMedia() {
    try {
        const string = JSON.stringify(MediaStorage);
        await AsyncStorage.setItem('@storage_Media', string);

    } catch (e) {
        alert("Saving likes failed");
    }
}

loadMedia().then(media => {
    if (media != null)
        MediaStorage = media;
});

export async function likeSong(id, boolean) {
    if (!MediaStorage.songs.hasOwnProperty(id))
        MediaStorage.songs[id] = { liked: boolean };
    else {
        if (boolean == MediaStorage.songs[id].liked)
            MediaStorage.songs[id].liked = null;
        else
            MediaStorage.songs[id].liked = boolean;
    }

    storeMedia();
}

export async function likePlaylist(id, boolean) {
    if (!MediaStorage.playlists.hasOwnProperty(id))
        MediaStorage.playlists[id] = { liked: boolean };
    else {
        if (boolean == MediaStorage.playlists[id].liked)
            MediaStorage.playlists[id].liked = null;
        else
            MediaStorage.playlists[id].liked = boolean;
    }

    storeMedia();
}

export async function likeArtist(id, boolean) {
    if (!MediaStorage.artists.hasOwnProperty(id))
        MediaStorage.artists[id] = { liked: boolean };
    else {
        if (boolean == MediaStorage.artists[id].liked)
            MediaStorage.artists[id].liked = null;
        else
            MediaStorage.artists[id].liked = boolean;
    }

    storeMedia();
}

export async function getSongLike(id) {
    if (MediaStorage.songs.hasOwnProperty(id))
        return MediaStorage.songs[id].liked;
    else
        return null;
}

export async function getPlaylistLike(id) {
    if (MediaStorage.playlists.hasOwnProperty(id))
        return MediaStorage.playlists[id].liked;
    else
        return null;
}

export async function getArtistLike(id) {
    if (MediaStorage.artists.hasOwnProperty(id))
        return MediaStorage.artists[id].liked;
    else
        return null;
}

export async function getLikedSongs() {
    let likedSongs = [];
    let idArray = Object.keys(MediaStorage.songs);

    for (let i = 0; i < idArray.length; i++) {
        if (MediaStorage.songs[idArray[i]].liked) {
            likedSongs.push(MediaStorage.songs[idArray[i]].front);
        }
    }

    return likedSongs;
}

export async function getLikedPlaylists() {
    let likedPlaylists = [];
    let idArray = Object.keys(MediaStorage.playlists);

    for (let i = 0; i < idArray.length; i++) {
        if (MediaStorage.playlists[idArray[i]].liked) {
            likedPlaylists.push(MediaStorage.playlists[idArray[i]].front);
        }
    }

    return likedPlaylists;
}

export async function getLikedArtists() {
    let likedArtists = [];
    let idArray = Object.keys(MediaStorage.artists);

    for (let i = 0; i < idArray.length; i++) {
        if (MediaStorage.artists[idArray[i]].liked) {
            likedArtists.push(MediaStorage.artists[idArray[i]].front);
        }
    }

    return likedArtists;
}