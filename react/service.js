import TrackPlayer from 'react-native-track-player';
import { fetchNext, fetchAudioStream } from "./modules/remote/API";
import { StatusBar } from 'react-native';

export const register = () => {
    StatusBar.setBarStyle("dark-content", true);
    StatusBar.setTranslucent(true);
    StatusBar.setBackgroundColor("transparent", true);

    global.navigationOptions = {
        headerTitle: null,
        headerShown: false
    };

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
}

export const YOUTUBE_WATCH = "https://www.youtube.com/watch?v=";

export var transmitLanguage = false;
export var proxyYTM = false;
export var safetyMode = false;

export const setTransmitLanguage = boolean => {
    transmitLanguage = boolean;
}

export const setProxyYTM = boolean => {
    proxyYTM = boolean;
}

export const setSafetyMode = boolean => {
    safetyMode = boolean;
}

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

export const skipTo = (id) => {
    return new Promise(
        async(resolve, reject) => {
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
            if (track.url == undefined)
                track.url = await fetchAudioStream(id);
            else {
                TrackPlayer.skip(id);

                resolve(true);
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
            TrackPlayer.seekTo(0);

            resolve(true);
        }
    );
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

    if (forward && index == array.length - 1 || !forward && position > 10)
        return TrackPlayer.seekTo(0);

    let next;
    if (forward)
        next = array[index + 1].id;
    else
        next = array[index - 1].id;

    return skipTo(next);
}

export async function startPlayback({ playlistId, videoId }) {
    let playlist = await fetchNext(videoId, playlistId);
    startPlaylist(playlist);
}

export async function startPlaylist(playlist) {
    await TrackPlayer.reset();
    for (let i = 0; i < playlist.list.length; i++) {
        let track = playlist.list[i];
        if (i == playlist.index || i == 0)
            track.url = await fetchAudioStream(track.id);

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