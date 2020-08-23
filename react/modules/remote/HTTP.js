import { Platform } from "react-native";

const url = "https://music.youtube.com/"
const partialEndpoint = "youtubei/v1/"
const parameter = "?alt=json&key="

export function getUrl(endpoint, apiKey) {
    return url + partialEndpoint + endpoint + parameter + apiKey;
}

export const getHttpResponse = async (url, input, type) => {
    if (Platform.OS == "web") {
        if (url.length == 26)
            url = window.location + "start";
        else if (url.length > 26)
            url = window.location + url.slice(26);
    }

    const response = await fetch(url, input);

    if (type == "json")
        return response.json();
    else
        return response.text();
}