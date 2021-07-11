import { msToMin, msToMMSS, textToSec } from "../utils/Time";
import Track from "../models/music/track";
import Playlist from "../models/music/playlist";
import { decodeNestedURI } from "../utils/Decoder";
import { getSignature } from "./Decrypt";
import { hackTracks } from "../../components/collections/FlatEntries";

export function extractConfiguration(html) {
    let ytData = {};

    let ytcfg = {set: object => {
        for (key of Object.keys(object)) {
            ytData[key] = object[key];
            
            if (key == "YTMUSIC_INITIAL_DATA") {
                ytData[key].map((element, index) =>
                    ytData[key][index].data = JSON.parse(element.data)
                );
            }
        }
    }};

    let setMessage = msgs => ytData.MESSAGES = msgs;

    let initialData = [];

    while (html.includes("<script")) {
        html = html.slice(html.indexOf("<script"));

        let part = html.slice(html.indexOf(">"), html.indexOf("</"));

        while (part.includes("initialData.push(")) {
            let dataOne = part.indexOf("initialData.push(");
            let dataTwo = part.indexOf(");") + 2;
            eval(part.slice(dataOne, dataTwo))
            part = part.slice(dataTwo);
        }

        if (part.includes("ytcfg.set(")) {
            let yOne = part.indexOf("ytcfg.set(") + 10;
            part = part.slice(yOne);
            let yTwo = part.indexOf("</");
        
            let slice = part.slice(0, yTwo).replace(",}", "}").replace(/\'/g, '"');
            
            if (slice.includes(");"))
                slice = slice.slice(0, slice.indexOf(");"));

            try {
                if (slice[slice.length - 1] == ")")
                    slice = slice.slice(0, slice.length - 1);

                if (slice.includes("initialData"))
                    slice = slice.replace("initialData", JSON.stringify(initialData));
                
                ytcfg.set(JSON.parse(slice));
            } catch (e) {
                console.error(e);
            }
        }
        
        if (part.includes("setMessage(")) {
            part = part.slice(part.indexOf("setMessage(") + 11);
            part = part.slice(0, part.indexOf(");"));
            setMessage(JSON.parse(part));
        }

        html = html.slice(html.indexOf("</"));
    }

    return ytData;
}

export function digestSearchResults(json) {
    let final = {
        results: 0,
        shelves: [],
        insteadOption: null,
        suggestionOption: null,
        reason: null
    };

    let sectionList = json.contents.sectionListRenderer.contents;
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

export function digestHomeResults(json) {
    let tabRenderer = json.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer;
    
    let sectionList = null;
    if (tabRenderer.hasOwnProperty("content"))
        sectionList = tabRenderer.content.sectionListRenderer;
    else
        sectionList = json.continuationContents.sectionListContinuation;

    let final = {background: null, shelves: [], continuation: null};
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
            final.background = shelfRenderer.backgroundImage.simpleVideoThumbnailRenderer.thumbnail.thumbnails[index].url;

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

function getPlaylist(json, playlistId) {
    let browse = {playlistId: "", title: "", subtitle: "", secondSubtitle: "", description: "", thumbnail: null, entries: []};
    let musicHeader = json.header.musicDetailHeaderRenderer;

    let titlelist = musicHeader.title.runs;
    for (let t = 0; t < titlelist.length; t++) {
        browse.title += titlelist[t].text;
    }

    let subtitlelist = musicHeader.subtitle.runs;
    for (let s = 0; s < subtitlelist.length; s++) {
        browse.subtitle += subtitlelist[s].text;
    }

    if (musicHeader.hasOwnProperty("description")) {
        let descriptionlist = musicHeader.description.runs;
        for (let d = 0; d < descriptionlist.length; d++) {
            browse.description += descriptionlist[d].text;
        }
    }

    let secondsubtitlelist = musicHeader.secondSubtitle.runs;
    for (let ss = 0; ss < secondsubtitlelist.length; ss++) {
        browse.secondSubtitle += secondsubtitlelist[ss].text;
    }

    let thumbnaillist = musicHeader.thumbnail.croppedSquareThumbnailRenderer.thumbnail.thumbnails;
    browse.thumbnail = thumbnaillist.slice(-1)[0].url;


    let songTabs = json.contents.singleColumnBrowseResultsRenderer.tabs;

    for (let st = 0; st < songTabs.length; st++) {
        let songList = songTabs[st].tabRenderer.content.sectionListRenderer.contents;
        
        for (let sl = 0; sl < songList.length; sl++) {
            let songs = songList[sl].musicPlaylistShelfRenderer.contents;
            browse.playlistId = songList[sl].musicPlaylistShelfRenderer.playlistId;
            
            for (let songIndex = 0; songIndex < songs.length; songIndex++) {
                let responsiveMusicItem = songs[songIndex].musicResponsiveListItemRenderer;

                let songTitlelist = responsiveMusicItem.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songSubtitlelist = responsiveMusicItem.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songSecondsubtitlelist = responsiveMusicItem.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songLengthlist = responsiveMusicItem.fixedColumns[0].musicResponsiveListItemFixedColumnRenderer.text.runs;
                let songThumbnaillist = responsiveMusicItem.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;

                let entry = {title: "", subtitle: "", secondTitle: "", secondSubtitle: "",  videoId: null, playlistId: null, thumbnail: null};

                for (let stl = 0; stl < songTitlelist.length; stl++) {
                    entry.title += songTitlelist[stl].text;
                }

                for (let ssl = 0; ssl < songSubtitlelist.length; ssl++) {
                    entry.subtitle += songSubtitlelist[ssl].text;
                }

                if (songSecondsubtitlelist != undefined)
                    for (let sssl = 0; sssl < songSecondsubtitlelist.length; sssl++) {
                        entry.secondSubtitle += songSecondsubtitlelist[sssl].text;
                    }

                for (let sll = 0; sll < songLengthlist.length; sll++) {
                    entry.secondTitle += songLengthlist[sll].text;
                }

                //entry.thumbnail = songThumbnaillist[songThumbnaillist.length - 1].url;
                entry.thumbnail = songThumbnaillist.slice(-1)[0].url;

                if (responsiveMusicItem.menu == undefined) continue; // ??

                let menuList = responsiveMusicItem.menu.menuRenderer.items;

                for (let ml = 0; ml < menuList.length; ml++) {
                    let menuObject = menuList[ml];

                    if (menuObject.hasOwnProperty("menuNavigationItemRenderer")) {
                        let menuItem = menuList[ml].menuNavigationItemRenderer;

                        if (menuItem.hasOwnProperty("navigationEndpoint")) {
                            let navigation = menuItem.navigationEndpoint;
    
                            if (navigation.hasOwnProperty("watchEndpoint")) {
                                entry.videoId = navigation.watchEndpoint.videoId;

                                if (playlistId != undefined)
                                    entry.playlistId = playlistId;
                                else
                                    entry.playlistId = navigation.watchEndpoint.playlistId;
                            }
                        }
                    }
                }

                browse.entries.push(entry);
            }
        }
    }

    return browse;
}

function getAlbum(json) {
    let updatelist = json.frameworkUpdates.entityBatchUpdate.mutations

    let browse = {playlistId: "", title: "", subtitle: "", secondSubtitle: "", description: "", thumbnail: null, entries: []};

    for (let ul = 0; ul < updatelist.length; ul++) {
        let payload = updatelist[ul].payload;

        if (payload.hasOwnProperty("musicTrack")) {
            let musicTrack = payload.musicTrack;
            let thumbnaillist = musicTrack.thumbnailDetails.thumbnails;

            let entry = {title: "", subtitle: "", secondTitle: "", secondSubtitle: "", videoId: null, thumbnail: null};
            entry.title = musicTrack.title;
            entry.subtitle = musicTrack.artistNames;
            entry.videoId = musicTrack.videoId;
            entry.thumbnail = thumbnaillist.slice(-1)[0].url;
            entry.secondTitle = msToMMSS(musicTrack.lengthMs);
            browse.entries.push(entry);
        }

        if (payload.hasOwnProperty("musicAlbumRelease")) {
            let albumRelease = payload.musicAlbumRelease;
            let thumbnaillist = albumRelease.thumbnailDetails.thumbnails;
            let minutes = msToMin(Number.parseInt(albumRelease.durationMs));

            browse.title = albumRelease.title;
            //browse.subtitle = "Album • " + albumRelease.artistDisplayName + " • " + albumRelease.releaseDate.year;
            browse.subtitle = albumRelease.artistDisplayName + " • " + albumRelease.releaseDate.year;
            browse.secondSubtitle = albumRelease.trackCount + " songs" + " • " + minutes + " minutes";
            browse.thumbnail = thumbnaillist.slice(-1)[0].url;
            browse.playlistId = albumRelease.audioPlaylistId;
        }

        if (payload.hasOwnProperty("musicAlbumReleaseDetail")) {
            let albumDetail = payload.musicAlbumReleaseDetail;

            browse.description = albumDetail.description;
        }
    }

    return browse;
}

function getArtist(json) {
    let artist = {
        header : {
            title: "",
            subscriptions: "",
            thumbnail: "",
        },

        shelves: []
    };

    let titleList = json.header.musicImmersiveHeaderRenderer.title.runs;
    for (let ttl = 0; ttl < titleList.length; ttl++) {
        artist.header.title += titleList[ttl].text;
    }

    let subList = json.header.musicImmersiveHeaderRenderer.subscriptionButton.subscribeButtonRenderer.subscriberCountText.runs;
    for (let sl = 0; sl < subList.length; sl++) {
        artist.header.subscriptions += subList[sl].text;
    }

    let thumbnailList = json.header.musicImmersiveHeaderRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;
    artist.header.thumbnail = thumbnailList[0].url;

    let tabList = json.contents.singleColumnBrowseResultsRenderer.tabs;
    for (let tbl = 0; tbl < tabList.length; tbl++) {

        let contentList = tabList[tbl].tabRenderer.content.sectionListRenderer.contents;
        for (let ctl = 0; ctl < contentList.length; ctl++) {
            let shelfEntry = contentList[ctl];

            let shelf = {title: "", subtitle: "", type: ""};
            if (shelfEntry.hasOwnProperty("musicShelfRenderer")) {
                shelf.type = "Songs";
                shelf.entries = [];

                let musicShelf = shelfEntry.musicShelfRenderer;
                
                let shelfTitleList = musicShelf.title.runs;
                for (let sttl = 0; sttl < shelfTitleList.length; sttl++) {
                    shelf.title += shelfTitleList[sttl].text;
                }

                let songList = musicShelf.contents;
                for (let sgl = 0; sgl < songList.length; sgl++) {
                    let songObject = songList[sgl].musicResponsiveListItemRenderer;

                    let entry = {
                        title: "",
                        subtitle: "",
                        secondTitle: "",
                        secondSubtitle: "",
                        thumbnail: "",
                        videoId: ""
                    };

                    let thumbnailList = songObject.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;
                    entry.thumbnail = thumbnailList[0].url;

                    let watchEndpoint = songObject.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchEndpoint;
                    let videoId = watchEndpoint.videoId;
                    let playlistId = watchEndpoint.playlistId;
                    entry.playlistId = playlistId;
                    entry.videoId = videoId;

                    let flexColumnList = songObject.flexColumns;
                    for (let sfcl = 0; sfcl < flexColumnList.length; sfcl++) {
                        let flexColumn = flexColumnList[sfcl].musicResponsiveListItemFlexColumnRenderer;

                        let flexTextList = flexColumn.text.runs;

                        let text = ""
                        for (let fttt = 0; fttt < flexTextList.length; fttt++)
                            text += flexTextList[fttt].text;

                        if (sfcl == 0)
                            entry.title = text; 
                        else if (sfcl == 1)
                            entry.subtitle = text;
                        else if (sfcl == 2)
                            entry.secondTitle = text;
                        else if (sfcl == 3)
                            entry.secondSubtitle = text;
                    }

                    shelf.entries.push(entry);
                }
            }

            if (shelfEntry.hasOwnProperty("musicCarouselShelfRenderer")) {
                shelf.type = "Playlists";
                shelf.albums = [];
                let playlistShelf = shelfEntry.musicCarouselShelfRenderer;

                let headerList = playlistShelf.header.musicCarouselShelfBasicHeaderRenderer.title.runs;
                for (let hdrl = 0; hdrl < headerList.length; hdrl++) {
                    shelf.title += headerList[hdrl].text;
                }

                let shelfContents = playlistShelf.contents;
                for (let psfc = 0; psfc < shelfContents.length; psfc++) {
                    let album = {title: "", subtitle: "", thumbnail: ""};

                    let music = shelfContents[psfc].musicTwoRowItemRenderer;

                    let titleList = music.title.runs;
                    for (let pttl = 0; pttl < titleList.length; pttl++) {
                        album.title += titleList[pttl].text;
                    }

                    let subtitleList = music.subtitle.runs;
                    if (subtitleList != undefined) {   
                        for (let pstl = 0; pstl < subtitleList.length; pstl++) {
                            album.subtitle += subtitleList[pstl].text;
                        }
                    }

                    let thumbnailList = music.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails;
                    /*for (let thbl = 0; thbl < thumbnailList.length; thbl++) {
                    }*/
                    album.thumbnail = thumbnailList[0].url;

                    let videoId;
                    let browseId;
                    let playlistId;

                    if (music.hasOwnProperty("navigationEndpoint")) {
                        let navigationEndpoint = music.navigationEndpoint;
                        if (navigationEndpoint.hasOwnProperty("browseEndpoint")) {
                            if (navigationEndpoint.browseEndpoint.hasOwnProperty("browseId"))
                                browseId = navigationEndpoint.browseEndpoint.browseId;
                        }

                        if (navigationEndpoint.hasOwnProperty("watchEndpoint")) {
                            if (navigationEndpoint.watchEndpoint.hasOwnProperty("playlistId"))
                                playlistId = navigationEndpoint.watchEndpoint.playlistId;

                            if (navigationEndpoint.watchEndpoint.hasOwnProperty("videoId"))
                                videoId = navigationEndpoint.watchEndpoint.videoId;
                        }
                    }

                    if (videoId != undefined)
                        album.videoId = videoId;

                    if (browseId != undefined)
                        album.browseId = browseId;

                    if (playlistId != undefined)
                        album.playlistId = playlistId;

                    shelf.albums.push(album);
                }
            }

            if (shelfEntry.hasOwnProperty("musicDescriptionShelfRenderer")) {
                shelf.description = "";
                let descriptionShelf = shelfEntry.musicDescriptionShelfRenderer;

                let headerList = descriptionShelf.header.runs;
                for (let ttll = 0; ttll < titleList.length; ttll++) {
                    shelf.title += headerList[ttll].text;
                }

                if (descriptionShelf.hasOwnProperty("subheader")) {
                    let subheaderList = descriptionShelf.subheader.runs;
                    for (let stll = 0; stll < titleList.length; stll++) {
                        shelf.subtitle += subheaderList[stll].text;
                    }
                }

                let descriptionList = descriptionShelf.description.runs;
                for (let dspl = 0; dspl < titleList.length; dspl++) {
                    shelf.description += descriptionList[dspl].text;
                }
            }

            artist.shelves.push(shelf);
        }
    }

    return artist;
}

export function digestBrowseResults(json, browseId) {
    if (browseId.slice(0, 2) === "VL") {
        let playlistId = browseId.slice(2);
        return getPlaylist(json, playlistId);
    } else if (browseId.slice(0, 2) === "UC")
        return getArtist(json);
    else
        return getAlbum(json);
}

export async function digestStreams(parse) {
    let videoId = parse.videoDetails.videoId;

    for (let i = 0; i < parse.streamingData.adaptiveFormats.length; i++) {
        if (parse.streamingData.adaptiveFormats[i].mimeType.split("/")[0] == "audio") {
            if (parse.streamingData.adaptiveFormats[i].signatureCipher) {
                let signatureCipher = parse.streamingData.adaptiveFormats[i].signatureCipher;

                let sigArray = decodeNestedURI(signatureCipher).split("&");
                let stream = sigArray[2].slice(4);
                let s = await getSignature(videoId, sigArray[0].substring(2));

                for (let j = 0; j < sigArray.length; j++)
                    if (j != 0 & j != 2)
                        stream += "&" + sigArray[j];

                stream += "&sig=" + s;
                return stream;
            } else
                return parse.streamingData.adaptiveFormats[i].url;
        }
    }
}

export function digestNextResults(json) {
    let playlist = new Playlist();

    let playlistRenderer;
    if (json.contents.singleColumnMusicWatchNextResultsRenderer.hasOwnProperty("playlist"))
        playlistRenderer = json.contents.singleColumnMusicWatchNextResultsRenderer
                                .playlist.playlistPanelRenderer;
    else {
        let musicQueueRenderer = json.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content.musicQueueRenderer;
        if (musicQueueRenderer.hasOwnProperty("hack") && hackTracks != null) {
            playlist = hackTracks;
            let currentVideoId = json.currentVideoEndpoint.watchEndpoint.videoId;
            
            for (let i = 0; i < playlist.list.length; i++) {
                if (playlist.list[i].id == currentVideoId) {
                    playlist.index = i;
                    return playlist;
                }
            }
        } else {
            playlistRenderer = musicQueueRenderer.content.playlistPanelRenderer;
        }
    }

    playlist.index = json.currentVideoEndpoint.watchEndpoint.index;

    for (let i = 0; i < playlistRenderer.contents.length; i++) {
        // skips automixPreviewVideoRenderer and playlistExpandableMessageRenderer
        if (!playlistRenderer.contents[i].hasOwnProperty("playlistPanelVideoRenderer")) {
            continue;
        }

        let panelRenderer = playlistRenderer.contents[i].playlistPanelVideoRenderer;

        let videoId = panelRenderer.navigationEndpoint.watchEndpoint.videoId;
        let playlistId = panelRenderer.navigationEndpoint.watchEndpoint.playlistId;
    
        let titleList = panelRenderer.title.runs;
        let title = "";
        for (let titleI = 0; titleI < titleList.length; titleI++)
            title += titleList[titleI].text;
    
        let subtitleList = panelRenderer.shortBylineText.runs;
        let artist = "";
        for (let subtitleI = 0; subtitleI < subtitleList.length; subtitleI++)
            artist += subtitleList[subtitleI].text;

        let thumbnailList = panelRenderer.thumbnail.thumbnails;

        let artwork = thumbnailList[thumbnailList.length - 1].url;
        let duration = textToSec(panelRenderer.lengthText.runs[0].text);

        let track = new Track(videoId, playlistId, title, artist, artwork, duration);
        playlist.list.push(track);
    }

    return playlist;
}

export function digestAudioInfo(response) {
    return {
        playable: response.playabilityStatus.status,
        id: response.videoDetails.videoId,
        channelId: response.videoDetails.channelId,
        title: response.videoDetails.title,
        artist: response.videoDetails.author.split(" - Topic")[0],
        duration: Number.parseInt(response.videoDetails.lengthSeconds),
        artwork: response.videoDetails.thumbnail.thumbnails[response.videoDetails.thumbnail.thumbnails.length - 1].url
    };
}