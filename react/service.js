import TrackPlayer from 'react-native-track-player';
import { fetchAudioStream } from "./modules/remote/API";
import { StatusBar } from 'react-native';
import { initSettings } from './modules/storage/SettingsStorage';
import { loadSongLocal, localIDs } from './modules/storage/SongStorage';

export const register = () => {
    StatusBar.setBarStyle("dark-content", true);
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent", true);

    TrackPlayer.registerPlaybackService(() => require("./handler"));

    TrackPlayer.updateOptions({
        stopWithApp: true,
        alwaysPauseOnInterruption: true,

        capabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_SEEK_TO
        ],

        notificationCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            TrackPlayer.CAPABILITY_STOP
        ],

        compactCapabilities: [
            TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT
        ],
    });

    initSettings();
}

export const YOUTUBE_WATCH = "https://www.youtube.com/watch?v=";

export var isRepeating = false;
export var focusedId = null;

export const setRepeat = async(boolean) => {
    isRepeating = boolean;
    if (isRepeating)
        focusedId = await TrackPlayer.getCurrentTrack();
}

export const skipAuto = async() => {
    if (isRepeating)
        TrackPlayer.seekTo(0);
    else
        skip(true);
}

export const skipTo = async(id) => {
    let array = await TrackPlayer.getQueue();
    let index;
    let track;

    for (let i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            index = i;
            track = array[i];
            break;
        }
    }

    focusedId = id;
    if (!track.url) {
        await TrackPlayer.pause();

        if (localIDs.includes(id))
            track.url = (await loadSongLocal(id)).url;
        else
            track.url = await fetchAudioStream(id);
    } else {
        await TrackPlayer.skip(id);
        return;
    }

    let next;
    if (index == array.length - 1)
        next = null;
    else
        next = array[index + 1].id;

    await TrackPlayer.remove(id);
    await TrackPlayer.add(track, next);
    await TrackPlayer.skip(id);
    TrackPlayer.play();
}

export const skip = async(forward) => {
    let id = await TrackPlayer.getCurrentTrack();
    let array = await TrackPlayer.getQueue();

    let position = await TrackPlayer.getPosition();
    let index;

    for (let i = 0; i < array.length; i++) {
        if (array[i].id == id) {
            index = i;
            break;
        }
    }

    if (forward && index == array.length - 1 || !forward && position > 10 || !forward && index == 0)
        return TrackPlayer.seekTo(0);

    let next;
    if (forward)
        next = array[index + 1].id;
    else
        next = array[index - 1].id;

    skipTo(next);
}

export async function startPlaylist(playlist) {
    for (let i = 0; i < playlist.list.length; i++) {
        let track = playlist.list[i];
        if ((i == playlist.index || i == 0) && track.url == undefined) {
            if (localIDs.includes(track.id))
                track.url = (await loadSongLocal(track.id)).url;
            else
                track.url = await fetchAudioStream(track.id);
        }

        await TrackPlayer.add(track);

        if (i == playlist.index) {
            focusedId = track.id;
            await TrackPlayer.skip(track.id);
            TrackPlayer.play();
        }
    }
}

export function setPlay(isPlaying) {
    if (isPlaying)  TrackPlayer.pause();
    else            TrackPlayer.play();
}