type Browse = {
    playlistId: string,
    title: string,
    subtitle: string,
    secondSubtitle: string,
    description: string,
    thumbnail: string | undefined,
    entries: BrowseEntry[]
};

type BrowseEntry = {
    videoId: string | undefined,
    browseId: string | undefined,
    playlistId: string,
    title: string,
    subtitle: string,
    thumbnail: string | undefined,
    secondTitle: string | undefined,
    secondSubtitle: string | undefined
};

function getPlaylist(json: BrowseResponse) {
    let browse: Browse = {playlistId: "", title: "", subtitle: "", secondSubtitle: "", description: "", thumbnail: undefined, entries: []};

    let musicHeader = json.header.musicDetailHeaderRenderer;

    let titlelist = musicHeader.title.runs;
    for (let t = 0; t < titlelist.length; t++) {
        browse.title += titlelist[t].text;
    }

    let subtitlelist = musicHeader.subtitle.runs;
    for (let s = 0; s < subtitlelist.length; s++) {
        browse.subtitle += subtitlelist[s].text;
    }

    if (musicHeader?.description) {
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
            let songs;
            if (songList[sl]?.musicPlaylistShelfRenderer) {
                songs = songList[sl].musicPlaylistShelfRenderer.contents;
                browse.playlistId = songList[sl].musicPlaylistShelfRenderer.playlistId;
            } else if (songList[sl]?.musicShelfRenderer) {
                songs = songList[sl].musicShelfRenderer.contents;
                browse.playlistId = json.microformat.microformatDataRenderer.urlCanonical.split("=").slice(-1)[0]
            } else break;
            
            for (let songIndex = 0; songIndex < songs.length; songIndex++) {
                let responsiveMusicItem = songs[songIndex].musicResponsiveListItemRenderer;

                let songTitlelist = responsiveMusicItem.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songSubtitlelist = responsiveMusicItem.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songSecondsubtitlelist = responsiveMusicItem.flexColumns[2]?.musicResponsiveListItemFlexColumnRenderer.text.runs;
                let songLengthlist = responsiveMusicItem.fixedColumns[0].musicResponsiveListItemFixedColumnRenderer.text.runs;
                let songThumbnaillist = responsiveMusicItem.thumbnail?.musicThumbnailRenderer.thumbnail.thumbnails;

                let entry: BrowseEntry = {title: "", subtitle: "", secondTitle: "", secondSubtitle: "", videoId: "", playlistId: "", thumbnail: undefined, browseId: undefined};

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

                    if (menuObject?.menuNavigationItemRenderer) {
                        let menuItem = menuList[ml].menuNavigationItemRenderer;

                        if (menuItem?.navigationEndpoint) {
                            let navigation = menuItem.navigationEndpoint;
    
                            if (navigation?.watchEndpoint) {
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

type BrowseResponse = {
    header: {
        musicDetailHeaderRenderer: {
            title: {runs: Array<{ text: string }>};
            subtitle: {runs: Array<{ text: string }>};
            description: {runs: Array<{ text: string }>} | undefined;
            secondSubtitle: {runs: Array<{ text: string }>};

            thumbnail: { croppedSquareThumbnailRenderer: { thumbnail: { thumbnails: Array<{url: string}> }; }; };
        },
        musicImmersiveHeaderRenderer: {
            title: {runs: Array<{text: string}>},
            subscriptionButton: {
                subscribeButtonRenderer: {subscriberCountText: {runs: Array<{text: string}>} | undefined},
                test: {}
            },
            thumbnail: {musicThumbnailRenderer: {thumbnail: {thumbnails: Array<{url: string}>}}}
        }
    };

    contents: {singleColumnBrowseResultsRenderer: {tabs: [{
        tabRenderer: {content: {sectionListRenderer: {
            contents: [{
                musicPlaylistShelfRenderer: ShelfRenderer,
                musicShelfRenderer: ShelfRenderer,
                musicCarouselShelfRenderer: ShelfRenderer,
                musicDescriptionShelfRenderer: ShelfRenderer | undefined
            }],
        }}}
    }]} };

    microformat: {microformatDataRenderer: {urlCanonical: string}};
};

type ShelfRenderer = {
    playlistId: string,
    contents: Array<{
        musicResponsiveListItemRenderer: {
            flexColumns: [
                {musicResponsiveListItemFlexColumnRenderer: {text: {runs: Array<{ text: string }>}}},
                {musicResponsiveListItemFlexColumnRenderer: {text: {runs: Array<{ text: string }>}}},
                {musicResponsiveListItemFlexColumnRenderer: {text: {runs: Array<{ text: string }>}}} | undefined,
                {musicResponsiveListItemFlexColumnRenderer: {text: {runs: Array<{ text: string }>}}} | undefined,
            ],

            fixedColumns: [{musicResponsiveListItemFixedColumnRenderer: {text: {runs: Array<{ text: string }>}}}],
            thumbnail: {musicThumbnailRenderer: {thumbnail: {thumbnails: Array<{url: string}> }}},
            menu: {menuRenderer: {items: Array<{
                menuNavigationItemRenderer: {
                    navigationEndpoint: {
                        watchEndpoint: {videoId: string, playlistId: string}
                    } | undefined
                } | undefined,
            }>}},

            overlay: {
                musicItemThumbnailOverlayRenderer: {content: {musicPlayButtonRenderer: {playNavigationEndpoint: {watchEndpoint: {
                    videoId: string,
                    playlistId: string
                }}}}}
            }
        },
        musicTwoRowItemRenderer: {
            title: {runs: Array<{text: string}>},
            subtitle: {runs: Array<{text: string}>},
            thumbnailRenderer: {musicThumbnailRenderer: {thumbnail: {thumbnails: Array<{url: string}>}}} | undefined,
            navigationEndpoint: {
                browseEndpoint: {browseId: string} | undefined,
                watchEndpoint: {videoId: string, playlistId: string} | undefined
            }
        }
    }>,

    title: {runs: Array<{text: string}>}
    header: {
        musicCarouselShelfBasicHeaderRenderer: {title: {runs: Array<{text: string}>}},
        runs: Array<{text: string}>
    },
    subheader: {runs: Array<{text: string}>} | undefined,
    description: {runs: Array<{text: string}>}
}

type Artist = {
    header: {
        title: string,
        subscriptions: string,
        thumbnail: string
    },
    
    shelves: Shelf[]
}

type Shelf = {
    title: string,
    subtitle: string,
    type: string,
    entries: BrowseEntry[] | undefined,

    albums: Array<{

    }> | undefined,

    description: string | undefined
}

function getArtist(json: BrowseResponse) {
    let artist: Artist = {
        header: {
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

    let subButton = json.header.musicImmersiveHeaderRenderer.subscriptionButton.subscribeButtonRenderer;

    if (subButton.subscriberCountText != undefined)
        for (let sl = 0; sl < subButton.subscriberCountText.runs.length; sl++) {
            artist.header.subscriptions += subButton.subscriberCountText.runs[sl].text;
        }

    artist.header.thumbnail = json.header.musicImmersiveHeaderRenderer.thumbnail?.musicThumbnailRenderer.thumbnail.thumbnails[0].url;
    let tabList = json.contents.singleColumnBrowseResultsRenderer.tabs;
    for (let tbl = 0; tbl < tabList.length; tbl++) {

        let contentList = tabList[tbl].tabRenderer.content.sectionListRenderer.contents;
        for (let ctl = 0; ctl < contentList.length; ctl++) {
            let shelfEntry = contentList[ctl];

            let shelf: Shelf = {title: "", subtitle: "", type: "", entries: undefined, albums: undefined, description: undefined};
            if (shelfEntry?.musicShelfRenderer) {
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

                    let entry: BrowseEntry = {
                        title: "",
                        subtitle: "",
                        secondTitle: "",
                        secondSubtitle: "",
                        videoId: "",
                        playlistId: "",
                        thumbnail: undefined,
                        browseId: undefined
                    };

                    entry.thumbnail = songObject.thumbnail?.musicThumbnailRenderer.thumbnail.thumbnails[0].url;

                    let watchEndpoint = songObject.overlay.musicItemThumbnailOverlayRenderer.content.musicPlayButtonRenderer.playNavigationEndpoint.watchEndpoint;
                    let videoId = watchEndpoint.videoId;
                    let playlistId = watchEndpoint.playlistId;
                    entry.playlistId = playlistId;
                    entry.videoId = videoId;

                    let flexColumnList = songObject.flexColumns;
                    for (let [index, container] of flexColumnList.entries()) {
                        let flexColumn = container?.musicResponsiveListItemFlexColumnRenderer;
                        if (flexColumn != undefined) {
                            let flexTextList = flexColumn.text.runs;

                            let text = ""
                            for (let fttt = 0; fttt < flexTextList.length; fttt++)
                                text += flexTextList[fttt].text;

                            if (index == 0)
                                entry.title = text;
                            else if (index == 1)
                                entry.subtitle = text;
                            else if (index == 2)
                                entry.secondTitle = text;
                            else if (index == 3)
                                entry.secondSubtitle = text;
                        }
                        
                    }

                    shelf.entries.push(entry);
                }
            }

            if (shelfEntry?.musicCarouselShelfRenderer) {
                shelf.type = "Playlists";
                shelf.albums = [];
                let playlistShelf = shelfEntry.musicCarouselShelfRenderer;

                let headerList = playlistShelf.header.musicCarouselShelfBasicHeaderRenderer.title.runs;
                for (let hdrl = 0; hdrl < headerList.length; hdrl++) {
                    shelf.title += headerList[hdrl].text;
                }

                let shelfContents = playlistShelf.contents;
                for (let psfc = 0; psfc < shelfContents.length; psfc++) {
                    let album: BrowseEntry = {title: "", subtitle: "", thumbnail: "", videoId: undefined, playlistId: "", secondTitle: undefined, secondSubtitle: undefined, browseId: undefined};

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

                    album.thumbnail = music.thumbnailRenderer?.musicThumbnailRenderer.thumbnail.thumbnails[0].url;

                    let videoId;
                    let browseId;
                    let playlistId;

                    if (music?.navigationEndpoint) {
                        let navigationEndpoint = music.navigationEndpoint;
                        if (navigationEndpoint?.browseEndpoint) {
                            if (navigationEndpoint.browseEndpoint?.browseId)
                                browseId = navigationEndpoint.browseEndpoint.browseId;
                        }

                        if (navigationEndpoint?.watchEndpoint) {
                            if (navigationEndpoint.watchEndpoint?.playlistId)
                                playlistId = navigationEndpoint.watchEndpoint.playlistId;

                            if (navigationEndpoint.watchEndpoint?.videoId)
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

            if (shelfEntry?.musicDescriptionShelfRenderer) {
                shelf.description = "";
                let descriptionShelf = shelfEntry.musicDescriptionShelfRenderer;

                let headerList = descriptionShelf.header.runs;
                for (let ttll = 0; ttll < titleList.length; ttll++) {
                    shelf.title += headerList[ttll].text;
                }

                if (descriptionShelf?.subheader) {
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

export default function digestBrowseResponse(json: BrowseResponse, browseId: string) {
    if (browseId.slice(0, 2) === "UC")
        return getArtist(json);
    else
        return getPlaylist(json);
}