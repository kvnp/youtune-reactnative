import { DeviceEventEmitter } from "react-native";
import { State } from "react-native-track-player";
import Media from "../api/Media";
import Music from "./Music";

export default class Cast {
    static player = null;
    static controller = null;
    static initialized = false;
    static deviceName = null;
    static sessionId = null;

    static #emitter = DeviceEventEmitter;
    static EVENT_SESSION = "event-cast-session";
    static EVENT_CAST = "event-cast-status";
    static EVENT_POSITION = "event-cast-position";
    static EVENT_METADATA = "event-cast-metadata";
    static EVENT_PLAYERSTATE = "event-cast-playerstate";

    static addListener(event, listener) {
        try {
            return this.#emitter.addListener(event, listener);
        } finally {
            if (event == this.EVENT_CAST) {
                let castState = "NOT_CONNECTED";
                if (window.hasOwnProperty("cast")) {
                    castState = !window.chrome.cast
                        ? "NOT_CONNECTED"
                        : cast.framework.CastContext.getInstance().getCastState()
                }
                
                this.#emitter.emit(
                    this.EVENT_CAST,
                    {castState: castState}
                );
            }
        }
    }

    static initialize() {
        if (!window.hasOwnProperty("chrome"))
            return;

        window['__onGCastApiAvailable'] = isAvailable => {
            if (isAvailable) {
                Cast.player = new cast.framework.RemotePlayer();
                Cast.controller = new cast.framework.RemotePlayerController(Cast.player);

                let instance = cast.framework.CastContext.getInstance();
                instance.setOptions({
                    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
                    resumeSavedSessions: true
                });

                instance.addEventListener(
                    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
                    e => {
                        this.#emitter.emit(this.EVENT_CAST, e);
                        console.log(e);
                    }
                );

                let session = cast.framework.CastContext.getInstance().getCurrentSession();
                if (session)
                    Cast.deviceName = session.getCastDevice().friendlyName;
                
                Cast.controller.addEventListener(
                    cast.framework.RemotePlayerEventType.CURRENT_TIME_CHANGED,
                    e => this.#emitter.emit(this.EVENT_POSITION, e.value)
                );

                Cast.controller.addEventListener(
                    cast.framework.RemotePlayerEventType.MEDIA_INFO_CHANGED,
                    e => console.log(e)
                );

                Cast.controller.addEventListener(
                    cast.framework.RemotePlayerEventType.QUEUE_INFO_CHANGED,
                    e => console.log(e)
                );

                Cast.controller.addEventListener(
                    cast.framework.RemotePlayerEventType.PLAYER_STATE_CHANGED,
                    e => {
                        let state;
                        switch (e.value) {
                            case "IDLE":
                                state = State.Ready;
                                break;
                            case "PLAYING":
                                state = State.Playing;
                                break;
                            case "PAUSED":
                                state = State.Paused;
                                break;
                            case "BUFFERING":
                                state = State.Buffering;
                        }
                        this.#emitter.emit(this.EVENT_PLAYERSTATE, state);
                    }
                );

                Cast.initialized = true;
            }
        };

        if (window.chrome && !window.chrome.cast) {
            var script = document.createElement('script');
            script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
            document.head.appendChild(script);
        }
    }

    static async cast() {
        let currentTime = 0;
        let session = cast.framework.CastContext.getInstance().getCurrentSession();
        if (!session) {
            await cast.framework.CastContext.getInstance().requestSession();
            session = cast.framework.CastContext.getInstance().getCurrentSession();
            Cast.deviceName = session.getCastDevice().friendlyName;
            currentTime = Music.position;
        }
        
        /*let startsWithBlob = url => url != undefined
            ? url.startsWith("blob")
            : true;

        let startIndex = Music.metadataIndex;
        let firstMedia;
        for (let i = 0; i < Music.metadataList.length; i++) {
            let currentMetadata = Music.metadataList[i];
            let src;

            if (Music.trackUrlLoaded[i] && !startsWithBlob(currentMetadata.url)) {
                src = currentMetadata.url;
            } else {
                try {
                    Music.metadataList[i].url = await Media.getAudioStream({
                        videoId: currentMetadata.id
                    });

                    src = Music.metadataList[i].url;
                } catch (_) {
                    src = currentMetadata.url;
                }
            }

            let mediaInfo = new chrome.cast.media.MediaInfo(src, "audio/mp4");
            mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
            mediaInfo.metadata.title = currentMetadata.title;
            mediaInfo.metadata.artist = currentMetadata.artist;
            if (Music.metadataIndex == i) {
                firstMedia = mediaInfo;
            }

            if (!startsWithBlob(currentMetadata.artwork)) {
                mediaInfo.metadata.images = [new chrome.cast.Image(currentMetadata.artwork)];
            }
            
            request.queueData.items.push(new chrome.cast.media.QueueItem(mediaInfo));
        }*/

        let media = Music.metadata;
        if (media.artwork?.startsWith("blob") || !media.artwork) {
            media.artwork = (await Media.getAudioInfo({videoId: media.id})).artwork;
        }

        if (media.url?.startsWith("blob") || !media.url) {
            media.url = await Media.getAudioStream({videoId: media.id});
        }

        let mediaInfo = new chrome.cast.media.MediaInfo(media.url, "audio/mp4");
        mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
        mediaInfo.metadata.images = [new chrome.cast.Image(media.artwork)];
        mediaInfo.metadata.title = media.title;
        mediaInfo.metadata.artist = media.artist;
        let request = new chrome.cast.media.LoadRequest(mediaInfo);
        request.currentTime = currentTime;
        request.queueData = new chrome.cast.media.QueueData();
        request.queueData.repeatMode = chrome.cast.media.RepeatMode.SINGLE;
        
        try {
            await session.loadMedia(request);
        } catch (e) {
            throw e;
        }
    }

    static setRepeatMode() {
        //TODO
    }

    static seekTo(position) {
        let session = cast.framework.CastContext.getInstance().getCurrentSession();
        if (session) {
            session.sendMessage("urn:x-cast:com.google.cast.media", {
                mediaSessionId: session.getMediaSession().mediaSessionId,
                requestId: 1,
                type: "SEEK",
                currentTime: position
            });
        }
    }

    static play() {
        Cast.controller.playOrPause();
    }

    static pause() {
        Cast.controller.playOrPause();
    }

    static reset() {
        this.disconnect();
    }

    static disconnect() {
        let instance = cast.framework.CastContext.getInstance()
        let session = instance.getCurrentSession();
        if (!session)
            instance.endCurrentSession();
        else
            session.endSession(true);
    }
}