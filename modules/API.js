import { getHL, getGL } from "./Native";
import {
    digestHomeResults,
    digestSearchResults,
    digestBrowseResults,
    digestNextResults,
    digestVideoInfoResults
} from "./Extractor";

import { getHttpResponse, getUrl } from "./HTTP";

const headers_api = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0"};
const headers_ytm = {
    "Referer":      "https://music.youtube.com/",
    "Content-Type": "application/json"
};

const headers_yt = {
    "Referer": "",
    "Content-Type": "*/*"
}

async function getApiKey() {
    if (global.apiKey == null) {
        let text = await getHttpResponse("https://music.youtube.com/", {method: "GET", headers: headers_api}, "text");

        text = text.slice(text.indexOf("INNERTUBE_API_KEY\":\"")+20);
        global.apiKey = text.slice(0, text.indexOf("\""));
    }

    return global.apiKey;
}

function getRequestBody() {
    let enableSafetyMode = false;
    let enableLanguagePreference = false;

    let body = {
        context: {
            client: {
                clientName: "WEB_REMIX",
                clientVersion: "0.1",
            }
        }
    };

    if (enableLanguagePreference) {
        body.context.client["gl"] = getGL();
        body.context.client["hl"] = getHL();
    }

    if (!enableSafetyMode)
        body.context["user"] = {enableSafetyMode: false}

    return body;
}

export async function fetchResults(query) {
    const apikey = await getApiKey();
    const url = getUrl("search", apikey);

    let body = getRequestBody();
    body["query"] = query;

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers_ytm,
                                               body: JSON.stringify(body)}, "json");
    
    return digestSearchResults(response);
}

export async function fetchSpecificResults(kind) {
    const apikey = await getApiKey();
    const url = getUrl("browse", apikey);

    let body = getRequestBody();
    body["input"] = input;

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers_ytm,
                                               body: JSON.stringify(body)}, "json");

    return digestSearchResults(response);
}

export async function fetchHome() {
    const apikey = await getApiKey();
    const url = getUrl("browse", apikey);

    let body = getRequestBody();
    body["browseId"] = "FEmusic_home";

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers_ytm,
                                               body: JSON.stringify(body)}, "json");

    return digestHomeResults(response);
}

export async function fetchSuggestions(input) {
    const apikey = await getApiKey();
    const url = getUrl("get_search_suggestions", apikey);

    let body = getRequestBody();
    body["input"] = input;

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers_ytm,
                                               body: JSON.stringify(body)}, "json");

    return null;
}

export async function fetchBrowse(browseId) {
    const apikey = await getApiKey();
    const url = getUrl("browse", apikey);

    let body = getRequestBody();
    body["browseId"] = browseId;

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers_ytm,
                                               body: JSON.stringify(body)}, "json");

    return digestBrowseResults(response, browseId);
}

export async function fetchVideo(id) {
    const url = "https://www.youtube.com/watch?v=" + id;

    let response = await getHttpResponse(url, {method: "GET"}, "text");
    console.log(response);

    let begin = response.indexOf("ytplayer.config = ") + 18;
    let end = response.indexOf(";ytplayer.web_player");
    //let end = response.indexOf(";ytplayer.load");
    
    //let slice = response.substring(begin, end);
    //let ytJson = JSON.parse(slice);
    //let ytPlayer = JSON.parse(ytJson.args.player_response);
    //let videoList = ytPlayer.streamingData.adaptiveFormats;
    //return videoList;
}

export async function fetchVideoInfo(videoId) {
    let url = "https://youtube.com/get_video_info?video_id=" + videoId +
              "&el=detailpage&c=WEB_REMIX&cver=0.1&cplayer=UNIPLAYER";

    let response = await getHttpResponse(url, {method: "GET",
                                               headers: headers_yt}, "text");

    return digestVideoInfoResults(response);
}

export async function fetchNext(videoId, playlistId) {
    const apikey = await getApiKey();
    const url = getUrl("next", apikey);

    let body = getRequestBody();
    body["enablePersistentPlaylistPanel"] = true;
    body["videoId"] = videoId;
    body["playlistId"] = playlistId;

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers_ytm,
                                               body: JSON.stringify(body)}, "json");

    return digestNextResults(response);
}