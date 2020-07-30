const url = "https://music.youtube.com/"
const partialEndpoint = "youtubei/v1/"
const parameter = "?alt=json&key="

export function getUrl(endpoint, apiKey) {
    return url + partialEndpoint + endpoint + parameter + apiKey;
}

export async function getHttpResponse(url, input, type) {
    const response = await fetch(url, input);
    switch(type) {
        case "json":
            return response.json();
        case "text":
            return response.text();
    }
}
