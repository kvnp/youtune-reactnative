import { getHL, getGL } from "./Native";
import { digestHomeResults, digestSearchResults, digestBrowseResults } from "./Extractor";
import { getHttpResponse, getUrl } from "./HTTP";

async function getApiKey() {
    if (global.apikey == null) {
        const headers = {"User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0"}
        let text = await getHttpResponse("https://music.youtube.com/", {method: "GET", headers: headers}, "text");

        text = text.slice(text.indexOf("INNERTUBE_API_KEY\":\"")+20);
        global.apikey = text.slice(0, text.indexOf("\""));
        console.log(global.apikey);
    }
    return global.apikey;
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

    const headers = {
        "Referer":      "https://music.youtube.com/",
        "Content-Type": "application/json"
    };

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers,
                                               body: JSON.stringify(body)}, "json");
    
    return digestSearchResults(response);
}

export async function fetchSpecificResults(kind) {
    const apikey = await getApiKey();
    const url = getUrl("browse", apikey);

    let body = getRequestBody();
    body["input"] = input;

    const headers = {
        Referer:        "https://music.youtube.com/",
        "Content-Type": "application/json"
    };

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers,
                                               body: JSON.stringify(body)}, "json");

    return digestSearchResults(response);
}

export async function fetchHome() {
    const apikey = await getApiKey();
    const url = getUrl("browse", apikey);

    let body = getRequestBody();
    body["browseId"] = "FEmusic_home";

    const headers = {
        Referer:        "https://music.youtube.com/",
        "Content-Type": "application/json"
    };

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers,
                                               body: JSON.stringify(body)}, "json");

    return digestHomeResults(response);
}

export async function fetchSuggestions(input) {
    const apikey = await getApiKey();
    const url = getUrl("get_search_suggestions", apikey);

    let body = getRequestBody();
    body["input"] = input;

    const headers = {
        Referer:        "https://music.youtube.com/",
        "Content-Type": "application/json"
    };

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers,
                                               body: JSON.stringify(body)}, "json");

    return null;
}

export async function fetchBrowse(browseId) {
    const apikey = await getApiKey();
    const url = getUrl("browse", apikey);

    let body = getRequestBody();
    //body["browseId"] = "VL" + playlistId;
    body["browseId"] = browseId;

    const headers = {
        Referer:        "https://music.youtube.com/",
        "Content-Type": "application/json"
    };

    let response = await getHttpResponse(url, {method: "POST",
                                               headers: headers,
                                               body: JSON.stringify(body)}, "json");

    return digestBrowseResults(response, browseId);
}

export async function fetchVideo(id) {
    const url = "https://www.youtube.com/watch?v=" + id;

    let response = await getHttpResponse(url, {method: "GET"}, "text");

    let begin = response.indexOf("ytplayer.config = ") + 18;
    let end = response.indexOf(";ytplayer.web_player");
    //let end = response.indexOf(";ytplayer.load");
    
    let slice = response.substring(begin, end);
    let ytJson = JSON.parse(slice);
    let ytPlayer = JSON.parse(ytJson.args.player_response)
    let videoList = ytPlayer.streamingData.adaptiveFormats;
    return videoList;
}