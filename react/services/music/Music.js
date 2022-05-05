import { DeviceEventEmitter } from 'react-native';
import TrackPlayer, { Capability, RepeatMode, Event, State } from 'react-native-track-player';
import Queue from 'queue-promise';
import Downloads from '../device/Downloads';
import Cast from './Cast';
import API from '../api/API';

export default class Music {
    static #initialized;
    static state = State.None;
    static position = 0;
    static #positionInterval = null;
    static #positionListener = null;
    static isStreaming = false;

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
    static EVENT_POSITION_UPDATE = "event-position-update";
    static EVENT_STATE_UPDATE = "event-state-update";

    static audioContext;

    static TrackPlayerTaskProvider = () => {
        return async function() {
            TrackPlayer.addEventListener(Event.PlaybackState, params => {
                if (Music.isStreaming)
                    return clearInterval(Music.#positionInterval)

                if (params.state != State.Playing) {
                    clearInterval(Music.#positionInterval);
                    TrackPlayer.getPosition().then(Music.#updatePosition);
                } else if (params.state != Music.state) {
                    Music.#positionInterval = setInterval(async() =>
                        Music.#updatePosition(await TrackPlayer.getPosition())
                    , 500);
                }

                Music.state = params.state;
                Music.#emitter.emit(Music.EVENT_STATE_UPDATE, params.state);
            });
    
            TrackPlayer.addEventListener(Event.PlaybackTrackChanged, params => {
                if (Music.isStreaming)
                    return;

                if (Music.metadataIndex != params.nextTrack) {
                    Music.metadataIndex = params.nextTrack;
                    Music.#emitter.emit(Music.EVENT_METADATA_UPDATE, Music.metadata);
                    Music.#updatePosition(0);
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

    static play = () => {
        if (Music.isStreaming)
            Cast.play();
        else {
            if (Music.audioContext)
                Music.audioContext.resume();
            TrackPlayer.play();
        }
    }

    static pause = () => {
        if (Music.isStreaming)
            Cast.pause();
        else
            TrackPlayer.pause();
    }

    static reset = () => {
        if (!Music.isStreaming)
            TrackPlayer.reset();

        Music.state = State.None;
        Music.#emitter.emit(Music.EVENT_STATE_UPDATE, State.None);
        Music.metadataList = [];
        Music.metadataIndex = 0;
        Music.position = 0;
    }

    static seekTo = position => {
        Music.#updatePosition(position);
        if (Music.isStreaming)
            Cast.seekTo(position);
        else {
            TrackPlayer.seekTo(position);
            clearInterval(Music.#positionInterval);
            Music.#positionInterval = setInterval(async() =>
                Music.#updatePosition(await TrackPlayer.getPosition())
            , 500);
        }
    }

    static #updatePosition = pos => {
        this.position = pos;
        Music.#emitter.emit(this.EVENT_POSITION_UPDATE, pos);
    }

    static initialize = () => {
        return new Promise(async(resolve, reject) => {
            TrackPlayer.registerPlaybackService(Music.TrackPlayerTaskProvider);
            await TrackPlayer.setupPlayer({});
            await TrackPlayer.updateOptions(TrackPlayerOptions);
            TrackPlayer.setRepeatMode(Music.repeatMode);

            Music.#queue.on("reject", error => console.log(error));
            Music.#queue.on("resolve", async(track) => {
                if (!Music.metadataList?.length)
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

                Music.skip(trackIndex);
            });

            Cast.initialize();
            Cast.addListener(Cast.EVENT_CAST, e => {
                if (e.castState == "CONNECTED") {
                    if (!Music.isStreaming) {
                        Music.isStreaming = true;
                        TrackPlayer.reset();
                        clearInterval(Music.#positionInterval);

                        Music.#positionListener = Cast.addListener(
                            Cast.EVENT_POSITION,
                            pos => Music.#updatePosition(pos)
                        );
                    }
                } else {
                    if (!Music.isStreaming)
                        return;

                    Music.isStreaming = false;
                    Music.#positionListener.remove();
                    if (Music.metadataList.length > 0)
                        Music.startPlaylist({
                            list: Music.metadataList,
                            index: Music.metadataIndex
                        }, Music.position);
                }
            });

            Cast.addListener(Cast.EVENT_PLAYERSTATE, e => {
                this.state = e;
                Music.#emitter.emit(this.EVENT_STATE_UPDATE, e);
            });

            Music.#initialized = true;
            resolve();
        });
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
            if (Music.transitionTrack)
                return Music.transitionTrack;
            else
                return {id: null, playlistId: null, title: null, artist: null, artwork: null, duration: 0};
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
            } else
                index = 0;
        } else if (index + 1 > Music.metadataList.length) {
            if (Music.repeatMode == RepeatMode.Queue) {
                index = 0;
                forward = true;
            } else
                index = Music.metadataList.length - 1;
        }
        
        forward = forward != undefined
            ? forward
            : index > Music.metadataIndex;
        //let playing = Music.state == State.Playing;
        //TrackPlayer.pause();
        let seek = !forward && Music.position >= 10;

        if (seek)
            Music.seekTo(0)
        else
            Music.skip(index);
        
        if (Music.trackUrlLoaded[Music.metadataIndex]) {
            if (!seek)
                Music.skip(index);
        } else {
            if (!Music.isStreaming)
                Music.#queue.enqueue(() => {
                    return new Promise(async(resolve, reject) => {
                        let track = Music.metadataList[Music.metadataIndex];
                        track.url = await Music.getStream({videoId: track.id});
                        resolve(track);
                    });
                });
            else
                Music.skip(index);
        }
    }

    static skip(index) {
        if (Music.isStreaming) {
            Music.metadataIndex = index;
            Cast.cast();
        } else {
            TrackPlayer.skip(index);
        }
        Music.#emitter.emit(Music.EVENT_METADATA_UPDATE, Music.metadata);
    }
    
    static skipNext() {
        Music.skipTo(Music.metadataIndex + 1);
    }

    static skipPrevious() {
        Music.skipTo(Music.metadataIndex - 1);
    }

    static getStream({videoId}) {
        if (Downloads.isTrackDownloaded(videoId))
            return Downloads.getStream(videoId);
        else
            return API.getAudioStream({videoId});
    }

    static getMetadata({videoId}) {
        if (Downloads.isTrackCached(videoId))
            return Downloads.getTrack(videoId);
        else
            return API.getAudioInfo({videoId});
    }

    static handlePlayback = async(track) => {
        Music.transitionTrack = track;
        const { id, playlistId } = track;

        let queue = Music.metadataList;
        if (queue.length > 0) {
            let track = Music.metadata;

            if (playlistId == track.playlistId) {
                if (track.id == id)
                    return;
                
                for (let i = 0; i < queue.length; i++) {
                    if (queue[i].id == id)
                        return Music.skip(i);
                }
            }

            Music.reset();
        }

        Music.state = State.Buffering;
        Music.#emitter.emit(Music.EVENT_STATE_UPDATE, State.Buffering);

        let local = false;
        if (typeof playlistId == "string")
            if (playlistId.startsWith("LOCAL"))
                local = true;

        if (local) {
            Downloads.loadLocalPlaylist(playlistId, id)
                .then(localPlaylist => Music.startPlaylist(localPlaylist))
                .catch(_ => console.log(_));
        } else {
            API.getNextSongs({videoId: id, playlistId})
                .then(resultPlaylist => Music.startPlaylist(resultPlaylist))
                .catch(_ => console.log(_));
        }
    }

    static async startPlaylist(playlist, position) {
        Music.metadataList = playlist.list;
        Music.trackUrlLoaded = Array(playlist.list.length).fill(false);

        for (let i = 0; i < playlist.list.length; i++) {
            if (i == playlist.index)
                Music.metadataIndex = i;

            if (i == playlist.index || i == playlist.index + 1) {
                if (Downloads.isTrackDownloaded(playlist.list[i].id) || !playlist.list[i].duration) {
                    playlist.list[i] = await Music.getMetadata({videoId: playlist.list[i].id});
                    playlist.list[i].id = playlist.list[i].videoId;
                    playlist.list[i].videoId = undefined;
                }

                playlist.list[i].url = await Music.getStream({videoId: playlist.list[i].id});
                Music.trackUrlLoaded[i] = true;
            }

            if (i == playlist.index + 1)
                break;
        }

        if (!Music.isStreaming) {
            await TrackPlayer.add(playlist.list);
            await TrackPlayer.skip(Music.metadataIndex);
            if (position)
                await TrackPlayer.seekTo(position);

            Music.play();
        } else {
            Cast.cast();
        }
        
        Music.#emitter.emit(Music.EVENT_METADATA_UPDATE, Music.metadata);
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