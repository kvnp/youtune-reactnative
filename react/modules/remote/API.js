import { getHL, getGL } from "../utils/Native";
import {extractConfiguration,} from "./Extractor";

import { getHttpResponse, getUrl } from "./HTTP";
import Settings from "../../services/device/Settings";
import Extractor from "../../services/api/Extractor";

export const headers_simple = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:79.0) Gecko/20100101 Firefox/79.0"};
const headers_ytm = {
    "Referer":      "https://music.youtube.com/",
    "Content-Type": "application/json"
};

export var configuration = null;

var apiKey = null;

async function getConfig(path) {
    if (!path)
        path = ""

    let response = await getHttpResponse(
        "https://music.youtube.com" + path, {
            method: "GET",
            headers: headers_simple
        },
        "text"
    );

    configuration = extractConfiguration(response);
    
    apiKey = configuration
        .WEB_PLAYER_CONTEXT_CONFIGS
        .WEB_PLAYER_CONTEXT_CONFIG_ID_MUSIC_WATCH
        .innertubeApiKey;
}

function getRequestBody() {
    let body = {
        context: {
            client: {
                clientName: "WEB_REMIX",
                clientVersion: "1.20210630.00.00"
            }
        }
    };

    if (Settings.Values.transmitLanguage) {
        body.context.client["gl"] = getGL();
        body.context.client["hl"] = getHL();
    }

    return body;
}

function getRequestBodyStream() {
    let body = {
        context: {
            client: {
                clientName: "ANDROID",
                clientVersion: "16.02"
            }
        }
    };

    if (Settings.Values.transmitLanguage) {
        body.context.client["gl"] = getGL();
        body.context.client["hl"] = getHL();
    }

    return body;
}

export async function fetchResults(query, params) {
    if (!apiKey)
        await getConfig();

    const url = getUrl("search", apiKey);

    let body = getRequestBody();
    body.context["user"] = {
        enableSafetyMode: Settings.Values.safetyMode
    };

    body["query"] = query;
    
    if (params)
        body["params"] = params;

    let response = await getHttpResponse(url, {
        method: "POST",
        headers: headers_ytm,
        body: JSON.stringify(body)
    }, "json");
    
    return Extractor.digestSearchResponse(response);
}

export async function fetchSpecificResults(kind) {
    if (!apiKey)
        await getConfig();

    const url = getUrl("browse", apiKey);

    let body = getRequestBody();
    body.context["user"] = { enableSafetyMode: Settings.Values.safetyMode }
    body["input"] = input;

    let response = await getHttpResponse(url, {
        method: "POST",
        headers: headers_ytm,
        body: JSON.stringify(body)
    }, "json");

    return Extractor.digestSearchResponse(response);
}

export async function fetchHome(continuation) {
    if (!apiKey)
        await getConfig();

    for (let element of configuration.YTMUSIC_INITIAL_DATA)
        if (element.path == "/browse" && element.params.browseId == "FEmusic_home")
            return Extractor.digestHomeResponse(element.data);

    let url = getUrl("browse", apiKey);

    let body = getRequestBody();
    body.context["user"] = { enableSafetyMode: Settings.Values.safetyMode }

    if (continuation)
        url = url + "&ctoken=" + continuation.continuation + 
                    "&continuation=" + continuation.continuation +
                    "&itct=" + continuation.itct +
                    "&type=next"
    else
        body["browseId"] = "FEmusic_home";

    let response = await getHttpResponse(url, {
        method: "POST",
        headers: headers_ytm,
        body: JSON.stringify(body)
    }, "json");

    return Extractor.digestHomeResponse(response);
}

export async function fetchSuggestions(input) {
    if (!apiKey)
        await getConfig();

    const url = getUrl("get_search_suggestions", apiKey);

    let body = getRequestBody();
    body.context["user"] = { enableSafetyMode: Settings.Values.safetyMode }
    body["input"] = input;

    let response = await getHttpResponse(url, {
        method: "POST",
        headers: headers_ytm,
        body: JSON.stringify(body)
    }, "json");

    return null;
}

export async function fetchBrowse(browseId) {
    let slice = browseId.slice(0, 2)
    if (!apiKey && (slice == "OL" || slice == "VL" || slice == "RD")) {
        if (slice == "VL")
            browseId = browseId.slice(2);

        await getConfig("/playlist?list=" + browseId);

        for (let i = 0; i < configuration.YTMUSIC_INITIAL_DATA.length; i++) {
            if (configuration.YTMUSIC_INITIAL_DATA[i].path == "/browse") {
                if (configuration.YTMUSIC_INITIAL_DATA[i].params.browseId == "FEmusic_home")
                    await getConfig("/playlist?list=" + browseId);
                
                return Extractor.digestBrowseResponse(
                    configuration.YTMUSIC_INITIAL_DATA[i].data,
                    configuration.YTMUSIC_INITIAL_DATA[i].params.browseId
                );
            }
        }
    } else if (!apiKey) {
        await getConfig();
    }

    const url = getUrl("browse", apiKey);

    let body = getRequestBody();
    body.context["user"] = { enableSafetyMode: Settings.Values.safetyMode }

    if (slice == "RD")
        browseId = "VL" + browseId;

    body["browseId"] = browseId;

    let response = await getHttpResponse(url, {
        method: "POST",
        headers: headers_ytm,
        body: JSON.stringify(body)
    }, "json");

    return Extractor.digestBrowseResponse(response, browseId);
}

export async function fetchAudioInfo({videoId, playlistId, controllerCallback}) {
    let url = "https://music.youtube.com/youtubei/v1/player?key=" + apiKey;

    let body = getRequestBody();
    body.context["user"] = { lockedSafetyMode: Settings.Values.safetyMode }
    body["videoId"] = videoId;

    if (playlistId)
        body["playlistId"] = playlistId;

    let response = await getHttpResponse(url, {
        method: "POST",
        headers: headers_ytm,
        body: JSON.stringify(body)
    }, "json", controllerCallback);

    let audioInfo = Extractor.digestAudioInfo(response);

    return audioInfo;
}

export async function fetchAudioStream({videoId, controllerCallback}) {
    let url = "https://youtubei.googleapis.com/youtubei/v1/player?key=" + apiKey;

    let body = getRequestBodyStream();
    body.context["user"] = { lockedSafetyMode: Settings.Values.safetyMode }
    body["videoId"] = videoId;

    let response = await getHttpResponse(url, {
        method: "POST",
        headers: headers_ytm,
        body: JSON.stringify(body)
    }, "json", controllerCallback);

    let stream = Extractor.digestStreams(response);
    return stream;
}

export async function fetchNext(videoId, playlistId) {
    if (!apiKey)
        await getConfig();
    const url = getUrl("next", apiKey);

    let body = getRequestBody();
    body["enablePersistentPlaylistPanel"] = true;
    body["videoId"] = videoId;
    body["playlistId"] = playlistId;
    body["isAudioOnly"] = true;

    let response = await getHttpResponse(url, {
        method: "POST",
        headers: headers_ytm,
        body: JSON.stringify(body)
    }, "json");

    return Extractor.digestNextResponse(response);
}

export async function downloadMedia({url, controllerCallback}) {
    let blob = await getHttpResponse(url, {
        method: "GET",
        headers: headers_ytm
    }, "blob", controllerCallback);

    let reader = input => {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(input);

        return new Promise(resolve => {
            fileReader.onloadend = () => {
                resolve(fileReader.result);
            };
        });
    }

    let base64 = await reader(blob);
    return base64;
}