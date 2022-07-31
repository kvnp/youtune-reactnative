import getAudioInfo from "../../api/extractor/AudioInfoResponse";
import getStreamInfo from "../../api/extractor/StreamResponse";

function getSpeed(startTime, endTime, downloadSize) {
    let duration = (endTime - startTime) / 1000;
    let bitsLoaded = downloadSize * 8;
    let speedBps = (bitsLoaded / duration).toFixed(2);
    let speedKbps = (speedBps / 1024).toFixed(2);
    return speedKbps + " Kb/s";
}

async function downloadTrack(videoId, cacheOnly) {
    let url = self.location.protocol + "//" + self.location.host + "/proxy" + "/youtubei/v1/player?alt=json&key=AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";
    let input = {
        body: JSON.stringify({context: {client: {
            clientName: "ANDROID_MUSIC",
            clientVersion: "4.57"
        }}, videoId}),
        method: "POST",
        credentials: "omit",
        headers: {
            "Referer": "https://music.youtube.com/",
            "Content-Type": "application/json"
        },
    };

    const trackFetch = await fetch(url, input);
    const trackResponse = await trackFetch.json();
    let track = getAudioInfo(trackResponse);
    track.artwork = self.location.protocol + "//" + self.location.host + "/proxy/lh3/" + track.artwork.split("/").slice(3).join("/");

    input = {
        method: "GET",
        credentials: "omit",
        headers: {"Referer": "https://music.youtube.com/"}
    };
    const artworkResponse = await fetch(track.artwork, input);
    track.artwork = await artworkResponse.blob();
    track.videoId = track.id;
    delete track.id;
    delete track.playable;
    self.postMessage({message: "track", payload: track});

    if (!cacheOnly) {
        track.url = getStreamInfo(trackResponse);
        track.url = self.location.protocol + "//" + self.location.host + "/proxy/" + track.url.split("/").slice(3).join("/");

        const blobResponse = await fetch(track.url, input);
        const reader = blobResponse.body.getReader();
        const contentLength = blobResponse.headers.get("Content-Length");
        const contentType = blobResponse.headers.get("Content-Type");

        let startTime, endTime;
        let receivedLength = 0;
        let chunks = [];
        while (true) {
            startTime = new Date().getTime();
            const {done, value} = await reader.read();
            if (done)
                break;
            
            chunks.push(value);
            receivedLength += value.length;
            endTime = new Date().getTime();
            self.postMessage({
                message: "progress",
                payload: {
                    videoId,
                    speed: getSpeed(startTime, endTime, value.length), 
                    progress: receivedLength/contentLength, completed: false
                }
            });
        }

        let blob = new Blob(chunks, {type: contentType});
        if (["audio", "video"].includes(blob.type.split("/")[0])) {
            self.postMessage({
                message: "download",
                payload: {
                    videoId: videoId,
                    url: blob,
                    date: new Date().getTime()
                }
            });
        }
    }

    self.postMessage({
        message: "progress",
        payload: {
            videoId,
            progress: 1,
            completed: true
        }
    });
    self.close();
}


self.onmessage = ({data: {videoId, cacheOnly}}) => {
    downloadTrack(videoId, cacheOnly);
};