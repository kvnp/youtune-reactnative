import { DeviceEventEmitter } from 'react-native';
import TrackPlayer, { Capability, RepeatMode, Event, State } from 'react-native-track-player';
import Queue from 'queue-promise';
import Media from '../api/Media';
import Downloads from '../device/Downloads';
import Cast from './Cast';

export default class Music {
    static #initialized;
    static state = State.None;
    static position = 0;
    static repeatMode = RepeatMode.Off;
    static repeatModeString = "repeat";
    static metadataList = [];
    static metadataIndex = null;
    static playlistId = null;
    static trackUrlLoaded = [];

    static transitionTrack;
    static wasPlayingBeforeSkip = false;

    static #emitter = DeviceEventEmitter;
    static EVENT_METADATA_UPDATE = "event-metadata-update";

    static TrackPlayerTaskProvider = () => {
        return async function() {
            TrackPlayer.addEventListener(Event.PlaybackState, params => {
                Music.state = params.state;
            });
    
            TrackPlayer.addEventListener(Event.PlaybackTrackChanged, params => {
                if (Music.metadataIndex != params.nextTrack) {
                    Music.metadataIndex = params.nextTrack;
                    Music.#emitter.emit(Music.EVENT_METADATA_UPDATE, null);
                }

                if (params.nextTrack < Music.metadataList.length - 1 && params.nextTrack >= 0) {
                    if (!Music.trackUrlLoaded[params.nextTrack]) {
                        Music.#queue.enqueue(() => {
                            return new Promise(async(resolve, reject) => {
                                let track = Music.metadataList[params.nextTrack];
                                track.url = await Music.getStream({videoId: track.id});
                                resolve(track);
                            });
                        });
                    }
                }
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
    
            TrackPlayer.addEventListener(Event.RemoteNext, params => {
                Music.skipNext();
            });
    
            TrackPlayer.addEventListener(Event.RemotePrevious, params => {
                Music.skipPrevious();
            });
    
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
                if (position > duration) position = duration;
    
                TrackPlayer.seekTo(position);
            });
    
            TrackPlayer.addEventListener(Event.RemoteJumpBackward, async() => {
                let position = await TrackPlayer.getPosition();
                position -= 10;
                if (newPosition < 0) position = 0;
    
                TrackPlayer.seekTo(position);
            });
        }
    };

    static #queue = new Queue({
        concurrent: 5,
        interval: 1
    });

    static addListener(event, listener) {
        return Music.#emitter.addListener(event, listener);
    }

    static initialize = () => {
        return new Promise(async(resolve, reject) => {
            Cast.initialize();
            TrackPlayer.registerPlaybackService(Music.TrackPlayerTaskProvider);
            await TrackPlayer.setupPlayer({});
            await TrackPlayer.updateOptions(TrackPlayerOptions);

            Music.#queue.on("start", () => {});
            Music.#queue.on("stop", () => {});
            Music.#queue.on("end", () => {});

            Music.#queue.on("reject", error => {});
            Music.#queue.on("resolve", async(track) => {
                if (Music.metadataList == null)
                    return;

                let trackIndex = -1;
                for (let i = 0; i < Music.metadataList.length; i++) {
                    if (Music.metadataList[i].id == track.id) {
                        trackIndex = i;
                        break;
                    }
                }

                if (trackIndex == -1)
                    return;

                await TrackPlayer.remove(trackIndex);
                await TrackPlayer.add(track, trackIndex);
                Music.trackUrlLoaded[trackIndex] = true;

                if (Music.metadata.id != track.id)
                    return;

                await TrackPlayer.skip(trackIndex);
                TrackPlayer.play();
            });

            Music.#initialized = true;
            TrackPlayer.setRepeatMode(Music.repeatMode);
            resolve();
        });
    }

    static reset = () => {
        Music.metadataIndex = 0;
        Music.metadataList = [];
        TrackPlayer.reset();
    }

    static cycleRepeatMode = () => {
        if (!Music.#initialized)
            return reject("Music needs to be initialized by calling initialize()");

        switch (Music.repeatMode) {
            case RepeatMode.Off:
                Music.repeatMode = RepeatMode.Queue;
                Music.repeatModeString = "repeat-on";
                break;
            case RepeatMode.Queue:
                Music.repeatMode = RepeatMode.Track;
                Music.repeatModeString = "repeat-one-on";
                break;
            case RepeatMode.Track:
                Music.repeatMode = RepeatMode.Off;
                Music.repeatModeString = "repeat";
        }
        
        TrackPlayer.setRepeatMode(Music.repeatMode);
        return Music.repeatModeString;
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
        if (index == null || Music.metadataList == null)
            return;

        let forward;
        if (index < 0) {
            if (Music.repeatMode == RepeatMode.Queue) {
                index = Music.metadataList.length - 1;
                forward = false;
            } else {
                index = 0;
            }
        } else if (index + 1 > Music.metadataList.length) {
            if (Music.repeatMode == RepeatMode.Queue) {
                index = 0;
                forward = true;
            } else {
                index = Music.metadataList.length - 1;
            }
        }
        
        forward = forward != undefined
            ? forward
            : index > Music.metadataIndex;
        //let playing = Music.state == State.Playing;
        //TrackPlayer.pause();
        let seek = !forward && Music.position >= 10;

        if (seek)
            TrackPlayer.seekTo(0);
        else {
            Music.metadataIndex = index;
            Music.#emitter.emit(Music.EVENT_METADATA_UPDATE, null);
        }
        
        if (Music.trackUrlLoaded[Music.metadataIndex]) {
            if (!seek)
                TrackPlayer.skip(index);
        } else {
            Music.#queue.enqueue(() => {
                return new Promise(async(resolve, reject) => {
                    let track = Music.metadataList[Music.metadataIndex];
                    track.url = await Music.getStream({videoId: track.id});
                    resolve(track);
                });
            });
        }
    }
    
    static skipNext() {
        TrackPlayer.getPosition().then(position => {
            Music.position = position;
            Music.skipTo(Music.metadataIndex + 1);
        })
    }

    static skipPrevious() {
        TrackPlayer.getPosition().then(position => {
            Music.position = position;
            Music.skipTo(Music.metadataIndex - 1);
        })
    }

    static setTransitionTrack(track) {
        Music.transitionTrack = track;
    }

    static getStream({videoId}) {
        if (Downloads.isTrackDownloaded(videoId))
            return Downloads.getStream(videoId);
        else
            return Media.getAudioStream({videoId});
    }

    static handlePlayback = async({videoId, playlistId}) => {
        let queue = Music.metadataList;
        if (queue.length > 0) {
            let track = Music.metadata;

            if (playlistId == track.playlistId) {
                if (track.id == videoId)
                    return;
                
                for (let i = 0; i < queue.length; i++) {
                    if (queue[i].id == videoId) {
                        return Music.skipTo(i);
                    }
                }
            }

            Music.reset();
        }

        Music.state = State.Buffering;
        if (playlistId?.startsWith("LOCAL")) {
            Downloads.loadLocalPlaylist(playlistId, videoId)
                .then(localPlaylist => Music.startPlaylist(localPlaylist))
                .catch(_ => console.log(_));
        } else {
            Media.getNextSongs({videoId, playlistId})
                .then(resultPlaylist => Music.startPlaylist(resultPlaylist))
                .catch(_ => console.log(_));
        }
    }

    static async startPlaylist(playlist) {
        Music.metadataList = playlist.list;
        Music.trackUrlLoaded = Array(playlist.list.length).fill(false);
        Music.metadataIndex = 0;

        for (let i = 0; i < playlist.list.length; i++) {
            if (i == playlist.index) {
                Music.metadataIndex = i;
            }

            if (i == playlist.index || i == playlist.index + 1) {
                playlist.list[i].url = await Music.getStream({videoId: playlist.list[i].id});
                Music.trackUrlLoaded[i] = true;
            }

            if (i == playlist.index + 1) {
                break;
            }
        }

        await TrackPlayer.add(playlist.list);
        await TrackPlayer.skip(Music.metadataIndex);
        TrackPlayer.play();
        
        Music.#emitter.emit(Music.EVENT_METADATA_UPDATE, null);
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