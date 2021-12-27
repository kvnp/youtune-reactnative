import { DeviceEventEmitter } from "react-native";
import TrackPlayer, { RepeatMode } from "react-native-track-player";
import Media from "../api/Media";
import Music from "./Music";

export default class Cast {
    static player = null;
    static controller = null;
    static initialized = false;
    static deviceName = null;
    static sessionId = null;

    static #emitter = DeviceEventEmitter;
    static EVENT_SESSION = "event-session";
    static EVENT_CAST = "event-cast";

    static addListener(event, listener) {
        try {
            return this.#emitter.addListener(event, listener);
        } finally {
            if (event == this.EVENT_CAST) {
                this.#emitter.emit(this.EVENT_CAST, {
                    castState: !window.chrome.cast
                        ? "NOT_CONNECTED"
                        : cast.framework.CastContext.getInstance().getCastState()
                });
            }
        }
    }

    static initialize() {
        window['__onGCastApiAvailable'] = isAvailable => {
            if (isAvailable) {
                let instance = cast.framework.CastContext.getInstance();
                instance.setOptions({
                    receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
                    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
                    resumeSavedSessions: true
                });

                instance.addEventListener(
                    cast.framework.CastContextEventType.CAST_STATE_CHANGED,
                    e => {
                        if (e.castState == "CONNECTED") {
                            TrackPlayer.setVolume(0);
                            //TrackPlayer.setRepeatMode(RepeatMode.Track);
                        } else {
                            TrackPlayer.setVolume(1);
                        }

                        this.#emitter.emit(this.EVENT_CAST, e);
                    }
                );

                instance.addEventListener(
                    cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
                    e => this.#emitter.emit(this.EVENT_SESSION, e)
                );

                Music.addListener(Music.EVENT_METADATA_UPDATE, () => {
                    if (cast.framework.CastContext.getInstance().getCurrentSession() != null)
                        Cast.cast();
                });

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
        let session = cast.framework.CastContext.getInstance().getCurrentSession();
        if (!session) {
            await cast.framework.CastContext.getInstance().requestSession();
            session = cast.framework.CastContext.getInstance().getCurrentSession();
            Cast.deviceName = session.getCastDevice().friendlyName;
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
        if (media.artwork.startsWith("blob")) {
            media.artwork = (await Media.getAudioInfo({videoId: media.id})).artwork;
        }

        if (media.url.startsWith("blob")) {
            media.url = await Media.getAudioStream({videoId: media.id});
        }

        let mediaInfo = new chrome.cast.media.MediaInfo(media.url, "audio/mp4");
        mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
        mediaInfo.metadata.images = [new chrome.cast.Image(media.artwork)];
        mediaInfo.metadata.title = media.title;
        mediaInfo.metadata.artist = media.artist;
        let request = new chrome.cast.media.LoadRequest(mediaInfo);
        request.queueData = new chrome.cast.media.QueueData();
        request.queueData.repeatMode = chrome.cast.media.RepeatMode.SINGLE;
        
        try {
            await session.loadMedia(request);
        } catch (e) {
            throw e;
        }
    }

    static disconnect() {
        cast.framework.CastContext.getInstance().endCurrentSession();
    }
}