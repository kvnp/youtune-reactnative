/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not the UI
 * such as processing media buttons or analytics
 */

import TrackPlayer from 'react-native-track-player';
import { NativeModules } from 'react-native';
import { fetchNext } from "./modules/remote/API";

const LinkBridge = NativeModules.LinkBridge;
const YOUTUBE_WATCH = "https://www.youtube.com/watch?v=";

var isRepeating = false;

function resolveUrl(id) {
    return new Promise(
        (resolve, reject) => {
            LinkBridge.getString(
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

export const setRepeat = boolean => {
    console.log("repeat: " + isRepeating);
    isRepeating = boolean;
}

async function handleSkip(array, index, forward) {
    let next;
    if (forward && index + 1 < array.length)
        next = index + 1;
    else if (!forward && index > 0)
        next = index - 1;
    else
        next = 0;

    if (array[next].url == null) {
        let track = array[next];
        track.url = await this.getUrl(array[next].id);
        
        await TrackPlayer.remove(track.id);
        let afterId = null;
        if (next < array.length)
            afterId = array[next + 1].id;

        await TrackPlayer.add(track, afterId);
    }

    if (forward)
        TrackPlayer.skipToNext();
    else
        TrackPlayer.skipToPrevious().catch(() => TrackPlayer.seekTo(0));
}

export const skip = async(forward) => {
    let id = await TrackPlayer.getCurrentTrack();
    let index;
    let track = await TrackPlayer.getTrack(id);
    let array = await TrackPlayer.getQueue();

    for (let i = 0; i < array.length; i++) {
        if (track.id == id) {
            index = i;
            break;
        }
    }

    if (forward) {
        if (index < array.length)
            handleSkip(array, index, forward);

    } else {
        let position = await TrackPlayer.getPosition();

        if (position > 10)
            TrackPlayer.seekTo(0);
        else
            handleSkip(array, index, forward);
    }
}

export function startPlayback({ playlistId, videoId }) {
    fetchNext(videoId, playlistId).then(
        playlist => getUrl(playlist.list[playlist.index].id)
            .then(async(url) => {
                playlist.list[playlist.index].url = url;
                await TrackPlayer.reset();
                for (let i = 0; i < playlist.list.length; i++) {
                    let track = playlist.list[i];
                    track.url = await getUrl(track.id);
                    
                    await TrackPlayer.add(track);

                    if (i == playlist.index)
                        await TrackPlayer.skip(playlist.list[playlist.index].id);
                        TrackPlayer.play();
                }
            })
    );
    return;
}

export function setPlay(isPlaying) {
    if (isPlaying)
        TrackPlayer.pause();
    else
        TrackPlayer.play();
}