import TrackPlayer, { Capability, RepeatMode } from 'react-native-track-player';
import Media from '../api/Media';

export default class Music {
    static #initialized;
    static repeatMode = RepeatMode.Off;
    static repeatModeString = "repeat";
    static metadataList = [];
    static metadataIndex = null;
    static trackUrlLoaded = [];

    static transitionTrack;

    static initialize = () => {
        return new Promise(async(resolve, reject) => {
            TrackPlayer.registerPlaybackService(TrackPlayerTaskProvider);
            await TrackPlayer.setupPlayer({});
            await TrackPlayer.updateOptions(TrackPlayerOptions);
            Music.#initialized = true;
            TrackPlayer.setRepeatMode(Music.repeatMode);
            resolve();
        });
    }

    static cycleRepeatMode = () => {
        return new Promise(async(resolve, reject) => {
            if (!Music.#initialized)
                reject("Music needs to be initialized by calling initialize()");

            switch(Music.repeatMode) {
                case RepeatMode.Off:
                    await TrackPlayer.setRepeatMode(RepeatMode.Queue);
                    Music.repeatMode = RepeatMode.Queue;
                    Music.repeatModeString = "repeat-on";
                    break;
                case RepeatMode.Queue:
                    await TrackPlayer.setRepeatMode(RepeatMode.Track);
                    Music.repeatMode = RepeatMode.Track;
                    Music.repeatModeString = "repeat-one-on";
                    break;
                case RepeatMode.Track:
                    await TrackPlayer.setRepeatMode(RepeatMode.Off);
                    Music.repeatMode = RepeatMode.Off;
                    Music.repeatModeString = "repeat";
            }
            await TrackPlayer.setRepeatMode(Music.repeatMode);
            resolve();
        });
    }

    static get index() {
        return Music.metadataIndex;
    }

    static get metadata() {
        if (Music.metadataList.length == 0)
            if (Music.transitionTrack == null)
                return {id: null, playlistId: null, title: null, artist: null, artwork: null, duration: null};
            else
                return Music.transitionTrack;
        else
            return Music.metadataList[Music.metadataIndex];
    }

    static skipTo(index) {
        if (Music.metadataList != null) {
            Music.metadataIndex = index;
            TrackPlayer.skip(index);
        }
    }
    
    static skipNext() {
        if (Music.metadataIndex > 0) {
            Music.metadataIndex++;
            TrackPlayer.skipToNext();
        }
    }

    static skipPrevious() {
        if (Music.metadataIndex < Music.metadataList.length - 1) {
            Music.metadataIndex--;
            TrackPlayer.skipToPrevious();
        }
    }

    static setTransitionTrack(track) {
        Music.transitionTrack = track;
    }

    static handlePlayback = async({videoId, playlistId}) => {
        //let queue = await TrackPlayer.getQueue();
        let queue = Music.metadataList;
        if (queue.length > 0) {
            //let index = await TrackPlayer.getCurrentTrack();
            let index = Music.metadataIndex;

            //let track = await TrackPlayer.getTrack(index);
            let track = Music.metadataList[Music.metadataIndex];
    
            if (track.id == videoId)
                return;
    
            if (track)
                return TrackPlayer.skip(index);
    
            Music.metadataList = [];
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
    
            Music.startPlaylist(localPlaylist);
        } else {
            Media.getNextSongs({videoId, playlistId})
                .then(resultPlaylist => Music.startPlaylist(resultPlaylist))
    
                .catch(async(reason) => {});
        }
    }

    static async startPlaylist(playlist) {
        console.log(playlist);
        Music.metadataList = playlist.list;
        Music.trackUrlLoaded = Array(playlist.list.length).fill(false);
    
        for (let i = 0; i < playlist.list.length; i++) {
            let track = playlist.list[i];
            /*if (i == playlist.index) {
                track.url = await getUrl(track.id);
                urlLoaded[i] = true;
            }*/
    
            track.url = await getUrl(track.id);
            Music.trackUrlLoaded[i] = true;
    
            await TrackPlayer.add(track);
            
            if (i == playlist.index) {
                await TrackPlayer.skip(i);
                TrackPlayer.play();
            }
        }
    }
}

const TrackPlayerTaskProvider = () => {
    return async function() {
        TrackPlayer.addEventListener(Event.PlaybackState, params => {
            //console.log(Event.PlaybackState);
            //console.log(params);

            playback = params.state;
            //if (stateCallback)
            //    stateCallback(params.state);
        });

        TrackPlayer.addEventListener(Event.PlaybackTrackChanged, params => {
            console.log(Event.PlaybackTrackChanged);
            console.log(params);
            
            metadataIndex = params.nextTrack;
            //if (trackCallback)
            //    trackCallback(metadataIndex);

            //TrackPlayer.getQueue()
            //    .then(queue => console.log(queue));
        });

        TrackPlayer.addEventListener(Event.PlaybackQueueEnded, params => {
            //console.log(Event.PlaybackQueueEnded);
            //console.log(params);
        });

        TrackPlayer.addEventListener(Event.PlaybackError, params => {
            //console.log(Event.PlaybackError);
            //console.log(params);
            /*TrackPlayer.seekTo(0).then(() => {
                TrackPlayer.play();
            });*/
        });

        TrackPlayer.addEventListener(Event.RemoteNext, params => TrackPlayer.skipToNext);

        TrackPlayer.addEventListener(Event.RemotePrevious, params => TrackPlayer.skipToPrevious);

        TrackPlayer.addEventListener(Event.RemotePlay, params => TrackPlayer.play());

        TrackPlayer.addEventListener(Event.RemotePause, params => TrackPlayer.pause());

        TrackPlayer.addEventListener(Event.RemoteStop, params => TrackPlayer.stop());

        TrackPlayer.addEventListener(Event.RemoteSeek, params => {
            TrackPlayer.seekTo( ~~(params.position) );
        });

        TrackPlayer.addEventListener(Event.RemoteJumpForward, async() => {
            let position = await TrackPlayer.getPosition();
            let duration = await TrackPlayer.getDuration();
            position += 10;
            if (newPosition > duration) position = duration;

            TrackPlayer.seekTo(position);
        });

        TrackPlayer.addEventListener(Event.RemoteJumpBackward, async() => {
            let position = await TrackPlayer.getPosition();
            position -= 10;
            if (newPosition < 0) position = 0;

            TrackPlayer.seekTo(position);
        });
    }
}

const TrackPlayerOptions = {
    stopWithApp: true,
    alwaysPauseOnInterruption: true,

    capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo
    ],

    notificationCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
        Capability.SeekTo
    ],

    compactCapabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
    ]
};