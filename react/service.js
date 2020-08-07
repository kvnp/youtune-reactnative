import TrackPlayer from 'react-native-track-player';
import { NativeModules } from 'react-native';
import { fetchNext } from "./modules/remote/API";

const LinkBridge = NativeModules.LinkBridge;
const YOUTUBE_WATCH = "https://www.youtube.com/watch?v=";

export var isRepeating = false;

function resolveUrl(id) {
    return new Promise(
        (resolve, reject) => {
            LinkBridge.getLink(
                YOUTUBE_WATCH + id,
                url => resolve(url)
            );
        }
    );
}

export async function getUrl(id) {
    let url = await resolveUrl(id);
    return url;
}

export const setRepeat = boolean => isRepeating = boolean;

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

            if (track.url == undefined)
                track.url = await getUrl(id);
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
            TrackPlayer.skip(id);

            resolve(true);
            return;
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
            console.log(i);
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
    return new Promise(
        async(resolve, reject) => {
            let playlist = await fetchNext(videoId, playlistId);
            let url = await getUrl(playlist.list[playlist.index].id);
            if (url != null) {
                playlist.list[playlist.index].url = url;
                await TrackPlayer.reset();

                for (let i = 0; i < playlist.list.length; i++) {
                    let track = playlist.list[i];
                    
                    if (i == playlist.index)
                        track.url = await getUrl(track.id);

                    await TrackPlayer.add(track);

                    if (i == playlist.index) {
                        await TrackPlayer.skip(playlist.list[playlist.index].id);
                        TrackPlayer.play();
                    }
                }

                resolve(true);
            } else
                reject({playlistId, videoId});
        }
    );
    
}

export function setPlay(isPlaying) {
    if (isPlaying)  TrackPlayer.pause();
    else            TrackPlayer.play();
}