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

module.exports = () => {
    TrackPlayer.addEventListener("playback-track-changed", params => {
        if (isRepeating && params["nextTrack"] != focusedId)
            TrackPlayer.skipToPrevious();
    });

    TrackPlayer.addEventListener("playback-queue-ended", params => {
        console.log(params);
        if (isRepeating)
            TrackPlayer.seekTo(0).then(() => {
                TrackPlayer.play();
            });
    });

    TrackPlayer.addEventListener("playback-error", params => {
        if (isRepeating)
            TrackPlayer.seekTo(0).then(() => {
                TrackPlayer.play();
            });
        else
            skip(true);
    });

    TrackPlayer.addEventListener("remote-next", params => {
        console.log("remote-next");
        skip(true);
    });

    TrackPlayer.addEventListener("remote-previous", params => {
        console.log("remote-previous");
        skip(false);
    });

    TrackPlayer.addEventListener("remote-play", params => TrackPlayer.play());

    TrackPlayer.addEventListener("remote-pause", params => TrackPlayer.pause());

    TrackPlayer.addEventListener("remote-stop", params => TrackPlayer.stop());

    TrackPlayer.addEventListener("remote-seek", params => {
        TrackPlayer.seekTo( ~~(params["position"]) );
    });

    TrackPlayer.addEventListener('remote-jump-forward', async() => {
        let position = await TrackPlayer.getPosition();
        let duration = await TrackPlayer.getDuration();
        position += 10;
        if (newPosition > duration) position = duration;

        TrackPlayer.seekTo(position);
    });

    TrackPlayer.addEventListener('remote-jump-backward', async() => {
        let position = await TrackPlayer.getPosition();
        position -= 10;
        if (newPosition < 0) position = 0;

        TrackPlayer.seekTo(position);
    });
};