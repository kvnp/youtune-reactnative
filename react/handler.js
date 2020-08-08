/**
 * This is the code that will run tied to the player.
 *
 * The code here might keep running in the background.
 *
 * You should put everything here that should be tied to the playback but not the UI
 * such as processing media buttons or analytics
 */

import TrackPlayer from 'react-native-track-player';
import { skip, isRepeating, focusedId } from './service';

module.exports = async function() {
    TrackPlayer.addEventListener("playback-track-changed", params => {
        if (isRepeating && params["nextTrack"] != focusedId)
            TrackPlayer.skipToPrevious();
    });

    TrackPlayer.addEventListener("playback-queue-ended", params => {
        //console.log("queue ended");
    });

    TrackPlayer.addEventListener("playback-error", params => skip(true));

    TrackPlayer.addEventListener("remote-next", params => skip(true));

    TrackPlayer.addEventListener("remote-previous", params => skip(false));

    TrackPlayer.addEventListener("remote-play", params => TrackPlayer.play());

    TrackPlayer.addEventListener("remote-pause", params => TrackPlayer.pause());

    TrackPlayer.addEventListener("remote-stop", params => TrackPlayer.stop());

    TrackPlayer.addEventListener("remote-seek", params => {
        TrackPlayer.seekTo(Math.floor(params["position"]));
    });
};