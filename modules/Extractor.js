export function digestSearchResults(json) {
    let final = {results: 0, suggestion: [], topics: []};

    if (json.contents.sectionListRenderer.contents[0].hasOwnProperty("itemSectionRenderer")) {
        if (json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].hasOwnProperty("messageRenderer")) {
            if (json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].messageRenderer.text.runs[0].text === "No results found") {
                return final;
            }
        } else if (json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].hasOwnProperty("didYouMeanRenderer")) {
            for (let q = 0; q < json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].didYouMeanRenderer.correctedQuery.runs.length; q++) {
                let text = json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].didYouMeanRenderer.correctedQuery.runs[q].text;

                if (json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].didYouMeanRenderer.correctedQuery.runs[q].hasOwnProperty("italics")) {
                    let italics = json.contents.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].didYouMeanRenderer.correctedQuery.runs[q].italics;
                    final.suggestion.push({text: text, italics: italics});
                } else {
                    final.suggestion.push({text: text, italics: false});
                }
            }
        }
    }

    let musicshelves = [];

    for (let x = 0; x < json.contents.sectionListRenderer.contents.length; x++) {
        if (json.contents.sectionListRenderer.contents[x].hasOwnProperty("musicShelfRenderer")) {
            musicshelves.push(json.contents.sectionListRenderer.contents[x].musicShelfRenderer);
        }
    }
    final.results = musicshelves.length;

    for (let i = 0; i < musicshelves.length; i++) {
        final.topics.push({});
        final.topics[i].topic = musicshelves[i].title.runs[0].text;
        console.log("! " + final.topics[i].topic);
        final.topics[i].elements = [];
        for (let j = 0; j < musicshelves[i].contents.length; j++) {
            let topic = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
            let title = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
            
            let thumbArrayLength = musicshelves[i].contents[j].musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.length
            let thumb = musicshelves[i].contents[j].musicResponsiveListItemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[thumbArrayLength - 1].url;
            console.log("IN: " + j + ": " + topic);
            final.topics[i].elements.push({});
            final.topics[i].elements[j].type = topic;
            final.topics[i].elements[j].title = title;
            final.topics[i].elements[j].thumb = thumb;
            
            if (topic === "Playlist") {
                final.topics[i].elements[j].subtitle = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].songsText = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[3].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].playlistId = musicshelves[i].contents[j].musicResponsiveListItemRenderer.doubleTapCommand.watchPlaylistEndpoint.playlistId;
            
            } else if (topic === "Single") {
                final.topics[i].elements[j].interpret = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].year = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[3].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].playlistId = musicshelves[i].contents[j].musicResponsiveListItemRenderer.doubleTapCommand.watchPlaylistEndpoint.playlistId;
                
            } else if (topic === "Video") {
                final.topics[i].elements[j].interpret = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].views = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[3].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].length = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[4].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text
                final.topics[i].elements[j].videoId = musicshelves[i].contents[j].musicResponsiveListItemRenderer.doubleTapCommand.watchEndpoint.videoId;
                final.topics[i].elements[j].playlistId = musicshelves[i].contents[j].musicResponsiveListItemRenderer.doubleTapCommand.watchEndpoint.playlistId;

            } else if (topic === "Song") {
                final.topics[i].elements[j].interpret = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].album = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[3].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].length = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[4].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
                final.topics[i].elements[j].videoId = musicshelves[i].contents[j].musicResponsiveListItemRenderer.doubleTapCommand.watchEndpoint.videoId;
                final.topics[i].elements[j].playlistId = musicshelves[i].contents[j].musicResponsiveListItemRenderer.doubleTapCommand.watchEndpoint.playlistId;
            
            } else if (topic === "Artist")
                final.topics[i].elements[j].subsText = musicshelves[i].contents[j].musicResponsiveListItemRenderer.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs[0].text;
        }
    }
    return final;
}

export function digestHomeResults(json) {
    let contentList = json.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents;

    let final = {background: null, shelves: []};
    for (let y = 0; y < contentList.length; y++) {
        let shelf = {title: "", albums: []};
        let shelfRenderer;

        if (contentList[y].hasOwnProperty("musicImmersiveCarouselShelfRenderer")) {
            shelfRenderer = contentList[y].musicImmersiveCarouselShelfRenderer;

            let index = shelfRenderer.backgroundImage.simpleVideoThumbnailRenderer.thumbnail.thumbnails.length - 1;
            final.background = shelfRenderer.backgroundImage.simpleVideoThumbnailRenderer.thumbnail.thumbnails[index].url;

        } else if (contentList[y].hasOwnProperty("musicCarouselShelfRenderer")) {
            shelfRenderer = contentList[y].musicCarouselShelfRenderer;

        } else continue;

        for (let l = 0; l < shelfRenderer.header.musicCarouselShelfBasicHeaderRenderer.title.runs.length; l++) {
            shelf.title += shelfRenderer.header.musicCarouselShelfBasicHeaderRenderer.title.runs[l].text;
        }

        for (let m = 0; m < shelfRenderer.contents.length; m++) {
            let album = {thumbnail: "", title: "", subtitle: "", playlistId: ""};
            
            for (let k = 0; k < shelfRenderer.contents[m].musicTwoRowItemRenderer.title.runs.length; k++) {
                album.title += shelfRenderer.contents[m].musicTwoRowItemRenderer.title.runs[k].text;
            }

            for (let k = 0; k < shelfRenderer.contents[m].musicTwoRowItemRenderer.subtitle.runs.length; k++) {
                album.subtitle += shelfRenderer.contents[m].musicTwoRowItemRenderer.subtitle.runs[k].text;
            }

            //album.browseId = shelfRenderer.contents[m].musicTwoRowItemRenderer.navigationEndpoint.browseEndpoint.browseId;
            album.playlistId = shelfRenderer.contents[m].musicTwoRowItemRenderer.thumbnailOverlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchPlaylistEndpoint.playlistId;

            album.thumbnail = shelfRenderer.contents[m].musicTwoRowItemRenderer.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails[0].url;

            shelf.albums.push(album);
        }
        
        final.shelves.push(shelf);
    }
    
    return final;
}

export function digestBrowseResults(json) {
    console.log("ja");
}