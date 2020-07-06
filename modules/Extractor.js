import { msToMin, msToMMSS } from "./Utils";

export function digestSearchResults(json) {
    let final = {results: 0, suggestion: [], reason: null, topics: []};

    let sectionList = json.contents.sectionListRenderer.contents;

    if (sectionList[0].hasOwnProperty("itemSectionRenderer")) {

        let itemSection = sectionList[0].itemSectionRenderer.contents;
        if (itemSection[0].hasOwnProperty("messageRenderer")) {
            let message = itemSection[0].messageRenderer.text.runs[0].text;
            final.reason = message;
            return final;

        } else if (itemSection[0].hasOwnProperty("didYouMeanRenderer")) {
            let suggestionlist = itemSection[0].didYouMeanRenderer.correctedQuery.runs;

            for (let sgg = 0; sgg < suggestionlist.length; sgg++) {
                let suggestion = {text: null, italics: null};

                let text = suggestionlist[sgg].text;
                let correction = false;

                if (suggestionlist[sgg].hasOwnProperty("italics"))
                    correction = suggestionlist[sgg].italics

                suggestion.text = text;
                suggestion.italics = correction;

                final.suggestion.push(suggestion);
            }
        }
    }

    for (let sl = 0; sl < sectionList.length; sl++) {
        let itemSection = sectionList[sl];

        if (itemSection.hasOwnProperty("musicShelfRenderer")) {
            let musicShelf = itemSection.musicShelfRenderer;

            let titlelist = musicShelf.title.runs;
            let title = "";

            for (let ttl = 0; ttl < titlelist.length; ttl++) {
                title += titlelist[ttl].text;
            }

            let topic = {topic: title, elements: []};

            let responsiveMusicList = musicShelf.contents;
            for (let rml = 0; rml < responsiveMusicList.length; rml++) {
                let responsiveMusicItem = responsiveMusicList[rml].musicResponsiveListItemRenderer;
                let element = {
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

                    let textList = flexColumn.text.runs;

                    let text = "";
                    for (let txt = 0; txt < textList.length; txt++) {
                        text += textList[txt].text;
                    }

                    if (fcl == 0)
                        element.title = text;
                    else if (fcl == 1)
                        element.subtitle = text;
                    else if (fcl == 2)
                        element.secondTitle = text;
                    else if (fcl == 3)
                        element.secondSubtitle = text;
                    else if (fcl == 4)
                        element.additionalInfo = text;
                }
                
                let thumbnaillist = responsiveMusicItem.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;
                element.thumbnail = thumbnaillist[0].url;
                
                if (responsiveMusicItem.hasOwnProperty("navigationEndpoint")) {
                    let type = responsiveMusicItem.navigationEndpoint.browseEndpoint.browseEndpointContextSupportedConfigs.browseEndpointContextMusicConfig.pageType;
                    if (type == "MUSIC_PAGE_TYPE_ARTIST")
                        element.type = "Artist";
                    else if (type == "MUSIC_PAGE_TYPE_ALBUM")
                        element.type = "Album";
                    else if (type == "MUSIC_PAGE_TYPE_PLAYLIST")
                        element.type = "Playlist";
                    
                    element.playlistId = responsiveMusicItem.doubleTapCommand.watchPlaylistEndpoint.playlistId;
                    element.browseId = responsiveMusicItem.navigationEndpoint.browseEndpoint.browseId;
                } else {
                    element.type = "Title";
                    element.videoId = responsiveMusicItem.doubleTapCommand.watchEndpoint.videoId;
                    element.playlistId = responsiveMusicItem.doubleTapCommand.watchEndpoint.playlistId;
                }

                final.results += 1;
                topic.elements.push(element);
            }

            final.topics.push(topic);
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
            let album = {title: "", subtitle: ""};
            
            for (let k = 0; k < shelfRenderer.contents[m].musicTwoRowItemRenderer.title.runs.length; k++) {
                album.title += shelfRenderer.contents[m].musicTwoRowItemRenderer.title.runs[k].text;
            }

            for (let k = 0; k < shelfRenderer.contents[m].musicTwoRowItemRenderer.subtitle.runs.length; k++) {
                album.subtitle += shelfRenderer.contents[m].musicTwoRowItemRenderer.subtitle.runs[k].text;
            }

            let videoId;
            let browseId;
            let playlistId;

            let musicItem = shelfRenderer.contents[m].musicTwoRowItemRenderer;
            if (musicItem.hasOwnProperty("navigationEndpoint")) {
                let navigationEndpoint = shelfRenderer.contents[m].musicTwoRowItemRenderer.navigationEndpoint;
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
            }

            if (browseId != undefined)
                album.browseId = browseId;

            if (playlistId != undefined)
                album.playlistId = playlistId;

            if (videoId != undefined)
                album.videoId = videoId;

            album.thumbnail = shelfRenderer.contents[m].musicTwoRowItemRenderer.thumbnailRenderer.musicThumbnailRenderer.thumbnail.thumbnails[0].url;

            shelf.albums.push(album);
        }
        
        final.shelves.push(shelf);
    }

    return final;
}

function getPlaylist(json) {
    let browse = {title: "", subtitle: "", secondSubtitle: "", description: "", thumbnail: null, songs: []};
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
    browse.thumbnail = thumbnaillist[0].url;


    let songTabs = json.contents.singleColumnBrowseResultsRenderer.tabs;

    for (let st = 0; st < songTabs.length; st++) {
        let songList = songTabs[st].tabRenderer.content.sectionListRenderer.contents;
        
        for (let sl = 0; sl < songList.length; sl++) {
            let songs = songList[sl].musicPlaylistShelfRenderer.contents;
            
            for (let songIndex = 0; songIndex < songs.length; songIndex++) {
                let responsiveMusicItem = songs[songIndex].musicResponsiveListItemRenderer;

                let songTitlelist = responsiveMusicItem.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songSubtitlelist = responsiveMusicItem.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songSecondsubtitlelist = responsiveMusicItem.flexColumns[2].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songLengthlist = responsiveMusicItem.fixedColumns[0].musicResponsiveListItemFixedColumnRenderer.text.runs;
                let songThumbnaillist = responsiveMusicItem.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;

                let song = {title: "", subtitle: "", secondTitle: "", secondSubtitle: "",  videoId: null, thumbnail: null};

                for (let stl = 0; stl < songTitlelist.length; stl++) {
                    song.title += songTitlelist[stl].text;
                }

                for (let ssl = 0; ssl < songSubtitlelist.length; ssl++) {
                    song.subtitle += songSubtitlelist[ssl].text;
                }

                if (songSecondsubtitlelist != undefined)
                    for (let sssl = 0; sssl < songSecondsubtitlelist.length; sssl++) {
                        song.secondSubtitle += songSecondsubtitlelist[sssl].text;
                    }

                for (let sll = 0; sll < songLengthlist.length; sll++) {
                    song.secondTitle += songLengthlist[sll].text;
                }

                //song.thumbnail = songThumbnaillist[songThumbnaillist.length - 1].url;
                song.thumbnail = songThumbnaillist[0].url;

                if (responsiveMusicItem.menu == undefined) continue; // ??

                let menuList = responsiveMusicItem.menu.menuRenderer.items;

                for (let ml = 0; ml < menuList.length; ml++) {
                    let menuObject = menuList[ml];

                    if (menuObject.hasOwnProperty("menuNavigationItemRenderer")) {
                        let menuItem = menuList[ml].menuNavigationItemRenderer;

                        if (menuItem.hasOwnProperty("navigationEndpoint")) {
                            let navigation = menuItem.navigationEndpoint;
    
                            if (navigation.hasOwnProperty("watchEndpoint")) {
                                song.videoId = navigation.watchEndpoint.videoId;
                            }
                        }
                    }
                }

                browse.songs.push(song);
            }
        }
    }

    return browse;
}



function getAlbum(json) {
    let updatelist = json.frameworkUpdates.entityBatchUpdate.mutations

    let browse = {title: "", subtitle: "", secondSubtitle: "", description: "", thumbnail: null, songs: []};

    for (let ul = 0; ul < updatelist.length; ul++) {
        let payload = updatelist[ul].payload;

        if (payload.hasOwnProperty("musicTrack")) {
            let musicTrack = payload.musicTrack;
            let thumbnaillist = musicTrack.thumbnailDetails.thumbnails;

            let song = {title: "", subtitle: "", secondSubtitle: "", length: "", videoId: null, thumbnail: null};
            song.title = musicTrack.title;
            song.subtitle = musicTrack.artistNames;
            song.videoId = musicTrack.videoId;
            song.thumbnail = thumbnaillist[0].url;
            song.length = msToMMSS(musicTrack.lengthMs);
            browse.songs.push(song);
        }

        if (payload.hasOwnProperty("musicAlbumRelease")) {
            let albumRelease = payload.musicAlbumRelease;
            let thumbnaillist = albumRelease.thumbnailDetails.thumbnails;
            let minutes = msToMin(Number.parseInt(albumRelease.durationMs));

            browse.title = albumRelease.title;
            //browse.subtitle = "Album • " + albumRelease.artistDisplayName + " • " + albumRelease.releaseDate.year;
            browse.subtitle = albumRelease.artistDisplayName + " • " + albumRelease.releaseDate.year;
            browse.secondSubtitle = albumRelease.trackCount + " songs" + " • " + minutes + " minutes";
            browse.thumbnail = thumbnaillist[0].url;
        }

        if (payload.hasOwnProperty("musicAlbumReleaseDetail")) {
            let albumDetail = payload.musicAlbumReleaseDetail;

            browse.description = albumDetail.description;
        }
    }

    return browse;
}

function getArtist(json) {
    let final = {
        header : {
            title: "",
            subscriptions: "",
            thumbnail: "",
        },

        shelves: []
    };

    let titleList = json.header.musicImmersiveHeaderRenderer.title.runs;
    for (let ttl = 0; ttl < titleList.length; ttl++) {
        final.header.title += titleList[ttl];
    }

    let subList = json.header.musicImmersiveCarouselShelfRenderer.subscriptionButton.subscribeButtonRenderer.subscriberCountText.runs;
    for (let sl = 0; sl < subList.length; sl++) {
        final.header.subscriptions += subList[sl];
    }

    let thumbnailList = json.header.musicImmersiveCarouselShelfRenderer.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails;
    final.header.thumbnail = thumbnailList[0].url;

    let tabList = json.contents.singleColumnBrowseResultsRenderer.tabs;
    for (let tbl = 0; tbl < tabList.length; tbl++) {

        let contentList = tabList[tbl].tabRenderer.content.sectionListRenderer.contents;
        for (let ctl = 0; ctl < contentList.length; ctl++) {
            let shelfEntry = contentList[ctl];

            let shelf = {title: "", type: "", items: []};
            if (shelfEntry.hasOwnProperty("musicShelfRenderer")) {
                shelf.type = "Songs";
                let musicShelf = shelf.musicShelfRenderer;

                let shelfTitleList = musicShelf.title.runs;
                for (let sttl = 0; sttl < shelfTitleList.length; sttl++) {
                    shelf.title += shelfTitleList[sttl];
                }

                let songList = musicShelf.contents;
                for (let sgl = 0; sgl < songList.length; sgl++) {
                    let songObject = songList[sgl].musicResponsiveListItemRenderer;

                    let song = {
                        title: "",
                        subtitle: "",
                        secondTitle: "",
                        secondSubtitle: "",
                        thumbnail: "",
                        videoId: ""
                    };

                    let thumbnailList = songObject.thumbnail.musicThumbnailRendeer.thumbnail.thumbnails;
                    song.thumbnail = thumbnailList[0].url;

                    let watchEndpoint = songObject.content.musicPlayButtonRenderer.playNavigationEndpoint.watchEndpoint;
                    let videoId = watchEndpoint.videoId;
                    let playlistId = watchEndpoint.playlistId;
                    song.playlistId = playlistId;
                    song.videoId = videoId;

                    let flexColumnList = songObject.flexColumns;
                    for (let sfcl = 0; sfcl < flexColumnList.length; sfcl++) {
                        let flexColumn = flexColumnList[sfcl].musicResponsiveListItemFlexColumnRenderer;

                        let flexTextList = flexColumn.text.runs;

                        let text = ""
                        for (let fttt = 0; fttt < flexTextList.length; fttt++)
                            text += flexTextList[fttt].text;

                        if (sfcl == 0)
                            song.title = text; 
                        else if (sfcl == 1)
                            song.subtitle = text;
                        else if (sfcl == 2)
                            song.secondTitle = text;
                        else if (sfcl == 3)
                            song.secondSubtitle = text;
                    }
                }
            }

            if (shelfEntry.hasOwnProperty("musicCarouselShelfRenderer")) {
                shelf.type = "Playlists";
                let playlistShelf = shelf.musicCarouselShelfRenderer;
                
            }

            final.shelves.push(shelf);
        }
    }
}

export function digestBrowseResults(json, browseId) {
    if (browseId.slice(0, 2) === "VL") {
        return getPlaylist(json);
    } else if (browseId.slice(0, 2) === "UC") {
        return getArtist(json);
    } else {
        return getAlbum(json);
    }
}