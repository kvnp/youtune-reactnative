export default function digestResultResponse(json) {
    let final = {
        results: 0,
        shelves: [],
        insteadOption: null,
        suggestionOption: null,
        reason: null
    };

    let sectionList = json.contents.tabbedSearchResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents;
    if (sectionList[0].hasOwnProperty("itemSectionRenderer")) {

        let itemSection = sectionList[0].itemSectionRenderer.contents[0];
        
        if (itemSection.hasOwnProperty("messageRenderer")) {
            let message = itemSection.messageRenderer.text.runs[0].text;
            final.reason = message;
            return final;

        } else if (itemSection.hasOwnProperty("didYouMeanRenderer")) {
            final.suggestionOption = {correctedList: [], endpoints: {text: "", query: ""}};
            let renderer = itemSection.didYouMeanRenderer;

            final.suggestionOption.endpoints.query = renderer.correctedQueryEndpoint.searchEndpoint.query;
            for (let dym = 0; dym < renderer.didYouMean.runs.length; dym++)
                final.suggestionOption.endpoints.text += renderer.didYouMean.runs[dym].text;
            
            for (let crq = 0; crq < renderer.correctedQuery.runs.length; crq++)
                final.suggestionOption.correctedList.push(renderer.correctedQuery.runs[crq]);
            

        } else if (itemSection.hasOwnProperty("showingResultsForRenderer")) {
            final.insteadOption = {correctedList: [], originalList: [], endpoints: {corrected: {text: "", query: ""}, original: {text: "", query: ""}}};

            let renderer = itemSection.showingResultsForRenderer;

            for (let srf = 0; srf < renderer.showingResultsFor.runs.length; srf++)
                final.insteadOption.endpoints.corrected.text += renderer.showingResultsFor.runs[srf].text;

            for (let sif = 0; sif < renderer.searchInsteadFor.runs.length; sif++)
                final.insteadOption.endpoints.original.text += renderer.searchInsteadFor.runs[sif].text;

            for (let cq = 0; cq < renderer.correctedQuery.runs.length; cq++) {
                final.insteadOption.correctedList.push(renderer.correctedQuery.runs[cq]);
                final.insteadOption.endpoints.corrected.query += renderer.correctedQuery.runs[cq].text;
            }

            for (let oq = 0; oq < renderer.originalQuery.runs.length; oq++) {
                final.insteadOption.originalList.push(renderer.originalQuery.runs[oq]);
                final.insteadOption.endpoints.original.query += renderer.originalQuery.runs[oq].text;
            }
        }
    }

    for (let sl = 0; sl < sectionList.length; sl++) {
        let itemSection = sectionList[sl];

        if (itemSection.hasOwnProperty("musicShelfRenderer")) {
            let musicShelf = itemSection.musicShelfRenderer;

            let titlelist = musicShelf.title.runs;
            let title = "";

            for (let ttl = 0; ttl < titlelist.length; ttl++)
                title += titlelist[ttl].text;

            let bottomEndpoint = null;
            if (musicShelf.hasOwnProperty("bottomEndpoint")) {
                let bottomText = "";
                let textArray = musicShelf.bottomText.runs;
                for (let botText = 0; botText < textArray.length; botText++) {
                    bottomText += textArray[botText].text;
                }

                bottomEndpoint = {
                    query: musicShelf.bottomEndpoint.searchEndpoint.query,
                    params: musicShelf.bottomEndpoint.searchEndpoint.params,
                    text: bottomText
                };
            }

            let shelf = {
                title: title,
                bottomEndpoint: bottomEndpoint,
                data: []
            };

            let responsiveMusicList = musicShelf.contents;
            for (let rml = 0; rml < responsiveMusicList.length; rml++) {
                let responsiveMusicItem = responsiveMusicList[rml].musicResponsiveListItemRenderer;
                let entry = {
                    title: "",
                    subtitle: "",
                    secondTitle: "",
                    secondSubtitle: "",
                    additionalInfo: "",
                    videoId: null,
                    playlistId: null,
                    browseId: null,
                    thumbnail: null
                };
                
                let flexColumnList = responsiveMusicItem.flexColumns;

                for (let fcl = 0; fcl < flexColumnList.length; fcl++) {
                    let flexColumn = flexColumnList[fcl].musicResponsiveListItemFlexColumnRenderer;

                    if (flexColumn.text != undefined) {
                        let textList = flexColumn.text.runs;

                        let text = "";
                        for (let txt = 0; txt < textList.length; txt++)
                            text += textList[txt].text;

                        if (fcl == 0)
                            entry.title = text;
                        else if (fcl == 1)
                            entry.subtitle = text;
                        else
                            break;
                    }
                }
                
                let thumbnaillist = responsiveMusicItem.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;
                entry.thumbnail = thumbnaillist[thumbnaillist.length - 1].url;
                
                if (responsiveMusicItem.hasOwnProperty("navigationEndpoint")) {
                    if (responsiveMusicItem.navigationEndpoint.hasOwnProperty("watchEndpoint")) {
                        entry.type = "Title";
                        entry.playlistId = responsiveMusicItem.navigationEndpoint.watchEndpoint.playlistId;
                        entry.videoId = responsiveMusicItem.navigationEndpoint.watchEndpoint.videoId;

                    } else {
                        let type = responsiveMusicItem.navigationEndpoint.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType;
                        if (type == "MUSIC_PAGE_TYPE_ARTIST")
                            entry.type = "Artist";
                        else {
                            if (type == "MUSIC_PAGE_TYPE_ALBUM")
                                entry.type = "Album";
                            else if (type == "MUSIC_PAGE_TYPE_PLAYLIST")
                                entry.type = "Playlist";

                            let playNavigationEndpoint = responsiveMusicItem.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint;

                            if (playNavigationEndpoint.hasOwnProperty("watchPlaylistEndpoint"))
                                entry.playlistId = playNavigationEndpoint.watchPlaylistEndpoint.playlistId;
                            else
                                entry.playlistId = playNavigationEndpoint.watchEndpoint.playlistId;
                            
                        }

                        entry.browseId = responsiveMusicItem.navigationEndpoint.browseEndpoint.browseId;
                    }
                } else {
                    entry.type = "Title";
                    
                    entry.videoId = responsiveMusicItem.playlistItemData.videoId;
                    entry.playlistId = responsiveMusicItem.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs[0].navigationEndpoint.watchEndpoint.playlistId;
                }

                final.results += 1;
                shelf.data.push(entry);
            }

            final.shelves.push(shelf);
        }
    }

    return final;
}