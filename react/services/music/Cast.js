import Media from "../api/Media";
import Music from "./Music";

export default class Cast {
    static initialized = false;
    static metadataListener = null;

    static applicationId;
    static castSession = null;
    static metadataListener;

    static player;
    static playerController;

    static initialize() {
        window['__onGCastApiAvailable'] = function(isAvailable) {
            if (isAvailable) {
                console.log("Initializing Cast");
                Cast.applicationId = chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
                cast.framework.CastContext.getInstance().setOptions({
                    receiverApplicationId: Cast.applicationId,
                    autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
                });

                Cast.player = new cast.framework.RemotePlayer();
                Cast.playerController = new cast.framework.RemotePlayerController(Cast.player);
                Cast.playerController.addEventListener(
                    cast.framework.RemotePlayerEventType.ANY_CHANGE,
                    e => console.log(e)
                );

                console.log(cast.framework.CastContext.getInstance());

                Cast.metadataListener = Music.addListener(
                    Music.EVENT_METADATA_UPDATE,
                    () => {
                        if (Cast.castSession != null)
                            Cast.loadMedia();
                    }
                );

                Cast.initialized = true;
            }
        };
    }

    static startSession() {
        return new Promise((resolve, reject) => {
            if (Cast.castSession != null)
                return resolve();

            chrome.cast.requestSession(
                function sessionListener(e) {
                    Cast.castSession = e;
                    return resolve();
                },

                function onLaunchError(e) {
                    console.log("error");
                    return;
                }
            )

            
        });
        
    }

    static play() {
        return new Promise(async(resolve, reject) => {
            await Cast.startSession();
            return Cast.loadMedia();
        });
    }

    static loadMedia() {
        return new Promise(async(resolve, reject) => {
            let url = await Media.getAudioStream({videoId: Music.metadata.id});
            var mediaInfo = new chrome.cast.media.MediaInfo(url, "audio/mp4");
            var request = new chrome.cast.media.LoadRequest(mediaInfo);
            Cast.castSession.loadMedia(request);
            resolve(true);
        });
    }
}