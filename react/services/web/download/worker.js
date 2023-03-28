import getAudioInfo from "../../api/extractor/AudioInfoResponse";

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
            clientName: "WEB_REMIX",
            clientVersion: "0.1"
        }}, videoId}),
        method: "POST",
        credentials: "omit",
        headers: {
            "Referer": "https://www.youtube.com/",
            "Content-Type": "application/json"
        },
    };

    if (!isDecryptionWorking())
        await enableDecryption({videoId});

    input.body["playbackContext"] = {contentPlaybackContext: {signatureTimestamp: signatureTimestamp}};

    const trackFetch = await fetch(url, input);
    const trackResponse = await trackFetch.json();
    let track = getAudioInfo(trackResponse);

    let split = track.artwork.split("/");
    let proxy = split[3] == "vi" ? "/proxy/" : "/proxy/lh3/";
    track.artwork = self.location.protocol + "//" + self.location.host + proxy + split.slice(3).join("/");

    input = {
        method: "GET",
        credentials: "omit",
        headers: {"Referer": "https://www.youtube.com/"}
    };
    const artworkResponse = await fetch(track.artwork, input);
    track.artwork = await artworkResponse.blob();
    delete track.playable;
    self.postMessage({message: "track", payload: track});

    if (!cacheOnly) {
        track.url = digestStreams(trackResponse).url;
        track.url = self.location.protocol + "//" + self.location.host + "/proxy/" + track.url.split("/").slice(3).join("/");

        const response = await fetch(track.url, {...input, method: "HEAD", redirect: "manual"});
        const contentLength = Number.parseInt(response.headers.get("Content-Length"));
        const contentType = response.headers.get("Content-Type");
        
        const parts = 8;
        const part = ~~(contentLength / parts);
        const last = contentLength - ((parts - 1)*part);
        for (let i = 0; i < parts; i++) {
            let start = (part*i) + (i>0 ?1 :0);
            let end = (i == parts-1)
                ? part*i + last
                : part*(i+1);

            console.log({start, end});

            //promises.push(fetch(track.url + "&range="+start+"-"+end, input))
        }

        const blobResponse = await fetch(track.url, input);
        const reader = blobResponse.body.getReader();

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

const FORMATS = "formats";
const ADAPTIVE_FORMATS = "adaptiveFormats";
const DEOBFUSCATION_FUNC_NAME = "deobfuscate";
const STREAMING_DATA = "streamingData";
const PLAYER = "player";
const NEXT = "next";
const SIGNATURE_CIPHER = "signatureCipher";
const CIPHER = "cipher";

const REGEXES = [
        "(?:\\b|[^a-zA-Z0-9$])([a-zA-Z0-9$]{2,})\\s*=\\s*function\\(\\s*a\\s*\\)"
                + "\\s*\\{\\s*a\\s*=\\s*a\\.split\\(\\s*\"\"\\s*\\)",
        "\\bm=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(h\\.s\\)\\)",
        "\\bc&&\\(c=([a-zA-Z0-9$]{2,})\\(decodeURIComponent\\(c\\)\\)",
        "([\\w$]+)\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(\"\"\\)\\s*;",
        "\\b([\\w$]{2,})\\s*=\\s*function\\((\\w+)\\)\\{\\s*\\2=\\s*\\2\\.split\\(\"\"\\)\\s*;",
        "\\bc\\s*&&\\s*d\\.set\\([^,]+\\s*,\\s*(:encodeURIComponent\\s*\\()([a-zA-Z0-9$]+)\\("
];
const STS_REGEX = "signatureTimestamp[=:](\\d+)";

const function_name = "decryptSignature";

var functionString = null;
export var signatureTimestamp = null;

async function fetchBaseJsLocation(videoId) {
    let watchUrl = self.location.protocol + "//" + self.location.host + "/proxy" + "/watch?v=" + videoId;

    let response = await fetch(watchUrl, {
        method: "GET",
        headers: {
            "User-Agent":
            "Mozilla/5.0 (Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0"
        }
    });
    
    let watchResponse = await response.text();
    let location = extractLocation(watchResponse);

    return location;
}

function extractLocation(response) {
    let searchTerm;
    if (response.indexOf('"js":') != -1) {
        searchTerm = '"js":';
    } else if (response.indexOf('"jsUrl":') != -1) {
        searchTerm = '"jsUrl":';
    } else {
        return null;
    }

    let jsIndex = response.indexOf(searchTerm);

    let side = response.substring(jsIndex + searchTerm.length);
    let ind1x = side.indexOf(",");
    let ind2x = side.indexOf("}");

    let result;
    if (ind1x < ind2x)
        result = side.substring(0, ind1x);
    else
        result = side.substring(0, ind2x);

    return result.replace(/\\/g, '').replace(/\"/g, '');
}

async function fetchBaseJs(location) {
    let playerUrl = self.location.protocol + "//" + self.location.host + "/proxy" + location;
    console.log(playerUrl);
    let response = await fetch(playerUrl, {
        method: "GET",
        headers: {
            "User-Agent":
            "Mozilla/5.0 (Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0"
        }
    });
    
    let playerCode = response.text();
    return playerCode;
}

function extractTimestamp(code) {
    return new RegExp(STS_REGEX).exec(code)[1];
}

function getFunction(code) {
    let decryptionFunctionName;
    for (let i = 0; i < REGEXES.length; i++) {
        let result = new RegExp(REGEXES[i]).exec(code);

        if (result != undefined) {
            if (result[1] != undefined) {
                decryptionFunctionName = result[1];
                break;
            }
        }
    }

    let functionPattern = "(" + decryptionFunctionName.split("$").join("\\$") + "=function\\([a-zA-Z0-9_]+\\)\\{.+?\\})";
    let decryptionFunction = "var " + new RegExp(functionPattern).exec(code)[1] + ";";
    let helperObjectName = new RegExp(";([A-Za-z0-9_\\$]{2})\\...\\(").exec(decryptionFunction)[1];

    let helperPattern = "(var " + helperObjectName.split("$").join("\\$") + "=\\{.+?\\}\\};)";
    let helperObject = new RegExp(helperPattern).exec(code.split("\n").join(""))[1];
    let callerFunction = "function " + function_name + "(a){return " + decryptionFunctionName + "(a);}";

    return helperObject + decryptionFunction + callerFunction;
    return (helperObject + decryptionFunction + callerFunction).replace(";,", ";");
}

function setFunction(fnString) {
    const gEval = function(){ (1, eval)(fnString); };
    gEval();
}

function isDecryptionWorking() {
    return functionString != null
}

async function enableDecryption({videoId}) {
    if (isDecryptionWorking())
        return;

    if (videoId)
        baseUrl = await fetchBaseJsLocation(videoId);

    let playerCode = await fetchBaseJs(baseUrl);

    functionString = getFunction(playerCode);
    console.log(functionString);
    signatureTimestamp = extractTimestamp(playerCode);
    console.log(signatureTimestamp);
    setFunction(functionString);
}

async function getSignature(signature) {
    return decryptSignature(signature);
}


export async function digestStreams(parse) {
    let current = {
        audioQuality: null,
        url: null,
        mimeType: null
    };

    let formats = parse.streamingData.adaptiveFormats
        ? parse.streamingData.adaptiveFormats
        : parse.streamingData.formats

    for (let i = 0; i < formats.length; i++) {
        let mimeType = formats[i].mimeType;
        if (["audio", "video"].includes(mimeType.split("/")[0])) {
            let audioQuality;
            switch (formats[i].audioQuality) {
                case "AUDIO_QUALITY_MEDIUM":
                    audioQuality = 2;
                    break;
                case "AUDIO_QUALITY_HIGH":
                    audioQuality = 3;
                    break;
                default:
                    audioQuality = 1;
            }
            
            if (audioQuality > current.audioQuality) {
                if (parse.streamingData.adaptiveFormats[i].signatureCipher) {
                    let signatureCipher = parse.streamingData.adaptiveFormats[i].signatureCipher;
                    let cipher = JSON.parse(
                        '{"' + signatureCipher.replace(/&/g, '","').replace(/=/g,'":"') + '"}',
                        function(key, value) { return key===""?value:decodeURIComponent(value) }
                    );

                    current.url = cipher["url"] + "&" + cipher["sp"] + "=" + await getSignature(cipher["s"]);
                    console.log(current.url);
                } else
                    current.url = parse.streamingData.adaptiveFormats[i].url;

                current.audioQuality = audioQuality;
                current.mimeType = formats[i].mimeType;
            } 

            if (audioQuality == 3)
                break;
        }
    }

    return current;
}