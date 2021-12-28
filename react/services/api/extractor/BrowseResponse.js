function getPlaylist(json) {
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
            let songs
            if (songList[sl].hasOwnProperty("musicPlaylistShelfRenderer")) {
                songs = songList[sl].musicPlaylistShelfRenderer.contents;
                browse.playlistId = songList[sl].musicPlaylistShelfRenderer.playlistId;
            } else if (songList[sl].hasOwnProperty("musicShelfRenderer")) {
                songs = songList[sl].musicShelfRenderer.contents;
                browse.playlistId = json.microformat.microformatDataRenderer.urlCanonical.split("=").slice(-1)[0]
            } else {
                break;
            }
            
            for (let songIndex = 0; songIndex < songs.length; songIndex++) {
                let responsiveMusicItem = songs[songIndex].musicResponsiveListItemRenderer;

                let songTitlelist = responsiveMusicItem.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songSubtitlelist = responsiveMusicItem.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songSecondsubtitlelist = responsiveMusicItem.flexColumns[2]?.musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songLengthlist = responsiveMusicItem.fixedColumns[0].musicResponsiveListItemFixedColumnRenderer.text.runs;
                let songThumbnaillist = responsiveMusicItem.thumbnail?.musicThumbnailRenderer.thumbnail.thumbnails;

                let entry = {title: "", subtitle: "", secondTitle: "", secondSubtitle: "",  videoId: null, playlistId: null, thumbnail: null};

                for (let stl = 0; stl < songTitlelist.length; stl++) {
                    entry.title += songTitlelist[stl].text;
                }

                if (songSubtitlelist == undefined) {
                    entry.subtitle = browse.subtitle.split("•")[1].trim()
                } else {
                    for (let ssl = 0; ssl < songSubtitlelist.length; ssl++) {
                        entry.subtitle += songSubtitlelist[ssl].text;
                    }
                }

                if (songSecondsubtitlelist != undefined)
                    for (let sssl = 0; sssl < songSecondsubtitlelist.length; sssl++) {
                        entry.secondSubtitle += songSecondsubtitlelist[sssl].text;
                    }

                for (let sll = 0; sll < songLengthlist.length; sll++) {
                    entry.secondTitle += songLengthlist[sll].text;
                }

                if (songThumbnaillist != null) {
                    entry.thumbnail = songThumbnaillist.slice(-1)[0].url;
                } else {
                    entry.thumbnail = browse.thumbnail;
                }

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

                                if (browse.playlistId != null)
                                    entry.playlistId = browse.playlistId;
                                else
                                    entry.playlistId = navigation.watchEndpoint.playlistId;

                                break;
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

export default function digestBrowseResponse(json, browseId) {
    if (browseId.slice(0, 2) === "UC")
        return getArtist(json);
    else
        return getPlaylist(json);
}