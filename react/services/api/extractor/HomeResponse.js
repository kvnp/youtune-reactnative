export default function digestHomeResponse(json) {
    let tabRenderer = json.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer;
    
    let sectionList = null;
    if (tabRenderer.hasOwnProperty("content"))
        sectionList = tabRenderer.content.sectionListRenderer;
    else
        sectionList = json.continuationContents.sectionListContinuation;

    let final = {shelves: [], continuation: null, picture: null};
    if (sectionList.hasOwnProperty("continuations")) {
        let continuations = sectionList.continuations[0].nextContinuationData;
        final.continuation = {
            continuation: continuations.continuation,
            itct: continuations.clickTrackingParams
        }
    }

    let contentList = sectionList.contents;
    for (let y = 0; y < contentList.length; y++) {
        let shelf = {title: "", albums: []};
        let shelfRenderer;

        if (contentList[y].hasOwnProperty("musicImmersiveCarouselShelfRenderer")) {
            shelfRenderer = contentList[y].musicImmersiveCarouselShelfRenderer;

            let index = shelfRenderer.backgroundImage.simpleVideoThumbnailRenderer.thumbnail.thumbnails.length - 1;
            let picture = shelfRenderer.backgroundImage.simpleVideoThumbnailRenderer.thumbnail.thumbnails[index].url;
            final.picture = picture;

        } else if (contentList[y].hasOwnProperty("musicCarouselShelfRenderer"))
            shelfRenderer = contentList[y].musicCarouselShelfRenderer;

        else continue;

        for (let l = 0; l < shelfRenderer.header.musicCarouselShelfBasicHeaderRenderer.title.runs.length; l++)
            shelf.title += shelfRenderer.header.musicCarouselShelfBasicHeaderRenderer.title.runs[l].text;

        for (let m = 0; m < shelfRenderer.contents.length; m++) {
            let album = {title: "", subtitle: ""};
            
            let itemRenderer;
            if (shelfRenderer.contents[m].hasOwnProperty("musicTwoRowItemRenderer")) {
                itemRenderer = shelfRenderer.contents[m].musicTwoRowItemRenderer;

                for (let k = 0; k < itemRenderer.title.runs.length; k++)
                    album.title += itemRenderer.title.runs[k].text;

                for (let k = 0; k < itemRenderer.subtitle.runs.length; k++)
                    album.subtitle += itemRenderer.subtitle.runs[k].text;

                album.thumbnail = itemRenderer.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails.slice(-1)[0].url;
            } else {
                itemRenderer = shelfRenderer.contents[m].musicResponsiveListItemRenderer;

                for (let k = 0; k < itemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs.length; k++)
                    album.title += itemRenderer.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[k].text;

                for (let k = 0; k < itemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs.length; k++)
                    album.subtitle += itemRenderer.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs[k].text;

                album.thumbnail = itemRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails.slice(-1)[0].url;
            }

            let videoId;
            let browseId;
            let playlistId;

            let navigationEndpoint;
            if (itemRenderer.hasOwnProperty("navigationEndpoint"))
                navigationEndpoint = itemRenderer.navigationEndpoint;
            else
                navigationEndpoint = itemRenderer.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint;

            if (navigationEndpoint.hasOwnProperty("watchEndpoint")) {
                if (navigationEndpoint.watchEndpoint.hasOwnProperty("watchPlaylistEndpoint"))
                    playlistId = playNavigationEndpoint.watchPlaylistEndpoint.playlistId;

                if (navigationEndpoint.watchEndpoint.hasOwnProperty("videoId"))
                    videoId = navigationEndpoint.watchEndpoint.videoId;
            }

            if (navigationEndpoint.hasOwnProperty("browseEndpoint")) {
                if (navigationEndpoint.browseEndpoint.hasOwnProperty("browseId"))
                    browseId = navigationEndpoint.browseEndpoint.browseId;
            }

            if (browseId != undefined)
                album.browseId = browseId;

            if (playlistId != undefined)
                album.playlistId = playlistId;

            if (videoId != undefined)
                album.videoId = videoId;

            shelf.albums.push(album);
        }
        
        final.shelves.push(shelf);
    }

    return final;
}