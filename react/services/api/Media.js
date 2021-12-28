import IO from "../device/IO";
import UI from "../ui/UI";
import API from "./API";
import Extractor from "./Extractor";
import HTTP from "./HTTP";

export default class Media {
    static async getSearchResults(query, params) {
        if (!API.initialized)
            await API.initialize();
        
        let requestBody = API.RequestBody.WEB;
        requestBody.query = query;
        requestBody.params = params;

        let url = API.URL.Search;
        let type = HTTP.Type.Json;
        let input = {
            method: HTTP.Method.POST,
            headers: HTTP.Headers.Referer,
            body: JSON.stringify(requestBody)
        };

        let response = await HTTP.getResponse(url, input, type);
        return Extractor.digestResultResponse(response);
    }

    static async getSearchSuggestions(query) {
        if (!API.initialized)
            await API.initialize();

        let requestBody = API.RequestBody.WEB;
        requestBody.input = query;

        let url = API.URL.Suggestion;
        let input = {
            method: HTTP.Method.POST,
            headers: HTTP.Headers.Referer,
            body: JSON.stringify(requestBody)
        }
        let type = HTTP.Type.Json;

        let response = await HTTP.getResponse(url, input, type);

        console.log(response);
    }

    static getBrowseData(browseId, continuation) {
        return new Promise(async(resolve, reject) => {
            if (browseId == undefined)
                return resolve(null);

            if (!API.initialized) {
                let initialPath;
                let slice = browseId.slice(0, 2);

                if (slice == "OL" || slice == "VL" || slice == "RD") {
                    if (slice == "VL")
                        browseId = browseId.slice(2);
                    
                    initialPath = "/playlist?list=" + browseId;
                } else if (slice == "FE") {
                    initialPath = "";
                } else {
                    initialPath = "/browse/" + browseId;
                }

                await API.initialize(initialPath);
                let initialData = await API.getInitialData(browseId);
                if (initialData != null) {
                    let extraction = browseId == "FEmusic_home"
                        ? Extractor.digestHomeResponse(initialData)
                        : Extractor.digestBrowseResponse(initialData, browseId);

                    UI.setHeader({url: extraction?.picture});
                    return resolve(extraction);
                }
            }

            //TODO implement continuation properly
            let requestBody = API.RequestBody.WEB;
            if (continuation && browseId == "FEmusic_home")
                url = url + "&ctoken=" + continuation.continuation + 
                            "&continuation=" + continuation.continuation +
                            "&itct=" + continuation.itct +
                            "&type=next"
            else {
                if (browseId.slice(0, 2) == "RD")
                    browseId = "VL" + browseId;
                
                requestBody.browseId = browseId;
            }

            let url = API.URL.Browse;
            let type = HTTP.Type.Json;
            let input = {
                method: HTTP.Method.POST,
                headers: HTTP.Headers.Referer,
                body: JSON.stringify(requestBody)
            };

            HTTP.getResponse(url, input, type)
                .then(response => resolve(
                    browseId == "FEmusic_home"
                        ? Extractor.digestHomeResponse(response)
                        : Extractor.digestBrowseResponse(response, browseId)
                ))
                .catch(reason => reject(reason));
        });
    }

    static async getAudioInfo({videoId, playlistId, controllerCallback}) {
        if (!API.initialized)
            await API.initialize();

        let requestBody = API.RequestBody.WEB;
        requestBody.videoId = videoId;
        requestBody.playlistId = playlistId;

        let url = API.URL.Audio;
        let type = HTTP.Type.Json;
        let input = {
            method: HTTP.Method.POST,
            headers: HTTP.Headers.Referer,
            body: JSON.stringify(requestBody)
        };


        let response = await HTTP.getResponse(url, input, type, controllerCallback);
        let audioInfo = Extractor.digestAudioInfoResponse(response);

        return audioInfo;
    }

    static async getAudioStream({videoId, controllerCallback}) {
        if (!API.initialized)
            await API.initialize();

        let requestBody = API.RequestBody.STREAM;
        requestBody.videoId = videoId;

        let url = API.URL.Stream;
        let type = HTTP.Type.Json;
        let input = {
            method: HTTP.Method.POST,
            headers: HTTP.Headers.Referer,
            body: JSON.stringify(requestBody)
        };

        let response = await HTTP.getResponse(url, input, type, controllerCallback);
        let stream = Extractor.digestStreamResponse(response);

        return stream;
    }

    static async getNextSongs({videoId, playlistId}) {
        if (!API.initialized)
            await API.initialize();
        
        let requestBody = API.RequestBody.WEB;
        requestBody.enablePersistentPlaylistPanel = true;
        requestBody.isAudioOnly = true;
        requestBody.videoId = videoId;
        requestBody.playlistId = playlistId;

        let url = API.URL.Next;
        let type = HTTP.Type.Json;
        let input = {
            method: HTTP.Method.POST,
            headers: HTTP.Headers.Referer,
            body: JSON.stringify(requestBody)
        };
        
        let response = await HTTP.getResponse(url, input, type);
        let playlist = Extractor.digestNextResponse(response);
        
        return playlist;
    }

    static async getBlob({url, controllerCallback}) {
        if (IO.isBlob(url))
            return url;

        let type = HTTP.Type.Blob;
        let input = {
            method: HTTP.Method.GET,
            headers: HTTP.Headers.Referer
        };
        
        let blob = await HTTP.getResponse(url, input, type, controllerCallback);
        return blob;
    }
}