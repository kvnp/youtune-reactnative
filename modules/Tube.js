export async function fetchResults(query) {
    const apikey = await getApiKey();
    const url = "https://music.youtube.com/youtubei/v1/search?alt=json&key=" + apikey;
    const body = {
        "context": {
            "client": {
                "clientName": "WEB_REMIX",
                "clientVersion": "0.1"
            }
        },
        "query": query
    };

    const headers = {
        'Referer': "https://music.youtube.com/",
        'Content-Type': 'application/json'
    };

    let response = await getFetchResponse(url, {method: 'POST',
                                                headers: headers,
                                                body: JSON.stringify(body)}, "json");
    return digestSearchResults(response);
}

export async function fetchHome() {
    const apikey = await getApiKey();
    const url = "https://music.youtube.com/youtubei/v1/browse?alt=json&key=" + apikey;
    const body = {
        "context": {
            "client": {
                "clientName": "WEB_REMIX",
                "clientVersion": "0.1"
            }
        },
        "browseId": "FEmusic_home"
    }

    const headers = {
        'Referer': "https://music.youtube.com/",
        'Content-Type': 'application/json'
    };

    let response = await getFetchResponse(url, {method: 'POST',
                                                headers: headers,
                                                body: JSON.stringify(body)}, "json");
    return digestSearchResults(response);
}

async function getApiKey() {
    if (global.apikey == null) {
        const headers = {'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64; rv:77.0) Gecko/20100101 Firefox/77.0'}
        let text = await getFetchResponse("https://music.youtube.com/", {method: 'GET', headers: headers}, "text");

        text = text.slice(text.indexOf("INNERTUBE_API_KEY\":\"")+20);
        global.apikey = text.slice(0, text.indexOf("\""));
    }
    return global.apikey;
}

async function getFetchResponse(url, input, type) {
    const response = await fetch(url, input);
    switch(type) {
        case "json":
            return response.json();
        case "text":
            return response.text();
    }
}

function digestSearchResults(json) {
    let final = {results: 0, suggestion: [], topics: []};

    if (json.contents.sectionListRenderer.contents[0].hasOwnProperty("itemSectionRenderer")) {
        if (json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].hasOwnProperty("messageRenderer")) {
            if (json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].messageRenderer.text.runs[0].text === "No results found") {
                return final;
            }
        } else if (json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].hasOwnProperty("didYouMeanRenderer")) {
            for (let i = 0; i < json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].didYouMeanRenderer.correctedQuery.runs.length; i++) {
                let text = json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].didYouMeanRenderer.correctedQuery.runs[i].text;

                if (json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].didYouMeanRenderer.correctedQuery.runs[i].hasOwnProperty("italics")) {
                    let italics = json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].didYouMeanRenderer.correctedQuery.runs[i].italics;
                    final.suggestion.push({text: text, italics: italics});
                } else {
                    final.suggestion.push({text: text, italics: false});
                }
            }
        }
    }

    let musicshelves = [];

    for (let i = 0; i < json.contents.sectionListRenderer.contents.length; i++) {
        if (json.contents.sectionListRenderer.contents[i].hasOwnProperty("musicShelfRenderer")) {
            musicshelves.push(json.contents.sectionListRenderer.contents[i].musicShelfRenderer);
        }
    }
    final.results = musicshelves.length;

    for (let i = 0; i < musicshelves.length; i++) {
        final.topics.push({});
        final.topics[i].topic = musicshelves[i].title.runs[0].text;
        final.topics[i].elements = [];
        for (let j = 0; j < musicshelves[i].contents.length; j++) {
            if (musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text === "Song") {
                final.topics[i].elements.push({});
                final.topics[i].elements[j].type = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].title = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].interpret = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].album = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[3].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].length = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[4].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].videoId = musicshelves[i].contents[j].musicResponsiveListItemRenderer.doubleTapCommand.watchEndpoint.videoId;
                final.topics[i].elements[j].thumb = musicshelves[i].contents[j].musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url;
            } else if (musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text === "Video") {
                final.topics[i].elements.push({});
                final.topics[i].elements[j].type = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].title = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].interpret = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].views = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[3].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].length = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[4].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text
                final.topics[i].elements[j].videoId = musicshelves[i].contents[j].musicResponsiveListItemRenderer.doubleTapCommand.watchEndpoint.videoId;
                final.topics[i].elements[j].thumb = musicshelves[i].contents[j].musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url;
            }
        }
    }

    return final;
}

function digestHomeResults(json) {
    
}