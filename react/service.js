import TrackPlayer, { RepeatMode, State } from 'react-native-track-player';

import { fetchAudioStream, fetchNext } from "./modules/remote/API";
import { loadSongLocal, localIDs } from './modules/storage/SongStorage';
import Playlist from "./modules/models/music/playlist";
import { metadataCallback } from './views/full/PlayView';

/*import Queue from "queue-promise";

const queue = new Queue({
  concurrent: 1,
  interval: 1
});

queue.on("start", () => {});
queue.on("stop", () => {});
queue.on("end", () => {});

queue.on("resolve", data => {});
queue.on("reject", error => {});*/

const getUrl = async(id) => {
    if (localIDs.includes(id))
        return (await loadSongLocal(id)).url;
    else
        return await fetchAudioStream({videoId: id});
}

var urlLoaded = null;
export var metadata = [];

export const startPlaylist = async(playlist) => {
    metadata = playlist.list;
    if (metadataCallback)
        metadataCallback(metadata, playlist.index);

    urlLoaded = Array(playlist.list.length).fill(false);

    for (let i = 0; i < playlist.list.length; i++) {
        let track = playlist.list[i];
        /*if (i == playlist.index) {
            track.url = await getUrl(track.id);
            urlLoaded[i] = true;
        }*/

        track.url = await getUrl(track.id);
        urlLoaded[i] = true;

        await TrackPlayer.add(track);
        
        if (i == playlist.index) {
            await TrackPlayer.skip(i);
            TrackPlayer.play();
        }
    }
    return;

    /*let nextTrack;
    let currentTrack;
    let startingIndex = 0;
    if (playlist.index == playlist.list.length - 1) {
        nextTrack = playlist.list[0];
        nextTrack.url = await getUrl(nextTrack.id);
        urlLoaded[0] = true;

        startingIndex = 1;
        console.log(nextTrack);
        await TrackPlayer.add(nextTrack);
        console.log(await TrackPlayer.getQueue());
    }
    
    console.log(playlist.list.slice(startingIndex, playlist.index));
    await TrackPlayer.add(
        playlist.list.slice(startingIndex, playlist.index)
    );
    console.log(await TrackPlayer.getQueue());

    currentTrack = playlist.list[playlist.index];
    currentTrack.url = await getUrl(currentTrack.id);
    urlLoaded[playlist.index] = true;
    console.log(currentTrack);
    await TrackPlayer.add(currentTrack);
    console.log(await TrackPlayer.getQueue());

    await TrackPlayer.skip(playlist.index);
    setMetadataIndex(playlist.index);

    await TrackPlayer.play();

    if (startingIndex == 0) {
        nextTrack = playlist.list[playlist.index + 1];
        nextTrack.url = await getUrl(nextTrack.id);
        urlLoaded[playlist.index + 1] = true;
        await TrackPlayer.add(nextTrack);
    }
    
    await TrackPlayer.add(
        playlist.list.slice(
            playlist.index + 2,
            playlist.list.length
        )
    );
    
    console.log(await TrackPlayer.getQueue());*/
}

export const handlePlayback = async({videoId, playlistId}) => {
    let queue = await TrackPlayer.getQueue();
    if (queue.length > 0) {
        let index = await TrackPlayer.getCurrentTrack();
        let track = await TrackPlayer.getTrack(index);

        if (track.id == videoId)
            return;

        if (track) {
            if (playlistId == track.playlistId) {
                for (let i = 0; i < queue.length; i++) {
                    if (queue[i].id == videoId)
                        return TrackPlayer.skip(i);
                }
            }
        }

        metadata = [];
        TrackPlayer.reset();
    }

    if (playlistId == "LOCAL_DOWNLOADS") {
        let localPlaylist = new Playlist();

        for (let i = 0; i < localIDs.length; i++) {
            let {title, artist, artwork, duration} = await loadSongLocal(localIDs[i]);
            let constructedTrack = {
                title,
                artist,
                artwork,
                duration,
                id: localIDs[i],
                playlistId: playlistId,
                url: null
            };

            if (videoId) {
                if (localIDs[i] == videoId)
                    localPlaylist.index = i;
            }

            localPlaylist.list.push(constructedTrack);
        }

        startPlaylist(localPlaylist);
    } else {
        fetchNext(videoId, playlistId)
            .then(resultPlaylist => startPlaylist(resultPlaylist))

            .catch(async(reason) => {
                if (localIDs.includes(videoId)) {
                    let localPlaylist = new Playlist();
                    localPlaylist.list.push(await loadSongLocal(videoId));
                    startPlaylist(localPlaylist);
                }
            });
    }
}

export const skip = async(nextIndex) => {
    console.log(await TrackPlayer.getCurrentTrack() + " " + metadataIndex);
    console.log("0 " + nextIndex + " " + metadata.length);

    if (metadata.length == 0)
        return;

    let forward = nextIndex > metadataIndex;
    let playing = playback == State.Playing;
    let position = await TrackPlayer.getPosition();

    /*if (
        nextIndex > metadata.length - 1 ||
        playing && !forward && position > 10 ||
        nextIndex < 0
    )
        return TrackPlayer.seekTo(0);*/

    let track = metadata[nextIndex];
    await TrackPlayer.skip(nextIndex);
    return TrackPlayer.play();

    let hasUrl = urlLoaded[nextIndex];

    if (hasUrl) {
        console.log("hasUrl");
        await TrackPlayer.skip(nextIndex);
        if (playing)
            TrackPlayer.play();
        
        return;
    }

    TrackPlayer.pause();

    track.url = await getUrl(track.id);
    urlLoaded[nextIndex] = true;

    let afterNext;
    if (nextIndex == metadata.length - 1)
        afterNext = null;
    else
        afterNext = nextIndex;

    await TrackPlayer.remove(nextIndex);
    await TrackPlayer.add(track, afterNext);
    await TrackPlayer.skip(nextIndex);
    return TrackPlayer.play();
}

export var currentRepeatMode = RepeatMode.Off;
export var currentRepeatString = "repeat";

export const switchRepeatMode = () => {
    switch(currentRepeatMode) {
        case RepeatMode.Off:
            TrackPlayer.setRepeatMode(RepeatMode.Queue);
            currentRepeatMode = RepeatMode.Queue;
            currentRepeatString = "repeat-on";
            break;
        case RepeatMode.Queue:
            TrackPlayer.setRepeatMode(RepeatMode.Track);
            currentRepeatMode = RepeatMode.Track;
            currentRepeatString = "repeat-one-on";
            break;
        case RepeatMode.Track:
            TrackPlayer.setRepeatMode(RepeatMode.Off);
            currentRepeatMode = RepeatMode.Off;
            currentRepeatString = "repeat";
    }

    return currentRepeatString;
};