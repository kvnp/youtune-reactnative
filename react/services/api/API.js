import Extractor from "./Extractor";
import HTTP from "./HTTP";
import IO from "../device/IO";
import Device from "../device/Device";
import UI from "../ui/UI";

export default class API {
    static initialData;
    static Key = "AIzaSyC9XL3ZjWddXya6X74dJoCTL-WEYFDNX30";

    static RequestBody = {
        WEB: {
            context: {
                client: {
                    clientName: "WEB_REMIX",
                    clientVersion: "1.20210630.00.00",
                    //TODO implement disable/enable language settings
                    gl: Device.Language.GL,
                    hl: Device.Language.HL
                }
            }
        },

        STREAM: {
            context: {
                client: {
                    clientName: "ANDROID",
                    clientVersion: "16.02",
                    //TODO implement disable/enable language settings
                    gl: Device.Language.GL,
                    hl: Device.Language.HL
                }
            }
        }
    }
    
    static URL = class URL {
        static Main = "https://music.youtube.com";
        static #Gapis = "https://youtubei.googleapis.com"
    
        static #Endpoint = "/youtubei/v1/";
        static #Parameter = "?alt=json&key="
    
        static #Search = "search";
        static #Suggestion = "get_search_suggestions";
        static #Browse = "browse";
        static #Next = "next";
        static #Audio = "player";
    
        static get Search() {
            return this.Main + this.#Endpoint +
                this.#Search + this.#Parameter + API.Key
        }
    
        static get Suggestion() {
            return this.Main + this.#Endpoint +
                this.#Suggestion + this.#Parameter + API.Key
        }
    
        static get Browse() {
            return this.Main + this.#Endpoint +
                this.#Browse + this.#Parameter + API.Key
        }
    
        static get Next() {
            return this.Main + this.#Endpoint +
                this.#Next + this.#Parameter + API.Key
        }
    
        static get Audio() {
            return this.Main + this.#Endpoint +
                this.#Audio + this.#Parameter + API.Key
        }
    
        static get Stream() {
            return this.#Gapis + this.#Endpoint +
                this.#Audio + this.#Parameter + API.Key
        }
    };

    static initialized = false;
    static initialize() {
        return new Promise((resolve, reject) => {
            if (this.initialized)
                return resolve(true);

            API.getBrowseData("FEmusic_home")
                .then(response => {
                    API.initialData = response;
                    if (API.initialData.picture)
                        UI.setHeader({url: API.initialData.picture});

                    this.initialized = true;
                    resolve(true);
                });
        });
    }

    static async getSearchResults(query, params) {
        let requestBody = API.RequestBody.WEB;
        requestBody.query = query;
        requestBody.params = params;

        let url = API.URL.Search;
        let type = HTTP.Type.Json;
        let input = {
            method: HTTP.Method.POST,
            credentials: "omit",
            headers: HTTP.Headers.Referer,
            body: JSON.stringify(requestBody)
        };

        let response = await HTTP.getResponse(url, input, type);
        return Extractor.digestResultResponse(response);
    }

    static async getSearchSuggestions(query) {
        let requestBody = API.RequestBody.WEB;
        requestBody.input = query;

        let url = API.URL.Suggestion;
        let input = {
            method: HTTP.Method.POST,
            credentials: "omit",
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

            if (API.initialized && browseId == "FEmusic_home")
                resolve(API.initialData);

            //TODO implement continuation
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
                credentials: "omit",
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
        let requestBody = API.RequestBody.WEB;
        requestBody.videoId = videoId;
        requestBody.playlistId = playlistId;

        let url = API.URL.Audio;
        let type = HTTP.Type.Json;
        let input = {
            method: HTTP.Method.POST,
            credentials: "omit",
            headers: HTTP.Headers.Referer,
            body: JSON.stringify(requestBody)
        };


        let response = await HTTP.getResponse(url, input, type, controllerCallback);
        let audioInfo = Extractor.digestAudioInfoResponse(response);

        return audioInfo;
    }

    static async getAudioStream({videoId, controllerCallback}) {
        let requestBody = API.RequestBody.STREAM;
        requestBody.videoId = videoId;

        let url = API.URL.Stream;
        let type = HTTP.Type.Json;
        let input = {
            method: HTTP.Method.POST,
            credentials: "omit",
            headers: HTTP.Headers.Referer,
            body: JSON.stringify(requestBody)
        };

        let response = await HTTP.getResponse(url, input, type, controllerCallback);
        let stream = Extractor.digestStreamResponse(response);
        return stream;
    }

    static async getNextSongs({videoId, playlistId}) {
        let requestBody = API.RequestBody.WEB;
        requestBody.enablePersistentPlaylistPanel = true;
        requestBody.isAudioOnly = true;
        requestBody.videoId = videoId;
        requestBody.playlistId = playlistId;

        let url = API.URL.Next;
        let type = HTTP.Type.Json;
        let input = {
            method: HTTP.Method.POST,
            credentials: "omit",
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
            credentials: "omit",
            headers: HTTP.Headers.Referer
        };
        
        let blob = await HTTP.getResponse(url, input, type, controllerCallback);
        return blob;
    }
}