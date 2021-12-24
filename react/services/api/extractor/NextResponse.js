import Playlist from "../../../models/music/playlist";
import Track from "../../../models/music/track";
import { textToSec } from "../../../utils/Time";

export default function digestNextResults(json) {
    let playlist = new Playlist();

    let playlistRenderer;
    if (json.contents.singleColumnMusicWatchNextResultsRenderer.hasOwnProperty("playlist"))
        playlistRenderer = json.contents.singleColumnMusicWatchNextResultsRenderer
                                .playlist.playlistPanelRenderer;
    else {
        let musicQueueRenderer = json.contents.singleColumnMusicWatchNextResultsRenderer.tabbedRenderer.watchNextTabbedResultsRenderer.tabs[0].tabRenderer.content.musicQueueRenderer;
        /*if (musicQueueRenderer.hasOwnProperty("hack") && hackTracks != null) {
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
        }*/
        playlistRenderer = musicQueueRenderer.content.playlistPanelRenderer;
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